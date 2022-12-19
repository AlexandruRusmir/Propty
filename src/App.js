import React, { useEffect, useState } from 'react';
import './styles/style.css';
import Web3 from 'web3'
import Container from 'react-bootstrap/Container';
import NavBar from './Components/NavBar';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/User/Home';
import AllProperties from './Components/User/AllProperties';
import MyProperties from './Components/User/MyProperties';
import HandleRegistrars from './Components/Owner/HandleRegistrars';
import { useWeb3 } from './CustomHooks/useWeb3';
import { useTitlesContract } from './CustomHooks/useTitlesContract';
import HandleContractRequests from './Components/Registrar/HandleContractRequests';
import { getCentralContractOwners, checkIfUserIsRegistrar } from './Helpers/contractDataProviders'
import ForSaleProperties from './Components/User/ForSaleProperties';

function App() {
	const web3 = useWeb3().current;
	
	const [account, setAccount] = useState('');
	const [balance, setBalance] = useState('');
	const [network, setNetwork] = useState('');


	const titlesContract = useTitlesContract().current;
	const [centralContractOwners, setCentralContractOwners] = useState([])
	const [isAdmin, setIsAdmin] = useState(false);
	const [isRegistrar, setIsRegistrar] = useState(false);

	useEffect( () => {
		const accountsChangeFunction = (accounts) => {
			setAccount(accounts[0].toLowerCase());
		}

		const chainChangeFunction = (chainId) => {
			window.location.reload();
		}

		const messageReceiveFunction = async (message) => {
			await loadBalance();
			console.log(message);
		}

		window.ethereum.on('accountsChanged', accountsChangeFunction);
		window.ethereum.on('chainChanged', chainChangeFunction);
		window.ethereum.on('message', messageReceiveFunction);

		loadAccount().then( receivedAccount => {
			setAccount(receivedAccount);
			console.log('signed in');
		}).catch( err => {
			console.log(err);
		});

		// if (!animationEnd) {
		// 	setTimeout(() => {
		// 		setAnimationEnd(true);
		// 	}, 3000)
		// }

		return () => {
			console.log('destructed');
			window.ethereum.removeListener('accountsChanged', accountsChangeFunction);
			window.ethereum.removeListener('chainChanged', chainChangeFunction);
			window.ethereum.removeListener('message', messageReceiveFunction);
		};
	}, [])

	useEffect(() => {
		loadBalance().catch(err => {
			console.log(err);
		});
		loadCentralContractData();
	}, [account])

	useEffect(() => {
		if (centralContractOwners.includes(account)) {
			setIsAdmin(true);
		} else {
			setIsAdmin(false);
		}
	}, [centralContractOwners])

	const loadAccount = async () => {
		const accounts = await web3.eth.requestAccounts();

		return accounts[0].toLowerCase();
	}

	const loadBalance = async () => {
		const network = await web3.eth.net.getNetworkType();
		setNetwork(network);
		if (!account) {
			return;
		}
		const balance = await web3.eth.getBalance(account);

		setBalance((balance/1e18).toFixed(4));
	}

	const loadCentralContractData = async () => {
        const owners = await getCentralContractOwners(titlesContract);
		const lowerCaseOwnerAdresses = owners.map(ownerAddress => {
			return ownerAddress.toLowerCase();
		})
        setCentralContractOwners(lowerCaseOwnerAdresses);

		const userIsRegistrar = await checkIfUserIsRegistrar(titlesContract, account);
		setIsRegistrar(userIsRegistrar);
    }

	return (
		<>
			<NavBar account={account} balance={balance} network={network} isAdmin={isAdmin} isRegistrar={isRegistrar}/>
			<div>
				<Routes>
					<Route path="/" element={
						<Home account={account} balance={balance} network={network}/>
					} />
					<Route path="/all-properties" element={
						<Container>
							<AllProperties account={account} balance={balance} network={network}/>
						</Container>
					} />
					<Route path="/my-properties" element={
						<Container>
							<MyProperties account={account} balance={balance} network={network}/>
						</Container>
					} />
					<Route path="/for-sale-properties" element={
						<Container>
							<ForSaleProperties account={account} balance={balance} network={network}/>
						</Container>
					} />
					<Route path="/handle-registrars" element={
						<Container>
							<HandleRegistrars owners={centralContractOwners} account={account} balance={balance} network={network}/>
						</Container>
					} />
					<Route path="/contract-requests" element={
						<Container>
							<HandleContractRequests account={account} balance={balance} network={network} isRegistrar={isRegistrar}/>
						</Container>
					} />
				</Routes>
			</div>
		</>
		
	);
}

export default App;