import React, { useEffect, useState } from 'react';
import './App.css';
import Web3 from 'web3';
import propertyTitleBuild from 'contracts/PropertyTitle.json';
import { Button, Carousel,ButtonGroup } from 'react-bootstrap';

function PropertyDetailsEdit(props) {
    const web3 = new Web3(Web3.givenProvider || 'https://localhost:7545');
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
        const contractCreator = await web3.eth.getStorageAt(contractAddress, 0);
        const contractOwner = await web3.eth.getStorageAt(contractAddress, 1);
        const contractState = await web3.eth.getStorageAt(contractAddress, 2);
        const propertyDetails = await web3.eth.getStorageAt(contractAddress, 3);
        console.log(contractState);
        const value4 = await web3.eth.getStorageAt(contractAddress, 10);

        setContractCreator(contractCreator);
        setContractOwner(contractOwner);
        setContractState(web3.utils.hexToNumber(contractState));
        setPropertyDetails(web3.utils.hexToAscii(propertyDetails));
        console.log(value4);
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
                <Button variant='danger'>Butt</Button>
            </div>
            <div>

            </div>
        </>
	);
}

export default PropertyDetailsEdit;