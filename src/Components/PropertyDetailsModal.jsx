import React from 'react';
import '../styles/style.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

function PropertyDetailsModal(props) {
    const [contractState, setContractState] = useState('');
    const [sellingPrice, setSellingPrice] = useState(props.sellingPrice);

    const validateSellingPriceString = (price) => {
        if (price.length === 0) {
            setSellingPrice(price);
            return;
        }

        const splitArray = price.split('.');
        if (splitArray.length > 2) {
            return;
        }

        if (!((price[price.length -1] >= '0' && price[price.length -1] <= '9') || price[price.length - 1] === '.')) {
            return;
        }

        setSellingPrice(price);
    };

    return (
        <div>
            <Modal
                show={props.show}
                onHide = {props.onHide}
                dialogClassName="modal-90w"
                aria-labelledby={'propertyTitleEditModal' + props.country + props.city + props.street  + props.streetNumber + props.apartmentNumber}
                centered
            >
                <Modal.Header closeButton>
                <Modal.Title id={'propertyEditModal' + props.country + props.city + props.street + props.streetNumber + props.apartmentNumber}>
                    Modify your Property Title Contract
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <span>Contract State: </span><br/>
                        <select onChange={(e) => {console.log(e.target.value);}}>
                            <option value="0">Owner Occupancy</option>
                            <option value="1">Tenancy</option>
                            <option value="2">Cooperative</option>
                            <option value="3">Condomium</option>
                            <option value="4">Public Housing</option>
                            <option value="5">Squatting</option>
                            <option value="6">Land Trust</option>
                        </select>
                        
                    </div>

                    <div>
                        Selling Price(ETH):<br/> 
                        <input value={sellingPrice} onChange={(e) => validateSellingPriceString(e.target.value)} placeholder='example: 7.543' />
                    </div>
                    
                    <div>

                    </div>
                    
                    <p>{props.utilityBillsPaid}</p>
                </Modal.Body>
                <Modal.Footer className='justify-content-center'>
                    <Button variant='success' onClick={props.onHide}>Save Contract Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PropertyDetailsModal;