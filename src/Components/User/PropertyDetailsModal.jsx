import React from 'react';
import '../../styles/style.css';
import '../../styles/buttons.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
import Web3 from 'web3';
import { Form } from 'react-bootstrap';
import { useWeb3 } from '../../CustomHooks/useWeb3';
import { useContract } from '../../CustomHooks/useContract';
import { MdOutlineSell } from "react-icons/md";
import config from '../../Config/config';

function PropertyDetailsModal(props) {
    const web3 = useWeb3().current;
    const contract = useContract().current;

    const [contractState, setContractState] = useState(props.contractState);
    const [sellingPrice, setSellingPrice] = useState(props.sellingPrice.toString());
    const [housingTenure, setHousingTenure] = useState(props.housingTenure);
    const [city, setCity] = useState(props.city);
    const [country, setCountry] = useState(props.country);
    const [street, setStreet] = useState(props.street);
    const [streetNumber, setStreetNumber] = useState(props.streetNumber);
    const [apartmentNumber, setApartmentNumber] = useState(props.apartmentNumber);
    const [squareMeters, setSquareMeters] = useState(props.squareMeters);

    const updateContractSellingPrice = async (sellingPriceString) => {
        if (sellingPriceString.length === 0) {
            return;
        }

        if (sellingPriceString.length > 17) {
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
            }).catch((err) => {
                console.log(err.message);
            });

            return;
        }
        
        contract.methods.setPropertySellingPrice(sellingPriceIntegralPart,0,0).send({ from: props.account }).then(() => {
            props.changeSellingPrice(sellingPriceString);
        }).catch((err) => {
            console.log(err.message);
        });
    }

    const updateContractHousingTenure = async () => {
        if (housingTenure.length === 0) {
            return;
        }

        contract.methods.modifyPropertyTenureType(housingTenure).send({ from: props.account }).then(() => {
            props.changeHousingTenure(housingTenure);
        });
    }

    const updateContractSquareMeters = async () => {
        if (squareMeters.length === 0) {
            return;
        }

        contract.methods.modifyPropertySquareMeters(squareMeters).send({ from: props.account }).then(() => {
            props.changeSquareMeters(squareMeters);
        });
    }

    const updateContractPriceAndTenureAndMeters = async (sellingPriceString) => {
        if (sellingPriceString.length === 0) {
            return;
        }

        if (sellingPriceString.length > 17) {
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

            contract.methods.modifyPropertyPriceAndTenureAndMeters(
                sellingPriceIntegralPart,
                sellingPriceFractionalPart,
                sellingPriceFractionalPartLength,
                housingTenure,
                squareMeters
            ).send({ from: props.account }).then(() => {
                props.changeSellingPrice(sellingPriceString);
                props.changeHousingTenure(housingTenure);
                props.changeSquareMeters(squareMeters);
            });

            return;
        }
        
        contract.methods.modifyPropertyPriceAndTenureAndMeters(
            sellingPriceIntegralPart,
            0,
            0,
            housingTenure,
            squareMeters
            ).send({ from: props.account }).then(() => {
                props.changeSellingPrice(sellingPriceString);
                props.changeHousingTenure(housingTenure);
                props.changeSquareMeters(squareMeters);
        }).catch((err) => {
            console.log(err.message);
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

    const applySellingPriceChange = () => {
        if (sellingPrice != props.sellingPrice) {
            updateContractSellingPrice(sellingPrice).then(() => {
                props.onDetailsEditHide();
            }).catch( err => {
                console.log(err);
            });
        }
    }

    const applyHousingTenureChange = () => {
        if (housingTenure != props.housingTenure) {
            updateContractHousingTenure(sellingPrice).then(() => {
                props.onDetailsEditHide();
            }).catch( err => {
                console.log(err);
            });
        }
    }

    const applySquareMetersChange = () => {
        if (squareMeters != props.squareMeters) {
            updateContractSquareMeters(squareMeters).then(() => {
                props.onDetailsEditHide();
            }).catch( err => {
                console.log(err);
            });
        }
    }

    const applyAllContractChanges = () => {
        updateContractPriceAndTenureAndMeters(sellingPrice).then(() => {
            props.onDetailsEditHide();
        }).catch( err => {
            console.log(err);
        });
    }

    return (
        <div>
            <Modal
                show={props.show}
                onHide = {props.onDetailsEditHide}
                size = 'lg'
                key={'propertyTitleEditModal' + props.country + props.city + props.street  + props.streetNumber + props.apartmentNumber}
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
                                                <Button className='apply-change-btn' onClick={() => {applySellingPriceChange();}}>
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
                                        <select value={housingTenure} onChange={(e) => {setHousingTenure(e.target.value);}}>
                                            <option value={config.housingTenure.OWNER_OCCUPANCY}>Owner Occupancy</option>
                                            <option value={config.housingTenure.TENANCY}>Tenancy</option>
                                            <option value={config.housingTenure.COOPERATIVE}>Cooperative</option>
                                            <option value={config.housingTenure.CONDOMIUM}>Condomium</option>
                                            <option value={config.housingTenure.PUBLIC_HOUSING}>Public Housing</option>
                                            <option value={config.housingTenure.SQUATTING}>Squatting</option>
                                            <option value={config.housingTenure.LAND_TRUST}>Land Trust</option>
                                        </select>
                                    </Col>
                                    <Col>
                                        {
                                            housingTenure == props.housingTenure ?
                                                <Button className='apply-change-btn disabled-btn'>
                                                    Request Change
                                                </Button> :
                                                <Button className='apply-change-btn' onClick={() => {applyHousingTenureChange();}}>
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
                                        <input type='number' value={squareMeters} onChange={(e) => setSquareMeters(e.target.value)} placeholder='example: 152' />
                                    </Col>
                                    <Col>
                                        {
                                            squareMeters == props.squareMeters ?
                                            <Button className='apply-change-btn disabled-btn'>
                                                Request Change
                                            </Button> :
                                            <Button className='apply-change-btn' onClick={() => {applySquareMetersChange();}}>
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
                                squareMeters == props.squareMeters && sellingPrice == props.sellingPrice && housingTenure == props.housingTenure ?
                                <Button className='submit-btn disabled-btn'>
                                    Save Contract Changes
                                </Button> :
                                <Button className='submit-btn' onClick={() => {applyAllContractChanges();}}>
                                    Save Contract Changes
                                </Button>
                            }
                            
                        </Col>
                        <Col xs={12} className='text-center mt-2'>
                            <p className='small-text'>This operation costs more than individually applying the changes</p>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PropertyDetailsModal;