import React, { useEffect, useState } from 'react';
import '../App.css';
import Web3 from 'web3';
import propertyTitleBuild from 'contracts/PropertyTitle.json';
import { Button, Carousel,ButtonGroup } from 'react-bootstrap';

function PropertyDetailsEdit(props) {
    const web3 = new Web3(Web3.givenProvider || 'https://localhost:8545');
    let contractAddress = '';

    const [contractCreator, setContractCreator] = useState('');
    const [contractOwner, setContractOwner] = useState('');
    const [contractState, setContractState] = useState('');
    const [propertyDetails, setPropertyDetails] = useState('');

    useEffect(() => {
         loadContract();
    }, []);
    
    async function loadContract() {
        const networkId = await web3.eth.net.getId();

        contractAddress =  propertyTitleBuild.networks[networkId].address;
        //const propertyAdress = await web3.eth.getStorageAt(contractAddress, web3.utils.soliditySha3());
        const propertyAdress = await web3.eth.getStorageAt(contractAddress, 8);
        console.log(web3.utils.hexToString(propertyAdress)[31]);
        // console.log(web3.utils.hexToString(propertyAdress));
        // const contractOwner = await web3.eth.getStorageAt(contractAddress, 1);
        // const contractState = await web3.eth.getStorageAt(contractAddress, 2);
        // const propertyDetails = await web3.eth.getStorageAt(contractAddress, 3);
        // const value4 = await web3.eth.getStorageAt(contractAddress, 34);
        // // console.log(contractCreator);
        // // console.log(contractOwner);
        // // console.log(web3.utils.hexToNumber(contractState));
        // // console.log(web3.utils.hexToAscii(propertyDetails));
        // // console.log(web3.utils.hexToAscii(value4));

        // setContractCreator(contractCreator);
        // setContractOwner(contractOwner);
        // setContractState(web3.utils.hexToNumber(contractState));
        // setPropertyDetails(web3.utils.hexToAscii(propertyDetails));
    }

    return (
        <>
            <div className="App">
                <h3>
                    Change property details
                </h3>
                <p>{contractCreator}</p>
                <p>{contractOwner}</p>
                <p>{contractState}</p>
                <p>{propertyDetails}</p>
            </div>
            <div>

            </div>
        </>
	);
}

export default PropertyDetailsEdit;