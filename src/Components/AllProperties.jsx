import React from 'react';
import PropertyCard from './PropertyCard';
import '../styles/style.css';

function AllProperties(props) {
    return (
        <div>
            <h1 className='text-center my-5'>All Registered Properties</h1>
            <PropertyCard account={props.account} balance={props.balance} network={props.network} contractAddress='0x7ed3B3F33C6b338CC545ad870D24b2f817c965b1'/>
        </div>
    );
}

export default AllProperties;