import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import '../../styles/style.css';
import '../../styles/allPropertiesStyle.css';
import { StyledTextField } from '../StyledTextField';
import paginationLimits from '../../Data/paginationLimits';
import { Button, Col, Row } from 'react-bootstrap';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import CustomPagination from '../CustomPagination';
import { Link } from 'react-router-dom';

function AllProperties(props) {
    const titlesContract = useTitlesContract().current;

    const [searchText, setSearchText] = useState('');
    const [onlyForSalePropertiesCheck, setOnlyForSalePropetiesCheck] = useState(false);

    const [activeTitleContractsCount, setActiveTitleContractsCount] = useState(0);
    const [ filteredActiveTitleContracts, setFilteredActiveTitleContracts] = useState([]);
    const [currentContractsOffset, setCurrentContractsOffset] = useState(0);

    useEffect(() => {
        loadContract(false);
    }, [])

    const loadContract = async (onlyForSale = false) => {
        if (!onlyForSale) {
            const titleContractsCount = await getActiveTitleContractsByAddressCount();
            let titleContracts = [];
            try {
                titleContracts = await getActiveTitleContractsByAddressAndOffsetAndLimit();
            } catch (err) {
                console.log(err.message);
            }
            setActiveTitleContractsCount(titleContractsCount);
            setFilteredActiveTitleContracts(titleContracts);
            const test = await titlesContract.methods.stringContains('aufgjejo', 'mn').call();
            console.log(test);
            return;
        }
        const titleContractsCount = await getForSaleTitleContractsByAddressCount();
        console.log('for sale count:' + titleContractsCount);
        let titleContracts = [];
        try {
            titleContracts = await getForSaleTitleContractsByAddressAndOffsetAndLimit();
        } catch (err) {
            console.log(err.message);
        }
        setActiveTitleContractsCount(titleContractsCount);
        setFilteredActiveTitleContracts(titleContracts);
    }

    useEffect(() => {
        setCurrentContractsOffset(0);
    }, [onlyForSalePropertiesCheck, searchText])

    useEffect(() => {
        loadContract(onlyForSalePropertiesCheck);
    }, [currentContractsOffset])

    const getActiveTitleContractsByAddressCount = async () => {
        const titleContracts = await titlesContract.methods.getActiveContractsByAddressCount(searchText).call();
        return titleContracts;
    }

    const getActiveTitleContractsByAddressAndOffsetAndLimit = async () => {
        const titleContracts = await titlesContract.methods.getActiveContractsByAddressAndOffsetAndLimit(searchText, currentContractsOffset, paginationLimits.activeTitleContractsLimit).call();
        return titleContracts;
    }

    const getForSaleTitleContractsByAddressCount = async () => {
        const titleContracts = await titlesContract.methods.getForSaleContractsByAddressCount(searchText).call();
        return titleContracts;
    }

    const getForSaleTitleContractsByAddressAndOffsetAndLimit = async () => {
        const titleContracts = await titlesContract.methods.getForSaleContractsByAddressAndOffsetAndLimit(searchText, currentContractsOffset, paginationLimits.activeTitleContractsLimit).call();
        return titleContracts;
    }

    const getNewActiveContracts = async () => {
        if (onlyForSalePropertiesCheck) {
            loadContract(true);
            return;
        }
        loadContract(false);
    }

    return (
        <div>
            <h1 className='text-center my-5 title-text'>All Registered Properties</h1>
            <Row>
                <Col className='d-flex justify-content-end mx-5'>
                    <Link to='/' className='add-new-registrar-btn text-light nav-link'>Go House Hunting</Link>
                </Col>
            </Row>
            <Row className='properties-search-box'>
                <Col xs={12}>
                    <StyledTextField 
                        fullWidth
                        style={{background: "#FFF"}}
                        label='Search for active properties by the corresponding location' 
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                </Col>
            </Row>
            <div className='mt-5'>
                {
                    filteredActiveTitleContracts.length > 0
                        ? 
                            <>
                                {
                                    filteredActiveTitleContracts.map((contractAddress) => (
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
                                        elementsCount={activeTitleContractsCount}
                                        elementsPerPage={paginationLimits.activeTitleContractsLimit}
                                        setNewOffset={(newOffset) => {setCurrentContractsOffset(newOffset);}}
                                        getNewElements={async () => {
                                        }}
                                    />
                                </div>
                            </>
                        :
                            <div className='text-center'>
                                <h4>There are no active title contracts currently registered for that search input.</h4>
                            </div>
                }
            </div>
        </div>
    );
}

export default AllProperties;