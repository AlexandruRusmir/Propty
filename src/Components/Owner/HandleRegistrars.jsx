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

function HandleRegistrars(props) {
    const titlesContract = useTitlesContract().current;

    const navigate = useNavigate();

    const [registrars, setRegistrars] = useState([]);
    const [addRegistrarOpen, setAddRegistrarOpen] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [seeRemovedRegistrars, setSeeRemovedRegistrars] = useState(false);
    const [seeActiveRegistrars, setSeeActiveRegistrars] = useState(false);

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

    return (
        <>
            <div>
                <h1 className='text-center my-5 title-text'>All Registrars</h1>
            </div>
            <Row className='mb-5'>
                <AddRegistrarModal
                    show = {addRegistrarOpen}
                    onAddRegistrarHide = {() => setAddRegistrarOpen(false)}

                    addNewRegistrar = {(newRegistrar) => {
                        setRegistrars([
                        {
                        address: newRegistrar,
                        isRegistrar: true
                    }, ...registrars]
                    );}}

                    account = {props.account}
                    currentRegistrars = {registrars}
                    currentOwners = {props.owners}
                />
                <Row>
                    <Col className='d-flex justify-content-end'>
                        <Button className='add-new-registrar-btn' onClick={() => {setAddRegistrarOpen(true);}}>Add a new Registrar</Button>
                    </Col>
                </Row>
                <Row className='input-box mt-4 mb-2'>
                    <Col xs={12} className='registrar-search'>
                        <h5>Filter Registrars:</h5>
                    </Col>
                    <Col lg={9} xs={12} className='registrar-search' >
                        <input 
                            placeholder='Search for registrar by address' 
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                            }}
                        />
                    </Col>
                    <Col lg={3} xs={12} className='registrar-search-checkboxes'>
                        <Row>
                            <Col lg={12} sm={6}>
                                <input type='checkbox' id='removed-registrars'
                                    onClick={() => {
                                        setSeeRemovedRegistrars(!seeRemovedRegistrars);
                                    }}
                                />
                                <label for='removed-registrars' className='checkbox-label'>Removed Registrars</label>
                            </Col>
                            <Col lg={12} sm={6}>
                                <input type='checkbox' id='active-registrars'
                                    onClick={() => {
                                        setSeeActiveRegistrars(!seeActiveRegistrars);
                                    }}
                                />
                                <label for='active-registrars' className='checkbox-label'>Active Registrars</label>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Row>
            <div>
                {
                    filteredRegistrars ?
                    filteredRegistrars.map(({address, isRegistrar}) => (
                        <RegistrarCard account={props.account} key={address} address={address} isRegistrar={isRegistrar} />
                    )) :
                    <div className='centered'>
                        <h3>There are no registrars currently added!</h3>
                    </div>
                }
            </div>
        </>
    );
}

export default HandleRegistrars;