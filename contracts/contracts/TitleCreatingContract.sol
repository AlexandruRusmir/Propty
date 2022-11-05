//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./PropertyTitle.sol";

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
        uint256 _squareMeters
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
            _squareMeters
        );
        titleContracts.push(address(propertyTitle));
        propertyTitleContractsValidaty[address(propertyTitle)] = false;
    }

    function validatePropertyTitleContract(address _contractAddress) public onlyRegistrar {
        propertyTitleContractsValidaty[_contractAddress] = true;
    }

    function checkIfUserIsOwner(address _userAddress) public view returns (bool) {
        if (isOwner[_userAddress] == true) {
            return true;
        }
        return false;    
    }

    function checkIfUserIsRegistrar(address _userAddress) public view returns (bool) {
        if (isRegistrar[_userAddress] == true) {
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

    modifier onlyRegistrar {
        require(isRegistrar[msg.sender] == true, "Only one of the registrars has access to this functionality.");
        _;
    }

    modifier onlyOwner {
        require(isOwner[msg.sender] == true, "Only one of the owners has access to this functionality.");
        _;
    }
}