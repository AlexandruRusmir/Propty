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
                    <>
                    </>
                 :
                <h4 className='text-center'>You are not connected to MetaMask. Please connect in order to see your registered properties</h4>
            }
            
        </div>
    );
}

export default MyProperties;