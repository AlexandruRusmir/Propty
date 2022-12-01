import { useState, useEffect } from 'react';
import '../../styles/style.css';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import { useContract } from '../../CustomHooks/useContract';
import { getTitleContractDetails } from '../../Helpers/contractDataProviders';
import { getNumberOfTrailingCharacters, getSellingPrice, getCorrespondingContractStateMessage, getCorrespondingHousingTenure, getMessageForRequiredDocuments } from '../../Helpers/helpers';
import { useWeb3 } from '../../CustomHooks/useWeb3';
import { Col, Row, Card, Accordion, Button, Modal } from 'react-bootstrap';

function ValidatePropertyModal(props) {
    const web3 = useWeb3().current;
    const titlesContract = useTitlesContract().current;
    const contract = useContract(props.contractAddress).current;

    const [proofOfIdentity, setProofOfIdentity] = useState(props.proofOfIdentity);
    const [propertyTitleDeeds, setPropertyTitleDeeds] = useState(props.propertyTitleDeeds);
    const [energyPerformanceCertificate, setEnergyPerformanceCertificate] = useState(props.energyPerformanceCertificate);
    const [extensionsAndAlterationsDocumentation, setExtensionsAndAlterationsDocumentation] = useState(props.extensionsAndAlterationsDocumentation);
    const [utilityBillsPaid, setUtilityBillsPaid] = useState(props.utilityBillsPaid);

    useEffect( () => {
        
    }, [])

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
                <Modal.Body className='mx-3 input-box'>
                    <Row>
                        <Col xs={12} className='registrar-search-checkboxes'>
                            <div>
                                <input type='checkbox' id='proof-of-identity'
                                    onClick={() => {
                                        setProofOfIdentity(!proofOfIdentity);
                                    }}
                                    value={proofOfIdentity}
                                />
                                <label htmlFor='proof-of-identity' className='checkbox-label'>Proof of identity</label>
                            </div>
                        
                            <div>
                                <input type='checkbox' id='property-title-deeds'
                                    onClick={() => {
                                        setPropertyTitleDeeds(!propertyTitleDeeds);
                                    }}
                                    value={propertyTitleDeeds}
                                />
                                <label htmlFor='property-title-deeds' className='checkbox-label'>Property Title Deeds</label>
                            </div>

                            <div>
                                <input type='checkbox' id='energy-performance-certificate'
                                    onClick={() => {
                                        setEnergyPerformanceCertificate(!energyPerformanceCertificate);
                                    }}
                                    value={energyPerformanceCertificate}
                                />
                                <label htmlFor='energy-performance-certificate' className='checkbox-label'>Energy Performance Certificate</label>
                            </div>

                            <div>
                                <input type='checkbox' id='extensions-and-alterations-documentation'
                                    onClick={() => {
                                        setExtensionsAndAlterationsDocumentation(!extensionsAndAlterationsDocumentation);
                                    }}
                                    value={extensionsAndAlterationsDocumentation}
                                />
                                <label htmlFor='extensions-and-alterations-documentation' className='checkbox-label'>Extensions and Alterations Documentation</label>
                            </div>

                            <div>
                                <input type='checkbox' id='utility-bills-paid'
                                    onClick={() => {
                                        setUtilityBillsPaid(!utilityBillsPaid);
                                    }}
                                    value={utilityBillsPaid}
                                />
                                <label htmlFor='utility-bills-paid' className='checkbox-label'>Utility bills paid</label>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className='centered'>
                    <Row>
                        <Col xs={12}>
                            
                        </Col>
                        <div className='centered'>
                            <p className='small-text'>This operation will change the state of the title contract according to this input!</p>
                        </div>
                    </Row>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ValidatePropertyModal;