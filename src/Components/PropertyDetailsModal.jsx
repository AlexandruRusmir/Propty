import React from 'react';
import '../styles/style.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import Web3 from 'web3';
import propertyTitleBuild from 'contracts/PropertyTitle.json';

function PropertyDetailsModal(props) {
    const web3 = new Web3(Web3.givenProvider || 'https://localhost:8545');
    const contract = new web3.eth.Contract(propertyTitleBuild.abi, props.contractAddress)

    const [contractState, setContractState] = useState(props.contractState);
    const [sellingPrice, setSellingPrice] = useState(props.sellingPrice);
    const [housingTenure, setHousingTenure] = useState(props.housingTenure);

    async function updateContractSellingPrice(sellingPriceString) {
        if (sellingPriceString.length === 0) {
            return;
        }

        if (sellingPriceString.length > 31) {
            return;
        }

        const splitArray = sellingPriceString.split('.');
        if (splitArray.length > 2) {
            return;
        }

        const sellingPriceIntegralPart = splitArray[0];
        const sellingPriceFractionalPart = splitArray[1];
        const sellingPriceFractionalPartLength = splitArray[1].length;

        contract.methods.setPropertySellingPrice(
            sellingPriceIntegralPart,
            sellingPriceFractionalPart,
            sellingPriceFractionalPartLength
        ).send({ from: props.account }).then(() => {
            props.changeSellingPrice(sellingPriceString);
        });
        
    }

    const setSellingPriceString = (price) => {
        console.log(props.contractAddress);
        if (price.length === 0) {
            setSellingPrice(price);
            return;
        }

        if (price.length > 31) {
            return;
        }

        const splitArray = price.split('.');
        if (splitArray.length > 2) {
            return;
        }

        if (!((price[price.length -1] >= '0' && price[price.length -1] <= '9') || price[price.length - 1] === '.')) {
            return;
        }

        setSellingPrice(price);
    };

    const applyContractChanges = () => {
        if (sellingPrice != props.sellingPrice) {
            updateContractSellingPrice(sellingPrice).then(() => {
                props.onHide();
            }).catch( err => {
                console.log(err);
            });
        }
    }

    return (
        <div>
            <Modal
                show={props.show}
                onHide = {props.onHide}
                dialogClassName="modal-90w"
                aria-labelledby={'propertyTitleEditModal' + props.country + props.city + props.street  + props.streetNumber + props.apartmentNumber}
                centered
            >
                <Modal.Header closeButton>
                <Modal.Title id={'propertyEditModal' + props.country + props.city + props.street + props.streetNumber + props.apartmentNumber}>
                    Modify your Property Title Contract
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <span>HousingTenure: </span><br/>
                        <select onChange={(e) => {setHousingTenure(e.target.value)}}>
                            <option value="0">Owner Occupancy</option>
                            <option value="1">Tenancy</option>
                            <option value="2">Cooperative</option>
                            <option value="3">Condomium</option>
                            <option value="4">Public Housing</option>
                            <option value="5">Squatting</option>
                            <option value="6">Land Trust</option>
                        </select>
                        
                    </div>

                    <div>
                        Selling Price(ETH):<br/> 
                        <input value={sellingPrice} onChange={(e) => setSellingPriceString(e.target.value)} placeholder='example: 7.543' />
                    </div>
                    
                    <div>
                        
                    </div>
                    
                </Modal.Body>
                <Modal.Footer className='justify-content-center'>
                    <Button variant='success' onClick={applyContractChanges}>Save Contract Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PropertyDetailsModal;