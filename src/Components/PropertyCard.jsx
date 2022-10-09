/* eslint-disable */
import React, { useRef } from 'react';
import '../styles/propertyCardStyle.css'
import '../styles/colors.css'
import { Col, Row, Card, Accordion, Button } from 'react-bootstrap';
import PropertyDetailsModal from './PropertyDetailsModal';
import Web3 from 'web3';
import { useState, useEffect } from 'react';
import { getNumberOfTrailingCharacters, getSellingPrice, getCorrespondingContractStateMessage, getCorrespondingHousingTenure, getMessageForRequiredDocuments } from '../Helpers/helpers';
import { useWeb3 } from '../CustomHooks/useWeb3';
import { useContract } from '../CustomHooks/useContract';
import { FaEthereum } from 'react-icons/fa';
import { MdOutlineSell, MdOutlineEditLocationAlt } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg'

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
    const [squareMetres, setSquareMetres] = useState('');
    const [proofOfIdentity, setProofOfIdentity] = useState('');
    const [propertyTitleDeeds, setPropertyTitleDeeds] = useState('');
    const [energyPerformanceCertificate, setEnergyPerformanceCertificate] = useState('');
    const [extensionsAndAlterationsDocumentation, setExtensionsAndAlterationsDocumentation] = useState('');
    const [utilityBillsPaid, setUtilityBillsPaid] = useState('');

    const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        loadContract();
    }, []);
    
    async function loadContract() {
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
        const squareMetres = await web3.eth.getStorageAt(contractAddress, 12);
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
        setSquareMetres(web3.utils.hexToNumber(squareMetres));
        setProofOfIdentity(web3.utils.hexToNumber(proofOfIdentity));
        setPropertyTitleDeeds(web3.utils.hexToNumber(propertyTitleDeeds));
        setEnergyPerformanceCertificate(web3.utils.hexToNumber(energyPerformanceCertificate));
        setExtensionsAndAlterationsDocumentation(web3.utils.hexToNumber(extensionsAndAlterationsDocumentation));
        setUtilityBillsPaid(web3.utils.hexToNumber(utilityBillsPaid));
    }

    async function getPropertySellingPrice() {
        return contract.methods.getPropertySellingPrice().call();
    }

    async function buyProperty() {
        const sellingPrice = await getPropertySellingPrice();

        const params = [{
            'from': props.account,
            'to': '0xD517EBCb17d3409fF5e6e51C5ee5BE7419Fe1B10',
            'gas': Number(2100000).toString(16),
            'gasPrice': Number(250000000).toString(16),
            'value': Number(sellingPrice).toString(16),
        }];

        const result = await window.ethereum.request({method: 'eth_sendTransaction', params}).catch( err => {
            console.log(err);
        })

        console.log(result);
    }

    return (
        <div>
            <Card
                key={'propertyTitle' + country + city + street  + streetNumber + apartmentNumber}
                id={'propertyTitle' + country + city + street  + streetNumber + apartmentNumber}
                text='black'
                className="mb-2 mx-5"
                variant='light'
            >
                <Card.Header className='text-center'>
                    {
                        props.account.toLowerCase() == contractOwner ?
                            <>
                                <p>This contract belongs to you</p>
                                <Row>
                                    <Col>
                                        <Button variant='success' onClick={() => setPopupOpen(true)} className='list-for-sale-btn'>
                                            Modify Property Title Contract <MdOutlineEditLocationAlt size={22}/>
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button className='list-for-sale-btn'>
                                            List Property For Sale <MdOutlineSell size={22}/>
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button className='list-for-sale-btn'>
                                            Invalidate Contract <CgPlayListRemove size={22}/>
                                        </Button>
                                    </Col>
                                </Row>

                                <PropertyDetailsModal
                                    show={popupOpen}
                                    onHide={() => setPopupOpen(false)}

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
                                    squareMetres = {squareMetres}
                                    proofOfIdentity = {proofOfIdentity}
                                    propertyTitleDeeds = {propertyTitleDeeds}
                                    energyPerformanceCertificate = {energyPerformanceCertificate}
                                    extensionsAndAlterationsDocumentation = {extensionsAndAlterationsDocumentation}
                                    utilityBillsPaid = {utilityBillsPaid}

                                    changeSellingPrice = {(sellingPrice) => {setSellingPrice(sellingPrice)}}
                                />
                            </>:
                            <> 
                                Property Owner: {contractOwner}
                                {
                                    contractState == 2 ?
                                        <Row>
                                            <Col>
                                                <Button onClick={() => {buyProperty();}}>
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
                                <p>Selling price: {sellingPrice} ETH</p>
                                <p>Housing tenure: {getCorrespondingHousingTenure(housingTenure)}</p>
                                <p>Country: {country}</p>
                                <p>City: {city}</p>
                            </Col>
                            <Col lg={6} md={12} className='text-center'>
                                <p>Street: {street}</p>
                                <p>Street number: {streetNumber}</p>
                                <p>Apartment number: {apartmentNumber}</p>
                                <p>Square Metres: {squareMetres}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Accordion>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Required Property Documents</Accordion.Header>
                                    <Accordion.Body>
                                        <p>Proof of Identity: {getMessageForRequiredDocuments(proofOfIdentity)}</p>
                                        <p>Property Title Deeds: {getMessageForRequiredDocuments(propertyTitleDeeds)}</p>
                                        <p>Energy Performance Certificate: {getMessageForRequiredDocuments(energyPerformanceCertificate)}</p>
                                        <p>Extensions and Alterations Documentation: {getMessageForRequiredDocuments(extensionsAndAlterationsDocumentation)}</p>
                                        <p>Utility Bills Paid: {getMessageForRequiredDocuments(utilityBillsPaid)}</p>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Row>
                    </div>
                </Card.Body>
            </Card>
        </div>
	);
}

export default PropertyCard;