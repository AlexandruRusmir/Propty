import React from 'react';
import { useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';
import CustomCarousel from './CustomCarousel';
import MyPropertiesCard from './MyPropertiesCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../../styles/style.css';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import { getPropertiesForAccount } from '../../Helpers/contractDataProviders';

function MyProperties(props) {
    const titlesContract = useTitlesContract().current;

    const [myTitleContracts, setMyTitleContracts] = useState([]);

    useEffect(() => {
        loadMyProperties();
    }, []);

    const loadMyProperties = async () => {
        const myTitleContractsArray = await getPropertiesForAccount(titlesContract, props.account);
        setMyTitleContracts(myTitleContractsArray);
    }

    return (
        <div>
            <Row className='m-5'>
                <Col lg={6} sm={12} className='d-none d-lg-block'>
                    <CustomCarousel/>
                </Col>
                <Col lg={6} sm={12}>
                    <div className='w-100 h-100 d-flex centered'>
                        <MyPropertiesCard loadMyProperties={loadMyProperties} account={props.account}/>
                    </div>
                </Col>
            </Row>
                
            {
                props.account 
                ?
                    <div className='my-5'>
                        {
                            myTitleContracts.length > 0
                                ? 
                                    <>
                                        {
                                            myTitleContracts.map((contractAddress) => (
                                                <PropertyCard
                                                    className='my-5'
                                                    key={contractAddress} 
                                                    contractAddress={contractAddress} 
                                                    account={props.account}
                                                />
                                            ))
                                        }
                                    </>
                                :
                                    <h4>There currently are no active or pending contracts corresponding to this account</h4>
                        }
                    </div>
                :
                <h4 className='text-center'>You are not connected to MetaMask. Please connect in order to see your registered properties</h4>
            }
            
        </div>
    );
}

export default MyProperties;