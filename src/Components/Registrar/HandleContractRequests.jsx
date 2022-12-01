import { useState, useEffect } from 'react';
import '../../styles/style.css';
import '../../styles/paginationStyle.css';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import { useNavigate } from 'react-router-dom';
import PendingContractRequest from './PendingContractCard';
import paginationLimits from '../../Data/paginationLimits';
import CustomPagination from '../CustomPagination';

function HandleContractRequests(props) {
    const titlesContract = useTitlesContract().current;

    const navigate = useNavigate();

    const [pendingTitleContractsCount, setPendingTitleContractsCount] = useState(0);
    const [filteredPendingTitleContracts, setFilteredPendingTitleContracts] = useState([]);
    const [currentContractsOffset, setCurrentContractsOffset] = useState(0);

    let paginationControl ;

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
        const titleContractsCount = await getPendingTitleContractsContract();
        const titleContracts = await getPendingTitleContractsByOffsetAndLimit();

        setFilteredPendingTitleContracts(titleContracts);
        setPendingTitleContractsCount(titleContractsCount);
    }

    const getPendingTitleContractsContract = async () => {
        const titleContracts = await titlesContract.methods.getPendingTitleContractsCount().call();
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
                                <PendingContractRequest key={contractAddress} contractAddress={contractAddress} />
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