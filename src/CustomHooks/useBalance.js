import { useRef } from "react"
import { useWeb3 } from "./useWeb3";
import propertyTitleBuild from 'contracts/PropertyTitle.json';

export const useContract = () => {
    const web3 = useWeb3().current;
    const contract = useRef(new web3.eth.Contract(propertyTitleBuild.abi, '0x8b7DD12C6a352FB45D7F42A788465174515a3aeB'));

    return contract;
}