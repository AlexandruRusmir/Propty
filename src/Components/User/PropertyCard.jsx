import React, { useRef } from 'react';
import '../../styles/propertyCardStyle.css'
import '../../styles/buttons.css'
import '../../styles/style.css';
import { Col, Row, Card, Accordion, Button } from 'react-bootstrap';
import PropertyDetailsModal from './PropertyDetailsModal';
import StateChangeModal from './StateChangeModal';
import { useState, useEffect } from 'react';
import { getNumberOfTrailingCharacters, getSellingPrice, getCorrespondingContractStateMessage, getCorrespondingHousingTenure, getApartmentNumberToDisplay } from '../../Helpers/helpers';
import { getTitleContractDetails } from '../../Helpers/contractDataProviders';
import { useWeb3 } from '../../CustomHooks/useWeb3';
import { useContract } from '../../CustomHooks/useContract';
import { FaEthereum } from 'react-icons/fa';
import { MdOutlineSell, MdOutlineEditLocationAlt, MdRemoveDone } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg'
import config from '../../Data/config';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

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

    const [contractHasBeenChangedAlertOpen, setContractHasBeenChangedAlertOpen] = useState(false);

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
        setApartmentNumber(getApartmentNumberToDisplay(web3.utils.hexToNumber(titleContractData.apartmentNumber)));
        setSquareMeters(web3.utils.hexToNumber(titleContractData.squareMeters));
        setProofOfIdentity(web3.utils.hexToString(titleContractData.proofOfIdentity).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(titleContractData.proofOfIdentity))));
        setPropertyTitleDeeds(web3.utils.hexToString(titleContractData.propertyTitleDeeds).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(titleContractData.propertyTitleDeeds))));
        setEnergyPerformanceCertificate(web3.utils.hexToString(titleContractData.energyPerformanceCertificate).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(titleContractData.energyPerformanceCertificate))));
        setExtensionsAndAlterationsDocumentation(web3.utils.hexToString(titleContractData.extensionsAndAlterationsDocumentation).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(titleContractData.extensionsAndAlterationsDocumentation))));
        setUtilityBillsPaid(web3.utils.hexToString(titleContractData.utilityBillsPaid).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(titleContractData.utilityBillsPaid))));
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

        const result = await window.ethereum.request({method: 'eth_sendTransaction', params}).then((txHash) => {
            setContractOwner(props.account);
            setContractState(config.contractState.OWNED);
        }).catch( err => {
            console.log(err);
        });

    }

    const handleContractHasBeenChangedAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
      
        setContractHasBeenChangedAlertOpen(false);
    }

    const openContractHasBeenChangedAlert = () => {
        setContractHasBeenChangedAlertOpen(true);
    }

    return (
        <div>
            <Card
                key = ''
                id={'propertyTitle' + country + city + street  + streetNumber + apartmentNumber}
                className="my-4 mx-5"
                variant='light'
            >
                <Card.Header className='text-center'>
                    {
                        contractOwner.includes(props.account.toLowerCase().slice(2)) ?
                            <>
                                <p>
                                    <strong>You are the Owner of this Contract</strong>
                                </p>
                                <Row>
                                {
                                    contractState != config.contractState.PENDING
                                        ?
                                            <>
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

                                                    openContractHasBeenChangedAlert={openContractHasBeenChangedAlert}

                                                    account = {props.account}
                                                    contractAddress = {contractAddress}
                                                    country = {country}
                                                    city = {city}
                                                    street = {street}
                                                    streetNumber = {streetNumber}
                                                    apartmentNumber = {apartmentNumber}

                                                    changeContractState = {(newContractState) => {setContractState(newContractState)}}
                                                />

                                                <PropertyDetailsModal
                                                    show={contractEditOpen}
                                                    onDetailsEditHide={() => setContractEditOpen(false)}
                                                    openContractHasBeenChangedAlert={openContractHasBeenChangedAlert}

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
                                            </>
                                        :
                                            <>
                                            </>
                                }
                                </Row>
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
                                                <p>Proof of Identity: {proofOfIdentity}</p>
                                                <p>Property Title Deeds: {propertyTitleDeeds}</p>
                                                <p>Energy Performance Certificate: {energyPerformanceCertificate}</p>
                                                <p>Extensions and Alterations Documentation: {extensionsAndAlterationsDocumentation}</p>
                                                <p>Utility Bills Paid: {utilityBillsPaid}</p>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </div>
                            </div>
                        </Row>
                    </div>
                </Card.Body>
            </Card>
            <Snackbar open={contractHasBeenChangedAlertOpen} autoHideDuration={3000} onClose={handleContractHasBeenChangedAlertClose}>
                <MuiAlert
                    variant="filled"
                    onClose={handleContractHasBeenChangedAlertClose}
                    severity="success"
                    sx={{ width: "404px" }}
                >
                    <div className='centered'>
                        The changes have been made to your contract!
                    </div>
                </MuiAlert>
            </Snackbar>
        </div>
	);
}

export default PropertyCard;