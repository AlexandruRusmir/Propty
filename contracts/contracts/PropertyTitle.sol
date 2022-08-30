//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

enum PropertyTitleContractState { INITIALIZED, OWNED, FOR_SALE, NO_LONGER_RELEVANT }

enum HousingTenure {
    OWNER_OCCUPANCY,
    TENANCY,
    COOPERATIVE,
    CONDOMIUM,
    PUBLIC_HOUSING,
    SQUATTING
}

struct PropertyDetails {
    string propertyAddress;
    string propertyDescription;
    HousingTenure tenureType;
    uint256 squareMetres;
}


contract PropertyTitle {
    address public creator;
    address public owner;
    PropertyTitleContractState public contractState;
    PropertyDetails public propertyDetails;

    constructor(address _creator, address _owner, string memory _propertyAddress) {
        creator = _creator;
        owner = _owner;
        contractState = PropertyTitleContractState.INITIALIZED;
        propertyDetails.propertyAddress = _propertyAddress;
    }

    function modifyContractState(
        address _owner, 
        PropertyTitleContractState _contractState
    ) 
        public 
        onlyCreator
    {
        owner = _owner;
        contractState = _contractState;
    }

    function insertPropertyDetails(
        string calldata _propertyDescription,
        HousingTenure _tenureType,
        uint256 _squareMetres
    )
        public
        onlyOwner
        onlyIfLegallyAllowed
    {
        propertyDetails.propertyDescription = _propertyDescription;
        propertyDetails.tenureType = _tenureType;
        propertyDetails.squareMetres = _squareMetres;
    }

    function modifyPropertyAdress(string memory _address) public onlyIfLegallyAllowed onlyOwner {
        propertyDetails.propertyAddress = _address;
    }

    function modifyPropertyDescription(string memory _description) public onlyIfLegallyAllowed onlyOwner {
        propertyDetails.propertyDescription = _description;
    }

    function modifyPropertyTenureType(HousingTenure _tenureType) public onlyIfLegallyAllowed onlyOwner {
        propertyDetails.tenureType = _tenureType;
    }

    function modifyPropertySquareMetres(uint256 _squareMetres) public onlyIfLegallyAllowed onlyOwner {
        propertyDetails.squareMetres = _squareMetres;
    }


    function getContractDetails() public view returns (address, address, PropertyTitleContractState) {
        return (creator, owner, contractState);
    }

    function validatePropertyDebts() public view returns (bool) {
        /// TODO
        if (!checkStringsEquality(propertyDetails.propertyAddress, '')) {
            return true;
        }
        return false;
        /// TODO
    }

    function checkStringsEquality(string memory firstString, string memory secondString) public pure returns (bool) {
        if (bytes(firstString).length != bytes(secondString).length) {
            return false;
        } else {
            return keccak256(abi.encodePacked(firstString)) == keccak256(abi.encodePacked(secondString));
        }
    }

    function checkIfStringIsFoundInStringsArray(
        string memory stringToSearchFor,
        string[] memory stringsArray
    )
        public
        pure
        returns (bool)
    {
        for (uint256 i = 0; i < stringsArray.length; i++) {
            if (checkStringsEquality(stringToSearchFor, stringsArray[i])) {
                return true;
            }
        }

        return false;
    }

    modifier onlyCreator {
        require(msg.sender == creator, "Only the creator of the Contract has access to this!");
        _;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner of the Contract has access to this!");
        _;
    }

    modifier onlyIfLegallyAllowed {
        require(validatePropertyDebts(), "The property is not legally alright.");
        _;
    }
}