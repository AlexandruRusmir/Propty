//SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./PropertyTitle.sol";

interface IAccessPropertyTitleMethods {
    function contractState() external view returns (PropertyTitleContractState);
    function getFullPropertyAddress() external view returns (string memory);
}

contract TitleCreatingContract {
    address[] public owners;
    mapping (address => bool) public isOwner;

    address[] public registrars;
    mapping (address => bool) public isRegistrar;

    address[] public titleContracts;
    mapping (address => bool) public propertyTitleContractsValidity;

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
        propertyTitleContractsValidity[address(propertyTitle)] = false;
    }

    function validatePropertyTitleContract(address _contractAddress) public onlyRegistrar {
        propertyTitleContractsValidity[_contractAddress] = true;
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
        uint256 k = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.PENDING) {
                k++;
            } 
        }

        return k;
    }

    function getActiveContractsByAddressCount(string memory addressToSearchFor) public view returns (uint256) {
        uint256 k = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.OWNED ||
                IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.FOR_SALE &&
                stringContains(IAccessPropertyTitleMethods(titleContracts[i]).getFullPropertyAddress(), addressToSearchFor)) {
                k++;
            } 
        }

        return k;
    }

    function getActiveContractsCount() public view returns (uint256) {
        uint256 k = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.OWNED ||
                IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.FOR_SALE) {
                k++;
            } 
        }

        return k;
    }

    function getPendingTitleContracts() public view returns (address[] memory) {
        address[] memory contractsAddresses = new address[](getPendingTitleContractsCount());

        uint256 k = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.PENDING) {
                contractsAddresses[k++] = titleContracts[i];
            } 
        }

        return contractsAddresses;
    }

    function getPendingContractsByOffsetAndLimit(uint256 offset, uint256 limit) public view returns (address[] memory) {
        uint256 pendingTitleContractsCount = getPendingTitleContractsCount();
        require(pendingTitleContractsCount > offset, "Offset greater than list length");

        address[] memory contractsAddresses = pendingTitleContractsCount > offset + limit 
            ? new address[](limit) 
            : new address[](pendingTitleContractsCount - offset);

        address[] memory pendingTitleContracts = getPendingTitleContracts();
        for (uint256 i = offset; i < offset + limit; i++) {
            if (i >= titleContracts.length) {
                break;
            }
            contractsAddresses[i - offset] = pendingTitleContracts[i];
        }

        return contractsAddresses;
    }

    function getActiveTitleContracts() public view returns (address[] memory) {
        address[] memory contractsAddresses = new address[](getActiveContractsCount());

        uint256 k = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.OWNED ||
                IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.FOR_SALE) {
                contractsAddresses[k++] = titleContracts[i];
            }
        }

        return contractsAddresses;
    }

    function getActiveContractsByAddress(string memory addressToSearchFor) public view returns (address[] memory) {
        address[] memory contractsAddresses = new address[](getActiveContractsByAddressCount(addressToSearchFor));

        address[] memory activeTitleContracts = getActiveTitleContracts();
        uint256 k = 0;
        for (uint256 i = 0; i < activeTitleContracts.length; i++) {
            if (stringContains(IAccessPropertyTitleMethods(titleContracts[i]).getFullPropertyAddress(), addressToSearchFor)) {
                contractsAddresses[k++] = titleContracts[i];
            }
        }

        return contractsAddresses;
    }

    function getActiveContractsByAddressAndOffsetAndLimit(string memory addressToSearchFor, uint256 offset, uint256 limit)  public view returns (address[] memory) {
        uint256 activeContractsByAddressCount = getActiveContractsByAddressCount(addressToSearchFor);
        require(activeContractsByAddressCount > offset, "Offset greater than list length");

        address[] memory titleContractsAddresses = activeContractsByAddressCount > offset + limit 
            ? new address[](limit) 
            : new address[](activeContractsByAddressCount - offset);

        address[] memory activeContractsByAddress = getActiveContractsByAddress(addressToSearchFor);
        for (uint256 i = offset; i < offset + limit; i++) {
            if (i >= activeContractsByAddress.length) {
                break;
            }
            titleContractsAddresses[i - offset] = activeContractsByAddress[i];

        }

        return titleContractsAddresses;
    }

    function stringContains(string memory stringToSearchIn, string memory stringToSearchFor) public pure returns (bool) {
        bytes memory stringToSearchForBytes = bytes (stringToSearchFor);
        bytes memory stringToSearchInBytes = bytes (stringToSearchIn);

        require(stringToSearchInBytes.length >= stringToSearchForBytes.length);

        bool found = false;
        for (uint i = 0; i <= stringToSearchInBytes.length - stringToSearchForBytes.length; i++) {
            bool flag = true;
            for (uint j = 0; j < stringToSearchForBytes.length; j++)
                if (stringToSearchForBytes [i + j] != stringToSearchForBytes [j]) {
                    flag = false;
                    break;
                }
            if (flag) {
                found = true;
                break;
            }
        }
        
        return found;
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