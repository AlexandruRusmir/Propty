import React, { useRef } from 'react';
import '../../styles/propertyCardStyle.css'
import '../../styles/buttons.css'
import '../../styles/style.css';
import { Col, Row, Card, Accordion, Button } from 'react-bootstrap';
import PropertyDetailsModal from './PropertyDetailsModal';
import StateChangeModal from './StateChangeModal';
import { useState, useEffect } from 'react';
import { getNumberOfTrailingCharacters, getSellingPrice, getCorrespondingContractStateMessage, getCorrespondingHousingTenure, getMessageForRequiredDocuments } from '../../Helpers/helpers';
import { getTitleContractDetails } from '../../Helpers/contractDataProviders';
import { useWeb3 } from '../../CustomHooks/useWeb3';
import { useContract } from '../../CustomHooks/useContract';
import { FaEthereum } from 'react-icons/fa';
import { MdOutlineSell, MdOutlineEditLocationAlt, MdRemoveDone } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg'
import config from '../../Data/config';

function PropertyCard(props) {
    const web3 = useWeb3().current;
    const contractAddress = props.contractAddress;
    const contract = useContract(contractAddress).current;

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
        const titleContractData = await getTitleContractDetails(web3, contractAddress);

        setContractState(web3.utils.hexToNumber(titleContractData.contractState));
        setSellingPrice(
            getSellingPrice(
                web3.utils.hexToNumber(titleContractData.sellingPriceIntegralPart), 
                web3.utils.hexToNumber(titleContractData.sellingPriceFractionalPart), 
                web3.utils.hexToNumber(titleContractData.sellingPriceFractionalPartLength)
                )
        );
        setContractCreator(titleContractData.contractCreator);
        setContractOwner(titleContractData.contractOwner);
        setHousingTenure(web3.utils.hexToNumber(titleContractData.housingTenure))
        setCountry(web3.utils.hexToString(titleContractData.country).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(titleContractData.country))));
        setCity(web3.utils.hexToString(titleContractData.city).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(titleContractData.city))));
        setStreet(web3.utils.hexToString(titleContractData.street).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(titleContractData.street))));
        setStreetNumber(web3.utils.hexToString(titleContractData.streetNumber).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(titleContractData.streetNumber))));
        setApartmentNumber(web3.utils.hexToNumber(titleContractData.apartmentNumber));
        setSquareMeters(web3.utils.hexToNumber(titleContractData.squareMeters));
        setProofOfIdentity(web3.utils.hexToNumber(titleContractData.proofOfIdentity));
        setPropertyTitleDeeds(web3.utils.hexToNumber(titleContractData.propertyTitleDeeds));
        setEnergyPerformanceCertificate(web3.utils.hexToNumber(titleContractData.energyPerformanceCertificate));
        setExtensionsAndAlterationsDocumentation(web3.utils.hexToNumber(titleContractData.extensionsAndAlterationsDocumentation));
        setUtilityBillsPaid(web3.utils.hexToNumber(titleContractData.utilityBillsPaid));
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
                key = ''
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
                                                <Button className='buy-contract-btn' onClick={buyProperty}>
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