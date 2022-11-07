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
import config from '../../Config/config';

function DeployTitleContract(props) {
    

    return (
        <Modal
            show = {props.show}
            onHide = {props.onAddNewContractHide}
            size = 'lg'
            key=''
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Add new Property Title Contract
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
            </Modal.Body>
            <Modal.Footer className='centered'>
                
            </Modal.Footer>
        </Modal>
    )
}

export default DeployTitleContract;