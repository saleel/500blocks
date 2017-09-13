pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Blocks500.sol";

contract TestBlocks500 {
  Blocks500 blocks500 = Blocks500(DeployedAddresses.Blocks500());
  uint public initialBalance = 11 ether;

  /*function testUsersCanBuyFreeBlock() {
    uint returnedId = blocks500.purchaseBlock.value(5000000000000000000)(6, "www.testing.com");
    uint expected = 6;
    Assert.equal(returnedId, expected, "Purchase of Block 6 should be saved");
    var (owner, url) = blocks500.getBlock(6);
    Assert.equal("url", "www.google.com");
  }

  function testUsersCanListBlock() {
    blocks500.purchaseBlock.value(5000000000000000000)(8, "www.testing.com");
    uint returnedId = blocks500.listBlock(8, 10);
    uint expected = 8;
    Assert.equal(returnedId, expected, "Listing of Block 8 should be saved");
    Assert.equal(blocks500.listedBlocks(8), 10, 'Listing price should be recorded');
  }

  function testUsersCanBuyListBlock() {
    uint returnedId = blocks500.purchaseBlock.value(10000000000000000000)(8, "www.testing.com");
    uint expected = 8;
    Assert.equal(returnedId, expected, "Purchase of Block 8 should be saved");
  }*/
}
