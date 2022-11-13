import { useRef } from "react"
import { useWeb3 } from "./useWeb3";
import propertyTitleBuild from 'contracts/PropertyTitle.json';

export const useContract = () => {
    const web3 = useWeb3().current;
    const contract = useRef(new web3.eth.Contract(propertyTitleBuild.abi, '0x03a756264a7CC291c91ba7A214D74da1958AAa05'));

    return contract;
}