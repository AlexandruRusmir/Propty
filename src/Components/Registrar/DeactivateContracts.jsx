import { useState, useEffect } from 'react';
import '../../styles/style.css';
import '../../styles/allPropertiesStyle.css';
import { StyledTextField } from '../StyledTextField';
import paginationLimits from '../../Data/paginationLimits';
import { Col, Row } from 'react-bootstrap';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import CustomPagination from '../CustomPagination';
import NotarySearchSvg from '../../assets/notary_search.svg';
import DeactivateContractCard from './DeactivateContractCard';

function InvalidateActiveContracts(props) {
    const titlesContract = useTitlesContract().current;

    const [searchText, setSearchText] = useState('');

    const [activeTitleContractsCount, setActiveTitleContractsCount] = useState(0);
    const [filteredActiveTitleContracts, setFilteredActiveTitleContracts] = useState([]);
    const [currentContractsOffset, setCurrentContractsOffset] = useState(0);

    useEffect(() => {
        loadContract(false);
    }, [])

    const loadContract = async () => {
        const titleContractsCount = await getActiveTitleContractsByAddressCount();
        let titleContracts = [];
        try {
            titleContracts = await getActiveTitleContractsByAddressAndOffsetAndLimit();
        } catch (err) {
            console.log(err.message);
        }
        setActiveTitleContractsCount(titleContractsCount);
        setFilteredActiveTitleContracts(titleContracts);
    }

    useEffect(() => {
        loadContract();
    }, [searchText])

    useEffect(() => {
        loadContract();
    }, [currentContractsOffset])

    const getActiveTitleContractsByAddressCount = async () => {
        const titleContracts = await titlesContract.methods.getActiveContractsByAddressCount(searchText).call();
        return titleContracts;
    }

    const getActiveTitleContractsByAddressAndOffsetAndLimit = async (offset = null) => {
        let contractsOffset = currentContractsOffset;
        if (typeof offset == 'number') {
            contractsOffset = offset
        }
        const titleContracts = await titlesContract.methods.getActiveContractsByAddressAndOffsetAndLimit(searchText, currentContractsOffset, paginationLimits.activeTitleContractsLimit).call();
        return titleContracts;
    }

    return (
        <div className='mt-5'>
            <h1 className='text-center title-text'>Invalidate active Properties</h1>
            <div className='d-flex justify-content-begin align-items-begin mx-5'>
                <img
                    className="d-block w-100 top-image"
                    src={NotarySearchSvg}
                    alt="First slide"
                />
            </div>
            <Row className='properties-search-box'>
                <Col xs={12}>
                    <StyledTextField 
                        fullWidth
                        style={{background: "#FFF"}}
                        label='Search for active properties by the corresponding location' 
                        value={searchText}
                        onChange={(e) => {
                            setCurrentContractsOffset(0);
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
                                        <DeactivateContractCard
                                            className='mb-5'
                                            key={'deactivatePropertyCard' + contractAddress} 
                                            contractAddress={contractAddress} 
                                            account={props.account}
                                            loadNewContracts={async () => {await loadContract();}}
                                        />
                                    ))
                                }
                            </>
                        :
                            <div className='text-center'>
                                <h4>There are no active title contracts currently registered for that search input.</h4>
                            </div>
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
            </div>
        </div>
    );
}

export default InvalidateActiveContracts;