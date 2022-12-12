import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import '../../styles/style.css';
import '../../styles/allPropertiesStyle.css';
import { StyledTextField } from '../StyledTextField';
import { StyledSwitch } from '../StyledSwitch';
import FormControlLabel from '@mui/material/FormControlLabel';
import paginationLimits from '../../Data/paginationLimits';
import { Col, Row } from 'react-bootstrap';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';

function AllProperties(props) {
    const titlesContract = useTitlesContract().current;

    const [searchText, setSearchText] = useState('');
    const [onlyForSalePropertiesCheck, setOnlyForSalePropetiesCheck] = useState(false);

    const [activeTitleContractsCount, setActiveTitleContractsCount] = useState(0);
    const [filteredActiveTitleContracts, setFilteredActiveTitleContracts] = useState([]);
    const [currentContractsOffset, setCurrentContractsOffset] = useState(0);

    useEffect(() => {
        loadContract();
    }, [])

    const loadContract = async () => {
        const titleContractsCount = await getActiveTitleContractsByAddressCount();
        let titleContracts = []
        try {
            titleContracts = await getActiveTitleContractsByAddressAndOffsetAndLimit();
        } catch (err) {
            console.log(err.message);
        }
        console.log(titleContracts);
        setActiveTitleContractsCount(titleContractsCount);
        setFilteredActiveTitleContracts(titleContracts);
    }

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

    const getForSaleTitleContractsByOffsetAndLimit = async () => {
        const titleContracts = await titlesContract.methods.getForSaleContractsByAddressAndOffsetAndLimit(searchText, currentContractsOffset, paginationLimits.activeTitleContractsLimit).call();
        return titleContracts;
    }

    return (
        <div>
            <h1 className='text-center my-5 title-text'>All Registered Properties</h1>
            <Row className='properties-search-box'>
                <Col lg={9} xs={12}>
                    <StyledTextField 
                        fullWidth
                        style={{background: "#FFF"}}
                        label='Search for properties by location' 
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                </Col>
                <Col lg={3} xs={12} className='only-for-sale-switch'>
                    <FormControlLabel
                        control={
                            <StyledSwitch 
                                onChange={(e) => setOnlyForSalePropetiesCheck(e.target.checked)}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                        label='For sale only'
                    />
                </Col>
            </Row>
            <div>
                {
                    filteredActiveTitleContracts
                        ? 
                            <>
                                bro
                            </>
                        :
                            <div className='text-center mt-5'>
                                <h4>There are no active title contracts currently registered for that search input.</h4>
                            </div>
                }
            </div>
        </div>
    );
}

export default AllProperties;