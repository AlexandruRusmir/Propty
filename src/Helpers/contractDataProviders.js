export const getTitleContractDetails = async (web3, contractAddress) => {
    const contractState = await web3.eth.getStorageAt(contractAddress, 0);
    const sellingPriceIntegralPart = await web3.eth.getStorageAt(contractAddress, 1);
    const sellingPriceFractionalPart = await web3.eth.getStorageAt(contractAddress, 2);
    const sellingPriceFractionalPartLength = await web3.eth.getStorageAt(contractAddress, 3);
    const contractCreator = await web3.eth.getStorageAt(contractAddress, 4);
    const contractOwner = await web3.eth.getStorageAt(contractAddress, 5);
    const housingTenure = await web3.eth.getStorageAt(contractAddress, 6);
    const country = await web3.eth.getStorageAt(contractAddress, 7);
    const city = await web3.eth.getStorageAt(contractAddress, 8);
    const street = await web3.eth.getStorageAt(contractAddress, 9);
    const streetNumber = await web3.eth.getStorageAt(contractAddress, 10);
    const apartmentNumber = await web3.eth.getStorageAt(contractAddress, 11);
    const squareMeters = await web3.eth.getStorageAt(contractAddress, 12);
    const proofOfIdentity = await web3.eth.getStorageAt(contractAddress, 13);
    const propertyTitleDeeds = await web3.eth.getStorageAt(contractAddress, 14);
    const energyPerformanceCertificate = await web3.eth.getStorageAt(contractAddress, 15);
    const extensionsAndAlterationsDocumentation = await web3.eth.getStorageAt(contractAddress, 16);
    const utilityBillsPaid = await web3.eth.getStorageAt(contractAddress, 17);

    const titleContractData = {
        'contractState': contractState,
        'contractCreator': contractCreator,
        'contractOwner': contractOwner,
        'sellingPriceIntegralPart': sellingPriceIntegralPart,
        'sellingPriceFractionalPart': sellingPriceFractionalPart,
        'sellingPriceFractionalPartLength': sellingPriceFractionalPartLength,
        'housingTenure': housingTenure,
        'country': country,
        'city': city,
        'street': street,
        'streetNumber': streetNumber,
        'apartmentNumber': apartmentNumber,
        'squareMeters': squareMeters,
        'proofOfIdentity': proofOfIdentity,
        'propertyTitleDeeds': propertyTitleDeeds,
        'energyPerformanceCertificate': energyPerformanceCertificate,
        'extensionsAndAlterationsDocumentation': extensionsAndAlterationsDocumentation,
        'utilityBillsPaid': utilityBillsPaid
    };

    return titleContractData;
}

export const getCentralContractOwners = async (titlesContract) => {
    const owners = titlesContract.methods.getContractOwners().call();
    return owners;
}

export const getCentralContractRegistrars = async (titlesContract) => {
    const registrars = await titlesContract.methods.getContractRegistrars().call();
    return registrars;
}

export const checkIfUserIsRegistrar = async (titlesContract, userAddress) => {
    if (!userAddress) {
        return;
    }
    const result = titlesContract.methods.isRegistrar(userAddress).call();
    return result
}