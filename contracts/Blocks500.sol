pragma solidity ^0.4.4;

contract Blocks500 {
  struct Block {
    address owner;
    string url;
  }

  address author;
  Block[500] public blocks;
  mapping(uint => uint) public listedBlocks;
  mapping(address => uint) public balances;

  event BlockPurchased(uint blockNumber, uint amount, address oldOwner, address newOwner);
  event BlockListed(uint blockNumber, uint amount);

  function Blocks500() {
    author = msg.sender;
  }

  function getBlock(uint blockNumber) constant returns (address, string) {
    Block memory currentBlock = blocks[blockNumber - 1];
    return (currentBlock.owner, currentBlock.url);
  }

  function purchaseBlock(uint blockNumber, string url) payable returns(uint) {
    assert(blockNumber > 0 && blockNumber <= 500);

    Block memory currentBlock = blocks[blockNumber - 1];
    address owner;
    uint amount;

    if (currentBlock.owner == address(0)) {
      amount = 5;
      owner = author;
    } else if (listedBlocks[blockNumber] != 0) {
      amount = listedBlocks[blockNumber];
      owner = currentBlock.owner;
    }

    assert(owner != address(0));
    assert(msg.value == (amount * 1000000000000000000));

    balances[owner] += msg.value;
    blocks[blockNumber - 1] = Block(msg.sender, url);
    delete listedBlocks[blockNumber];
    BlockPurchased(blockNumber, amount, owner, msg.sender);

    return blockNumber;
  }

  function listBlock(uint blockNumber, uint amount) returns(uint) {
    assert(blockNumber > 0 && blockNumber <= 500);

    Block memory currentBlock = blocks[blockNumber - 1];

    assert(currentBlock.owner == msg.sender);

    listedBlocks[blockNumber] = amount;
    BlockListed(blockNumber, amount);

    return blockNumber;
  }

  function withdraw() {
    msg.sender.transfer(balances[msg.sender]);
  }
}
