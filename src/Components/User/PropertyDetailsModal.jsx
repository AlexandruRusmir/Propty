import React from 'react';
import '../../styles/style.css';
import '../../styles/buttons.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
import { useContract } from '../../CustomHooks/useContract';
import config from '../../Data/config';
import { checkIfNumberIsValid, getSellingPriceComponentsFromString } from '../../Helpers/helpers';
import { StyledTextField } from '../StyledTextField';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import errorMessages from '../../Data/errorMessages';

function PropertyDetailsModal(props) {
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

    const [contractStateIsBeingChanged, setContractStateIsBeingChanged] = useState(false);
    const [contractStateIsBeingChangedAlertOpen, setContractStateIsBeingChangedAlertOpen] = useState(false);

    const updateContractSellingPrice = async (sellingPriceString) => {
        if (sellingPriceString.length === 0) {
            setSellingPriceInvalidMessage(errorMessages.deployTitleMessages.lessThan1CharacterValue);
            return;
        }

        if (sellingPriceString.length > 32) {
            setSellingPriceInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            return;
        }

        const splitArray = sellingPriceString.split('.');
        if (splitArray.length > 2) {
            setSellingPriceInvalidMessage(errorMessages.deployTitleMessages.illegalCharactersInput);
            return;
        }

        setContractStateIsBeingChanged(true);
        setContractStateIsBeingChangedAlertOpen(true);

        let {sellingPriceIntegralPart, sellingPriceFractionalPart, sellingPriceFractionalPartLength} = getSellingPriceComponentsFromString(sellingPriceString);

        contract.methods.setPropertySellingPrice(
            sellingPriceIntegralPart,
            sellingPriceFractionalPart,
            sellingPriceFractionalPartLength
        ).send({ from: props.account }).then(() => {
            props.changeSellingPrice(sellingPriceString);
            props.onDetailsEditHide();
            setContractStateIsBeingChanged(false);
            setContractStateIsBeingChangedAlertOpen(false);
            props.openContractHasBeenChangedAlert();
        }).catch((err) => {
            console.log(err.message);
            setContractStateIsBeingChanged(false);
            setContractStateIsBeingChangedAlertOpen(false);
        });
    }

    const updateContractHousingTenure = async () => {
        if (!(housingTenure <= config.housingTenure.LAND_TRUST && housingTenure >= config.housingTenure.OWNER_OCCUPANCY)) {
            setHousingTenureInvalidMessage(errorMessages.deployTitleMessages.invalidHousingTenureValue);
            return;
        }

        setContractStateIsBeingChanged(true);
        setContractStateIsBeingChangedAlertOpen(true);

        contract.methods.modifyPropertyTenureType(housingTenure).send({ from: props.account }).then(() => {
            props.changeHousingTenure(housingTenure);
            props.onDetailsEditHide();
            setContractStateIsBeingChanged(false);
            setContractStateIsBeingChangedAlertOpen(false);
            props.openContractHasBeenChangedAlert();
        }).catch((err) => {
            console.log(err.message);
            setContractStateIsBeingChanged(false);
            setContractStateIsBeingChangedAlertOpen(false);
        });
    }

    const updateContractSquareMeters = async () => {
        if (squareMeters.length === 0) {
            setSquareMetersInvalidMessage(errorMessages.deployTitleMessages.lessThan1CharacterValue);
            return;
        }

        if (squareMeters.length > 32) {
            setSquareMetersInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            return;
        }

        setContractStateIsBeingChanged(true);
        setContractStateIsBeingChangedAlertOpen(true);

        contract.methods.modifyPropertySquareMeters(squareMeters).send({ from: props.account }).then(() => {
            props.changeSquareMeters(squareMeters);
            props.onDetailsEditHide();
            setContractStateIsBeingChanged(false);
            setContractStateIsBeingChangedAlertOpen(false);
            props.openContractHasBeenChangedAlert();
        }).catch((err) => {
            console.log(err.message);
            setContractStateIsBeingChanged(false);
            setContractStateIsBeingChangedAlertOpen(false);
        });
    }

    const updateContractPriceAndTenureAndMeters = async (sellingPriceString) => {
        if (sellingPriceString.length === 0) {
            setSellingPriceInvalidMessage(errorMessages.deployTitleMessages.lessThan1CharacterValue);
            return;
        }
        if (sellingPriceString.length > 32) {
            setSellingPriceInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            return;
        }
        const splitArray = sellingPriceString.split('.');
        if (splitArray.length > 2) {
            setSellingPriceInvalidMessage(errorMessages.deployTitleMessages.illegalCharactersInput);
            return;
        }
        if (!(housingTenure <= config.housingTenure.LAND_TRUST && housingTenure >= config.housingTenure.OWNER_OCCUPANCY)) {
            setHousingTenureInvalidMessage(errorMessages.deployTitleMessages.invalidHousingTenureValue);
            return;
        }
        if (squareMeters.length === 0) {
            setSquareMetersInvalidMessage(errorMessages.deployTitleMessages.lessThan1CharacterValue);
            return;
        }

        if (squareMeters.length > 32) {
            setSquareMetersInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            return;
        }

        setContractStateIsBeingChanged(true);
        setContractStateIsBeingChangedAlertOpen(true);

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
            props.onDetailsEditHide();
            setContractStateIsBeingChanged(false);
            setContractStateIsBeingChangedAlertOpen(false);
            props.openContractHasBeenChangedAlert();
        }).catch((err) => {
            console.log(err.message);
            setContractStateIsBeingChanged(false);
            setContractStateIsBeingChangedAlertOpen(false);
        });
    }

    const applySellingPriceChange = () => {
        if (sellingPrice != props.sellingPrice) {
            updateContractSellingPrice(sellingPrice).then(() => {
            }).catch( err => {
                console.log(err);
            });
        }
    }

    const applyHousingTenureChange = () => {
        if (housingTenure != props.housingTenure) {
            updateContractHousingTenure(sellingPrice).then(() => {
            }).catch( err => {
                console.log(err);
            });
        }
    }

    const applySquareMetersChange = () => {
        if (squareMeters != props.squareMeters) {
            updateContractSquareMeters(squareMeters).then(() => {
            }).catch( err => {
                console.log(err);
            });
        }
    }

    const applyAllContractChanges = () => {
        updateContractPriceAndTenureAndMeters(sellingPrice).then(() => {
        }).catch( err => {
            console.log(err);
        });
    }

    const handleContractIsBeingChangedAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
      
        setContractStateIsBeingChangedAlertOpen(false);
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
                                            error={!sellingPriceIsValid}
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
                                            sellingPrice == props.sellingPrice || contractStateIsBeingChanged ?
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
                                        error={!housingTenureIsValid}
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
                                            housingTenure == props.housingTenure || contractStateIsBeingChanged ?
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
                                            error={!squareMetresIsValid}
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
                                            squareMeters == props.squareMeters || contractStateIsBeingChanged ?
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
                                (squareMeters == props.squareMeters && sellingPrice == props.sellingPrice && housingTenure == props.housingTenure) || contractStateIsBeingChanged ?
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
            <Snackbar open={contractStateIsBeingChangedAlertOpen} autoHideDuration={6000} onClose={handleContractIsBeingChangedAlertClose}>
                <MuiAlert
                    variant="filled"
                    onClose={handleContractIsBeingChangedAlertClose}
                    severity="info"
                    sx={{ width: "636px" }}
                >
                    <div className='centered'>
                        Please confirm the transaction and wait for the state of your contract to be changed.
                    </div>
                </MuiAlert>
            </Snackbar>
        </div>
    )
}

export default PropertyDetailsModal;