import { useState, useEffect } from 'react';
import '../../styles/style.css';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';

function HandleContractRequests(props) {
    const titlesContract = useTitlesContract().current;

    const [titleContracts, setTitleContracts] = useState([]);

    useEffect( () => {
        loadContract();
    }, [])

    const loadContract = async () => {
        const titleContracts = await getTitleContracts();
        console.log(titleContracts);
        setTitleContracts(titleContracts);
    }

    const getTitleContracts = async () => {
        const titleContracts = await titlesContract.methods.getTitleContracts().call();
        return titleContracts;
    }

    return (
        <div>
            <h1 className='text-center my-5 title-text'>Title Contracts Requests</h1>
        </div>
    );
}

export default HandleContractRequests;