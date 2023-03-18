import { useState, useEffect } from 'react';
import '../../styles/style.css';
import '../../styles/contractRequestsStyle.css';
import { useContract } from '../../CustomHooks/useContract';
import { useWeb3 } from '../../CustomHooks/useWeb3';
import { getTitleContractDetails } from '../../Helpers/contractDataProviders';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { contractState, documentsProvidedMessage, documentsNotProvidedMessage } from '../../Data/config';
import { getNumberOfTrailingCharacters } from '../../Helpers/helpers';
import { loadPropertyRequiredDocumentsState } from '../../Helpers/externalDataProviders';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function DeactivateContractModal(props) {
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

    const [atLeastOneDocumentValidatyChanged, setAtLeastOneDocumentValidatyChanged] = useState(false);

    const [propertyRequiredDocumentsState, setPropertyRequiredDocumentsState] = useState({});

    const [contractStateBeingChanged, setContractStateBeingChanged] = useState(false);
    const [contractStateBeingChangedAlertOpen, setContractStateBeingChangedAlertOpen] = useState(false);

    useEffect(() => {
        loadContract();
    }, []);

    useEffect(() => {
        setProofOfIdentity(Boolean(initialProofOfIdentity));
        setPropertyTitleDeeds(Boolean(initialPropertyTitleDeeds));
        setEnergyPerformanceCertificate(Boolean(initialEnergyPerformanceCertificate));
        setExtensionsAndAlterationsDocumentation(Boolean(initialExtensionsAndAlterationsDocumentation));
        setUtilityBillsPaid(Boolean(initialUtilityBillsPaid));
        setAtLeastOneDocumentValidatyChanged(false);
    }, [initialProofOfIdentity, initialPropertyTitleDeeds, initialEnergyPerformanceCertificate, initialExtensionsAndAlterationsDocumentation, initialUtilityBillsPaid])

    useEffect( () => {
        if (initialProofOfIdentity != proofOfIdentity  
            || initialPropertyTitleDeeds != propertyTitleDeeds 
            || initialEnergyPerformanceCertificate != energyPerformanceCertificate 
            || initialExtensionsAndAlterationsDocumentation != extensionsAndAlterationsDocumentation 
            || initialUtilityBillsPaid != utilityBillsPaid) {
            setAtLeastOneDocumentValidatyChanged(true);
        }
        else {
            setAtLeastOneDocumentValidatyChanged(false);
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
        
        const propertyRequiredDocumentsState = await loadPropertyRequiredDocumentsState(titleContractData.street);
        setPropertyRequiredDocumentsState(propertyRequiredDocumentsState);
    }

    const applyDocumentsStateChanges = async () => {
        setContractStateBeingChanged(true);
        setContractStateBeingChangedAlertOpen(true);
        contract.methods.setRequiredDocumentsStateAndContractState(
            proofOfIdentity ? documentsProvidedMessage : documentsNotProvidedMessage,
            propertyTitleDeeds ? documentsProvidedMessage : documentsNotProvidedMessage,
            energyPerformanceCertificate ? documentsProvidedMessage : documentsNotProvidedMessage,
            extensionsAndAlterationsDocumentation ? documentsProvidedMessage : documentsNotProvidedMessage,
            utilityBillsPaid ? documentsProvidedMessage : documentsNotProvidedMessage,
            contractState.PENDING
        ).send({ from: props.account }).then(() => {
            setInitialProofOfIdentity(proofOfIdentity);
            setInitialPropertyTitleDeeds(propertyTitleDeeds);
            setInitialEnergyPerformanceCertificate(energyPerformanceCertificate);
            setInitialExtensionsAndAlterationsDocumentation(extensionsAndAlterationsDocumentation);
            setInitialUtilityBillsPaid(utilityBillsPaid);
            props.onDeactivatePropertyHide();
            props.loadNewContracts();
            setContractStateBeingChanged(false);
            setContractStateBeingChangedAlertOpen(false);
        }).catch((err) => {
            console.log(err.message);
            setContractStateBeingChanged(false);
            setContractStateBeingChangedAlertOpen(false);
        });
    }

    const handleContractStateBeingChangedAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
      
        setContractStateBeingChangedAlertOpen(false);
    }

    return (
       <div>
            <Modal
                show = {props.show}
                onHide = {props.onDeactivatePropertyHide}
                size = 'md'
                aria-labelledby='addRegistrarModal'
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className='mx-3'>
                        Invalidate Property Title Contract
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='mx-3'>
                    <Row>
                        <Col xs={12}>
                            <FormControlLabel
                                checked={proofOfIdentity}
                                control={<Checkbox color='success' inputProps={{ 'aria-label': 'controlled' }}/>}
                                label="Proof of identity"
                                onChange={(e) => {
                                    setProofOfIdentity(e.target.checked);
                                }}
                            />
                        </Col>
                        <Col xs={12}>
                            <div className='document-text'>
                                {
                                    propertyRequiredDocumentsState.proofOfIdentityState
                                        ? <p className='document-found'>This document's validity is confirmed</p>
                                        : <p className='document-not-found'>This document's validity could not be confirmed</p>
                                }
                            </div>
                        </Col>
                    </Row>
                
                    <Row>
                        <Col xs={12}>
                            <FormControlLabel
                                checked={propertyTitleDeeds}
                                control={<Checkbox color='success' inputProps={{ 'aria-label': 'controlled' }}/>}
                                label="Property Title Deeds"
                                onChange={(e) => {
                                    setPropertyTitleDeeds(e.target.checked);
                                }}
                            />
                        </Col>
                        <Col xs={12}>
                            <div className='document-text'>
                                {
                                    propertyRequiredDocumentsState.propertyTitleDeedsState
                                        ? <p className='document-found'>This document's validity is confirmed</p>
                                        : <p className='document-not-found'>This document's validity could not be confirmed</p>
                                }
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12}>
                            <FormControlLabel
                                checked={energyPerformanceCertificate}
                                control={<Checkbox color='success' inputProps={{ 'aria-label': 'controlled' }}/>}
                                label="Energy Performance Certificate"
                                onChange={(e) => {
                                    setEnergyPerformanceCertificate(e.target.checked);
                                }}
                            />
                        </Col>
                        <Col xs={12}>
                            <div className='document-text'>
                                {
                                    propertyRequiredDocumentsState.energyPerformanceCertificateState
                                        ? <p className='document-found'>This document's validity is confirmed</p>
                                        : <p className='document-not-found'>This document's validity could not be confirmed</p>
                                }
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12}>
                            <FormControlLabel
                                checked={extensionsAndAlterationsDocumentation}
                                control={<Checkbox color='success' inputProps={{ 'aria-label': 'controlled' }}/>}
                                label="Extensions and alterations documentation"
                                onChange={(e) => {
                                    setExtensionsAndAlterationsDocumentation(e.target.checked);
                                }}
                            />
                        </Col>
                        <Col xs={12}>
                            <div className='document-text'>
                                {
                                    propertyRequiredDocumentsState.extensionsAndAlterationsDocumentationState
                                        ? <p className='document-found'>This document's validity is confirmed</p>
                                        : <p className='document-not-found'>This document's validity could not be confirmed</p>
                                }
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12}>
                            <FormControlLabel
                                checked={utilityBillsPaid}
                                control={<Checkbox color='success' inputProps={{ 'aria-label': 'controlled' }}/>}
                                label="Utility bills paid"
                                onChange={(e) => {
                                    setUtilityBillsPaid(e.target.checked);
                                }}
                            />
                        </Col>
                        <Col xs={12}>
                            <div className='document-text'>
                                {
                                    propertyRequiredDocumentsState.proofOfIdentityState
                                        ? <p className='document-found'>This document's validity is confirmed</p>
                                        : <p className='document-not-found'>This document's validity could not be confirmed</p>
                                }
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className='centered'>
                    <Row>
                        <Col xs={12} className='mt-2 mb-3 centered'>
                            {
                                atLeastOneDocumentValidatyChanged && !contractStateBeingChanged
                                    ?   <Button className='submit-btn'
                                            onClick={() => {applyDocumentsStateChanges(true);}}
                                        >
                                            Apply changes and deactivate contract
                                        </Button>
                                    :   <Button className='submit-btn disabled-btn'>
                                            Apply changes and deactivate contract
                                        </Button>
                            }
                        </Col>
                        <Col xs={12}>
                            <div className='text-center'>
                                <p className='small-text'>This operation will deactivate the contract, making it necessary for the documents to be validated again!</p>
                            </div>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
            <Snackbar open={contractStateBeingChangedAlertOpen} autoHideDuration={6000} onClose={handleContractStateBeingChangedAlertClose}>
                <MuiAlert
                    variant="filled"
                    onClose={handleContractStateBeingChangedAlertClose}
                    severity="info"
                    sx={{ width: "590px" }}
                >
                    <div className='centered'>
                        Please confirm the transaction and wait for the contract state to be updated.
                    </div>
                </MuiAlert>
            </Snackbar>
        </div>
    );
}

export default DeactivateContractModal;