import React from 'react';
import PropertyDetailsEdit from './PropertyDetailsEdit';
import TestComponent2 from '../testComponent2';
import PropertyCard from './PropertyCard';

function MyProperties(props) {
    return (
        <div>
            <h1 className='text-center my-5'>My Registered Properties</h1>
            <PropertyCard account={props.account} balance={props.balance} network={props.network} contractAddress='0xD517EBCb17d3409fF5e6e51C5ee5BE7419Fe1B10'/>
            {/* <PropertyDetailsEdit account={props.account} balance={props.balance} network={props.network}/>
            <TestComponent2 account={props.account} balance={props.balance} network={props.network}/> */}
        </div>
    
    );
}

export default MyProperties;