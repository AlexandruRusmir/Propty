import { useRef } from "react"
import { useWeb3 } from "./useWeb3";
import titleCreatingContractBuild from 'contracts/TitleCreatingContract.json';
import config from "../Config/config";

const contractAddress = config.titleDeployingContractAddress;

export const useTitlesContract = () => {
    const web3 = useWeb3().current;
    const contract = useRef(new web3.eth.Contract(titleCreatingContractBuild.abi, contractAddress));

    return contract;
}