// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

enum PropertyTitleContractState { INITIALIZED, OWNED, FOR_SALE, NO_LONGER_RELEVANT }
struct PropertyDetails {
    string propertyAddress;
    string propertyDescription;
    uint256 squareMetres;
}
contract TestEnum {
  PropertyTitleContractState prop;
  string oakd;

  constructor() {
    prop = PropertyTitleContractState.FOR_SALE;
    oakd = 'uhfrdihiutw';
  }

  function setProp(PropertyTitleContractState _prop) public {
    prop = _prop;
  }

  function getProp() public view returns (PropertyTitleContractState) {
    return prop;
  }

  function getInitialized() public pure returns (PropertyTitleContractState) {
    return PropertyTitleContractState.INITIALIZED;
  }
  function getOwned() public pure returns (PropertyTitleContractState) {
    return PropertyTitleContractState.OWNED;
  }
  function getForSale() public pure returns (PropertyTitleContractState) {
    return PropertyTitleContractState.FOR_SALE;
  }
  function getNoLongerRelevant() public pure returns (PropertyTitleContractState) {
    return PropertyTitleContractState.NO_LONGER_RELEVANT;
  }
}
