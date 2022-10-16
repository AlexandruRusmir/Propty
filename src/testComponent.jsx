import React, { useEffect, useState } from 'react';
import './App.css';
import Web3 from 'web3';
import testContractBuild from 'contracts/TestContract.json';
import TestComponent2 from './testComponent2';
import { useWeb3 } from './CustomHooks/useWeb3';
import { useContract } from './CustomHooks/useContract';

function TestComponent(props) {
    const web3 = useWeb3().current;

    let contract = useContract().current;
    const [number, setNumber] = useState(0);
    const [newNumber, setNewNumber] = useState('');

    useEffect(() => {
        loadContract();
    }, [number]);

    async function loadContract() {
        const networkId = await web3.eth.net.getId();

        let number = await getContractNumber();
        console.log(number);
        setNumber(number);
    }

    async function getContractNumber() {
        if(contract === '') {
            await loadContract();
        }
        return contract.methods.getNumber().call();
    }

    async function setContractNumber(number) {
        if(contract === '') {
            await loadContract();
        }
        return contract.methods.setNumber(number).send({ from: props.account });
    }

    const handleChange = (event) => {
        setNewNumber(event.target.value);
    }

    const numberChangeClick = e => {
        if (newNumber === '') {
            console.log('Invalid value');
            return;
        }
        setContractNumber(newNumber).then( () => {
            setNumber(newNumber);
            setNewNumber('');
        }).catch( err => {
            console.log(err);
        });
    }

	return (
		<div className="App">
			<p>
                The number: {number}
			</p>
            <span>Change the number:{"\u00a0"}</span>
            <input
                type="number"
                id="message"
                name="message"
                onChange={handleChange}
                autoComplete="off"
                value={newNumber}
            />
            <button onClick={numberChangeClick}>Change number</button>
		</div>
	);
}

export default TestComponent;