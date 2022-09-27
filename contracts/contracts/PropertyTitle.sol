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
    HousingTenure tenureType;
    string country;
    string city;
    string street;
    string streetNumber;
    uint256 apartmentNumber;
    uint256 squareMetres;
}

struct RequiredPropertyDocuments {
    bool proofOfIdentity;
    bool propertyTitleDeeds;
    bool energyPerformanceCertificate;
    bool extensionsAndAlterationsDocumentation;
    bool utilityBillsPaid;
}


contract PropertyTitle {
    PropertyTitleContractState public contractState;
    uint256 public sellingPriceIntegralPart;
    uint256 public sellingPriceFractionalPart;
    uint256 public sellingPriceFractionalPartLength;
    address public creator;
    address payable public owner;
    PropertyDetails public propertyDetails;
    RequiredPropertyDocuments public requiredDocuments;

    constructor(
        address _creator,
        address payable _owner,
        string memory _country,
        string memory _city,
        string memory _street,
        string memory _streeNumber,
        uint256 _apartmentNumber,
        uint256 _squareMeters
    )
    {
        creator = _creator;
        owner = _owner;
        contractState = PropertyTitleContractState.FOR_SALE;
        propertyDetails.country = _country;
        propertyDetails.city = _city;
        propertyDetails.street = _street;
        propertyDetails.streetNumber = _streeNumber;
        propertyDetails.apartmentNumber = _apartmentNumber;
        propertyDetails.squareMetres = _squareMeters;

        sellingPriceIntegralPart = 7;
        sellingPriceFractionalPart = 534;
        sellingPriceFractionalPartLength = 3;
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
        HousingTenure _tenureType,
        uint256 _squareMetres
    )
        external
        onlyOwner
        onlyIfLegallyAllowed
    {
        propertyDetails.tenureType = _tenureType;
        propertyDetails.squareMetres = _squareMetres;
    }

    function modifyPropertyAdress(string memory _street, string memory _streeNumber) external onlyIfLegallyAllowed onlyOwner {
        propertyDetails.street = _street;
        propertyDetails.streetNumber = _streeNumber;
    }

    function modifyPropertyTenureType(HousingTenure _tenureType) external onlyIfLegallyAllowed onlyOwner {
        propertyDetails.tenureType = _tenureType;
    }

    function modifyPropertySquareMetres(uint256 _squareMetres) external onlyIfLegallyAllowed onlyOwner {
        propertyDetails.squareMetres = _squareMetres;
    }

    function setPropertySellingPrice(
        uint256 _sellingPriceIntegralPart, 
        uint256 _sellingPriceFractionalPart, 
        uint256 _sellingPriceFractionalPartLength
    ) 
        external 
        onlyIfLegallyAllowed 
        onlyOwner 
    {
        sellingPriceIntegralPart = _sellingPriceIntegralPart;
        sellingPriceFractionalPart = _sellingPriceFractionalPart;
        sellingPriceFractionalPartLength = _sellingPriceFractionalPartLength;
        contractState = PropertyTitleContractState.FOR_SALE;
    }

    function buyProperty() external payable onlyIfPropertyForSale {
        uint256 sellingPriceWeiValue = (sellingPriceIntegralPart * 10**18) + (sellingPriceFractionalPart * 10**18 / 10**sellingPriceFractionalPartLength);
        (bool sent, bytes memory data) = owner.call{value: sellingPriceWeiValue }("");
        require(sent, "Failed to send Ether.");
        contractState = PropertyTitleContractState.OWNED;
        owner = payable(msg.sender);
    }

    function getContractDetails() public view returns (address, address, PropertyTitleContractState) {
        return (creator, owner, contractState);
    }

    function validatePropertyDebts() public view returns (bool) {
        /// TODO
        return true;
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