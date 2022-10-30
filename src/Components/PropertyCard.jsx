/* eslint-disable */
import React, { useRef } from 'react';
import '../styles/propertyCardStyle.css'
import '../styles/colors.css'
import { Col, Row, Card, Accordion, Button } from 'react-bootstrap';
import PropertyDetailsModal from './PropertyDetailsModal';
import StateChangeModal from './StateChangeModal';
import { useState, useEffect } from 'react';
import { getNumberOfTrailingCharacters, getSellingPrice, getCorrespondingContractStateMessage, getCorrespondingHousingTenure, getMessageForRequiredDocuments } from '../Helpers/helpers';
import { useWeb3 } from '../CustomHooks/useWeb3';
import { useContract } from '../CustomHooks/useContract';
import { FaEthereum } from 'react-icons/fa';
import { MdOutlineSell, MdOutlineEditLocationAlt, MdRemoveDone } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg'
import config from '../Config/config';

function PropertyCard(props) {
    const web3 = useWeb3().current;
    let contractAddress = props.contractAddress;
    const contract = useContract().current;

    const [contractState, setContractState] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [contractCreator, setContractCreator] = useState('');
    const [contractOwner, setContractOwner] = useState('');
    const [housingTenure, setHousingTenure] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [squareMeters, setSquareMeters] = useState('');
    const [proofOfIdentity, setProofOfIdentity] = useState('');
    const [propertyTitleDeeds, setPropertyTitleDeeds] = useState('');
    const [energyPerformanceCertificate, setEnergyPerformanceCertificate] = useState('');
    const [extensionsAndAlterationsDocumentation, setExtensionsAndAlterationsDocumentation] = useState('');
    const [utilityBillsPaid, setUtilityBillsPaid] = useState('');

    const [desiredNewState, setDesiredNewState] = useState('');

    const [contractEditOpen, setContractEditOpen] = useState(false);
    const [stateChangeOpen, setStateChangeOpen] = useState(false);

    useEffect(() => {
        loadContract();
    }, []);
    
    const loadContract = async () => {
        // const networkId = await web3.eth.net.getId();

        // contractAddress =  propertyTitleBuild.networks[networkId].address;

        const contractState = await web3.eth.getStorageAt(contractAddress, 0);
        const sellingPriceIntegralPart = await web3.eth.getStorageAt(contractAddress, 1);
        const sellingPriceFractionalPart = await web3.eth.getStorageAt(contractAddress, 2);
        const sellingPriceFractionalPartLength = await web3.eth.getStorageAt(contractAddress, 3);
        const contractCreator = await web3.eth.getStorageAt(contractAddress, 4);
        const contractOwner = await web3.eth.getStorageAt(contractAddress, 5);
        const housingTenure = await web3.eth.getStorageAt(contractAddress, 6);
        const country = await web3.eth.getStorageAt(contractAddress, 7);
        const city = await web3.eth.getStorageAt(contractAddress, 8);
        const street = await web3.eth.getStorageAt(contractAddress, 9);
        const streetNumber = await web3.eth.getStorageAt(contractAddress, 10);
        const apartmentNumber = await web3.eth.getStorageAt(contractAddress, 11);
        const squareMeters = await web3.eth.getStorageAt(contractAddress, 12);
        const proofOfIdentity = await web3.eth.getStorageAt(contractAddress, 13);
        const propertyTitleDeeds = await web3.eth.getStorageAt(contractAddress, 14);
        const energyPerformanceCertificate = await web3.eth.getStorageAt(contractAddress, 15);
        const extensionsAndAlterationsDocumentation = await web3.eth.getStorageAt(contractAddress, 16);
        const utilityBillsPaid = await web3.eth.getStorageAt(contractAddress, 17);

        setContractState(web3.utils.hexToNumber(contractState));
        setSellingPrice(
            getSellingPrice(
                web3.utils.hexToNumber(sellingPriceIntegralPart), 
                web3.utils.hexToNumber(sellingPriceFractionalPart), 
                web3.utils.hexToNumber(sellingPriceFractionalPartLength)
                )
        );
        setContractCreator(contractCreator);
        setContractOwner(contractOwner);
        setHousingTenure(web3.utils.hexToNumber(housingTenure))
        setCountry(web3.utils.hexToString(country).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(country))));
        setCity(web3.utils.hexToString(city).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(city))));
        setStreet(web3.utils.hexToString(street).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(street))));
        setStreetNumber(web3.utils.hexToString(streetNumber).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(streetNumber))));
        setApartmentNumber(web3.utils.hexToNumber(apartmentNumber));
        setSquareMeters(web3.utils.hexToNumber(squareMeters));
        setProofOfIdentity(web3.utils.hexToNumber(proofOfIdentity));
        setPropertyTitleDeeds(web3.utils.hexToNumber(propertyTitleDeeds));
        setEnergyPerformanceCertificate(web3.utils.hexToNumber(energyPerformanceCertificate));
        setExtensionsAndAlterationsDocumentation(web3.utils.hexToNumber(extensionsAndAlterationsDocumentation));
        setUtilityBillsPaid(web3.utils.hexToNumber(utilityBillsPaid));
    }

    const getPropertySellingPrice = async () => {
        return contract.methods.getPropertySellingPrice().call();
    }

    const buyProperty = async () => {
        const sellingPrice = await getPropertySellingPrice();

        const params = [{
            'from': props.account,
            'to': props.contractAddress,
            'gas': Number(2100000).toString(16),
            'gasPrice': Number(250000000).toString(16),
            'value': Number(sellingPrice).toString(16),
        }];

        const result = await window.ethereum.request({method: 'eth_sendTransaction', params}).then( () => {
            setContractOwner(props.account);
            setContractState(config.contractState.OWNED);
        }).catch( err => {
            console.log(err);
        });

        console.log(result);
    }

    return (
        <div>
            <Card
                key={'propertyTitle' + country + city + street  + streetNumber + apartmentNumber}
                id={'propertyTitle' + country + city + street  + streetNumber + apartmentNumber}
                className="mb-2 mx-5"
                variant='light'
            >
                <Card.Header className='text-center'>
                    {
                        props.account.toLowerCase() == contractOwner ?
                            <>
                                <p>
                                    <strong>You are the Owner of this Contract</strong>
                                </p>
                                <Row>
                                    <Col lg={4} md={12}>
                                        {
                                            contractState == config.contractState.FOR_SALE ?
                                            <Button className='remove-listing-btn' onClick={() => {
                                                setDesiredNewState(config.contractState.OWNED);
                                                setStateChangeOpen(true);
                                            }}>
                                                Remove Listing <CgPlayListRemove size={22}/>
                                            </Button> :
                                            <>
                                                {
                                                    housingTenure == config.housingTenure.OWNER_OCCUPANCY || housingTenure == config.housingTenure.CONDOMIUM ?
                                                    <Button className='list-for-sale-btn' onClick={() => {
                                                        setDesiredNewState(config.contractState.FOR_SALE);
                                                        setStateChangeOpen(true);
                                                    }}>
                                                        List For Sale <MdOutlineSell size={22}/>
                                                    </Button> :
                                                    <Button className='list-for-sale-btn disabled-btn'>
                                                        List For Sale <MdOutlineSell size={22}/>
                                                    </Button>
                                                }
                                            </>
                                        }
                                    </Col>
                                    <Col lg={4} md={12}>
                                        <Button onClick={() => setContractEditOpen(true)} className='modify-contract-btn'>
                                            Modify Contract <MdOutlineEditLocationAlt size={22}/>
                                        </Button>
                                    </Col>
                
                                    <Col lg={4} md={12}>
                                        <Button className='disable-contract-btn' onClick={() => {
                                            setDesiredNewState(config.contractState.NO_LONGER_RELEVANT);
                                            setStateChangeOpen(true);
                                        }}>
                                            Invalidate Contract <MdRemoveDone size={22}/>
                                        </Button>
                                    </Col>
                                    <StateChangeModal
                                        show={stateChangeOpen}
                                        onStateChangeHide={() => setStateChangeOpen(false)}
                                        desiredNewState = {desiredNewState}

                                        account = {props.account}
                                        contractAddress = {contractAddress}
                                        country = {country}
                                        city = {city}
                                        street = {street}
                                        streetNumber = {streetNumber}
                                        apartmentNumber = {apartmentNumber}

                                        changeContractState = {(newContractState) => {setContractState(newContractState)}}
                                    />
                                </Row>

                                <PropertyDetailsModal
                                    show={contractEditOpen}
                                    onDetailsEditHide={() => setContractEditOpen(false)}

                                    account = {props.account}
                                    contractAddress = {contractAddress}
                                    contractState = {contractState}
                                    sellingPrice = {sellingPrice}
                                    housingTenure = {housingTenure}
                                    country = {country}
                                    city = {city}
                                    street = {street}
                                    streetNumber = {streetNumber}
                                    apartmentNumber = {apartmentNumber}
                                    squareMeters = {squareMeters}
                                    proofOfIdentity = {proofOfIdentity}
                                    propertyTitleDeeds = {propertyTitleDeeds}
                                    energyPerformanceCertificate = {energyPerformanceCertificate}
                                    extensionsAndAlterationsDocumentation = {extensionsAndAlterationsDocumentation}
                                    utilityBillsPaid = {utilityBillsPaid}

                                    changeSellingPrice = {(sellingPrice) => {setSellingPrice(sellingPrice);}}
                                    changeHousingTenure = {(housingTenure) => {setHousingTenure(housingTenure);}}
                                    changeSquareMeters = {(squareMeters) => {setSquareMeters(squareMeters);}}
                                />
                            </>:
                            <> 
                                <p className='mb-3'>
                                    <strong>Property Owner:</strong> {contractOwner}
                                </p>
                                {
                                    contractState == config.contractState.FOR_SALE ?
                                        <Row>
                                            <Col>
                                                <Button className='buy-contract-btn' onClick={() => {buyProperty();}}>
                                                    Buy Property <FaEthereum />
                                                </Button>
                                            </Col>
                                        </Row> :
                                        ''
                                }
                            </>
                    }
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Card.Title className='text-center mb-4'>
                            Contract state: {getCorrespondingContractStateMessage(contractState)}
                        </Card.Title>
                    </Row>
                    <div>
                        <Row>
                            <Col lg={6} md={12} className='text-center'>
                                <p><strong>Selling price:</strong> {sellingPrice} ETH</p>
                                <p><strong>Housing tenure:</strong> {getCorrespondingHousingTenure(housingTenure)}</p>
                                <p><strong>Country:</strong> {country}</p>
                                <p><strong>City:</strong> {city}</p>
                            </Col>
                            <Col lg={6} md={12} className='text-center'>
                                <p><strong>Street:</strong> {street}</p>
                                <p><strong>Street number:</strong> {streetNumber}</p>
                                <p><strong>Apartment number:</strong> {apartmentNumber}</p>
                                <p><strong>Square Metres:</strong> {squareMeters}</p>
                            </Col>
                        </Row>
                        <Row>
                            <div>
                                <div className='custom-accordion'>
                                    <Accordion>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header className='mx-2'><span>Required Property Documents</span></Accordion.Header>
                                            <Accordion.Body>
                                                <p>Proof of Identity: {getMessageForRequiredDocuments(proofOfIdentity)}</p>
                                                <p>Property Title Deeds: {getMessageForRequiredDocuments(propertyTitleDeeds)}</p>
                                                <p>Energy Performance Certificate: {getMessageForRequiredDocuments(energyPerformanceCertificate)}</p>
                                                <p>Extensions and Alterations Documentation: {getMessageForRequiredDocuments(extensionsAndAlterationsDocumentation)}</p>
                                                <p>Utility Bills Paid: {getMessageForRequiredDocuments(utilityBillsPaid)}</p>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </div>
                            </div>
                        </Row>
                    </div>
                </Card.Body>
            </Card>
        </div>
	);
}

export default PropertyCard;