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

	const [animationEnd, setAnimationEnd] = useState(false);

	useEffect( () => {
		const accountsChangeFunction = (accounts) => {
			setAccount(accounts[0].toLowerCase());
		}

		const chainChangeFunction = (chainId) => {
			window.location.reload();
		}

		window.ethereum.on('accountsChanged', accountsChangeFunction);
		window.ethereum.on('chainChanged', chainChangeFunction);

		loadAccount().then((receivedAccount) => {
			setAccount(receivedAccount);
			console.log('signed in');
		}).catch( err => {
			console.log(err);
		});

		if (!animationEnd) {
			setTimeout(() => {
				setAnimationEnd(true);
			}, 5000)
		}

		return () => {
			console.log(1);
			window.ethereum.removeListener('accountsChanged', accountsChangeFunction);
			window.ethereum.removeListener('chainChanged', chainChangeFunction);
		};
	}, [])

	useEffect(() => {
		loadBalance().catch(err => {
			console.log(err);
		});
	}, [account])

	async function loadAccount() {
		const accounts = await web3.eth.requestAccounts();

		return accounts[0].toLowerCase();
	}

	async function loadBalance() {
		const network = await web3.eth.net.getNetworkType();
		if (!account) {
			await loadAccount();
		}
		const balance = await web3.eth.getBalance(account);

		setBalance((balance/1e18).toFixed(4));
		setNetwork(network);
	}

	return (
		<>
			{
				animationEnd ?
				<>
					<NavBar account={account} balance={balance} network={network}/>
					<div>
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
						
					</div>
				</> :
				
				<>
					ok
				</>
				
			}
		</>
		
	);
}

export default App;