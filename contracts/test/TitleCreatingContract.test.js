const { expectRevert, ether } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const propertyTitleBuild = require('contracts/PropertyTitle.json');
const TitleCreatingContract = artifacts.require('TitleCreatingContract');

contract('TitleCreatingContract', (accounts) => {
    const onlyCreatorRevertMessage = "Only the creator of the Contract has access to this!";
    const onlyOwnerRevertMessage = "Only the owner of the Contract has access to this!";
    const onlyIfLegallyAllowedRevertMessage = "The property is not legally alright.";
    const onlyForSaleRevertMessage = "This property is not for sale.";
    const onlyTitleCreatingOwnerRevertMessage = "Only one of the owners has access to this functionality.";
    const onlyRegistrarRevertMessage = "Only a registered registrar has access to this action.";
    const onlyNotOwnerRevertMessage = "You can not validate your own property";
    const onlyRelevantPropertyRevertMessage = "This Property Title Contract is no longer relavant";

    const firstAccount = accounts[0], secondAccount = accounts[1], thirdAccount = accounts[2], fourthAccount = accounts[3], fifthAccount = accounts[4], sixthAccount = accounts[5];
    const country = 'Romania', city = 'Timisoara', street = 'Strada Liberatii', streetNumber = '31A', apartmentNumber = '7', squareMeters = '128';
    const sellingPriceIntegralPart = '15', sellingPriceFractionalPart = '254', sellingPriceFractionalPartLength = '3';

    let titleCreatingContract;

    describe('Title creating contract owner and registrar functionality', () => {
        before(async () => {
            titleCreatingContract = await TitleCreatingContract.new(
                [
                    firstAccount,
                    secondAccount
                ]
            );
        });

        it('should recognize whether an account has owner rights or not', async () => {
            const titleCreatingContractFirstOwner = await titleCreatingContract.owners(0);
            const titleCreatingContractSecondOwner = await titleCreatingContract.owners(1);
            const firstAccountIsOwner = await titleCreatingContract.isOwner(firstAccount);
            const secondAccountIsOwner = await titleCreatingContract.isOwner(secondAccount);
            const thirdAccountIsOwner = await titleCreatingContract.isOwner(thirdAccount);

            assert.equal(titleCreatingContractFirstOwner, firstAccount, 'wrong owners array assignment');
            assert.equal(titleCreatingContractSecondOwner, secondAccount, 'wrong owners array assignment');
            assert.equal(firstAccountIsOwner, true, 'wrong first account owner status');
            assert.equal(secondAccountIsOwner, true, 'wrong second account owner status');
            assert.equal(thirdAccountIsOwner, false, 'wrong third account owner status');
        });

        it('should prevent anyone who is not an owner from adding registrars', async () => {
            return expectRevert(
                titleCreatingContract.addRegistrars(
                    [
                        fourthAccount
                    ],
                    { from: thirdAccount }
                ), onlyTitleCreatingOwnerRevertMessage
            );
        });

        it('should allow owners to add registrars and the changes should be seen in the contract state', async () => {
            await titleCreatingContract.addRegistrars(
                    [
                        thirdAccount,
                        fourthAccount
                    ],
                    { from: firstAccount }
                );
            
            const titleCreatingContractFirstRegistrar = await titleCreatingContract.registrars(0);
            const titleCreatingContractSecondRegistrar = await titleCreatingContract.registrars(1);
            const thirdAccountIsRegistrar = await titleCreatingContract.isRegistrar(thirdAccount);
            const fourthAccountIsRegistrar = await titleCreatingContract.isRegistrar(fourthAccount);
            const firstAccountIsRegistrar = await titleCreatingContract.isRegistrar(firstAccount);

            assert.equal(titleCreatingContractFirstRegistrar, thirdAccount, 'wrong registrars array assignment');
            assert.equal(titleCreatingContractSecondRegistrar, fourthAccount, 'wrong registrars array assignment');
            assert.equal(thirdAccountIsRegistrar, true, 'wrong third account registrar status');
            assert.equal(fourthAccountIsRegistrar, true, 'wrong fourth account registrar status');
            assert.equal(firstAccountIsRegistrar, false, 'wrong first account registrar status');
        });

        it('should prevent anyone who is not an owner from removing registrar role from accounts', async () => {
            return expectRevert(
                titleCreatingContract.removeRegistrarRole(
                    [
                        fourthAccount
                    ],
                    { from: thirdAccount }
                ), onlyTitleCreatingOwnerRevertMessage
            );
        });

        it('should allow owners to remove the registrar role from accounts', async () => {
            await titleCreatingContract.removeRegistrarRole(
                    [
                        thirdAccount,
                        fourthAccount
                    ],
                    { from: firstAccount }
                );
            
            const titleCreatingContractFirstRegistrar = await titleCreatingContract.registrars(0);
            const titleCreatingContractSecondRegistrar = await titleCreatingContract.registrars(1);
            const thirdAccountIsRegistrar = await titleCreatingContract.isRegistrar(thirdAccount);
            const fourthAccountIsRegistrar = await titleCreatingContract.isRegistrar(fourthAccount);

            assert.equal(titleCreatingContractFirstRegistrar, thirdAccount, 'wrong registrars array assignment');
            assert.equal(titleCreatingContractSecondRegistrar, fourthAccount, 'wrong registrars array assignment');
            assert.equal(thirdAccountIsRegistrar, false, 'wrong third account registrar status');
            assert.equal(fourthAccountIsRegistrar, false, 'wrong fourth account registrar status');
        });

        it('should prevent anyone who is not an owner from reactivating the registrar role for accounts', async () => {
            return expectRevert(
                titleCreatingContract.reactivateRegistrarRole(
                    [
                        fourthAccount
                    ],
                    { from: thirdAccount }
                ), onlyTitleCreatingOwnerRevertMessage
            );
        });

        it('should allow owners to reactivate the registrar role for accounts', async () => {
            await titleCreatingContract.reactivateRegistrarRole(
                    [
                        thirdAccount,
                        fourthAccount
                    ],
                    { from: firstAccount }
                );
            
            const titleCreatingContractFirstRegistrar = await titleCreatingContract.registrars(0);
            const titleCreatingContractSecondRegistrar = await titleCreatingContract.registrars(1);
            const thirdAccountIsRegistrar = await titleCreatingContract.isRegistrar(thirdAccount);
            const fourthAccountIsRegistrar = await titleCreatingContract.isRegistrar(fourthAccount);

            assert.equal(titleCreatingContractFirstRegistrar, thirdAccount, 'wrong registrars array assignment');
            assert.equal(titleCreatingContractSecondRegistrar, fourthAccount, 'wrong registrars array assignment');
            assert.equal(thirdAccountIsRegistrar, true, 'wrong third account registrar status');
            assert.equal(fourthAccountIsRegistrar, true, 'wrong fourth account registrar status');
        });

        it('should allow anyone to deploy their property title contract through this contract', async () => {
            await titleCreatingContract.deployNewPropertyTitle(
                sixthAccount,
                country,
                city,
                street,
                streetNumber,
                apartmentNumber,
                squareMeters,
                sellingPriceIntegralPart,
                sellingPriceFractionalPart,
                sellingPriceFractionalPartLength,
                { from: sixthAccount }
            );

            await titleCreatingContract.deployNewPropertyTitle(
                thirdAccount,
                country,
                city,
                street,
                "31B",
                apartmentNumber,
                squareMeters,
                sellingPriceIntegralPart,
                sellingPriceFractionalPart,
                sellingPriceFractionalPartLength,
                { from: thirdAccount }
            );

            const firstTitleContractsArrayElementAfterTitleDeploy = await titleCreatingContract.titleContracts(0);
            assert.equal(!!(firstTitleContractsArrayElementAfterTitleDeploy), true, 'there should be one titleContracts element');
            const secondTitleContractsArrayElementAfterTitleDeploy = await titleCreatingContract.titleContracts(0);
            assert.equal(!!(secondTitleContractsArrayElementAfterTitleDeploy), true, 'there should be one titleContracts element');
            const firstTitleContractValidity = await titleCreatingContract.propertyTitleContractsValidity(firstTitleContractsArrayElementAfterTitleDeploy);
            assert.equal(firstTitleContractValidity, false, 'this title contract should not yet be valid');
            const secondTitleContractValidity = await titleCreatingContract.propertyTitleContractsValidity(secondTitleContractsArrayElementAfterTitleDeploy);
            assert.equal(secondTitleContractValidity, false, 'this title contract should not yet be valid');
        });

        it('should prevent anyone who is not a registrar from modifying deployed title contracts documents state', async () => {
            const firstTitleContractAddress = await titleCreatingContract.titleContracts(0);
            const propertyTitleContract = new web3.eth.Contract(propertyTitleBuild.abi, firstTitleContractAddress);

            return expectRevert(
                propertyTitleContract.methods.setRequiredDocumentsStateAndContractState(
                    'Provided',
                    'Provided',
                    'Provided',
                    'Provided',
                    'Provided',
                    '1',
                ).send({ from: firstAccount }), onlyRegistrarRevertMessage
            );
        });

        it('should prevent registrars from validating the documents of their own property title contracts', async () => {
            const secondTitleContractAddress = await titleCreatingContract.titleContracts(1);
            const propertyTitleContract = new web3.eth.Contract(propertyTitleBuild.abi, secondTitleContractAddress);
            return expectRevert(
                propertyTitleContract.methods.setRequiredDocumentsStateAndContractState(
                    'Provided',
                    'Provided',
                    'Provided',
                    'Provided',
                    'Provided',
                    '1',
                ).send({ from: thirdAccount }), onlyNotOwnerRevertMessage
            );
        });

        it('should allow registrars to modify the documents state of deployed title contracts', async () => {
            const firstTitleContractAddress = await titleCreatingContract.titleContracts(0);
            const propertyTitleContract = new web3.eth.Contract(propertyTitleBuild.abi, firstTitleContractAddress);
            const providedText = 'Provided';

            await propertyTitleContract.methods.setRequiredDocumentsStateAndContractState(
                providedText,
                providedText,
                providedText,
                providedText,
                providedText,
                '1',
            ).send({ from: thirdAccount });

            const secondTitleContractAddress = await titleCreatingContract.titleContracts(1);
            const secondPropertyTitleContract = new web3.eth.Contract(propertyTitleBuild.abi, secondTitleContractAddress);

            await secondPropertyTitleContract.methods.setRequiredDocumentsStateAndContractState(
                providedText,
                providedText,
                providedText,
                providedText,
                providedText,
                '1',
            ).send({ from: fourthAccount });
            
            const contractState = await web3.eth.getStorageAt(firstTitleContractAddress, 0);
            const proofOfIdentity = await web3.eth.getStorageAt(firstTitleContractAddress, 13);
            const propertyTitleDeeds = await web3.eth.getStorageAt(firstTitleContractAddress, 14);
            const energyPerformanceCertificate = await web3.eth.getStorageAt(firstTitleContractAddress, 15);
            const extensionsAndAlterationsDocumentation = await web3.eth.getStorageAt(firstTitleContractAddress, 16);
            const utilityBillsPaid = await web3.eth.getStorageAt(firstTitleContractAddress, 17);
            assert.equal(web3.utils.hexToNumber(contractState), 1, 'property title contract state should be OWNED');
            assert.equal(web3.utils.hexToString(proofOfIdentity).slice(0, providedText.length), 'Provided', 'proof of identity document should be validated');
            assert.equal(web3.utils.hexToString(propertyTitleDeeds).slice(0, providedText.length), 'Provided', 'property title deeds document should be validated');
            assert.equal(web3.utils.hexToString(energyPerformanceCertificate).slice(0, providedText.length), 'Provided', 'energy performance certificate document should be validated');
            assert.equal(web3.utils.hexToString(extensionsAndAlterationsDocumentation).slice(0, providedText.length), 'Provided', 'extensions and alterations document should be validated');
            assert.equal(web3.utils.hexToString(utilityBillsPaid).slice(0, providedText.length), 'Provided', 'utility bills document should be validated');
        });
    });

    describe('Title creating contract deployed and active property title contracts functionality', () => {
        before(async () => {
            await titleCreatingContract.deployNewPropertyTitle(
                fifthAccount,
                'USA',
                'Strongstown',
                'Excellence Street',
                'T1',
                '1',
                '100',
                '10',
                '001',
                '3',
                { from: fifthAccount }
            );

            await titleCreatingContract.deployNewPropertyTitle(
                firstAccount,
                'USA',
                'Successtown',
                'Confident Street',
                'C1',
                '13',
                '89',
                '7',
                '3',
                '1',
                { from: firstAccount }
            );

            const thirdTitleContractAddress = await titleCreatingContract.titleContracts(2);
            const propertyTitleContract = new web3.eth.Contract(propertyTitleBuild.abi, thirdTitleContractAddress);
            const providedText = 'Provided';

            await propertyTitleContract.methods.setRequiredDocumentsStateAndContractState(
                providedText,
                providedText,
                providedText,
                providedText,
                providedText,
                '1',
            ).send({ from: thirdAccount });

            const fourthTitleContractAddress = await titleCreatingContract.titleContracts(3);
            const secondPropertyTitleContract = new web3.eth.Contract(propertyTitleBuild.abi, fourthTitleContractAddress);

            await secondPropertyTitleContract.methods.setRequiredDocumentsStateAndContractState(
                providedText,
                providedText,
                providedText,
                providedText,
                providedText,
                '1',
            ).send({ from: thirdAccount });
        });

        it('should allow the owner to change the selling price of the owned property title contract', async () => {
            const thirdTitleContractAddress = await titleCreatingContract.titleContracts(2);
            const propertyTitleContract = new web3.eth.Contract(propertyTitleBuild.abi, thirdTitleContractAddress);

            const newSellingPriceIntegralPart = '6', newSellingPriceFractionalPart = '32', newSellingPriceFractionalPartLength = '2';
            await propertyTitleContract.methods.setPropertySellingPrice(
                newSellingPriceIntegralPart,
                newSellingPriceFractionalPart,
                newSellingPriceFractionalPartLength
            ).send({ from: fifthAccount });

            const sellingPriceInWei = await propertyTitleContract.methods.getPropertySellingPrice().call();
            assert.equal(
                sellingPriceInWei.toString(), 
                ether(newSellingPriceIntegralPart + '.' + newSellingPriceFractionalPart).toString(), 
                'setPropertySellingPrice not working properly'
            );

        });

        it('should allow the owner to change the housing tenure, but this should make the contract require document validation once again', async () => {
            const thirdTitleContractAddress = await titleCreatingContract.titleContracts(2);
            const propertyTitleContract = new web3.eth.Contract(propertyTitleBuild.abi, thirdTitleContractAddress);

            await propertyTitleContract.methods.modifyPropertyTenureType(
                "2"
            ).send({ from: fifthAccount });

            const housingTenure = await web3.eth.getStorageAt(thirdTitleContractAddress, 6);
            assert.equal(web3.utils.hexToNumber(housingTenure), 2, 'housing tenure does not change');
            const contractState = await web3.eth.getStorageAt(thirdTitleContractAddress, 0);
            assert.equal(web3.utils.hexToNumber(contractState), 0, 'chaging the tenure type put the contract in pending state');

            const providedText = 'Provided';
            await propertyTitleContract.methods.setRequiredDocumentsStateAndContractState(
                providedText,
                providedText,
                providedText,
                providedText,
                providedText,
                '1',
            ).send({ from: thirdAccount });
        });

        it('should allow the owner to change the square meters, but this should make the contract require document validation once again', async () => {
            const thirdTitleContractAddress = await titleCreatingContract.titleContracts(2);
            const propertyTitleContract = new web3.eth.Contract(propertyTitleBuild.abi, thirdTitleContractAddress);

            await propertyTitleContract.methods.modifyPropertySquareMeters(
                "64"
            ).send({ from: fifthAccount });

            const squareMeters = await web3.eth.getStorageAt(thirdTitleContractAddress, 12);
            assert.equal(web3.utils.hexToNumber(squareMeters), 64, 'square meters does not change');
            const contractState = await web3.eth.getStorageAt(thirdTitleContractAddress, 0);
            assert.equal(web3.utils.hexToNumber(contractState), 0, 'chaging the tenure type put the contract in pending state');

            const providedText = 'Provided';
            await propertyTitleContract.methods.setRequiredDocumentsStateAndContractState(
                providedText,
                providedText,
                providedText,
                providedText,
                providedText,
                '1',
            ).send({ from: thirdAccount });
        });

        it('should allow the owner to list the contract for sale or unlist it', async () => {
            const thirdTitleContractAddress = await titleCreatingContract.titleContracts(2);
            const propertyTitleContract = new web3.eth.Contract(propertyTitleBuild.abi, thirdTitleContractAddress);

            await propertyTitleContract.methods.modifyContractState("2").send({ from: fifthAccount });
            const contractState = await web3.eth.getStorageAt(thirdTitleContractAddress, 0);
            assert.equal(web3.utils.hexToNumber(contractState), 2, 'contract state does not change');

            await propertyTitleContract.methods.modifyContractState("1").send({ from: fifthAccount });
            const contractStateAfterSecondUpdate = await web3.eth.getStorageAt(thirdTitleContractAddress, 0);
            assert.equal(web3.utils.hexToNumber(contractStateAfterSecondUpdate), 1, 'contract state does not change');
        });

        it('should prevent the owner from making any modifications once the contract is set to no longer relevant', async () => {
            const thirdTitleContractAddress = await titleCreatingContract.titleContracts(2);
            const propertyTitleContract = new web3.eth.Contract(propertyTitleBuild.abi, thirdTitleContractAddress);
            await propertyTitleContract.methods.modifyContractState("3").send({ from: fifthAccount });

            return expectRevert(
                propertyTitleContract.methods.modifyPropertySquareMeters(
                    "64"
                ).send({ from: fifthAccount }), onlyRelevantPropertyRevertMessage
            );
        });

        it('should prevent the registrar from validating the contract once it is set to no longer relevant', async () => {
            const thirdTitleContractAddress = await titleCreatingContract.titleContracts(2);
            const propertyTitleContract = new web3.eth.Contract(propertyTitleBuild.abi, thirdTitleContractAddress);

            const providedText = 'Provided';
            return expectRevert(
                propertyTitleContract.methods.setRequiredDocumentsStateAndContractState(
                    providedText,
                    providedText,
                    providedText,
                    providedText,
                    providedText,
                    '1',
                ).send({ from: thirdAccount }), onlyRelevantPropertyRevertMessage
            );
        });

        // it('should prevent the contract from being bought if it is not for sale', async () => {
        //     const thirdTitleContractAddress = await titleCreatingContract.titleContracts(2);
        //     const propertyTitleContract = new web3.eth.Contract(propertyTitleBuild.abi, thirdTitleContractAddress);

        //     const params = [{
        //         'from': thirdAccount,
        //         'to': thirdTitleContractAddress,
        //         'gas': Number(2100000).toString(16),
        //         'gasPrice': Number(250000000).toString(16),
        //         'value': Number(8.32).toString(16),
        //     }];
            
        //     return expectRevert(
        //         window.ethereum.request({method: 'eth_sendTransaction', params}).send({ from: thirdAccount }), onlyForSaleRevertMessage
        //     );
        // });
    });


    describe('Title creating contract helper functions functionality', () => {
        it('should have a function that returns whether a string contains a substring', async () => {
            const firstStringInclusionResult = await titleCreatingContract.stringContains('This is the string to search in', 'string to search');
            const secondStringInclusionResult = await titleCreatingContract.stringContains('This is the string to search in', 'strink');
            assert.equal(
                firstStringInclusionResult, 
                true, 
                'stringContains function not working properly.'
            );
            assert.equal(
                secondStringInclusionResult, 
                false, 
                'stringContains function not working properly.'
            );
        });

        it('should have a function that returns the lowercase version of a string', async () => {
            const lowerCaseString = await titleCreatingContract.toLower('THis is My ID');
            assert.equal(
                lowerCaseString, 
                'this is my id', 
                'toLower function not working properly.'
            );
        });
    });
});