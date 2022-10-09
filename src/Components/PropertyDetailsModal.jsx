import React from 'react';
import '../styles/style.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
import Web3 from 'web3';
import { Form } from 'react-bootstrap';
import { useWeb3 } from '../CustomHooks/useWeb3';
import { useContract } from '../CustomHooks/useContract';
import { MdOutlineSell } from "react-icons/md";

function PropertyDetailsModal(props) {
    const web3 = useWeb3().current;
    const contract = useContract().current;

    const [contractState, setContractState] = useState(props.contractState);
    const [sellingPrice, setSellingPrice] = useState(props.sellingPrice);
    const [housingTenure, setHousingTenure] = useState(props.housingTenure);
    const [city, setCity] = useState(props.city);
    const [country, setCountry] = useState(props.country);
    const [street, setStreet] = useState(props.street);
    const [streetNumber, setStreetNumber] = useState(props.streetNumber);
    const [apartmentNumber, setApartmentNumber] = useState(props.apartmentNumber);
    const [squareMetres, setSquareMetres] = useState(props.squareMetres);

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
        if (splitArray[1]) {
            const sellingPriceFractionalPart = splitArray[1];
            const sellingPriceFractionalPartLength = splitArray[1].length;

            contract.methods.setPropertySellingPrice(
                sellingPriceIntegralPart,
                sellingPriceFractionalPart,
                sellingPriceFractionalPartLength
            ).send({ from: props.account }).then(() => {
                props.changeSellingPrice(sellingPriceString);
            });

            return;
        }
        
        contract.methods.setPropertySellingPrice(sellingPriceIntegralPart,0,).send({ from: props.account }).then(() => {
            props.changeSellingPrice(sellingPriceString);
        });
    }

    const setSellingPriceString = (price) => {
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
                size = 'lg'
                aria-labelledby={'propertyTitleEditModal' + props.country + props.city + props.street  + props.streetNumber + props.apartmentNumber}
                centered
            >
                <Modal.Header closeButton>
                <Modal.Title id={'propertyEditModal' + props.country + props.city + props.street + props.streetNumber + props.apartmentNumber}>
                    <div className='mx-4'>
                        Modify your Property Title Contract
                    </div>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col className='input-box flex-column'>
                            <div className='mx-4 my-3'>
                                Selling Price(ETH):<br/> 
                                <Row>
                                    <Col lg={9} sm={7} xs={12}>
                                        <input value={sellingPrice} onChange={(e) => setSellingPriceString(e.target.value)} placeholder='example: 7.543' />
                                    </Col>
                                    <Col>
                                        {
                                            sellingPrice == props.sellingPrice ?
                                                <Button className='apply-change-btn disabled-btn'>
                                                    Apply Change
                                                </Button> :
                                                <Button className='apply-change-btn'>
                                                    Apply Change
                                                </Button> 
                                        }                       
                                    </Col>
                                </Row>
                                
                            </div>

                            <div className='mx-4 my-3'>
                                <span>Housing Tenure: </span><br/>
                                <Row>
                                    <Col lg={9} sm={7} xs={12}>
                                        <select onChange={(e) => {setHousingTenure(e.target.value);}}>
                                            <option value="0">Owner Occupancy</option>
                                            <option value="1">Tenancy</option>
                                            <option value="2">Cooperative</option>
                                            <option value="3">Condomium</option>
                                            <option value="4">Public Housing</option>
                                            <option value="5">Squatting</option>
                                            <option value="6">Land Trust</option>
                                        </select>
                                    </Col>
                                    <Col>
                                        {
                                            housingTenure == props.housingTenure ?
                                                <Button className='apply-change-btn disabled-btn'>
                                                    Request Change
                                                </Button> :
                                                <Button className='apply-change-btn' onClick={() => {console.log(1);}}>
                                                    Request Change
                                                </Button>
                                        }
                                    </Col>
                                </Row>
                            </div>

                            <div className='mx-4 my-3'>
                                Square Metres:<br/>
                                <Row>
                                    <Col lg={9} sm={7} xs={12}>
                                        <input type='number' value={squareMetres} onChange={(e) => setSquareMetres(e.target.value)} placeholder='example: 152' />
                                    </Col>
                                    <Col>
                                        {
                                            squareMetres == props.squareMetres ?
                                            <Button className='apply-change-btn disabled-btn'>
                                                Request Change
                                            </Button> :
                                            <Button className='apply-change-btn'>
                                                Request Change
                                            </Button>
                                        }
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className='justify-content-center'>
                    <Row>
                        <Col xs={12}>
                            {
                                squareMetres == props.squareMetres && sellingPrice == props.sellingPrice && housingTenure == props.housingTenure ?
                                <Button className='submit-btn disabled-btn' onClick={applyContractChanges}>
                                    Save Contract Changes
                                </Button> :
                                <Button className='submit-btn' onClick={applyContractChanges}>
                                    Save Contract Changes
                                </Button>
                            }
                            
                        </Col>
                        <Col xs={12} className='text-center mt-2'>
                            <div className=''>
                                <p className='small-text'>This operation costs more than individually applying the changes</p>
                            </div>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PropertyDetailsModal;