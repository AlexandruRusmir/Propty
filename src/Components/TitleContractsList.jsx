import React from 'react';
import { useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';
import CustomCarousel from './CustomCarousel';
import MyPropertiesCard from './MyPropertiesCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useCentralContractOwners } from '../CustomHooks/useCentralContractOwners';
import { useTitlesContract } from '../CustomHooks/useTitlesContract';
import { useWeb3 } from '../CustomHooks/useWeb3';

function TitleContractsList(props) {
    const web3 = useWeb3().current;
    const titlesContract = useTitlesContract().current;
    let contractOwners = [];
    
    const [registrars, setCRegistrars] = useState([]);
    const [titleContracts, setTitleContracts] = useState([]);

    useEffect( () => {
        loadContract();
    }, [])

    const loadContract = async () => {
        const owners = await loadContractOwners();
        contractOwners = owners;
    }

    const loadContractOwners = async () => {
        const owners = await getContractOwners();
        return owners;
    }

    const getContractOwners = async () => {
        const owners = titlesContract.methods.getContractOwners().call();
        return owners;
    }

    return (
        <div>     
            {
                props.account ?
                    <PropertyCard account={props.account} balance={props.balance} network={props.network} contractAddress='0x8b7DD12C6a352FB45D7F42A788465174515a3aeB'/>
                 :
                <h2>You are not connected to MetaMask!</h2>
            }
            
        </div>
    );
}

export default TitleContractsList;