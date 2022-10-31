import React from 'react';
import PropertyCard from './PropertyCard';
import '../../styles/style.css';
import TitleContractsList from './TitleContractsList';

function AllProperties(props) {
    return (
        <div>
            <h1 className='text-center my-5 title-text'>All Registered Properties</h1>
            <PropertyCard account={props.account} balance={props.balance} network={props.network} contractAddress='0x8b7DD12C6a352FB45D7F42A788465174515a3aeB'/>
            <TitleContractsList />
        </div>
    );
}

export default AllProperties;