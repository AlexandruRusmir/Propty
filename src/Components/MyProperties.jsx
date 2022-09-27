import React from 'react';
import PropertyDetailsEdit from './PropertyDetailsEdit';
import TestComponent2 from '../testComponent2';
import PropertyCard from './PropertyCard';

function MyProperties(props) {
    return (
        <div>
            <h1 className='text-center my-5'>My Registered Properties</h1>
            <PropertyCard account={props.account} balance={props.balance} network={props.network} contractAddress='0x7ed3B3F33C6b338CC545ad870D24b2f817c965b1'/>
            {/* <PropertyDetailsEdit account={props.account} balance={props.balance} network={props.network}/>
            <TestComponent2 account={props.account} balance={props.balance} network={props.network}/> */}
        </div>
    
    );
}

export default MyProperties;