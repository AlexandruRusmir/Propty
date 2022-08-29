import React, { useEffect, useState } from 'react';
import './App.css'
import Web3 from 'web3'
import TestComponent from './testComponent';

function App() {
	const web3 = new Web3(Web3.givenProvider || 'https://localhost:8545');
	
	const [account, setAccount] = useState('');
	const [balance, setBalance] = useState('');
	const [network, setNetwork] = useState('');

	useEffect(() => {
		loadBalance().catch(err => {
			console.log(err);
		});
	}, [account])

	useEffect( () => {
		window.ethereum.on('accountsChanged', function (accounts) {
			setAccount(accounts[0]);
			console.log(`Selected account changed to ${accounts[0]}`);
		});
		window.ethereum.on('chainChanged', (chainId) => {
			window.location.reload();
		});
		loadAccounts().then(() => {
			console.log('signed in');
		}).catch( err => {
			console.log(err);
		});
	}, [])

	async function loadAccounts() {
		const accounts = await web3.eth.requestAccounts();
		setAccount(accounts[0]);
	}

	async function loadBalance() {
		const network = await web3.eth.net.getNetworkType()
		const balance = await web3.eth.getBalance(account);

		setBalance((balance/1e18).toFixed(4));
		setNetwork(network);
	}

	return (
		<>
			<div className="App">
				<p>
					Your account address is: {account}
				</p>
				<p>
					You are connected to the {network} network and your balance is {balance}.
				</p>
				<TestComponent account={account} balance={balance} network={network}></TestComponent>
			</div>
		</>
	);
}

export default App;