import { useRef } from "react"
import { useWeb3 } from "./useWeb3";
import titleCreatingContractBuild from 'contracts/TitleCreatingContract.json';

const contractAddress = "0x71ac15e63BaAcbEd27DB174E6373eea3Ea95a6fc";

export const useTitlesContract = () => {
    const web3 = useWeb3().current;
    const contract = useRef(new web3.eth.Contract(titleCreatingContractBuild.abi, contractAddress));

    return contract;
}