import { useState, useEffect } from 'react';
import '../../styles/style.css';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import { useNavigate } from 'react-router-dom';
import PendingContractRequest from './PendingContractCard';

function HandleContractRequests(props) {
    const titlesContract = useTitlesContract().current;

    const navigate = useNavigate();

    const [filteredPendingTitleContracts, setFilteredPendingTitleContracts] = useState([]);

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
        setFilteredPendingTitleContracts(titleContracts);
    }

    const getPendingTitleContracts = async () => {
        const titleContracts = await titlesContract.methods.getPendingTitleContractsByOffsetAndLimit(0,5).call();
        return titleContracts;
    }

    return (
        <>
            <div>
                <h1 className='text-center my-5 title-text'>Title Contracts Requests</h1>
            </div>
            <div>
                {
                    filteredPendingTitleContracts ?
                    filteredPendingTitleContracts.map((contractAddress) => (
                        <PendingContractRequest key={contractAddress} contractAddress={contractAddress} />
                    )) :
                    <div className='centered'>
                        <h3>There are no registrars currently added!</h3>
                    </div>
                }
            </div>
        </>
    );
}

export default HandleContractRequests;