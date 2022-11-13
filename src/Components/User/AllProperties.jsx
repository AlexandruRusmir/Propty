import React from 'react';
import PropertyCard from './PropertyCard';
import '../../styles/style.css';

function AllProperties(props) {
    return (
        <div>
            <h1 className='text-center my-5 title-text'>All Registered Properties</h1>
            <PropertyCard account={props.account} balance={props.balance} network={props.network} contractAddress='0xd8C21F189cf3E3bab376fF20d3779e259311D1Ff'/>
        </div>
    );
}

export default AllProperties;