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

    const validateUserInputs = () => {
        if (!(housingTenure <= config.housingTenure.LAND_TRUST && housingTenure >= config.housingTenure.OWNER_OCCUPANCY)) {
            setHousingTenureIsValid(false);
            setHousingTenureInvalidMessage(errorMessages.deployTitleMessages.invalidHousingTenureValue);
            return false;
        }

        if (country.length < 4) {
            setCountryIsValid(false);
            setCountryInvalidMessage(errorMessages.deployTitleMessages.lessThan4CharactersValue);
            return false;
        }
        if (country.length > 32) {
            setCountryIsValid(false);
            setCountryInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            return false;
        }
        if (country.includes(errorMessages.illegalCharacters)) {
            setCountryIsValid(false);
            setCountryInvalidMessage(errorMessages.deployTitleMessages.illegalCharactersInput);
            return false;
        }

        if (city.length < 1) {
            setCountryIsValid(false);
            setCityInvalidMessage(errorMessages.deployTitleMessages.lessThan1CharacterValue);
            return false;
        }
        if (city.length > 32) {
            setCityIsValid(false);
            setCityInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            return false;
        }
        if (city.includes(errorMessages.illegalCharacters)) {
            setCityIsValid(false);
            setCityInvalidMessage(errorMessages.deployTitleMessages.illegalCharactersInput);
            return false;
        }

        if (street.length < 4) {
            setStreetIsValid(false);
            setStreetInvalidMessage(errorMessages.deployTitleMessages.lessThan4CharactersValue);
            return false;
        }
        if (street.length > 32) {
            setStreetIsValid(false);
            setStreetInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            return false;
        }
        if (street.includes(errorMessages.illegalCharacters)) {
            setStreetIsValid(false);
            setStreetInvalidMessage(errorMessages.deployTitleMessages.illegalCharactersInput);
            return false;
        }

        if (streetNumber.length < 1) {
            setStreetNumberIsValid(false);
            setStreetNumberInvalidMessage(errorMessages.deployTitleMessages.lessThan1CharacterValue);
            return false;
        }
        if (streetNumber.length > 32) {
            setStreetNumberIsValid(false);
            setStreetNumberInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            return false;
        }
        if (streetNumber.includes(errorMessages.illegalCharacters)) {
            setStreetNumberIsValid(false);
            setStreetNumberInvalidMessage(errorMessages.deployTitleMessages.illegalCharactersInput);
            return false;
        }


        if (apartmentNumber.length < 1) {
            setApartmentNumberIsValid(false);
            setApartmentNumberInvalidMessage(errorMessages.deployTitleMessages.lessThan1CharacterValue);
            return false;
        }
        if (apartmentNumber.length > 32) {
            setApartmentNumberIsValid(false);
            setApartmentNumberInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            return false;
        }
        if (apartmentNumber.includes(errorMessages.illegalCharacters)) {
            setApartmentNumberIsValid(false);
            setApartmentNumberInvalidMessage(errorMessages.deployTitleMessages.illegalCharactersInput);
            return false;
        }

        if (squareMeters.length < 1) {
            setSquareMetresIsValid(false);
            setSquareMetersInvalidMessage(errorMessages.deployTitleMessages.lessThan1CharacterValue);
            return false;
        }
        if (squareMeters.length > 32) {
            setSquareMetresIsValid(false);
            setSquareMetersInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            return false;
        }
        if (squareMeters.includes(errorMessages.illegalCharacters)) {
            setSquareMetresIsValid(false);
            setSquareMetersInvalidMessage(errorMessages.deployTitleMessages.illegalCharactersInput);
            return false;
        }

        if (sellingPrice.length < 1) {
            setSellingPriceIsValid(false);
            setSellingPriceInvalidMessage(errorMessages.deployTitleMessages.lessThan1CharacterValue);
            return false;
        }
        if (sellingPrice.length > 32) {
            setSellingPriceIsValid(false);
            setSellingPriceInvalidMessage(errorMessages.deployTitleMessages.moreThan32CharactersValue);
            return false;
        }
        if (sellingPrice.includes(errorMessages.illegalCharacters)) {
            setSellingPriceIsValid(false);
            setSellingPriceInvalidMessage(errorMessages.deployTitleMessages.illegalCharactersInput);
            return false;
        }

        return true;
    }

    const deployTitleContract = async () => {
        if (!validateUserInputs()) {
            return;
        }

        let {sellingPriceIntegralPart, sellingPriceFractionalPart, sellingPriceFractionalPartLength} = getSellingPriceComponentsFromString(sellingPrice);

        titlesContract.methods.deployNewPropertyTitle(
            props.account,
            country,
            city,
            street,
            streetNumber,
            apartmentNumber,
            squareMeters,
            sellingPriceIntegralPart,
            sellingPriceFractionalPart,
            sellingPriceFractionalPartLength
        ).send({ from: props.account }).then(() => {
            console.log('deployed');
        }).catch((err) => {
            console.log(err.message);
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
                <Modal.Title className='mx-3'>
                    Add new Property Title Contract
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='input-box'>
                    <Row className='mx-2'>
                        <Col lg={6} md={12} className='mb-3'>
                            Housing Tenure: <br/>
                            <select 
                                onChange={(e) => {setHousingTenure(e.target.value);}}
                                className={housingTenureIsValid ? '' : 'invalid-input'} 
                                onClick={() => {setHousingTenureIsValid(true);}}
                            >
                                <option value={config.housingTenure.OWNER_OCCUPANCY}>Owner Occupancy</option>
                                <option value={config.housingTenure.TENANCY}>Tenancy</option>
                                <option value={config.housingTenure.COOPERATIVE}>Cooperative</option>
                                <option value={config.housingTenure.CONDOMIUM}>Condomium</option>
                                <option value={config.housingTenure.PUBLIC_HOUSING}>Public Housing</option>
                                <option value={config.housingTenure.SQUATTING}>Squatting</option>
                                <option value={config.housingTenure.LAND_TRUST}>Land Trust</option>
                            </select>
                            <span className="invalid-input-feedback">
                                {housingTenureIsValid ? <>&nbsp;</> : housingTenureInvalidMessage}
                            </span>
                        </Col>
                        <Col lg={6} md={12} className='mb-3'>
                            Country:<br/>
                            <input 
                                value={country} 
                                className={countryIsValid ? '' : 'invalid-input'} 
                                onChange={(e) => setCountry(e.target.value)} 
                                onClick={() => {setCountryIsValid(true);}}
                                placeholder='example: Romania'
                            />
                            <span className="invalid-input-feedback">
                                {countryIsValid ? <>&nbsp;</> : countryInvalidMessage}
                            </span>
                        </Col>
                    </Row>
                    <Row className='mx-2'>
                        <Col lg={6} md={12} className='mb-3'>
                            <span>City:</span><br/>
                            <input 
                                value={city} 
                                className={cityIsValid ? '' : 'invalid-input'} 
                                onChange={(e) => setCity(e.target.value)} 
                                onClick={() => {setCityIsValid(true);}}
                                placeholder='example: Timisoara' 
                            />
                            <span className="invalid-input-feedback">
                                {cityIsValid ? <>&nbsp;</> : cityInvalidMessage}
                            </span>
                        </Col>
                        <Col lg={6} md={12} className='mb-3'>
                            <span>Street:</span><br/>
                            <input 
                                value={street} 
                                className={streetIsValid ? '' : 'invalid-input'} 
                                onChange={(e) => setStreet(e.target.value)} 
                                onClick={() => {setStreetIsValid(true);}}
                                placeholder='example: Bulevardul Sperantei' 
                            />
                            <span className="invalid-input-feedback">
                                {streetIsValid ? <>&nbsp;</> : streetInvalidMessage}
                            </span>
                        </Col>
                    </Row>
                    <Row className='mx-2'>
                        <Col lg={6} md={12} className='mb-3'>
                            <span>Street Number:</span><br/>
                            <input 
                                value={streetNumber} 
                                onChange={(e) => setStreetNumber(e.target.value)} 
                                onClick={() => {setStreetNumberIsValid(true);}}
                                className={streetNumberIsValid ? '' : 'invalid-input'} 
                                placeholder='example: 13A' 
                            />
                            <span className="invalid-input-feedback">
                                {streetNumberIsValid ? <>&nbsp;</> : streetNumberInvalidMessage}
                            </span>
                        </Col>
                        <Col lg={6} md={12} className='mb-3'>
                            <span>Apartment Number:</span><br/>
                            <input 
                                value={apartmentNumber} 
                                className={apartmentNumberIsValid ? '' : 'invalid-input'} 
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
                                placeholder='use "-" if there is none'
                            />
                            <span className="invalid-input-feedback">
                                {apartmentNumberIsValid ? <>&nbsp;</> : apartmentNumberInvalidMessage}
                            </span>
                        </Col>
                    </Row>
                    <Row className='mx-2'>
                        <Col lg={6} md={12} className='mb-3'>
                            <span>Square Meters:</span><br/>
                            <input 
                                value={squareMeters} 
                                className={squareMetresIsValid ? '' : 'invalid-input'} 
                                onChange={(e) => {
                                    if (checkIfNumberIsValid(e.target.value)) {
                                        setSquareMeters(e.target.value);
                                    }
                                }}
                                onClick={() => {setSquareMetresIsValid(true);}}
                                placeholder='example: 132' 
                            />
                            <span className="invalid-input-feedback">
                                {squareMetresIsValid ? <>&nbsp;</> : squareMetersInvalidMessage}
                            </span>
                        </Col>
                        <Col lg={6} md={12} className='mb-3'>
                            <span>Selling Price(ETH):</span><br/>
                            <input 
                                value={sellingPrice} 
                                className={sellingPriceIsValid ? '' : 'invalid-input'} 
                                onChange={(e) => {
                                    if (checkIfNumberIsValid(e.target.value)) {
                                        setSellingPrice(e.target.value);
                                    }
                                }} 
                                onClick={() => {setSellingPriceIsValid(true);}}
                                placeholder='example: 7.543' 
                            />
                            <span className="invalid-input-feedback">
                                {sellingPriceIsValid ? <>&nbsp;</> : sellingPriceInvalidMessage}
                            </span>
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