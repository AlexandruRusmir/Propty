import React from 'react';
import '../../styles/style.css';
import '../../styles/buttons.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
import { getCorrespondingContractStateMessage } from '../../Helpers/helpers';
import { useContract } from '../../CustomHooks/useContract';
import config from '../../Config/config';
import { useEffect } from 'react';
import { useMemo } from 'react';

function DeployTitleContract(props) {

    const [sellingPrice, setSellingPrice] = useState('');
    const [housingTenure, setHousingTenure] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [street, setStreet] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [squareMeters, setSquareMeters] = useState('');

    const [valuesAreValid, setValuesAreValid] = useState(false);
    const [housingTenureIsValid, setHousingTenureIsValid] = useState(true);
    const [cityIsValid, setCityIsValid] = useState(true);
    const [countryIsValid, setCountryIsValid] = useState(true);
    const [streetIsValid, setStreetIsValid] = useState(true);
    const [streetNumberIsValid, setStreetNumberIsValid] = useState(true);
    const [sellingPriceIsValid, setSellingPriceIsValid] = useState(true);
    const [squareMetresIsValid, setSquareMetresIsValid] = useState(true);
    const [apartmentNumberIsValid, setApartmentNumberIsValid] = useState(true);

    const validateUserInputs = () => {
        if (!(housingTenure >= config.housingTenure.OWNER_OCCUPANCY && housingTenure <=config.housingTenure.LAND_TRUST)) {
            setHousingTenureIsValid(false);
        }
    }

    useMemo(validateUserInputs, [city, country, street, streetNumber, apartmentNumber, squareMeters]);

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
                                {housingTenureIsValid ? <>&nbsp;</> : 'Illegal value provided as housing tenure'}
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
                                {countryIsValid ? <>&nbsp;</> : 'This value can not exceed 32 characters!'}
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
                                {cityIsValid ? <>&nbsp;</> : 'This value can not exceed 32 characters!'}
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
                                {streetIsValid ? <>&nbsp;</> : 'This value can not exceed 32 characters!'}
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
                                {streetNumberIsValid ? <>&nbsp;</> : 'This value can not exceed 32 characters!'}
                            </span>
                        </Col>
                        <Col lg={6} md={12} className='mb-3'>
                            <span>Apartment Number:</span><br/>
                            <input 
                                value={apartmentNumber} 
                                className={apartmentNumberIsValid ? '' : 'invalid-input'} 
                                type='number'
                                onChange={(e) => setApartmentNumber(e.target.value)} 
                                onClick={() => {setApartmentNumberIsValid(true);}}
                                placeholder='example: 8' 
                            />
                            <span className="invalid-input-feedback">
                                {apartmentNumberIsValid ? <>&nbsp;</> : 'This value can not exceed 32 characters!'}
                            </span>
                        </Col>
                    </Row>
                    <Row className='mx-2'>
                        <Col lg={6} md={12} className='mb-3'>
                            <span>Square Meters:</span><br/>
                            <input 
                                value={squareMeters} 
                                className={squareMetresIsValid ? '' : 'invalid-input'} 
                                type='number' 
                                onChange={(e) => setSquareMeters(e.target.value)} 
                                onClick={() => {setSquareMetresIsValid(true);}}
                                placeholder='example: 132' 
                            />
                            <span className="invalid-input-feedback">
                                {squareMetresIsValid ? <>&nbsp;</> : 'This value can not exceed 32 characters!'}
                            </span>
                        </Col>
                        <Col lg={6} md={12} className='mb-3'>
                            <span>Selling Price(ETH):</span><br/>
                            <input 
                                value={sellingPrice} 
                                className={sellingPriceIsValid ? '' : 'invalid-input'} 
                                onChange={(e) => setSellingPriceString(e.target.value)} 
                                onClick={() => {setSellingPriceIsValid(true);}}
                                placeholder='example: 7.543' 
                            />
                            <span className="invalid-input-feedback">
                                {sellingPriceIsValid ? <>&nbsp;</> : 'This value can not exceed 32 characters!'}
                            </span>
                        </Col>
                    </Row>
                </div>
            </Modal.Body>
            <Modal.Footer className='centered my-3'>
                <Row>
                    <Col xs={12} className='mb-2'>
                    {
                        valuesAreValid ?
                            <Button className='submit-btn' onClick={() => {console.log(1);}}>
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