import { useState, useEffect } from 'react';
import '../../styles/style.css';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import { useNavigate } from 'react-router-dom';

function HandleContractRequests(props) {
    const titlesContract = useTitlesContract().current;

    const navigate = useNavigate();

    const [titleContracts, setTitleContracts] = useState([]);

    useEffect( () => {
        if (!props.isRegistrar) {
            navigate('/');
            return;
        }
        loadContract();
    }, [])

    const loadContract = async () => {
        const titleContracts = await getPendingTitleContracts();
        console.log(titleContracts);
        setTitleContracts(titleContracts);
    }

    const getPendingTitleContracts = async () => {
        const titleContracts = await titlesContract.methods.getPendingTitleContracts().call();
        return titleContracts;
    }

    return (
        <div>
            <h1 className='text-center my-5 title-text'>Title Contracts Requests</h1>
        </div>
    );
}

export default HandleContractRequests;