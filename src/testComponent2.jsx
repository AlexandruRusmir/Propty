import React, { useEffect, useState } from 'react';
import './App.css';
import Web3 from 'web3';
import testEnumBuild from 'contracts/TestEnum.json';
import { useWeb3 } from './CustomHooks/useWeb3';
import { useContract } from './CustomHooks/useContract';

function TestComponent2(props) {
    const web3 = useWeb3().current;

    let contract = useContract().current;
    const [number, setNumber] = useState();
    const [newNumber, setNewNumber] = useState('');

    useEffect(() => {
        loadContract();
    }, [number]);

    async function loadContract() {
        const networkId = await web3.eth.net.getId();

        let number = await getContractNumber();
        setNumber(number);

        let contractAddress = testEnumBuild.networks[networkId].address;
        const enumValue = await web3.eth.getStorageAt(contractAddress, 0);
        console.log('enum value: ' + web3.utils.hexToNumberString(enumValue));


        const testVal = await web3.eth.getStorageAt(contractAddress, 1);
        console.log('Test value: ' + web3.utils.hexToString(testVal));
    }

    async function getContractNumber() {
        if (contract === '') {
            await loadContract();
        }
        let enumValue = await contract.methods.getProp().call();
        console.log(enumValue);
        setNumber(enumValue);
    }

    async function setContractNumber(number) {
        if (contract === '') {
            await loadContract();
        }
        return contract.methods.setProp(number).send({ from: props.account });
    }

    const handleChange = (event) => {
        setNewNumber(event.target.value);
    }

    const numberChangeClick = e => {
        if (newNumber === '') {
            console.log('Invalid value');
            return;
        }
        setContractNumber(newNumber).then(() => {
            setNumber(newNumber);
            setNewNumber('');
        }).catch(err => {
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

export default TestComponent2;