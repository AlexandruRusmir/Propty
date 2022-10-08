import { useRef } from "react"
import { useWeb3 } from "./useWeb3";
import propertyTitleBuild from 'contracts/PropertyTitle.json';

export const useContract = () => {
    const web3 = useWeb3().current;
    const contract = useRef(new web3.eth.Contract(propertyTitleBuild.abi, '0xD517EBCb17d3409fF5e6e51C5ee5BE7419Fe1B10'));

    return contract;
}