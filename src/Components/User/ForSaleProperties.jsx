import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import '../../styles/style.css';
import '../../styles/allPropertiesStyle.css';
import { StyledTextField } from '../StyledTextField';
import paginationLimits from '../../Data/paginationLimits';
import { Col, Row } from 'react-bootstrap';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import CustomPagination from '../CustomPagination';
import { Link } from 'react-router-dom';
import SearchingSvg from '../../assets/searching.svg';

function ForSaleProperties(props) {
    const titlesContract = useTitlesContract().current;

    const [searchText, setSearchText] = useState('');

    const [forSaleTitleContractsCount, setForSaleTitleContractsCount] = useState(0);
    const [filteredForSaleTitleContracts, setFilteredForSaleTitleContracts] = useState([]);
    const [currentContractsOffset, setCurrentContractsOffset] = useState(0);

    useEffect(() => {
        loadContract(false);
    }, [])

    const loadContract = async () => {
        const titleContractsCount = await getForSaleTitleContractsByAddressCount();
        let titleContracts = [];
        try {
            titleContracts = await getForSaleTitleContractsByAddressAndOffsetAndLimit();
        } catch (err) {
            console.log(err.message);
        }
        setForSaleTitleContractsCount(titleContractsCount);
        setFilteredForSaleTitleContracts(titleContracts);
    }

    useEffect(() => {
        setCurrentContractsOffset(0);
        loadContract()
    }, [searchText])

    const getForSaleTitleContractsByAddressCount = async () => {
        const titleContracts = await titlesContract.methods.getForSaleContractsByAddressCount(searchText).call();
        return titleContracts;
    }

    const getForSaleTitleContractsByAddressAndOffsetAndLimit = async () => {
        const titleContracts = await titlesContract.methods.getForSaleContractsByAddressAndOffsetAndLimit(searchText, currentContractsOffset, paginationLimits.activeTitleContractsLimit).call();
        return titleContracts;
    }

    return (
        <div className='mt-5'>
            <h1 className='text-center title-text'>For Sale Properties</h1>
            <Row>
                <Col>
                    <img
                        className="d-block w-100 top-image"
                        src={SearchingSvg}
                        alt="First slide"
                    />
                </Col>
                <Col className='d-flex justify-content-end align-items-end mx-5'>
                    <Link to='/all-properties' className='see-all-properties-btn text-dark nav-link for-sale-or-all-properties-link'>View all active</Link>
                </Col>
            </Row>
            <Row className='properties-search-box'>
                <Col xs={12}>
                    <StyledTextField 
                        fullWidth
                        style={{background: "#FFF"}}
                        label='Search for properties for sale by the corresponding location' 
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                </Col>
            </Row>
            <div className='mt-5'>
                {
                    filteredForSaleTitleContracts.length > 0
                        ? 
                            <>
                                {
                                    filteredForSaleTitleContracts.map((contractAddress) => (
                                        <PropertyCard
                                            className='mb-5'
                                            key={contractAddress} 
                                            contractAddress={contractAddress} 
                                            account={props.account}
                                        />
                                    ))
                                }
                                <div className='centered mb-5 mt-4'>
                                    <CustomPagination
                                        elementsCount={forSaleTitleContractsCount}
                                        elementsPerPage={paginationLimits.activeTitleContractsLimit}
                                        setNewOffset={(newOffset) => {setCurrentContractsOffset(newOffset);}}
                                        getNewElements={async () => {
                                        }}
                                    />
                                </div>
                            </>
                        :
                            <div className='text-center'>
                                <h4>There are no for sale title contracts currently registered for that search input.</h4>
                            </div>
                }
            </div>
        </div>
    );
}

export default ForSaleProperties;