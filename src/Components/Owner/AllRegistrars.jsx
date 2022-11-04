import { useEffect } from 'react';
import { useState } from 'react';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import '../../styles/style.css';
import RegistrarCard from './RegistrarCard';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import AddRegistrarModal from './AddRegistrarModal';

function AllRegistrars(props) {
    const titlesContract = useTitlesContract().current;

    const [registrars, setRegistrars] = useState([]);
    const [addRegistrarOpen, setAddRegistrarOpen] = useState(false);

    useEffect(() => {
        loadCentralContractRegistrars();
    }, [])

    const loadCentralContractRegistrars = async () => {
        const registrars = await getCentralContractRegistrars();
        setRegistrars(registrars);
        console.log(registrars);
    }

    const getCentralContractRegistrars = async () => {
        const registrars = titlesContract.methods.getContractRegistrars().call();
        return registrars;
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

                    addNewRegistrar = {(newRegistrar) => {setRegistrars(registrars.concat([newRegistrar]));}}

                    account = {props.account}
                    currentRegistrars = {registrars}
                />
                <Col lg={12} className='d-flex justify-content-end'>
                    <Button className='add-new-registrar-btn' onClick={() => {setAddRegistrarOpen(true);}}>Add a new Registrar</Button>
                </Col>
            </Row>
            <div>
                
            </div>
            <div>
                <RegistrarCard address="0xA14304638C269F716B06ccFd8f0Cc5f2a9Bb79CC" isRegistrar={true} />
            </div>
            <div>
                <RegistrarCard address="0xA14304638C269F716B06ccFd8f0Cc5f2a9Bb79CC" isRegistrar={false} />
            </div>
        </>
    );
}

export default AllRegistrars;