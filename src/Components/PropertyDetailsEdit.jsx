import React, { useEffect, useState } from 'react';
import '../App.css';
import Web3 from 'web3';
import propertyTitleBuild from 'contracts/PropertyTitle.json';
import { Button, Carousel,ButtonGroup } from 'react-bootstrap';
import { getNumberOfTrailingCharacters, getSellingPrice } from '../Helpers/helpers.js';
import { useWeb3 } from '../CustomHooks/useWeb3';

function PropertyDetailsEdit(props) {
    const web3 = useWeb3().current;

    let contractAddress = '';

    const [contractState, setContractState] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [contractCreator, setContractCreator] = useState('');
    const [contractOwner, setContractOwner] = useState('');
    const [housingTenure, setHousingTenure] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [squareMetres, setSquareMetres] = useState('');
    const [proofOfIdentity, setProofOfIdentity] = useState('');
    const [propertyTitleDeeds, setPropertyTitleDeeds] = useState('');
    const [energyPerformanceCertificate, setEnergyPerformanceCertificate] = useState('');
    const [extensionsAndAlterationsDocumentation, setExtensionsAndAlterationsDocumentation] = useState('');
    const [utilityBillsPaid, setUtilityBillsPaid] = useState('');

    useEffect(() => {
         loadContract();
    }, []);
    
    async function loadContract() {
        const networkId = await web3.eth.net.getId();

        contractAddress =  propertyTitleBuild.networks[networkId].address;

        const contractState = await web3.eth.getStorageAt(contractAddress, 0);
        const sellingPriceIntegralPart = await web3.eth.getStorageAt(contractAddress, 1);
        const sellingPriceFractionalPart = await web3.eth.getStorageAt(contractAddress, 2);
        const sellingPriceFractionalPartLength = await web3.eth.getStorageAt(contractAddress, 3);
        const contractCreator = await web3.eth.getStorageAt(contractAddress, 4);
        const contractOwner = await web3.eth.getStorageAt(contractAddress, 5);
        const housingTenure = await web3.eth.getStorageAt(contractAddress, 6);
        const country = await web3.eth.getStorageAt(contractAddress, 7);
        const city = await web3.eth.getStorageAt(contractAddress, 8);
        const street = await web3.eth.getStorageAt(contractAddress, 9);
        const streetNumber = await web3.eth.getStorageAt(contractAddress, 10);
        const apartmentNumber = await web3.eth.getStorageAt(contractAddress, 11);
        const squareMetres = await web3.eth.getStorageAt(contractAddress, 12);
        const proofOfIdentity = await web3.eth.getStorageAt(contractAddress, 13);
        const propertyTitleDeeds = await web3.eth.getStorageAt(contractAddress, 14);
        const energyPerformanceCertificate = await web3.eth.getStorageAt(contractAddress, 15);
        const extensionsAndAlterationsDocumentation = await web3.eth.getStorageAt(contractAddress, 16);
        const utilityBillsPaid = await web3.eth.getStorageAt(contractAddress, 17);

        setContractState(web3.utils.hexToNumber(contractState));
        setSellingPrice(
            getSellingPrice(
                web3.utils.hexToNumber(sellingPriceIntegralPart), 
                web3.utils.hexToNumber(sellingPriceFractionalPart), 
                web3.utils.hexToNumber(sellingPriceFractionalPartLength)
                )
        );
        setContractCreator(contractCreator);
        setContractOwner(contractOwner);
        setHousingTenure(web3.utils.hexToNumber(housingTenure));
        setCountry(web3.utils.hexToString(country).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(country))));
        setCity(web3.utils.hexToString(city).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(city))));
        setStreet(web3.utils.hexToString(street).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(street))));
        setStreetNumber(web3.utils.hexToString(streetNumber).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(streetNumber))));
        setApartmentNumber(web3.utils.hexToNumber(apartmentNumber));
        setSquareMetres(web3.utils.hexToNumber(squareMetres));
        setProofOfIdentity(web3.utils.hexToNumber(proofOfIdentity));
        setPropertyTitleDeeds(web3.utils.hexToNumber(propertyTitleDeeds));
        setEnergyPerformanceCertificate(web3.utils.hexToNumber(energyPerformanceCertificate));
        setExtensionsAndAlterationsDocumentation(web3.utils.hexToNumber(extensionsAndAlterationsDocumentation));
        setUtilityBillsPaid(web3.utils.hexToNumber(utilityBillsPaid));
    }

    return (
        <>
            <div className="App">
                <h3>
                    Change property details
                </h3>
                <p>{contractState}</p>
                <p>{contractCreator}</p>
                <p>{contractOwner}</p>
                <p>{sellingPrice}</p>
                <p>{housingTenure}</p>
                <p>{country}</p>
                <p>{city}</p>
                <p>{street}</p>
                <p>{streetNumber}</p>
                <p>{apartmentNumber}</p>
                <p>{squareMetres}</p>
                <p>{proofOfIdentity}</p>
                <p>{propertyTitleDeeds}</p>
                <p>{energyPerformanceCertificate}</p>
                <p>{extensionsAndAlterationsDocumentation}</p>
                <p>{utilityBillsPaid}</p>
            </div>
            <div>

            </div>
        </>
	);
}

export default PropertyDetailsEdit;