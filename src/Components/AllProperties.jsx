import React from 'react';
import PropertyCard from './PropertyCard';

function AllProperties(props) {
    return (
        <>
            <h1 className='text-center my-5'>All Registered Properties</h1>
            <PropertyCard account={props.account} balance={props.balance} network={props.network}/>
        </>
    );
}

export default AllProperties;