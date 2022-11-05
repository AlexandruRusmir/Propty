import { useEffect } from 'react';
import { useState } from 'react';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import '../../styles/style.css';
import { useNavigate } from 'react-router-dom';
import RegistrarCard from './RegistrarCard';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import AddRegistrarModal from './AddRegistrarModal';

function HandleRegistrars(props) {
    const titlesContract = useTitlesContract().current;

    const navigate = useNavigate();

    const [registrars, setRegistrars] = useState([]);
    const [addRegistrarOpen, setAddRegistrarOpen] = useState(false);
    const [registrarsList, setRegistrarsList] = useState('');

    useEffect(() => {
        if (!props.owners.includes(props.account)) {
            navigate('/');
        }
        loadCentralContractRegistrars();
    }, [])

    const loadCentralContractRegistrars = async () => {
        const registrarAddresses = await getCentralContractRegistrars();
        let registrarsArray = [];
        for (let registrarAddress of registrarAddresses) {
            const addressIsStillRegistrar = await checkIfAddressIsRegistrar(registrarAddress);
            registrarsArray.push({
                address: registrarAddress,
                isRegistrar: addressIsStillRegistrar
            })
        }
        setRegistrars(registrarsArray);
    }

    const getCentralContractRegistrars = async () => {
        const registrars = await titlesContract.methods.getContractRegistrars().call();
        return registrars;
    }

    const checkIfAddressIsRegistrar = async (address) => {
        const isRegistrar = await titlesContract.methods.checkIfUserIsRegistrar(address).call();
        return isRegistrar;
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

                    addNewRegistrar = {(newRegistrar) => { console.log(newRegistrar);
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
                <Col lg={12} className='d-flex justify-content-end'>
                    <Button className='add-new-registrar-btn' onClick={() => {setAddRegistrarOpen(true);}}>Add a new Registrar</Button>
                </Col>
            </Row>
            <div>
                {
                    registrars ?
                    registrars.map(({address, isRegistrar}) => (
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