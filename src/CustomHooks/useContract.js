import { useRef } from "react"
import { useWeb3 } from "./useWeb3";
import propertyTitleBuild from 'contracts/PropertyTitle.json';

export const useContract = (contractAddress) => {
    const web3 = useWeb3().current;
    const contract = useRef(new web3.eth.Contract(propertyTitleBuild.abi, contractAddress));

    return contract;
}