import React from 'react';
import PropertyCard from './PropertyCard';
import '../styles/style.css';
import TestComponent from '../testComponent';

function AllProperties(props) {
    return (
        <div>
            <h1 className='text-center my-5'>All Registered Properties</h1>
            <PropertyCard account={props.account} balance={props.balance} network={props.network} contractAddress='0xBaBd87738eaD1A0857eEb4A47b1542ceb4e428b7'/>
            {/* <TestComponent account={props.account} balance={props.balance} network={props.network} /> */}
        </div>
    );
}

export default AllProperties;