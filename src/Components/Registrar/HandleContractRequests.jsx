import { useState, useEffect } from 'react';
import '../../styles/style.css';
import '../../styles/paginationStyle.css';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import { useNavigate } from 'react-router-dom';
import PendingContractCard from './PendingContractCard';
import paginationLimits from '../../Data/paginationLimits';
import CustomPagination from '../CustomPagination';

function HandleContractRequests(props) {
    const titlesContract = useTitlesContract().current;

    const navigate = useNavigate();

    const [pendingTitleContractsCount, setPendingTitleContractsCount] = useState(0);
    const [filteredPendingTitleContracts, setFilteredPendingTitleContracts] = useState([]);
    const [currentContractsOffset, setCurrentContractsOffset] = useState(0);

    useEffect( () => {
        if (!props.isRegistrar) {
            navigate('/');
            return;
        }
        loadContract();
    }, [])

    useEffect( () => {
        loadContract();
    }, [currentContractsOffset])

    const loadContract = async () => {
        const titleContractsCount = await getPendingTitleContractsCount();
        const titleContracts = await getPendingTitleContractsByOffsetAndLimit();

        setFilteredPendingTitleContracts(titleContracts);
        setPendingTitleContractsCount(titleContractsCount);
    }

    const getPendingTitleContractsCount = async () => {
        const titleContracts = await titlesContract.methods.getPendingContractsCount().call();
        return titleContracts;
    }

    const getPendingTitleContractsByOffsetAndLimit = async () => {
        const titleContracts = await titlesContract.methods.getPendingContractsByOffsetAndLimit(currentContractsOffset, paginationLimits.pendingTitleContractsLimit).call();
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
                    <>
                        {
                            filteredPendingTitleContracts.map((contractAddress) => (
                                <PendingContractCard key={contractAddress} contractAddress={contractAddress} account={props.account}/>
                            ))
                        }
                        <div className='centered'>
                            <CustomPagination
                                elementsCount={pendingTitleContractsCount}
                                elementsPerPage={paginationLimits.pendingTitleContractsLimit}
                                setNewOffset={(newOffset) => {setCurrentContractsOffset(newOffset);}}
                                getNewElements={async () => {
                                    const titleContracts = await getPendingTitleContractsByOffsetAndLimit();
                                    setFilteredPendingTitleContracts(titleContracts);
                                }}
                            />
                        </div>
                    </> :
                    <div className='centered'>
                        <h3>There are currently no pending contracts.</h3>
                    </div>
                }
            </div>
        </>
    );
}

export default HandleContractRequests;