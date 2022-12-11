import { useState, useEffect } from 'react';
import '../../styles/style.css';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import { useContract } from '../../CustomHooks/useContract';
import { useWeb3 } from '../../CustomHooks/useWeb3';
import { getTitleContractDetails } from '../../Helpers/contractDataProviders';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { contractState, documentsProvidedMessage, documentsNotProvidedMessage } from '../../Data/config';
import { getNumberOfTrailingCharacters } from '../../Helpers/helpers';


function ValidatePropertyModal(props) {
    const web3 = useWeb3().current;
    const contract = useContract(props.contractAddress).current;

    const [proofOfIdentity, setProofOfIdentity] = useState(Boolean(props.proofOfIdentity));
    const [propertyTitleDeeds, setPropertyTitleDeeds] = useState(Boolean(props.propertyTitleDeeds));
    const [energyPerformanceCertificate, setEnergyPerformanceCertificate] = useState(Boolean(props.energyPerformanceCertificate));
    const [extensionsAndAlterationsDocumentation, setExtensionsAndAlterationsDocumentation] = useState(Boolean(props.extensionsAndAlterationsDocumentation));
    const [utilityBillsPaid, setUtilityBillsPaid] = useState(Boolean(props.utilityBillsPaid));

    const [initialProofOfIdentity, setInitialProofOfIdentity] = useState(Boolean(props.proofOfIdentity));
    const [initialPropertyTitleDeeds, setInitialPropertyTitleDeeds] = useState(Boolean(props.propertyTitleDeeds));
    const [initialEnergyPerformanceCertificate, setInitialEnergyPerformanceCertificate] = useState(Boolean(props.energyPerformanceCertificate));
    const [initialExtensionsAndAlterationsDocumentation, setInitialExtensionsAndAlterationsDocumentation] = useState(Boolean(props.extensionsAndAlterationsDocumentation));
    const [initialUtilityBillsPaid, setInitialUtilityBillsPaid] = useState(Boolean(props.utilityBillsPaid));

    const [allDocumentsAreValid, setAllDocumentsAreValid] = useState(false);
    const [allLeastOneDocumentValidatyChanged, setAllLeastOneDocumentValidatyChanged] = useState(false);

    useEffect(() => {
        loadContract();
    }, []);

    useEffect(() => {
        setProofOfIdentity(Boolean(initialProofOfIdentity));
        setPropertyTitleDeeds(Boolean(initialPropertyTitleDeeds));
        setEnergyPerformanceCertificate(Boolean(initialEnergyPerformanceCertificate));
        setExtensionsAndAlterationsDocumentation(Boolean(initialExtensionsAndAlterationsDocumentation));
        setUtilityBillsPaid(Boolean(initialUtilityBillsPaid));
        setAllLeastOneDocumentValidatyChanged(false);
    }, [initialProofOfIdentity, initialPropertyTitleDeeds, initialEnergyPerformanceCertificate, initialExtensionsAndAlterationsDocumentation, initialUtilityBillsPaid])

    useEffect( () => {   
        if (proofOfIdentity && propertyTitleDeeds && energyPerformanceCertificate && extensionsAndAlterationsDocumentation && utilityBillsPaid) {
            setAllDocumentsAreValid(true);
        }
        else {
            setAllDocumentsAreValid(false);
        }

        if (initialProofOfIdentity != proofOfIdentity  
            || initialPropertyTitleDeeds != propertyTitleDeeds 
            || initialEnergyPerformanceCertificate != energyPerformanceCertificate 
            || initialExtensionsAndAlterationsDocumentation != extensionsAndAlterationsDocumentation 
            || initialUtilityBillsPaid != utilityBillsPaid) {
            setAllLeastOneDocumentValidatyChanged(true);
        }
        else {
            setAllLeastOneDocumentValidatyChanged(false);
        }
    }, [proofOfIdentity, propertyTitleDeeds, energyPerformanceCertificate, extensionsAndAlterationsDocumentation, utilityBillsPaid]);

    const loadContract = async () => {
        const titleContractData = await getTitleContractDetails(web3, props.contractAddress);
        if (web3.utils.hexToString(titleContractData.proofOfIdentity).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(titleContractData.proofOfIdentity))) === 'Provided' ) {
            setInitialProofOfIdentity(true);
        }
        else {
            setInitialProofOfIdentity(false);
        }
        if (web3.utils.hexToString(titleContractData.propertyTitleDeeds).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(titleContractData.propertyTitleDeeds))) === 'Provided') {
            setInitialPropertyTitleDeeds(true);
        }
        else {
            setInitialPropertyTitleDeeds(false);
        }
        if (web3.utils.hexToString(titleContractData.energyPerformanceCertificate).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(titleContractData.energyPerformanceCertificate))) === 'Provided') {
            setInitialEnergyPerformanceCertificate(true);
        }
        else {
            setInitialEnergyPerformanceCertificate(false);
        }
        if (web3.utils.hexToString(titleContractData.extensionsAndAlterationsDocumentation).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(titleContractData.extensionsAndAlterationsDocumentation))) === 'Provided') {
            setInitialExtensionsAndAlterationsDocumentation(true);
        }
        else {
            setInitialExtensionsAndAlterationsDocumentation(false);
        }
        if (web3.utils.hexToString(titleContractData.utilityBillsPaid).slice(0, -getNumberOfTrailingCharacters(web3.utils.hexToString(titleContractData.utilityBillsPaid))) === 'Provided') {
            setInitialUtilityBillsPaid(true);
        }
        else {
            setInitialUtilityBillsPaid(false);
        }
    }

    const applyDocumentsStateChanges = async (activateContract = false) => {
        const newContractState = activateContract ? contractState.OWNED : contractState.PENDING
        contract.methods.setRequiredDocumentsStateAndContractState(
            proofOfIdentity ? documentsProvidedMessage : documentsNotProvidedMessage,
            propertyTitleDeeds ? documentsProvidedMessage : documentsNotProvidedMessage,
            energyPerformanceCertificate ? documentsProvidedMessage : documentsNotProvidedMessage,
            extensionsAndAlterationsDocumentation ? documentsProvidedMessage : documentsNotProvidedMessage,
            utilityBillsPaid ? documentsProvidedMessage : documentsNotProvidedMessage,
            newContractState
        ).send({ from: props.account }).then(() => {
            setInitialProofOfIdentity(proofOfIdentity);
            setInitialPropertyTitleDeeds(propertyTitleDeeds);
            setInitialEnergyPerformanceCertificate(energyPerformanceCertificate);
            setInitialExtensionsAndAlterationsDocumentation(extensionsAndAlterationsDocumentation);
            setInitialUtilityBillsPaid(utilityBillsPaid);
            props.onValidatePropertyHide();
            props.loadNewContractsIfContractIsValidated(newContractState);
        }).catch((err) => {
            console.log(err.message);
        });
    }

    return (
       <div>
            <Modal
                show = {props.show}
                onHide = {props.onValidatePropertyHide}
                size = 'xl'
                aria-labelledby='addRegistrarModal'
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className='mx-3'>
                        Validate Property Modal
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='mx-3'>
                    <Row>
                        <Col xs={12}>
                            <div>
                                <FormControlLabel
                                    checked={proofOfIdentity}
                                    control={<Checkbox inputProps={{ 'aria-label': 'controlled' }}/>}
                                    label="Proof of identity"
                                    onChange={(e) => {
                                        setProofOfIdentity(e.target.checked);
                                    }}
                                />

                            </div>
                        
                            <div>
                                <FormControlLabel
                                    checked={propertyTitleDeeds}
                                    control={<Checkbox inputProps={{ 'aria-label': 'controlled' }}/>}
                                    label="Property Title Deeds"
                                    onChange={(e) => {
                                        setPropertyTitleDeeds(e.target.checked);
                                    }}
                                />
                            </div>

                            <div>
                                <FormControlLabel
                                    checked={energyPerformanceCertificate}
                                    control={<Checkbox inputProps={{ 'aria-label': 'controlled' }}/>}
                                    label="Energy Performance Certificate"
                                    onChange={(e) => {
                                        setEnergyPerformanceCertificate(e.target.checked);
                                    }}
                                />
                            </div>

                            <div>
                                <FormControlLabel
                                    checked={extensionsAndAlterationsDocumentation}
                                    control={<Checkbox inputProps={{ 'aria-label': 'controlled' }}/>}
                                    label="Extensions and alterations documentation"
                                    onChange={(e) => {
                                        setExtensionsAndAlterationsDocumentation(e.target.checked);
                                    }}
                                />
                            </div>

                            <div>
                                <FormControlLabel
                                    checked={utilityBillsPaid}
                                    control={<Checkbox inputProps={{ 'aria-label': 'controlled' }}/>}
                                    label="Utility bills paid"
                                    onChange={(e) => {
                                        setUtilityBillsPaid(e.target.checked);
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className='centered'>
                    <Row>
                        <Col lg={6} xs={12} className='mt-2 mb-3 centered'>
                            {
                                allLeastOneDocumentValidatyChanged
                                    ?   <Button className='submit-btn'
                                            onClick={() => {applyDocumentsStateChanges(false);}}
                                        >
                                            Apply changes to documents state
                                            </Button>
                                    :   <Button className='submit-btn disabled-btn'>
                                            Apply changes to documents state
                                        </Button>
                            }
                        </Col>
                        <Col lg={6} xs={12} className='mt-2 mb-3 centered'>
                            {
                                allDocumentsAreValid 
                                    ?   <Button className='submit-btn'
                                            onClick={() => {applyDocumentsStateChanges(true);}}
                                        >
                                            Apply changes and activate contract
                                        </Button>
                                    :   <Button className='submit-btn disabled-btn'>
                                            Apply changes and activate contract
                                        </Button>
                            }
                        </Col>
                        <Col xs={12}>
                            <div className='text-center'>
                                <p className='small-text'>This operation will change the state of the title contract according to this input!</p>
                            </div>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ValidatePropertyModal;