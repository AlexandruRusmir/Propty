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

    const validateUserInputs = () => {
        console.log(1);
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
            key=''
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Add new Property Title Contract
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='input-box'>
                    <Row className='mx-2'>
                        <Col lg={6} md={12} className=' my-4'>
                            Housing: <br/>
                            <select onChange={(e) => {setHousingTenure(e.target.value);}}>
                                <option value={config.housingTenure.OWNER_OCCUPANCY}>Owner Occupancy</option>
                                <option value={config.housingTenure.TENANCY}>Tenancy</option>
                                <option value={config.housingTenure.COOPERATIVE}>Cooperative</option>
                                <option value={config.housingTenure.CONDOMIUM}>Condomium</option>
                                <option value={config.housingTenure.PUBLIC_HOUSING}>Public Housing</option>
                                <option value={config.housingTenure.SQUATTING}>Squatting</option>
                                <option value={config.housingTenure.LAND_TRUST}>Land Trust</option>
                            </select>
                        </Col>
                        <Col lg={6} md={12} className=' my-4'>
                            Country:<br/>
                            <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder='example: Romania' />
                        </Col>
                    </Row>
                    <Row className='mx-2'>
                        <Col lg={6} md={12} className=' my-4'>
                            <span>City:</span><br/>
                            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder='example: Timisoara' />
                        </Col>
                        <Col lg={6} md={12} className=' my-4'>
                            <span>Street:</span><br/>
                            <input value={street} onChange={(e) => setStreet(e.target.value)} placeholder='example: Bulevardul Sperantei' />
                        </Col>
                    </Row>
                    <Row className='mx-2'>
                        <Col lg={6} md={12} className=' my-4'>
                            <span>Stree Number:</span><br/>
                            <input value={streetNumber} onChange={(e) => setStreetNumber(e.target.value)} placeholder='example: 13A' />
                        </Col>
                        <Col lg={6} md={12} className=' my-4'>
                            <span>Apartment Number:</span><br/>
                            <input value={apartmentNumber} type='number' onChange={(e) => setApartmentNumber(e.target.value)} placeholder='example: 8' />
                        </Col>
                    </Row>
                    <Row className='mx-2'>
                        <Col lg={6} md={12} className=' my-4'>
                            <span>Square Meters:</span><br/>
                            <input value={squareMeters} type='number' onChange={(e) => setSquareMeters(e.target.value)} placeholder='example: 132' />
                        </Col>
                        <Col lg={6} md={12} className=' my-4'>
                            <span>Selling Price(ETH):</span><br/>
                            <input value={sellingPrice} onChange={(e) => setSellingPriceString(e.target.value)} placeholder='example: 7.543' />
                        </Col>
                    </Row>
                </div>
            </Modal.Body>
            <Modal.Footer className='centered my-3'>
                <Row>
                    <Col xs={12}>
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
                    <Col xs={12} className='text-center mt-2'>
                        <p className='small-text'>Your contract wil be deployed and validated by a registrar in the shortest possible time.</p>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
    )
}

export default DeployTitleContract;