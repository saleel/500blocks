const web3 = global.web3;
var Blocks500 = artifacts.require("Blocks500");

contract('Blocks500', function(accounts) {
  let contract_balance;
  let contract_starting_balance;
  let account0_balance; // owner
  let account0_starting_balance;
  let account1_balance;
  let account1_starting_balance;
  let account2_balance;
  let account2_starting_balance;

  it("should buy free block", function() {
    return Blocks500.deployed()
      .then(function(instance) {
        contract_balance = web3.eth.getBalance(instance.address).toNumber();
        contract_starting_balance = contract_balance;
        account0_balance = web3.eth.getBalance(accounts[0]).toNumber();
        account0_starting_balance = account0_balance;
        account1_balance = web3.eth.getBalance(accounts[1]).toNumber();
        account1_starting_balance = account1_balance;
        account2_balance = web3.eth.getBalance(accounts[2]).toNumber();
        account2_starting_balance = account2_balance;

        assert.equal(contract_balance, 0);

        return instance.purchaseBlock(6, "www.google.com", {
          value: web3.toWei(5, 'ether'),
          from: accounts[1],
        })
        .then(function(res) {
          return instance.getBlock.call(6);
        })
        .then(function(response) {
          assert.equal(response[0], accounts[1]);
          assert.equal(response[1], 'www.google.com');

          contract_balance = web3.eth.getBalance(instance.address).toNumber();
          account1_balance = web3.eth.getBalance(accounts[1]).toNumber();
          assert.equal(account1_balance, account1_starting_balance - web3.toWei(5, 'ether'));
          assert.equal(contract_balance, web3.toWei(5, 'ether'));
        });
      })
  });

  it("should not allow purchase of invalid block", function(done) {
    Blocks500.deployed()
      .then(function(instance) {
        return instance.purchaseBlock(501, "www.google.com", {
          value: web3.toWei(5, 'ether'),
          from: accounts[1],
        })
        .then(() => {
          done(new Error("Should fail"));
        })
        .catch(function(error) {
          assert.equal(!!error, true);
          done();
        });
      })
  });

  it("should list a purchased block", function() {
    return Blocks500.deployed()
      .then(function(instance) {
        return instance.purchaseBlock(40, "www.40.com", {
          value: web3.toWei(5, 'ether'),
          from: accounts[2],
        })
        .then(function() {
          return instance.listBlock(40, 10, {
            from: accounts[2],
          })
        })
        .then(function() {
          return instance.listedBlocks.call(40);
        })
        .then(function(response) {
          assert.equal(response, 10);
        });
      })
  });

  it("should purchase a listed block", function() {
    return Blocks500.deployed()
      .then(function(instance) {
        return instance.purchaseBlock(100, "www.old.com", {
          value: web3.toWei(5, 'ether'),
          from: accounts[0],
        })
        .then(function() {
          return instance.listBlock(100, 7, {
            from: accounts[0],
          });
        })
        .then(function(res) {
          return instance.getBlock.call(100);
        })
        .then(function(response) {
          assert.equal(response[0], accounts[0]);
          assert.equal(response[1], 'www.old.com');
        })
        .then(function() {
          return instance.purchaseBlock(100, "www.new.com", {
            value: web3.toWei(7, 'ether'),
            from: accounts[1],
          });
        })
        .then(function(res) {
          return instance.getBlock.call(100);
        })
        .then(function(response) {
          assert.equal(response[0], accounts[1]);
          assert.equal(response[1], 'www.new.com');
        });
      })
  });

  it("should not purchase an unlisted block", function(done) {
    Blocks500.deployed()
      .then(function(instance) {
        return instance.purchaseBlock(90, "www.old.com", {
          value: web3.toWei(5, 'ether'),
          from: accounts[3],
        })
        .then(function() {
          return instance.purchaseBlock(90, "www.new.com", {
            value: web3.toWei(5, 'ether'),
            from: accounts[4],
          });
        })
        .then(() => {
          done(new Error("Should fail"));
        })
        .catch(function(error) {
          assert.equal(!!error, true);
          done();
        });
      })
  });
});
