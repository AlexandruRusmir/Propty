//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

enum PropertyTitleContractState { INITIALIZED, OWNED, FOR_SALE, NO_LONGER_RELEVANT }

enum HousingTenure {
    OWNER_OCCUPANCY,
    TENANCY,
    COOPERATIVE,
    CONDOMIUM,
    PUBLIC_HOUSING,
    SQUATTING,
    LAND_TRUST
}

struct PropertyDetails {
    string propertyAddress;
    string propertyDescription;
    HousingTenure tenureType;
    uint256 squareMetres;
}

struct RequiredPropertySellingDocuments {
    bool proofOfIdentity;
    bool propertyTitleDeeds;
    bool energyPerformanceCertificate;
    bool extensionsAndAlterationsDocumentation;
    bool utilityBillsPaid;
}


contract PropertyTitle {
    address public creator;
    address payable public owner;
    PropertyTitleContractState public contractState;
    PropertyDetails public propertyDetails;
    uint256 public sellingPrice;
    RequiredPropertySellingDocuments public requiredDocuments;

    constructor(address _creator, address payable _owner, string memory _propertyAddress) {
        creator = _creator;
        owner = _owner;
        contractState = PropertyTitleContractState.INITIALIZED;
        propertyDetails.propertyAddress = _propertyAddress;
    }

    function modifyContractState(
        address payable _owner, 
        PropertyTitleContractState _contractState
    )
        external 
        onlyIfUserIsRegistrar
    {
        owner = _owner;
        contractState = _contractState;
    }

    function insertPropertyDetails(
        string calldata _propertyDescription,
        HousingTenure _tenureType,
        uint256 _squareMetres
    )
        external
        onlyOwner
        onlyIfLegallyAllowed
    {
        propertyDetails.propertyDescription = _propertyDescription;
        propertyDetails.tenureType = _tenureType;
        propertyDetails.squareMetres = _squareMetres;
    }

    function modifyPropertyAdress(string memory _address) external onlyIfLegallyAllowed onlyOwner {
        propertyDetails.propertyAddress = _address;
    }

    function modifyPropertyDescription(string memory _description) external onlyIfLegallyAllowed onlyOwner {
        propertyDetails.propertyDescription = _description;
    }

    function modifyPropertyTenureType(HousingTenure _tenureType) external onlyIfLegallyAllowed onlyOwner {
        propertyDetails.tenureType = _tenureType;
    }

    function modifyPropertySquareMetres(uint256 _squareMetres) external onlyIfLegallyAllowed onlyOwner {
        propertyDetails.squareMetres = _squareMetres;
    }

    function addPropertyAsForSale(uint256 _sellingPrice) external onlyIfLegallyAllowed onlyOwner {
        sellingPrice = _sellingPrice;
        contractState = PropertyTitleContractState.FOR_SALE;
    }

    function buyProperty() external payable onlyIfPropertyForSale {
        (bool sent, bytes memory data) = owner.call{value: sellingPrice}("");
        require(sent, "Failed to send Ether.");
        contractState = PropertyTitleContractState.OWNED;
        owner = payable(msg.sender);
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

    function checkIfUserIsRegistrar() public view returns (bool) {
        //address currentUser = msg.sender;
        // registrarsArray = CentralContract.getRegistrarsArray();
        // for (uint256 i = 0; i < registrarsArray.length; i++) {
        //     if (currentUser == registrarsArray[i]) {
        //         return true;
        //     }
        // }
        return true;
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

    modifier onlyIfUserIsRegistrar {
        require(checkIfUserIsRegistrar(), "Only a registered registrar has access to this action.");
        _;
    }

    modifier onlyIfPropertyForSale {
        require(propertyDetails.tenureType == HousingTenure.OWNER_OCCUPANCY || propertyDetails.tenureType == HousingTenure.CONDOMIUM,
            "This property's tenure type does not support being sold");
        require(contractState == PropertyTitleContractState.FOR_SALE, "This property is not for sale.");
        _;
    }
}