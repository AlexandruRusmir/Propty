//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./PropertyTitle.sol";

interface IAccessPropertyTitleMethods {
    function contractState() external view returns (PropertyTitleContractState);
}

contract TitleCreatingContract {
    address[] public owners;
    mapping (address => bool) public isOwner;

    address[] public registrars;
    mapping (address => bool) public isRegistrar;

    address[] public titleContracts;
    mapping (address => bool) public propertyTitleContractsValidaty;

    constructor(address[] memory _owners)
    {
        for (uint256 i = 0; i < _owners.length; i++) {
            owners.push(_owners[i]);
            isOwner[_owners[i]] = true;
        }
    }

    function addRegistrars(address[] memory _registrars) public onlyOwner {
        for (uint256 i = 0; i < _registrars.length; i++) {
            if (!checkIfUserIsOwner(_registrars[i])) {
                registrars.push(_registrars[i]);
                isRegistrar[_registrars[i]] = true;
            }
        }
    }

    function removeRegistrarRole(address[] memory _registrars) public onlyOwner {
        for (uint256 i = 0; i < _registrars.length; i++) {
            isRegistrar[_registrars[i]] = false;
        }
    }

    function reactivateRegistrarRole(address[] memory _registrars) public onlyOwner {
        for (uint256 i = 0; i < _registrars.length; i++) {
            isRegistrar[_registrars[i]] = true;
        }
    }

    function deployNewPropertyTitle(
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
        public
    {
        PropertyTitle propertyTitle = new PropertyTitle(
            address(this),
            _owner,
            _country,
            _city,
            _street,
            _streeNumber,
            _apartmentNumber,
            _squareMeters,
            _sellingPriceIntegralPart,
            _sellingPriceFractionalPart,
            _sellingPriceFractionalPartLength
        );
        titleContracts.push(address(propertyTitle));
        propertyTitleContractsValidaty[address(propertyTitle)] = false;
    }

    function validatePropertyTitleContract(address _contractAddress) public onlyRegistrar {
        propertyTitleContractsValidaty[_contractAddress] = true;
    }

    function checkIfUserIsOwner(address userAddress) public view returns (bool) {
        if (isOwner[userAddress] == true) {
            return true;
        }
        return false;    
    }

    function checkIfUserIsRegistrar(address userAddress) public view returns (bool) {
        if (isRegistrar[userAddress] == true) {
            return true;
        }
        return false;
    }

    function getContractOwners() public view returns (address[] memory) {
        return owners;
    }

    function getContractRegistrars() public view returns (address[] memory) {
        return registrars;
    }

    function getTitleContracts() public view returns (address[] memory) {
        return titleContracts;
    }

    function getPendingTitleContractsCount() public view returns (uint256) {
        uint256 counter = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.PENDING) {
                counter++;
            } 
        }

        return counter;
    }

    function getActiveTitleContractsCount() public view returns (uint256) {
        uint256 counter = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.OWNED ||
                IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.FOR_SALE) {
                counter++;
            } 
        }

        return counter;
    }

    function getNoLongerRelevantTitleContractsCount() public view returns (uint256) {
        uint256 counter = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.NO_LONGER_RELEVANT) {
                counter++;
            } 
        }

        return counter;
    }

    function getPendingTitleContracts() public view returns (address[] memory) {
        address[] memory titleContractsAddresses = new address[](getPendingTitleContractsCount());

        uint256 k = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.PENDING) {
                titleContractsAddresses[k++] = titleContracts[i];
            } 
        }

        return titleContractsAddresses;
    }

    function getPendingTitleContractsByOffsetAndLimit(uint256 offset, uint256 limit) public view returns (address[] memory) {
        address[] memory titleContractsAddresses = getPendingTitleContractsCount() > offset + limit 
            ? new address[](limit) 
            : new address[](getPendingTitleContractsCount() - offset);

        address[] memory pendingTitleContracts = getPendingTitleContracts();
        for (uint256 i = offset; i < offset + limit; i++) {
            if (i >= titleContracts.length) {
                break;
            }
            titleContractsAddresses[i - offset] = pendingTitleContracts[i];
        }

        return titleContractsAddresses;
    }

    function getActiveTitleContracts() public view returns (address[] memory) {
        address[] memory titleContractsAddresses = new address[](getActiveTitleContractsCount());

        uint256 k = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.OWNED ||
                IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.FOR_SALE) {
                titleContractsAddresses[k++] = titleContracts[i];
            }
        }

        return titleContractsAddresses;
    }

    function getNoLongerRelevantTitleContracts() public view returns (address[] memory) {
        address[] memory titleContractsAddresses = new address[](getNoLongerRelevantTitleContractsCount());

        uint256 k = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.NO_LONGER_RELEVANT) {
                titleContractsAddresses[k++] = titleContracts[i];
            }
        }

        return titleContractsAddresses;
    }

    modifier onlyRegistrar {
        require(isRegistrar[msg.sender] == true, "Only one of the registrars has access to this functionality.");
        _;
    }

    modifier onlyOwner {
        require(isOwner[msg.sender] == true, "Only one of the owners has access to this functionality.");
        _;
    }
}