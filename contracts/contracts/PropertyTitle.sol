//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface ITitleCreatingContract {
    function checkIfUserIsRegistrar(address _userAddress) external view returns (bool);
}

enum PropertyTitleContractState { PENDING, OWNED, FOR_SALE, NO_LONGER_RELEVANT }

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
    uint256 squareMeters;
}

struct RequiredPropertyDocuments {
    string proofOfIdentityState;
    string propertyTitleDeedsState;
    string energyPerformanceCertificateState;
    string extensionsAndAlterationsDocumentationState;
    string utilityBillsPaidState;
}

struct SellingPrice {
    uint256 sellingPriceIntegralPart;
    uint256 sellingPriceFractionalPart;
    uint256 sellingPriceFractionalPartLength;
}


contract PropertyTitle {
    PropertyTitleContractState public contractState;
    SellingPrice public sellingPrice;
    address public creator;
    address public owner;
    PropertyDetails public propertyDetails;
    RequiredPropertyDocuments public requiredDocuments;

    constructor(
        address _creator,
        address _owner,
        string memory _country,
        string memory _city,
        string memory _street,
        string memory _streeNumber,
        uint256 _apartmentNumber,
        uint256 _squareMeters,
        uint256 _sellingPriceIntegralPart,
        uint256 _sellingPriceFractionalPart,
        uint256  _sellingPriceFractionalPartLength
    )
    {
        creator = _creator;
        owner = _owner;
        contractState = PropertyTitleContractState.PENDING;
        propertyDetails.country = _country;
        propertyDetails.city = _city;
        propertyDetails.street = _street;
        propertyDetails.streetNumber = _streeNumber;
        propertyDetails.apartmentNumber = _apartmentNumber;
        propertyDetails.squareMeters = _squareMeters;
        sellingPrice.sellingPriceIntegralPart = _sellingPriceIntegralPart;
        sellingPrice.sellingPriceFractionalPart = _sellingPriceFractionalPart;
        sellingPrice.sellingPriceFractionalPartLength = _sellingPriceFractionalPartLength;

        requiredDocuments.proofOfIdentityState = 'Not Provided';
        requiredDocuments.propertyTitleDeedsState = 'Not Provided';
        requiredDocuments.energyPerformanceCertificateState = 'Not Provided';
        requiredDocuments.extensionsAndAlterationsDocumentationState = 'Not Provided';
        requiredDocuments.utilityBillsPaidState = 'Not Provided';
    }

    receive() external payable onlyIfPropertyForSale onlyRelevantProperty 
    {
        uint256 sellingPriceWeiValue = (sellingPrice.sellingPriceIntegralPart * 10**18) + (sellingPrice.sellingPriceFractionalPart * 10**(18-sellingPrice.sellingPriceFractionalPartLength));
        require(msg.sender.balance >= sellingPriceWeiValue, 'Insufficient funds');
        payable(owner).transfer(msg.value);
        contractState = PropertyTitleContractState.OWNED;
        owner = payable(msg.sender);
    }

    function modifyContractStateAndOwner(
        address payable _owner, 
        PropertyTitleContractState _contractState
    )
        external 
        onlyRegistrar
        onlyRelevantProperty
    {
        owner = _owner;
        contractState = _contractState;
    }

    function insertPropertyDetails(
        HousingTenure _tenureType,
        uint256 _squareMeters
    )
        external
        onlyOwner
        onlyIfLegallyAllowed
        onlyRelevantProperty
    {
        propertyDetails.tenureType = _tenureType;
        propertyDetails.squareMeters = _squareMeters;
    }

    function modifyContractState(PropertyTitleContractState _contractState) external onlyIfLegallyAllowed onlyOwner onlyRelevantProperty {
        contractState = _contractState;
    }

    function modifyPropertyAdress(string memory _street, string memory _streeNumber) external onlyIfLegallyAllowed onlyOwner onlyRelevantProperty {
        propertyDetails.street = _street;
        propertyDetails.streetNumber = _streeNumber;
    }

    function modifyPropertyPriceAndTenureAndMeters(
        uint256 _sellingPriceIntegralPart, 
        uint256 _sellingPriceFractionalPart, 
        uint256 _sellingPriceFractionalPartLength,
        HousingTenure _tenureType,
        uint256 _squareMeters
    )
        external
        onlyIfLegallyAllowed
        onlyOwner
        onlyRelevantProperty
    {
        sellingPrice.sellingPriceIntegralPart = _sellingPriceIntegralPart;
        sellingPrice.sellingPriceFractionalPart = _sellingPriceFractionalPart;
        sellingPrice.sellingPriceFractionalPartLength = _sellingPriceFractionalPartLength;
        propertyDetails.tenureType = _tenureType;
        propertyDetails.squareMeters = _squareMeters;
        contractState = PropertyTitleContractState.PENDING;
    }

    function modifyPropertyTenureType(HousingTenure _tenureType) external onlyIfLegallyAllowed onlyOwner onlyRelevantProperty {
        propertyDetails.tenureType = _tenureType;
        contractState = PropertyTitleContractState.PENDING;
    }

    function modifyPropertySquareMeters(uint256 _squareMeters) external onlyIfLegallyAllowed onlyOwner onlyRelevantProperty {
        propertyDetails.squareMeters = _squareMeters;
        contractState = PropertyTitleContractState.PENDING;
    }

    function setPropertySellingPrice(
        uint256 _sellingPriceIntegralPart, 
        uint256 _sellingPriceFractionalPart, 
        uint256 _sellingPriceFractionalPartLength
    ) 
        external 
        onlyIfLegallyAllowed 
        onlyOwner 
        onlyRelevantProperty
    {
        sellingPrice.sellingPriceIntegralPart = _sellingPriceIntegralPart;
        sellingPrice.sellingPriceFractionalPart = _sellingPriceFractionalPart;
        sellingPrice.sellingPriceFractionalPartLength = _sellingPriceFractionalPartLength;
    }

    function setRequiredDocumentsStateAndContractState(
        string memory _proofOfIdentity,
        string memory _propertyTitleDeeds,
        string memory _energyPerformanceCertificate,
        string memory _extensionsAndAlterationsDocumentation,
        string memory _utilityBillsPaid,
        PropertyTitleContractState _contractState
    )
        external
        onlyRegistrar
        onlyRelevantProperty
    {
        requiredDocuments.proofOfIdentityState = _proofOfIdentity;
        requiredDocuments.propertyTitleDeedsState = _propertyTitleDeeds;
        requiredDocuments.energyPerformanceCertificateState = _energyPerformanceCertificate;
        requiredDocuments.extensionsAndAlterationsDocumentationState = _extensionsAndAlterationsDocumentation;
        requiredDocuments.utilityBillsPaidState = _utilityBillsPaid;
        contractState = _contractState;
    }

    function getPropertySellingPrice() public view returns (uint256) {
        uint256 sellingPriceWeiValue = (sellingPrice.sellingPriceIntegralPart * 10**18) + (sellingPrice.sellingPriceFractionalPart * 10**(18-sellingPrice.sellingPriceFractionalPartLength));
        return sellingPriceWeiValue;
    }

    function getContractDetails() public view returns (address, address, PropertyTitleContractState) {
        return (creator, owner, contractState);
    }

    function getFullPropertyAddress() public view returns (string memory) {
        return string.concat(propertyDetails.country, propertyDetails.city, propertyDetails.street, propertyDetails.streetNumber);
    }

    function checkIfAllDocumentsAreProvided() public view returns (bool) {
        if (checkStringsEquality(requiredDocuments.proofOfIdentityState, 'Provided') 
            && checkStringsEquality(requiredDocuments.propertyTitleDeedsState, 'Provided') 
            && checkStringsEquality(requiredDocuments.energyPerformanceCertificateState, 'Provided') 
            && checkStringsEquality(requiredDocuments.extensionsAndAlterationsDocumentationState, 'Provided') 
            && checkStringsEquality(requiredDocuments.utilityBillsPaidState, 'Provided')) {
                return true;
        }
        return false;
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
        require(checkIfAllDocumentsAreProvided(), "The property is not legally alright.");
        _;
    }

    modifier onlyRegistrar {
        require(ITitleCreatingContract(creator).checkIfUserIsRegistrar(msg.sender) == true, "Only a registered registrar has access to this action.");
        _;
    }

    modifier onlyIfPropertyForSale {
        require(propertyDetails.tenureType == HousingTenure.OWNER_OCCUPANCY || propertyDetails.tenureType == HousingTenure.CONDOMIUM,
            "This property's tenure type does not support being sold");
        require(contractState == PropertyTitleContractState.FOR_SALE, "This property is not for sale.");
        _;
    }

    modifier onlyRelevantProperty {
        require(contractState != PropertyTitleContractState.NO_LONGER_RELEVANT, 
            'This Property Title Contract is no longer relavant');
        _;
    }
}