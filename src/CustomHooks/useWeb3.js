import { useRef } from "react"
import Web3 from "web3";

export const useWeb3 = () => {
    const web3 = useRef(new Web3(Web3.givenProvider || 'https://localhost:8446'));
    web3.current.currentProvider.setMaxListeners(0);

    return web3;
}