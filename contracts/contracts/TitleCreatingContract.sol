//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./PropertyTitle.sol";


contract TitleCreatingContract {
    address[] public owners;
    address[] public registrars;
    mapping (address => bool) public registrarsState;
    address[] public titleContracts;
    mapping (address => bool) public propertyTitleContractsValidaty;

    constructor(address[] memory _owners)
    {
        for (uint256 i = 0; i < _owners.length; i++) {
            owners.push(_owners[i]);
        }
    }

    function addRegistrars(address[] memory _registrars) public onlyOwner {
        for (uint256 i = 0; i < _registrars.length; i++) {
            registrars.push(_registrars[i]);
            registrarsState[_registrars[i]] = true;
        }
    }

    function removeRegistrars(address[] memory _registrars) public onlyOwner {
        for (uint256 i = 0; i < _registrars.length; i++) {
            registrarsState[_registrars[i]] = false;
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

    function checkIfUserIsRegistrar(address _userAddress) public view returns (bool) {
        if (registrarsState[_userAddress] == true) {
            return true;
        }
        return false;
    }

    function getContractOwners() public view returns (address[] memory) {
        return owners;
    }

    modifier onlyRegistrar {
        require(registrarsState[msg.sender] == true, "Only one of the registrars has access to this functionality.");
        _;
    }

    modifier onlyOwner {
        bool confirmedOwner = false;
        for (uint256 i = 0; i < owners.length; i++) {
            if (msg.sender == owners[i]) {
                confirmedOwner = true;
                break;
            }
        }
        require(confirmedOwner == true, "Only one of the owners has access to this functionality.");
        _;
    }
}