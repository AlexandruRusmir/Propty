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
        let titleContracts = []
        try {
            titleContracts = await getPendingTitleContractsByOffsetAndLimit();
        } catch (err) {
            console.log(err.message);
        }
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

    const loadNewContracts = async () => {
        loadContract().then().catch((err) => {
            setFilteredPendingTitleContracts([]);
        });
    }

    return (
        <>
            <div>
                <h1 className='text-center my-5 title-text'>Title Contracts Requests</h1>
            </div>
            <div>
                {
                    filteredPendingTitleContracts.length > 0 ?
                    <>
                        {
                            filteredPendingTitleContracts.map((contractAddress) => (
                                <PendingContractCard 
                                    key={contractAddress} 
                                    contractAddress={contractAddress} 
                                    account={props.account}
                                    loadNewContracts={async () => {await loadNewContracts();}}
                                />
                            ))
                        }
                        <div className='centered mb-5 mt-4'>
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
                        <h4>There are no pending contracts to show right now.</h4>
                    </div>
                }
            </div>
        </>
    );
}

export default HandleContractRequests;