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
        titlesContract.getPastEvents(
            'NewTitleContract',
            {
                filter: {titleContractAddress: contractAddress},
                fromBlock: 0,
                toBlock: 'latest'
            }, (err, events) => {
                setInitialOwnerData({
                    initialOwnerAddress: events[0].returnValues.ownerAddress,
                    deployTime: unixToDateString(events[0].returnValues.timestamp)
                });
            }
        );

        let newOwnersArray = [];
        contract.getPastEvents(
            'NewPropertyTitleOwner',
            {
                filter: {titleContractAddress: contractAddress},
                fromBlock: 0,
                toBlock: 'latest',
            }, (err, events) => {
                newOwnersArray = events.map(event => {
                    const previousOwner = {};
                    previousOwner.buyerAddress = event.returnValues.newOwnerAddress;
                    previousOwner.paidPrice = web3.utils.fromWei(String(event.returnValues.paidPrice), 'ether');
                    previousOwner.buyingTime = unixToDateString(event.returnValues.timestamp);

                    return previousOwner;
                });
                setPreviousOwners(newOwnersArray);
            }
        );
    };
    

    return (
        <div>
            <Modal
                show={props.show}
                key={'propertyOwnerHistory' + contractAddress}
                onHide = {props.onOwnersHistoryHide}
                size = 'lg'
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
                                <Row className='mb-5' key={previousOwner.buyingTime}>
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