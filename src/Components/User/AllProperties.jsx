import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import '../../styles/style.css';
import '../../styles/allPropertiesStyle.css';
import { StyledTextField } from '../StyledTextField';
import paginationLimits from '../../Data/paginationLimits';
import { StyledSwitch } from '../StyledSwitch';
import { Col, Row } from 'react-bootstrap';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import CustomPagination from '../CustomPagination';
import FormControlLabel from '@mui/material/FormControlLabel';
import SearchingLocationSvg from '../../assets/searching_location.svg';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@mui/material';

function AllProperties(props) {
    const titlesContract = useTitlesContract().current;
    const navigate = useNavigate();

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
            <h1 className='text-center title-text'>All active Properties</h1>
            <Row>
                <Col>
                    <img
                        className="d-block w-100 top-image"
                        src={SearchingLocationSvg}
                        alt="First slide"
                    />
                </Col>
                <Col className='d-flex justify-content-end align-items-end mx-5'>
                    <FormControlLabel control={<Switch
                    onChange={() => {
                        navigate('/for-sale-properties');
                    }}/>} label="Only For Sale Properties" />
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
                                        <PropertyCard
                                            className='mb-5'
                                            key={contractAddress} 
                                            contractAddress={contractAddress} 
                                            account={props.account}
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

export default AllProperties;