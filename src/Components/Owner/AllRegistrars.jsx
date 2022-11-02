import { useEffect } from 'react';
import { useState } from 'react';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import '../../styles/style.css';
import RegistrarCard from './RegistrarCard';

function AllRegistrars(props) {
    const [registrars, setRegistrars] = useState([]);

    const titlesContract = useTitlesContract().current;

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