import React from 'react';
import PropertyCard from './PropertyCard';
import '../styles/style.css';

function AllProperties(props) {
    return (
        <div>
            <h1 className='text-center my-5'>All Registered Properties</h1>
            <PropertyCard account={props.account} balance={props.balance} network={props.network}/>
        </div>
    );
}

export default AllProperties;