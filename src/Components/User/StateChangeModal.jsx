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
import config from '../../Data/config';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function StateChangeModal(props) {
    const desiredNewState = props.desiredNewState;
    const contractAddress = props.contractAddress;
    const contract = useContract(contractAddress).current;

    const [contractStateIsBeingChanged, setContractStateIsBeingChanged] = useState(false);
    const [contractStateIsBeingChangedAlertOpen, setContractStateIsBeingChangedAlertOpen] = useState(false);

    const setPropertyForSale = async () => {
        setContractStateIsBeingChanged(true);
        setContractStateIsBeingChangedAlertOpen(true);
        contract.methods.modifyContractState(config.contractState.FOR_SALE).send({ from: props.account }).then(() => {
            props.changeContractState(config.contractState.FOR_SALE);
            props.onStateChangeHide();
            setContractStateIsBeingChanged(false);
            setContractStateIsBeingChangedAlertOpen(false);
        }).catch((err) => {
            console.log(err.message);
            setContractStateIsBeingChanged(false);
            setContractStateIsBeingChangedAlertOpen(false);
        });
    }

    const removePropertyForSaleListing = async () => {
        setContractStateIsBeingChanged(true);
        setContractStateIsBeingChangedAlertOpen(true);
        contract.methods.modifyContractState(config.contractState.OWNED).send({ from: props.account }).then(() => {
            props.changeContractState(config.contractState.OWNED);
            props.onStateChangeHide();
            setContractStateIsBeingChanged(false);
            setContractStateIsBeingChangedAlertOpen(false);
        }).catch((err) => {
            console.log(err.message);
            setContractStateIsBeingChanged(false);
            setContractStateIsBeingChangedAlertOpen(false);
        });
    }

    const permanentlyDisableContract = async () => {
        setContractStateIsBeingChanged(true);
        setContractStateIsBeingChangedAlertOpen(true);
        contract.methods.modifyContractState(config.contractState.NO_LONGER_RELEVANT).send({ from: props.account }).then(() => {
            props.changeContractState(config.contractState.NO_LONGER_RELEVANT);
            props.onStateChangeHide();
            setContractStateIsBeingChanged(false);
            setContractStateIsBeingChangedAlertOpen(false);
        }).catch((err) => {
            console.log(err.message);
            setContractStateIsBeingChanged(false);
            setContractStateIsBeingChangedAlertOpen(false);
        });
    }

    const handleContractIsBeingChangedAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
      
        setContractStateIsBeingChangedAlertOpen(false);
    }

    return (
        <div>
            <Modal
                show = {props.show}
                onHide = {props.onStateChangeHide}
                size = 'lg'
                aria-labelledby={'stateChangeModal' + props.country + props.city + props.street  + props.streetNumber + props.apartmentNumber}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id={'propertyTitleStateChangeModal' + props.country + props.city + props.street + props.streetNumber + props.apartmentNumber}>
                        <div className='mx-4'>
                            {
                                desiredNewState == config.contractState.FOR_SALE ?
                                <>
                                    List the Contract for Sale
                                </> :
                                desiredNewState == config.contractState.NO_LONGER_RELEVANT ?
                                <>
                                    Disable the Contract
                                </> :
                                <>
                                    Remove the Contract Sale listing
                                </>
                            }
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className='mx-3'>
                        {
                            desiredNewState == config.contractState.FOR_SALE ?
                            <p>
                                Are you sure that you want to list your Property Title Contract for sale? 
                            </p> :
                            desiredNewState == config.contractState.NO_LONGER_RELEVANT ?
                            <p>
                                This action will <strong>permanently</strong> disable this Property Title Contract. Are you sure you want to continue?
                            </p> :
                            <p>
                                Are you sure that you want to remove the Listing for your Property Title Contract?
                            </p>
                        }
                    </Row>
                </Modal.Body>
                <Modal.Footer className='centered'>
                    <Row>
                        <Col xs={12}>
                            {
                                desiredNewState == config.contractState.FOR_SALE ?
                                <>
                                    {
                                        !contractStateIsBeingChanged ?
                                        <Button className='submit-btn' onClick={async () => {await setPropertyForSale();}}>
                                            List For Sale
                                        </Button> :
                                        <Button className='submit-btn disabled-btn'>
                                            List For Sale
                                        </Button>
                                    }
                                </> :
                                desiredNewState == config.contractState.NO_LONGER_RELEVANT ?
                                <>
                                    {
                                        !contractStateIsBeingChanged ?
                                        <Button className='submit-btn' onClick={async () => {await permanentlyDisableContract();}}>
                                            Disable Contract
                                        </Button> :
                                        <Button className='submit-btn disabled-btn'>
                                            Disable Contract
                                        </Button>
                                    }
                                </> :
                                <>
                                    {
                                        !contractStateIsBeingChanged ?
                                        <Button className='submit-btn' onClick={async () => {await removePropertyForSaleListing();}}>
                                            Remove Listing
                                        </Button> :
                                        <Button className='submit-btn disabled-btn'>
                                            Remove Listing
                                        </Button>
                                    }
                                </>
                            }
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
            <Snackbar open={contractStateIsBeingChangedAlertOpen} autoHideDuration={5000} onClose={handleContractIsBeingChangedAlertClose}>
                <MuiAlert
                    variant="filled"
                    onClose={handleContractIsBeingChangedAlertClose}
                    severity="info"
                    sx={{ width: "636px" }}
                >
                    <div className='centered'>
                        Please confirm the transaction and wait for the state of your contract to be changed.
                    </div>
                </MuiAlert>
            </Snackbar>
        </div>
    )
}

export default StateChangeModal;