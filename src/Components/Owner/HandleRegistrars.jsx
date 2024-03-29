import { useEffect, useState, useMemo } from 'react';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import '../../styles/style.css';
import { useNavigate } from 'react-router-dom';
import RegistrarCard from './RegistrarCard';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import AddRegistrarModal from './AddRegistrarModal';
import { checkIfUserIsRegistrar, getCentralContractRegistrars } from '../../Helpers/contractDataProviders';
import { StyledTextField } from '../StyledTextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function HandleRegistrars(props) {
    const titlesContract = useTitlesContract().current;

    const navigate = useNavigate();

    const [registrars, setRegistrars] = useState([]);
    const [addRegistrarOpen, setAddRegistrarOpen] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [seeRemovedRegistrars, setSeeRemovedRegistrars] = useState(false);
    const [seeActiveRegistrars, setSeeActiveRegistrars] = useState(false);

    const [addedNewRegistrarAlertOpen, setAddedNewRegistrarAlertOpen] = useState(false);

    useEffect(() => {
        if (!props.owners.includes(props.account)) {
            navigate('/');
            return;
        }
        loadCentralContractRegistrars();
    }, [])

    const filteredRegistrars = useMemo( () => {
        return registrars.filter((registrar) => {
            if (registrar.address.toLowerCase().includes(searchText.toLowerCase())) {
                if ((!seeRemovedRegistrars && !seeActiveRegistrars) || (seeRemovedRegistrars && seeActiveRegistrars)) {
                    return true;
                }
                if (seeRemovedRegistrars && !registrar.isRegistrar) {
                    return true;
                }
                if (seeActiveRegistrars && registrar.isRegistrar) {
                    return true;
                }
            }
            return false
        });
    }, [registrars, searchText, seeRemovedRegistrars, seeActiveRegistrars])

    const loadCentralContractRegistrars = async () => {
        const registrarAddresses = await getCentralContractRegistrars(titlesContract);
        let registrarsArray = [];
        for (let registrarAddress of registrarAddresses) {
            const addressIsStillRegistrar = await checkIfUserIsRegistrar(titlesContract, registrarAddress);
            registrarsArray.push({
                address: registrarAddress,
                isRegistrar: addressIsStillRegistrar
            })
        }
        setRegistrars(registrarsArray);
    }

    const handleAddedNewRegistrarAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
      
        setAddedNewRegistrarAlertOpen(false);
    }

    return (
        <>
            <div>
                <h1 className='text-center my-5 title-text'>All Registrars</h1>
            </div>
            <Row className='mb-5'>
                <AddRegistrarModal
                    show = {addRegistrarOpen}
                    onAddRegistrarHide = {() => setAddRegistrarOpen(false)}
                    setAddedNewRegistrarAlertOpen={setAddedNewRegistrarAlertOpen}
                    addNewRegistrar = {(newRegistrar) => {
                        setRegistrars([
                        {
                            address: newRegistrar,
                            isRegistrar: true
                        }, ...registrars]);
                    }}
                    loadCentralContractRegistrars={loadCentralContractRegistrars}

                    account = {props.account}
                    currentRegistrars = {registrars}
                    currentOwners = {props.owners}
                />
                <Row>
                    <Col className='d-flex justify-content-end'>
                        <Button className='add-new-registrar-btn' onClick={() => {setAddRegistrarOpen(true);}}>Add a new Registrar</Button>
                    </Col>
                </Row>
                <Row className='mt-4 mb-2'>
                    <Col xs={12} className='registrar-search'>
                        <h5>Filter Registrars:</h5>
                    </Col>
                    <Col lg={9} xs={12} className='mt-2 registrar-search' >
                        <StyledTextField 
                            fullWidth
                            style={{background: "#FFF"}}
                            label='Search for registrar by address' 
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                            }}
                        />
                    </Col>
                    <Col lg={3} xs={12} className='registrar-search-checkboxes'>
                        <Row>
                            <Col lg={12} sm={6}>
                                <FormControlLabel
                                    checked={seeRemovedRegistrars}
                                    control={<Checkbox size="small" color="default"/>}
                                    color="default"
                                    label="Removed registrars"
                                    onChange={(e) => {
                                        setSeeRemovedRegistrars(e.target.checked);
                                    }}
                                />
                            </Col>
                            <Col lg={12} sm={6}>
                                <FormControlLabel
                                    checked={seeActiveRegistrars}
                                    control={<Checkbox size="small" color="default"/>}
                                    label="Active registrars"
                                    onChange={(e) => {
                                        setSeeActiveRegistrars(e.target.checked);
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Row>
            <div>
                {
                    filteredRegistrars ?
                    filteredRegistrars.map(({address, isRegistrar}) => (
                        <RegistrarCard
                            account={props.account}
                            key={address} 
                            address={address} 
                            isRegistrar={isRegistrar} 
                            loadCentralContractRegistrars={loadCentralContractRegistrars}
                        />
                    )) :
                    <div className='centered'>
                        <h3>There are no registrars currently added!</h3>
                    </div>
                }
            </div>
            <Snackbar open={addedNewRegistrarAlertOpen} autoHideDuration={4000} onClose={handleAddedNewRegistrarAlertClose}>
                <MuiAlert
                    variant="filled"
                    onClose={handleAddedNewRegistrarAlertClose}
                    severity="success"
                    sx={{ width: "330px" }}
                >
                    <div className='centered'>
                        Registrar successfully activated!
                    </div>
                </MuiAlert>
            </Snackbar>
        </>
    );
}

export default HandleRegistrars;