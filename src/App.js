import React, { useEffect, useState } from 'react';
import './App.css';
import './styles/style.css';
import Web3 from 'web3'
import TestComponent from './testComponent';
import PropertyDetailsEdit from './Components/PropertyDetailsEdit';
import TestComponent2 from './testComponent2';
import Container from 'react-bootstrap/Container';
import NavBar from './Components/NavBar';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import AllProperties from './Components/AllProperties';
import MyProperties from './Components/MyProperties';

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
		const network = await web3.eth.net.getNetworkType();
		if (!account) {
			await loadAccounts();
		}
		const balance = await web3.eth.getBalance(account);

		setBalance((balance/1e18).toFixed(4));
		setNetwork(network);
	}

	return (
		<>
			<NavBar account={account} balance={balance} network={network}/>
			<>
				<Routes>
					<Route path="/" element={<Home account={account} balance={balance} network={network}/>} />
					<Route path="/allproperties" element={
						<Container>
							<AllProperties account={account} balance={balance} network={network}/>
						</Container>
					} />
					<Route path="/myproperties" element={
						<Container>
							<MyProperties account={account} balance={balance} network={network}/>
						</Container>
					} />
				</Routes>
				{/* {
					account ?
					<>
						<PropertyDetailsEdit account={account} balance={balance} network={network}/>
						<TestComponent2 account={account} balance={balance} network={network}/>
					</>:
					<p> Please connect to Metamask </p>
				} */}
				
			</>
		</>
	);
}

export default App;