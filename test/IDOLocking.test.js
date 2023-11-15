const { assert } = require("chai");
const truffleAssert = require("truffle-assertions");

//Change the lock duration factor from 3600 to 30 before testing

const Locking = artifacts.require("./IDOLocking.sol");
const Token = artifacts.require("./Token.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Locking", (accounts) => {
  let instance;
  let token;
  const totalSupply = 200000000000000000000;
  before(async () => {
    token = await Token.new(
      "MineToken",
      "MNT",
      18,
      totalSupply.toString(),
      accounts[0]
    );
    instance = await Locking.new("IDO Locking", token.address, 58, 1);
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await instance.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await instance.name();
      name.should.equal("IDO Locking");
    });

    it("has tokenAddress", async () => {
      const tokenAddress = await instance.tokenAddress();
      assert.equal(tokenAddress.toString(), token.address);
    });

    it("has rate", async () => {
      const rate = await instance.rate();
      assert.equal(rate.toString(), "58");
    });

    it("has lock duration", async () => {
      const lockduration = await instance.lockDuration();
      assert.equal(lockduration.toString(), "1");
    });
  });

  describe("Rewards", async () => {
    it("should not add 0 rewards", async () => {
      await truffleAssert.reverts(
        instance.addReward(0),
        "Reward must be positive"
      );
    });

    it("should not add reward greater than allowance", async () => {
      const approval = 1000000000000000000;
      const rewards = 2000000000000000000;
      await token.approve(instance.address, approval.toString());
      await truffleAssert.reverts(
        instance.addReward(rewards.toString()),
        "Make sure to add enough allowance"
      );
    });

    it("adds rewards", async () => {
      const reward = 500000000000000000;
      await token.approve(instance.address, reward.toString());
      await instance.addReward(reward.toString());
      const totalReward = await instance.totalReward();
      totalReward
        .toString()
        .should.equal(reward.toString(), "Total rewards is correct");
      const rewardBalance = await instance.rewardBalance();
      rewardBalance
        .toString()
        .should.equal(reward.toString(), "Reward balance is correct");
    });
  });

  describe("Setting rate, lockDuration and eligibilityAmount", async () => {
    it("should set rate and lock duration by owner", async () => {
      await instance.setRateAndLockduration(60, 2, { from: accounts[0] });
      const rate = await instance.rate();
      const index = await instance.index(); //Check the visibility after testing
      rate.toString().should.equal("60", "Rate set successfully by owner");
      const newRate = await instance.rates(index);
      newRate[0].toString().should.equal("60", "Rate is updated");
      const lock = await instance.lockDuration();
      lock.toString().should.equal("2", "Lock set successfully");
    });

    it("should not allow others to set rate and lock duration", async () => {
      await truffleAssert.reverts(
        instance.setRateAndLockduration(100, 200, { from: accounts[2] }),
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("Staking", async () => {
    it("should not stake 0 amount", async () => {
      await truffleAssert.reverts(instance.stake(0), "Can't stake 0 amount");
    });

    it("should not add greater than allowance", async () => {
      const approval = 4000000000000000000;
      const stake = 50000000000000000000;
      await token.approve(instance.address, approval.toString());
      await truffleAssert.reverts(
        instance.stake(stake.toString()),
        "Make sure to add enough allowance"
      );
    });

    it("adds stakes", async () => {
      const stake = 2000000000000000000;
      await token.approve(instance.address, stake.toString());
      await instance.stake(stake.toString(), { from: accounts[0] });
      const deposits = await instance.userDeposits(accounts[0]);
      const index = await instance.index();
      deposits[0]
        .toString()
        .should.equal("2000000000000000000", "Staked correctly");
      deposits[3]
        .toString()
        .should.equal(index.toString(), "Index is set correctly");
      deposits[5].should.equal(false, "Staked correctly");
      const stakedBalance = await instance.stakedBalance();
      stakedBalance
        .toString()
        .should.equal("2000000000000000000", "Staked Balance is correct");
      const stakedTotal = await instance.stakedTotal();
      stakedTotal
        .toString()
        .should.equal("2000000000000000000", "Staked total is correct");
    });

    it("should allow multiple stakes from same user and reset the lock", async () => {
      const stake = 1000000000000000000;
      await token.approve(instance.address, stake.toString());
      function timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      await timeout(30000);
      await instance.stake(stake.toString());
      const deposits = await instance.userDeposits(accounts[0]);
      deposits[0]
        .toString()
        .should.equal("3000000000000000000", "Staked correctly");
      deposits[5].should.equal(false, "Staked correctly");
      deposits[4].toString().should.equal("6400000000000000", "Updated");
    });

    it("should stake according to the changes in rates", async () => {
      const deposits = await instance.userDeposits(accounts[0]);
      const rate = await instance.rate();
      const userIndex = deposits[3].toString();
      const userRate = await instance.rates(userIndex);
      rate.toString().should.equal(userRate[0].toString(), "Rates are synced1");
      await instance.setRateAndLockduration(70, 2);
      const stake = 2000000000000000000;
      await token.transfer(accounts[1], stake.toString());
      await token.approve(instance.address, stake.toString(), {
        from: accounts[1],
      });
      await instance.stake(stake.toString(), { from: accounts[1] });
      const deposits1 = await instance.userDeposits(accounts[1]);
      const rate1 = await instance.rate();
      const userIndex1 = deposits1[3].toString();
      const userRate1 = await instance.rates(userIndex1);
      rate1
        .toString()
        .should.equal(userRate1[0].toString(), "Rates are synced2");
    });
  });

  describe("Withdraw", async () => {
    it("should not allow to withdraw without stakes", async () => {
      await truffleAssert.reverts(
        instance.withdraw({ from: accounts[2] }),
        "No stakes found for user"
      );
    });

    it("should not allow withdraw before deposit time", async () => {
      await truffleAssert.reverts(
        instance.withdraw(),
        "Requesting before lock time"
      );
    });

    it("withdraws successfully", async () => {
      const stake1 = 2000000000000000000;
      await token.transfer(accounts[3], stake1.toString());
      await token.approve(instance.address, stake1.toString(), {
        from: accounts[3],
      });
      await instance.stake(stake1.toString(), { from: accounts[3] });

      const stakedBalance = await instance.stakedBalance();
      const rewardBalance = await instance.rewardBalance();
      const amount = await instance.userDeposits(accounts[3]);
      const depositAmount = amount[0];
      function timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      await timeout(60000);
      await instance.withdraw({ from: accounts[3] });
      const balance1 = await token.balanceOf(accounts[3]);
      // console.log(balance1.toString());
      const latestStakedBalance = await instance.stakedBalance();
      latestStakedBalance
        .toString()
        .should.equal(
          stakedBalance.sub(depositAmount).toString(),
          "Staked balance updated correctly"
        );
      const reward = balance1.sub(web3.utils.toBN(depositAmount));
      // console.log(reward.toString());
      const latestRewardBalance = await instance.rewardBalance();
      latestRewardBalance
        .toString()
        .should.equal(
          rewardBalance.sub(reward).toString(),
          "Reward Balance updated correctly"
        );
    });

    it("should not withdraw twice", async () => {
      await instance.withdraw();
      await truffleAssert.reverts(
        instance.withdraw(),
        "No stakes found for user"
      );
    });
  });
});
