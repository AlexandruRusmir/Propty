import React from 'react';
import PropertyCard from './PropertyCard';
import '../styles/style.css';
import TestComponent from '../testComponent';

function AllProperties(props) {
    return (
        <div>
            <h1 className='text-center my-5'>All Registered Properties</h1>
            <PropertyCard account={props.account} balance={props.balance} network={props.network} contractAddress='0xD517EBCb17d3409fF5e6e51C5ee5BE7419Fe1B10'/>
            {/* <TestComponent account={props.account} balance={props.balance} network={props.network} /> */}
        </div>
    );
}

export default AllProperties;