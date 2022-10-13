import { useRef } from "react"
import { useWeb3 } from "./useWeb3";
import propertyTitleBuild from 'contracts/PropertyTitle.json';

export const useContract = () => {
    const web3 = useWeb3().current;
    const contract = useRef(new web3.eth.Contract(propertyTitleBuild.abi, '0xBaBd87738eaD1A0857eEb4A47b1542ceb4e428b7'));

    return contract;
}