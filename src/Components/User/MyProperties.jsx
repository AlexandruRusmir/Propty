import React from 'react';
import { useEffect } from 'react';
import PropertyCard from './PropertyCard';
import CustomCarousel from './CustomCarousel';
import MyPropertiesCard from './MyPropertiesCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../../styles/style.css';

function MyProperties(props) {
    return (
        <div>
            <Row className='m-5'>
                <Col lg={6} sm={12} className='d-none d-lg-block'>
                    <CustomCarousel/>
                </Col>
                <Col lg={6} sm={12}>
                    <div className='w-100 h-100 d-flex centered'>
                        <MyPropertiesCard account={props.account}/>
                    </div>
                </Col>
            </Row>
                
            {
                props.account ?
                    <PropertyCard 
                        key=''
                        account={props.account} 
                        balance={props.balance} 
                        network={props.network} 
                        contractAddress='0x03a756264a7CC291c91ba7A214D74da1958AAa05'
                    />
                 :
                <h2>You are not connected to MetaMask</h2>
            }
            
        </div>
    );
}

export default MyProperties;