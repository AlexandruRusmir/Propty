import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import '../../styles/style.css';
import '../../styles/allPropertiesStyle.css';
import { StyledTextField } from '../StyledTextField';
import { StyledSwitch } from '../StyledSwitch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Col, Row } from 'react-bootstrap';

function AllProperties(props) {
    const [searchText, setSearchText] = useState('');
    const [onlyForSalePropertiesCheck, setOnlyForSalePropetiesCheck] = useState(false);

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
        </div>
    );
}

export default AllProperties;