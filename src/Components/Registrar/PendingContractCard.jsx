import { useState, useEffect } from 'react';
import '../../styles/style.css';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import { useContract } from '../../CustomHooks/useContract';
import { getTitleContractDetails } from '../../Helpers/contractDataProviders';
import { getNumberOfTrailingCharacters, getSellingPrice, getCorrespondingContractStateMessage, getCorrespondingHousingTenure, getMessageForRequiredDocuments } from '../../Helpers/helpers';
import { useWeb3 } from '../../CustomHooks/useWeb3';
import { Col, Row, Card, Accordion, Button } from 'react-bootstrap';
import ValidatePropertyModal from './ValidatePropertyModal';

function PendingContractRequest(props) {
    const web3 = useWeb3().current;
    const titlesContract = useTitlesContract().current;
    const contract = useContract(props.contractAddress).current;

    const [contractOwner, setContractOwner] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
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

    const [validatePropertyOpen, setValidatePropertyOpen] = useState(false);

    useEffect( () => {
        loadContract();
    }, [])

    const loadContract = async () => {
        const titleContractData = await getTitleContractDetails(web3, props.contractAddress);

        setSellingPrice(
            getSellingPrice(
                web3.utils.hexToNumber(titleContractData.sellingPriceIntegralPart), 
                web3.utils.hexToNumber(titleContractData.sellingPriceFractionalPart), 
                web3.utils.hexToNumber(titleContractData.sellingPriceFractionalPartLength)
                )
        );
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

    return (
       <div>
            <Card
                id={'pendingPropertyTitle' + props.contractAddress}
                className="mb-2 mx-5"
                variant='light'
            >
                <Card.Header as="h6" className='text-center'>
                    <p><strong>Contract address:</strong> {props.contractAddress}</p>
                    <p><strong>Owner:</strong> {contractOwner}</p>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col lg={6} md={12} className='text-center'>
                            <p><strong>Housing tenure:</strong> {getCorrespondingHousingTenure(housingTenure)}</p>
                            <p><strong>Country:</strong> {country}</p>
                            <p><strong>City:</strong> {city}</p>
                            <p><strong>Selling price:</strong> {sellingPrice} ETH</p>
                        </Col>
                        <Col lg={6} md={12} className='text-center'>
                            <p><strong>Street:</strong> {street}</p>
                            <p><strong>Street number:</strong> {streetNumber}</p>
                            <p><strong>Apartment number:</strong> {apartmentNumber}</p>
                            <p><strong>Square Metres:</strong> {squareMeters}</p>
                        </Col>
                    </Row>
                    <Row className='centered'>
                        <Button className='buy-contract-btn'  onClick={() =>  {setValidatePropertyOpen(true);}}>Validate Property</Button>
                        <ValidatePropertyModal
                            key={'validateProperty' + props.contractAddress}
                            show={validatePropertyOpen}
                            onValidatePropertyHide={() => {setValidatePropertyOpen(false);}}
                            contractAddress={props.contractAddress}

                            proofOfIdentity={proofOfIdentity}
                            propertyTitleDeeds={propertyTitleDeeds}
                            energyPerformanceCertificate={energyPerformanceCertificate}
                            extensionsAndAlterationsDocumentation={extensionsAndAlterationsDocumentation}
                            utilityBillsPaid={utilityBillsPaid}
                        />
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
}

export default PendingContractRequest;