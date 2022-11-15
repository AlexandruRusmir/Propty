import React from 'react';
import '../../styles/style.css';
import '../../styles/buttons.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect } from 'react';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import Web3 from 'web3';

function AddRegistrarModal(props) {
    const titlesContract = useTitlesContract().current;

    const [newRegistrarAddress, setNewRegistrarAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [addressIsValid, setAddressIsValid] = useState(false);

    
    useEffect(() => {
        validateNewRegistrarAddress();
    }, [newRegistrarAddress]);

    const validateNewRegistrarAddress = () => {
        if (newRegistrarAddress === '') {
            setErrorMessage('');
            setAddressIsValid(false);
            return false;
        }

        if (props.currentOwners.includes(newRegistrarAddress.toLowerCase())) {
            setErrorMessage('This address belongs to an owner and can not be become a registrar address.');
            setAddressIsValid(false);
            return false;
        }

        if ((newRegistrarAddress.length === 42 && newRegistrarAddress.substring(0,2).toLowerCase() !== '0x') || 
            (newRegistrarAddress.length === 40 && newRegistrarAddress.substring(0,2).toLowerCase() === '0x') ||
            (newRegistrarAddress.length !== 42 && newRegistrarAddress.length !== 40)) {
            setErrorMessage('Invalid Ethereum Address');
            setAddressIsValid(false);
            return false;
        }

        if (props.currentRegistrars) {
            for (let registrar of props.currentRegistrars) {
                if ((newRegistrarAddress.toLowerCase() === registrar.address.toLowerCase()) ||
                    (newRegistrarAddress.length === 40 && registrar.address.substring(2).toLowerCase() === newRegistrarAddress.toLowerCase())) {
                        setErrorMessage('Address already added as Registrar');
                        setAddressIsValid(false);
                        return false;
                    }
            }
        }

        setErrorMessage('');
        setAddressIsValid(true);
        return true;
    }

    const requestRegistrarAdd = async () => {
        if (!validateNewRegistrarAddress()) {
            return;
        }

        if (newRegistrarAddress.length === 40) {
            setNewRegistrarAddress('0x' + newRegistrarAddress);
        }
        await addRegistrar();
    }

    const addRegistrar = async () => {
        titlesContract.methods.addRegistrars([newRegistrarAddress]).send({ from: props.account }).then(() => {
            props.addNewRegistrar(newRegistrarAddress);
            props.onAddRegistrarHide();
        }).catch((err) => {
            console.log(err.message);
        });
    }

    return (
        <div>
            <Modal
                show = {props.show}
                onHide = {props.onAddRegistrarHide}
                size = 'lg'
                aria-labelledby='addRegistrarModal'
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className='centered mx-3'>
                        Add a new registrar by providing their address
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='mx-3 input-box'>
                    <div>
                        <p>Please introduce the account address of the person you would like to add as a registrar:</p>
                    </div>
                    <div>
                        <input type='text' value={newRegistrarAddress} onChange={(e) => {setNewRegistrarAddress(e.target.value);}}
                            placeholder='New registrar address (0x8mD4y...)' />
                    </div>
                    <p id='error-message' className='error-message mt-2 text-center'>{errorMessage}</p>
                </Modal.Body>
                <Modal.Footer className='centered'>
                    <Row>
                        <Col xs={12}>
                            {
                                addressIsValid ?
                                    <Button className='submit-btn' onClick={async () => {await requestRegistrarAdd();}}>
                                        Add as Registrar
                                    </Button> :
                                    <Button className='submit-btn disabled-btn'>
                                        Add as Registrar
                                    </Button>
                            }
                            
                        </Col>
                        <div className='centered'>
                            <p className='small-text'>This operation will give the account corresponding to the address registrar rights!</p>
                        </div>
                    </Row>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default AddRegistrarModal;