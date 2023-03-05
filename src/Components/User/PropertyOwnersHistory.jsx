import React from 'react';
import '../../styles/style.css';
import '../../styles/buttons.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useWeb3 } from '../../CustomHooks/useWeb3';
import { useState, useEffect } from 'react';
import { useContract } from '../../CustomHooks/useContract';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import { unixToDateString } from '../../Helpers/helpers';

function PropertyOwnersHistory(props) {
    const web3 = useWeb3().current;
    const contractAddress = props.contractAddress;
    const contract = useContract(contractAddress).current;
    const titlesContract = useTitlesContract().current;

    const [initialOwnerData, setInitialOwnerData] = useState({});
    const [previousOwners, setPreviousOwners] = useState([]);

    useEffect(() => {
        loadOwnersData();
    }, []);



    const loadOwnersData = async () => {
        const deployBlockNumber = await titlesContract.methods.propertyTitleDeployBlockNumber(contractAddress).call();
        titlesContract.getPastEvents(
            'NewTitleContract',
            {
                fromBlock: deployBlockNumber,
                toBlock: deployBlockNumber
            }, (err, events) => {
                setInitialOwnerData({
                    initialOwnerAddress: events[0].returnValues.ownerAddress,
                    deployTime: unixToDateString(events[0].returnValues.timestamp)
                });
            }
        );

        const newOwnerBlockNumbers = await contract.methods.getContractNewOwnerBlockNumbers().call();
        const newOwnersArray = newOwnerBlockNumbers.map(blockNumber => {
            const previousOwner = {};
            contract.getPastEvents(
                'NewPropertyTitleOwner',
                {
                    fromBlock: blockNumber,
                    toBlock: blockNumber
                }, (err, events) => {
                    previousOwner.buyerAddress = events[0].returnValues.newOwnerAddress;
                    previousOwner.paidPrice = web3.utils.fromWei(String(events[0].returnValues.paidPrice), 'ether');
                    previousOwner.buyingTime = unixToDateString(events[0].returnValues.timestamp);
                }
            );
            return previousOwner;
        });
        setPreviousOwners(newOwnersArray);
    }

    return (
        <div>
            <Modal
                show={props.show}
                onHide = {props.onOwnersHistoryHide}
                size = 'lg'
                key={'ownersHistrory' + props.contractAddress}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id={'propertyEditModal' + props.country + props.city + props.street + props.streetNumber + props.apartmentNumber}>
                        <div className='mx-3'>
                            Property Title Contract Owners History
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    <Row className='mb-5'>
                        <Col lg={6} sm={12}>
                            <b>Initial Owner:</b> <br></br> {initialOwnerData.initialOwnerAddress}
                        </Col>
                        <Col lg={6} sm={12}>
                            <b>Contract Deploy Time:</b> <br></br> {initialOwnerData.deployTime}
                        </Col>
                    </Row>
                    {
                        previousOwners.length > 0 && previousOwners.map(previousOwner => (
                                <Row className='mb-5'>
                                    <Col lg={6} sm={12}>
                                        <b>Buyer Address:</b> <br></br> {previousOwner.buyerAddress}
                                    </Col>
                                    <Col lg={3} sm={6}>
                                        <b>Buying Time:</b> <br></br> {previousOwner.buyingTime}
                                    </Col>
                                    <Col lg={3} sm={6}>
                                        <b>Buying Price:</b> <br></br> {previousOwner.paidPrice} ETH
                                    </Col>
                                </Row>
                            ))
                    }
                </Modal.Body>
                <Modal.Footer className='justify-content-center'>
                    <p className='small-text'>Note that any information regarding previous owners is not registered on the blockchain. </p>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PropertyOwnersHistory;