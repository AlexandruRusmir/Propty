// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TestContract {
  uint256 number;

  constructor(uint256 _number) {
    number = _number;
  }

  function setNumber(uint256 _number) public {
    number = _number;
  }
}
