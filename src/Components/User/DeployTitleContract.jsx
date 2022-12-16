import React from 'react';
import '../../styles/style.css';
import '../../styles/buttons.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect, useMemo } from 'react';
import config from '../../Data/config';
import errorMessages from '../../Data/errorMessages';
import { checkIfNumberIsValid, getSellingPriceComponentsFromString } from '../../Helpers/helpers';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import { StyledTextField } from '../StyledTextField';
import MenuItem from '@mui/material/MenuItem';

function DeployTitleContract(props) {
    const titlesContract = useTitlesContract().current;

    const [sellingPrice, setSellingPrice] = useState('');
    const [housingTenure, setHousingTenure] = useState('0');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [street, setStreet] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [squareMeters, setSquareMeters] = useState('');

    const [valuesAreCompleted, setValuesAreCompleted] = useState(false);

    const [housingTenureIsValid, setHousingTenureIsValid] = useState(true);
    const [cityIsValid, setCityIsValid] = useState(true);
    const [countryIsValid, setCountryIsValid] = useState(true);
    const [streetIsValid, setStreetIsValid] = useState(true);
    const [streetNumberIsValid, setStreetNumberIsValid] = useState(true);
    const [sellingPriceIsValid, setSellingPriceIsValid] = useState(true);
    const [squareMetresIsValid, setSquareMetresIsValid] = useState(true);
    const [apartmentNumberIsValid, setApartmentNumberIsValid] = useState(true);

    const [housingTenureInvalidMessage, setHousingTenureInvalidMessage] = useState('');
    const [cityInvalidMessage, setCityInvalidMessage] = useState('');
    const [countryInvalidMessage, setCountryInvalidMessage] = useState('');
    const [streetInvalidMessage, setStreetInvalidMessage] = useState('');
    const [streetNumberInvalidMessage, setStreetNumberInvalidMessage] = useState('');
    const [apartmentNumberInvalidMessage, setApartmentNumberInvalidMessage] = useState('');
    const [squareMetersInvalidMessage, setSquareMetersInvalidMessage] = useState('');
    const [sellingPriceInvalidMessage, setSellingPriceInvalidMessage] = useState('');

    const checkIfInputsAreCompleted = () => {
        if (!housingTenure || !country || !city || !street || !streetNumber || !sellingPrice || !squareMeters || !apartmentNumber) {
            setValuesAreCompleted(false);
            return;
        }
        setValuesAreCompleted(true);
    }

    useMemo(checkIfInputsAreCompleted, [housingTenure, city, country, street, streetNumber, apartmentNumber, squareMeters, sellingPrice]);

    const clearFields = () => {
        setSellingPrice('');
        setHousingTenure(0);
        setCity('');
        setCountry('');
        setStreet('');
        setStreetNumber('');
        setApartmentNumber('');
        setSquareMeters('');
    }

    const validateUserInputs = () => {
        let inputsAreValid = true;
        if (!(housingTenure <= config.housingTenure.LAND_TRUST && housingTenure >= config.housingTenure.OWNER_OCCUPANCY)) {
            setHousingTenureIsValid(false);
            setHousingTenureInvalidMessage(errorMessages.deployTitleMessages.invalidHousingTenureValue);
            inputsAreValid = false;
        }

        if (country.length < 4) {
            setCountryIsValid(false);
            setCountryInvalidMessage(errorMessages.deployTitleMessages.lessThan4CharactersValue);
            inputsAreValid = false;
        }
        if (country.length > 32) {
            setCountryIsValid(false);
            setCountryInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            inputsAreValid = false;
        }
        if (country.includes(errorMessages.illegalCharacters)) {
            setCountryIsValid(false);
            setCountryInvalidMessage(errorMessages.deployTitleMessages.illegalCharactersInput);
            inputsAreValid = false;
        }

        if (city.length < 1) {
            setCountryIsValid(false);
            setCityInvalidMessage(errorMessages.deployTitleMessages.lessThan1CharacterValue);
            inputsAreValid = false;
        }
        if (city.length > 32) {
            setCityIsValid(false);
            setCityInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            inputsAreValid = false;
        }
        if (city.includes(errorMessages.illegalCharacters)) {
            setCityIsValid(false);
            setCityInvalidMessage(errorMessages.deployTitleMessages.illegalCharactersInput);
            inputsAreValid=  false;
        }

        if (street.length < 4) {
            setStreetIsValid(false);
            setStreetInvalidMessage(errorMessages.deployTitleMessages.lessThan4CharactersValue);
            inputsAreValid = false;
        }
        if (street.length > 32) {
            setStreetIsValid(false);
            setStreetInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            inputsAreValid = false;
        }
        if (street.includes(errorMessages.illegalCharacters)) {
            setStreetIsValid(false);
            setStreetInvalidMessage(errorMessages.deployTitleMessages.illegalCharactersInput);
            inputsAreValid = false;
        }

        if (streetNumber.length < 1) {
            setStreetNumberIsValid(false);
            setStreetNumberInvalidMessage(errorMessages.deployTitleMessages.lessThan1CharacterValue);
            inputsAreValid = false;
        }
        if (streetNumber.length > 32) {
            setStreetNumberIsValid(false);
            setStreetNumberInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            inputsAreValid = false;
        }
        if (streetNumber.includes(errorMessages.illegalCharacters)) {
            setStreetNumberIsValid(false);
            setStreetNumberInvalidMessage(errorMessages.deployTitleMessages.illegalCharactersInput);
            inputsAreValid = false;
        }


        if (apartmentNumber.length < 1) {
            setApartmentNumberIsValid(false);
            setApartmentNumberInvalidMessage(errorMessages.deployTitleMessages.lessThan1CharacterValue);
            inputsAreValid = false;
        }
        if (apartmentNumber.length > 32) {
            setApartmentNumberIsValid(false);
            setApartmentNumberInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            inputsAreValid = false;
        }
        if (apartmentNumber.includes(errorMessages.illegalCharacters)) {
            setApartmentNumberIsValid(false);
            setApartmentNumberInvalidMessage(errorMessages.deployTitleMessages.illegalCharactersInput);
            inputsAreValid = false;
        }

        if (squareMeters.length < 1) {
            setSquareMetresIsValid(false);
            setSquareMetersInvalidMessage(errorMessages.deployTitleMessages.lessThan1CharacterValue);
            inputsAreValid = false;
        }
        if (squareMeters.length > 32) {
            setSquareMetresIsValid(false);
            setSquareMetersInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            inputsAreValid = false;
        }
        if (squareMeters.includes(errorMessages.illegalCharacters)) {
            setSquareMetresIsValid(false);
            setSquareMetersInvalidMessage(errorMessages.deployTitleMessages.illegalCharactersInput);
            inputsAreValid = false;
        }

        if (sellingPrice.length < 1) {
            setSellingPriceIsValid(false);
            setSellingPriceInvalidMessage(errorMessages.deployTitleMessages.lessThan1CharacterValue);
            inputsAreValid = false;
        }
        if (sellingPrice.length > 32) {
            setSellingPriceIsValid(false);
            setSellingPriceInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            inputsAreValid = false;
        }
        if (sellingPrice.includes(errorMessages.illegalCharacters)) {
            setSellingPriceIsValid(false);
            setSellingPriceInvalidMessage(errorMessages.deployTitleMessages.illegalCharactersInput);
            inputsAreValid = false;
        }

        return inputsAreValid;
    }

    const deployTitleContract = async () => {
        if (!validateUserInputs()) {
            return;
        }

        let {sellingPriceIntegralPart, sellingPriceFractionalPart, sellingPriceFractionalPartLength} = getSellingPriceComponentsFromString(sellingPrice);

        const apartmentNumberToDeploy = apartmentNumber === '-' ? 0 : apartmentNumber;
        titlesContract.methods.deployNewPropertyTitle(
            props.account,
            country,
            city,
            street,
            streetNumber,
            apartmentNumberToDeploy,
            squareMeters,
            sellingPriceIntegralPart,
            sellingPriceFractionalPart,
            sellingPriceFractionalPartLength
        ).send({ from: props.account }).then(() => {
            clearFields();
            props.onAddNewContractHide();
            props.setDeployConfirmAlertOpen(true);
        }).catch((err) => {
            console.log(err.message);
            props.onAddNewContractHide();
            props.setFailConfirmAlertOpen(true);
        });
    }

    return (
        <Modal
            show = {props.show}
            onHide = {props.onAddNewContractHide}
            size = 'lg'
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title className='ms-4 mr-1'>
                    Add new Property Title Contract
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Row className='mx-2'>
                        <Col lg={6} md={12} className='mb-3'>
                        <StyledTextField
                            error={!housingTenureIsValid}
                            fullWidth
                            select
                            label="Housing Tenure"
                            value={housingTenure}
                            onClick={() => {setHousingTenureIsValid(true);}}
                            onChange={(e) => setHousingTenure(e.target.value)}
                            helperText={
                                housingTenureIsValid 
                                    ? "Please select the housing tenure"
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
                        <Col lg={6} md={12} className='mb-3'>
                            <StyledTextField 
                                error={!countryIsValid}
                                fullWidth
                                label="Country"
                                value={country} 
                                onChange={(e) => setCountry(e.target.value)} 
                                onClick={() => {setCountryIsValid(true);}}
                                helperText={
                                    countryIsValid 
                                        ? "The country where the property is located"
                                        : countryInvalidMessage
                                }
                            ></StyledTextField>
                        </Col>
                    </Row>
                    <Row className='mx-2'>
                        <Col lg={6} md={12} className='mb-3'>
                            <StyledTextField 
                                error={!cityIsValid}
                                fullWidth
                                value={city} 
                                label="City"
                                onChange={(e) => setCity(e.target.value)} 
                                onClick={() => {setCityIsValid(true);}}
                                helperText={
                                    cityIsValid 
                                        ? "The city where the property is located"
                                        : cityInvalidMessage
                                }
                            />
                        </Col>
                        <Col lg={6} md={12} className='mb-3'>
                            <StyledTextField 
                                error={!streetIsValid}
                                fullWidth
                                label="Street"
                                value={street} 
                                onChange={(e) => setStreet(e.target.value)} 
                                onClick={() => {setStreetIsValid(true);}}
                                helperText={
                                    streetIsValid 
                                        ? "The street where the property is located"
                                        : streetInvalidMessage
                                }
                            />
                        </Col>
                    </Row>
                    <Row className='mx-2'>
                        <Col lg={6} md={12} className='mb-3'>
                            <StyledTextField 
                                error={!streetNumberIsValid}
                                fullWidth
                                label="Street Number"
                                value={streetNumber} 
                                onChange={(e) => setStreetNumber(e.target.value)} 
                                onClick={() => {setStreetNumberIsValid(true);}}
                                helperText={
                                    streetNumberIsValid 
                                        ? "The street number where the property is located"
                                        : streetNumberInvalidMessage
                                }
                            />
                        </Col>
                        <Col lg={6} md={12} className='mb-3'>
                            <StyledTextField 
                                error={!apartmentNumberIsValid}
                                fullWidth
                                label="Apartment Number (use - if none)"
                                value={apartmentNumber} 
                                onChange={(e) => {
                                    if (e.target.value.includes('-')) {
                                        if (e.target.value.length > 1) {
                                            return;
                                        }
                                        setApartmentNumber(e.target.value);
                                        return;
                                    }
                                    if (checkIfNumberIsValid(e.target.value)) {
                                        if (!(e.target.value).includes('.')){
                                            setApartmentNumber(e.target.value);
                                        }
                                    }
                                }}
                                onClick={() => {setApartmentNumberIsValid(true);}}
                                helperText={
                                    apartmentNumberIsValid 
                                        ? "The street number where the property is located"
                                        : apartmentNumberInvalidMessage
                                }
                            />
                        </Col>
                    </Row>
                    <Row className='mx-2'>
                        <Col lg={6} md={12} className='mb-3'>
                            <StyledTextField 
                                error={!squareMetresIsValid}
                                fullWidth
                                label="Square Metres"
                                value={squareMeters} 
                                onChange={(e) => {
                                    if (checkIfNumberIsValid(e.target.value)) {
                                        if (!(e.target.value).includes('.')){
                                            setSquareMeters(e.target.value);
                                        }
                                    }
                                }}
                                onClick={() => {setSquareMetresIsValid(true);}}
                                helperText={
                                    squareMetresIsValid 
                                        ? "Declared property square meters"
                                        : squareMetersInvalidMessage
                                }
                            />
                        </Col>
                        <Col lg={6} md={12} className='mb-3'>
                            <StyledTextField 
                                error={!sellingPriceIsValid}
                                fullWidth
                                label="Selling Price (ETH)"
                                value={sellingPrice} 
                                onChange={(e) => {
                                    if (checkIfNumberIsValid(e.target.value)) {
                                        setSellingPrice(e.target.value);
                                    }
                                }} 
                                onClick={() => {setSellingPriceIsValid(true);}}
                                helperText={
                                    sellingPriceIsValid 
                                        ? "Property selling price (ETH)"
                                        : sellingPriceInvalidMessage
                                }
                            />
                        </Col>
                    </Row>
                </div>
            </Modal.Body>
            <Modal.Footer className='centered my-3'>
                <Row>
                    <Col xs={12} className='mb-2'>
                    {
                        valuesAreCompleted ?
                            <Button className='submit-btn' onClick={deployTitleContract}>
                                Deploy Contract Request
                            </Button> :
                            <Button className='submit-btn disabled-btn'>
                                Deploy Contract Request
                            </Button> 
                    }
                    </Col>
                    <Col xs={12} className='text-center '>
                        <p className='small-text'>Your contract wil be deployed and validated by a registrar in the shortest possible time.</p>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
    )
}

export default DeployTitleContract;