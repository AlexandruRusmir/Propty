import React from 'react';
import PropertyDetailsEdit from './PropertyDetailsEdit';
import TestComponent2 from '../testComponent2';

function MyProperties(props) {
    return (
        <>
            <p>{props.account}</p>
                Mine

            <PropertyDetailsEdit account={props.account} balance={props.balance} network={props.network}/>
            {/* <TestComponent2 account={props.account} balance={props.balance} network={props.network}/> */}
        </>
    
    );
}

export default MyProperties;