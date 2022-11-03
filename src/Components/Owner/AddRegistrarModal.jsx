import React from 'react';
import '../../styles/style.css';
import '../../styles/buttons.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import Web3 from 'web3';

function AddRegistrarModal(props) {
    const titlesContract = useTitlesContract().current;

    const [newRegistrarAddress, setNewRegistrarAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validateNewRegistrarAddress = () => {
        if ((newRegistrarAddress.length === 42 && newRegistrarAddress.substring(0,2).toLowerCase() !== '0x') || 
            (newRegistrarAddress.length === 40 && newRegistrarAddress.substring(0,2).toLowerCase() === '0x') ||
            (newRegistrarAddress.length !== 42 && newRegistrarAddress.length !== 40)) {
            setErrorMessage('Invalid Ethereum Address');
            return false;
        }

        for (const registrarAddress in props.registrars) {
            console.log(registrarAddress);
            console.log(newRegistrarAddress.toLowerCase());
            if ((newRegistrarAddress.toLowerCase() === registrarAddress) ||
                (newRegistrarAddress.length === 40 && registrarAddress.substring(2) === newRegistrarAddress.toLowerCase())) {
                    setErrorMessage('Address already added as Registrar');
                    return false;
                }
        }

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
        titlesContract.methods.addRegistrars([newRegistrarAddress.toLowerCase()]).send({ from: props.account }).then(() => {
            props.addNewRegistrar(newRegistrarAddress);
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
                    <Modal.Title>
                        
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className='mx-3 input-box'>
                        <input type='text' value={newRegistrarAddress} onChange={(e) => {setNewRegistrarAddress(e.target.value);}}
                            placeholder='New registrar address (0x8mD4y...)' />
                    </Row>
                    <p id='error-message' className='error-message centered mt-2'>{errorMessage}</p>
                </Modal.Body>
                <Modal.Footer className='centered'>
                    <Row>
                        <Col xs={12}>
                            <Button className='submit-btn' onClick={async () => {await requestRegistrarAdd();}}>
                                Add as Registrar
                            </Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default AddRegistrarModal;