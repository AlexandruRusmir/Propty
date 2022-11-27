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
import config from '../../Data/config';
import { checkIfNumberIsValid, getSellingPriceComponentsFromString } from '../../Helpers/helpers';
import { StyledTextField } from '../SyledTextField';
import MenuItem from '@mui/material/MenuItem';


function PropertyDetailsModal(props) {
    const web3 = useWeb3().current;
    const contract = useContract(props.contractAddress).current;

    const [sellingPrice, setSellingPrice] = useState(props.sellingPrice.toString());
    const [housingTenure, setHousingTenure] = useState(props.housingTenure);
    const [squareMeters, setSquareMeters] = useState(props.squareMeters);

    const [housingTenureIsValid, setHousingTenureIsValid] = useState(true);
    const [sellingPriceIsValid, setSellingPriceIsValid] = useState(true);
    const [squareMetresIsValid, setSquareMetresIsValid] = useState(true);

    const [housingTenureInvalidMessage, setHousingTenureInvalidMessage] = useState('');
    const [squareMetersInvalidMessage, setSquareMetersInvalidMessage] = useState('');
    const [sellingPriceInvalidMessage, setSellingPriceInvalidMessage] = useState('');

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

        let {sellingPriceIntegralPart, sellingPriceFractionalPart, sellingPriceFractionalPartLength} = getSellingPriceComponentsFromString(sellingPriceString);

        contract.methods.setPropertySellingPrice(
            sellingPriceIntegralPart,
            sellingPriceFractionalPart,
            sellingPriceFractionalPartLength
        ).send({ from: props.account }).then(() => {
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

        let {sellingPriceIntegralPart, sellingPriceFractionalPart, sellingPriceFractionalPartLength} = getSellingPriceComponentsFromString(sellingPriceString);

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
        }).catch((err) => {
            console.log(err.message);
        });
    }

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
                        <Col className='flex-column'>
                            <div className='mx-4 my-3'>
                                <Row>
                                    <Col lg={9} sm={7} xs={12}>
                                        <StyledTextField
                                            fullWidth
                                            label="Selling Price (ETH)"
                                            value={sellingPrice} 
                                            onClick={() => {setSellingPriceIsValid(true);}}
                                            onChange={(e) => {
                                            if (checkIfNumberIsValid(e.target.value)) {
                                                setSellingPrice(e.target.value);
                                                }
                                            }} 
                                            helperText={
                                                housingTenureIsValid 
                                                    ? "New Selling Price"
                                                    : sellingPriceInvalidMessage
                                            }
                                        />
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
                                <Row>
                                    <Col lg={9} sm={7} xs={12}>
                                    <StyledTextField
                                        fullWidth
                                        select
                                        label="Housing Tenure"
                                        value={housingTenure}
                                        onClick={() => {setHousingTenureIsValid(true);}}
                                        onChange={(e) => setHousingTenure(e.target.value)}
                                        helperText={
                                            housingTenureIsValid 
                                                ? "New Housing Tenure"
                                                : housingTenureInvalidMessage
                                        }
                                    >
                                        {config.selectHousingTenures.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </StyledTextField>

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
                                <Row>
                                    <Col lg={9} sm={7} xs={12}>
                                        <StyledTextField
                                            fullWidth
                                            label="Square Metres"
                                            value={squareMeters} 
                                            onClick={() => {setSquareMetresIsValid(true);}}
                                            onChange={(e) => {
                                                if (checkIfNumberIsValid(e.target.value)) {
                                                    setSquareMeters(e.target.value);
                                                }
                                            }}
                                            helperText={
                                                squareMetresIsValid 
                                                    ? "New Square Meters Value"
                                                    : squareMetersInvalidMessage
                                            }
                                        />
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