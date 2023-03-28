//SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./PropertyTitle.sol";

interface IAccessPropertyTitleMethods {
    function contractState() external view returns (PropertyTitleContractState);
    function getFullPropertyAddress() external view returns (string memory);
    function owner() external view returns (address);
}

contract TitleCreatingContract {
    event NewTitleContract(
        address indexed ownerAddress,
        address indexed titleContractAddress,
        uint256 timestamp
    );

    address[] public owners;
    mapping (address => bool) public isOwner;

    address[] public registrars;
    mapping (address => bool) public isRegistrar;

    address[] public titleContracts;

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
        emit NewTitleContract(_owner, address(propertyTitle), block.timestamp);
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

    function getContracts() public view returns (address[] memory) {
        return titleContracts;
    }

    function getPendingContractsCount() public view returns (uint256) {
        uint256 k = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.PENDING) {
                k++;
            } 
        }

        return k;
    }

    function getPendingContracts() public view returns (address[] memory) {
        address[] memory contracts = new address[](getPendingContractsCount());

        uint256 k = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.PENDING) {
                contracts[k++] = titleContracts[i];
            } 
        }

        return contracts;
    }

    function getPendingContractsByOffsetAndLimit(uint256 offset, uint256 limit) public view returns (address[] memory) {
        uint256 pendingContractsCount = getPendingContractsCount();
        require(pendingContractsCount > offset, "Offset greater than list length");

        address[] memory contracts = pendingContractsCount > offset + limit 
            ? new address[](limit) 
            : new address[](pendingContractsCount - offset);

        address[] memory pendingContracts = getPendingContracts();
        for (uint256 i = offset; i < offset + limit; i++) {
            if (i >= pendingContracts.length) {
                break;
            }
            contracts[i - offset] = pendingContracts[i];
        }

        return contracts;
    }

    function getActiveContractsByAddressCount(string memory addressToSearchFor) public view returns (uint256) {
        uint256 k = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if ((IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.OWNED ||
                IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.FOR_SALE) &&
                stringContains(toLower(IAccessPropertyTitleMethods(titleContracts[i]).getFullPropertyAddress()), toLower(addressToSearchFor))) {
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

    function getActiveContracts() public view returns (address[] memory) {
        address[] memory contracts = new address[](getActiveContractsCount());

        uint256 k = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.OWNED ||
                IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.FOR_SALE) {
                contracts[k++] = titleContracts[i];
            }
        }

        return contracts;
    }

    function getActiveContractsByAddress(string memory addressToSearchFor) public view returns (address[] memory) {
        address[] memory contracts = new address[](getActiveContractsByAddressCount(addressToSearchFor));

        address[] memory activeContracts = getActiveContracts();
        uint256 k = 0;
        for (uint256 i = 0; i < activeContracts.length; i++) {
            if (stringContains(toLower(IAccessPropertyTitleMethods(activeContracts[i]).getFullPropertyAddress()), toLower(addressToSearchFor))) {
                contracts[k++] = activeContracts[i];
            }
        }

        return contracts;
    }

    function getActiveContractsByAddressAndOffsetAndLimit(string memory addressToSearchFor, uint256 offset, uint256 limit)  public view returns (address[] memory) {
        uint256 activeContractsByAddressCount = getActiveContractsByAddressCount(addressToSearchFor);
        require(activeContractsByAddressCount > offset, "Offset greater than list length");

        address[] memory contracts = activeContractsByAddressCount > offset + limit 
            ? new address[](limit) 
            : new address[](activeContractsByAddressCount - offset);

        address[] memory activeContractsByAddress = getActiveContractsByAddress(addressToSearchFor);
        for (uint256 i = offset; i < offset + limit; i++) {
            if (i >= activeContractsByAddress.length) {
                break;
            }
            contracts[i - offset] = activeContractsByAddress[i];

        }

        return contracts;
    }

    function getForSaleContractsByAddressCount(string memory addressToSearchFor) public view returns (uint256) {
        uint256 k = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.FOR_SALE &&
                stringContains(toLower(IAccessPropertyTitleMethods(titleContracts[i]).getFullPropertyAddress()), toLower(addressToSearchFor))) {
                k++;
            }
        }

        return k;
    }

    function getForSaleContractsCount() public view returns (uint256) {
        uint256 k = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.FOR_SALE) {
                k++;
            } 
        }

        return k;
    }


    function getForSaleContracts() public view returns (address[] memory) {
        address[] memory contracts = new address[](getForSaleContractsCount());

        uint256 k = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).contractState() == PropertyTitleContractState.FOR_SALE) {
                contracts[k++] = titleContracts[i];
            }
        }

        return contracts;
    }

    function getForSaleContractsByAddress(string memory addressToSearchFor) public view returns (address[] memory) {
        address[] memory contracts = new address[](getForSaleContractsByAddressCount(addressToSearchFor));

        address[] memory forSaleContracts = getForSaleContracts();
        uint256 k = 0;
        for (uint256 i = 0; i < forSaleContracts.length; i++) {
            if (stringContains(toLower(IAccessPropertyTitleMethods(forSaleContracts[i]).getFullPropertyAddress()), toLower(addressToSearchFor))) {
                contracts[k++] = forSaleContracts[i];
            }
        }

        return contracts;
    }

    function getForSaleContractsByAddressAndOffsetAndLimit(string memory addressToSearchFor, uint256 offset, uint256 limit)  public view returns (address[] memory) {
        uint256 forSaleContractsByAddressCount = getForSaleContractsByAddressCount(addressToSearchFor);
        require(forSaleContractsByAddressCount > offset, "Offset greater than list length");

        address[] memory contracts = forSaleContractsByAddressCount > offset + limit 
            ? new address[](limit) 
            : new address[](forSaleContractsByAddressCount - offset);

        address[] memory forSaleContractsByAddress = getForSaleContractsByAddress(addressToSearchFor);
        for (uint256 i = offset; i < offset + limit; i++) {
            if (i >= forSaleContractsByAddress.length) {
                break;
            }
            contracts[i - offset] = forSaleContractsByAddress[i];

        }

        return contracts;
    }

    function getAccountContractsCount(address account) public view returns (uint256)
    {
        uint256 k = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).owner() == account && 
                IAccessPropertyTitleMethods(titleContracts[i]).contractState() != PropertyTitleContractState.NO_LONGER_RELEVANT) {
                k++;
            }
        }

        return k;
    }

    function getAccountContracts(address account) public view returns (address[] memory)
    {
        address[] memory contracts = new address[](getAccountContractsCount(account));
        uint256 k = 0;
        for (uint256 i = 0; i < titleContracts.length; i++) {
            if (IAccessPropertyTitleMethods(titleContracts[i]).owner() == account) {
                contracts[k++] = titleContracts[i];
            }
        }

        return contracts;
    }

    function stringContains(string memory stringToSearchIn, string memory stringToSearchFor) public pure returns (bool) {
        bytes memory stringToSearchForBytes = bytes (stringToSearchFor);
        bytes memory stringToSearchInBytes = bytes (stringToSearchIn);

        require(stringToSearchInBytes.length >= stringToSearchForBytes.length);

        bool found = false;
        for (uint i = 0; i <= stringToSearchInBytes.length - stringToSearchForBytes.length; i++) {
            bool flag = true;
            for (uint j = 0; j < stringToSearchForBytes.length; j++)
                if (stringToSearchInBytes[i + j] != stringToSearchForBytes[j]) {
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

    function toLower(string memory str) public pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);
        for (uint i = 0; i < bStr.length; i++) {
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
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