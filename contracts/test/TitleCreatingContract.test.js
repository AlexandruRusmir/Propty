const { expectRevert, ether, expectEvent, BN } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const assert = require('assert');
const propertyTitleBuild = require('contracts/PropertyTitle.json');
const titleCreatingContractBuild = require('contracts/TitleCreatingContract.json');
const TitleCreatingContract = artifacts.require('TitleCreatingContract');
const PropertyTitle = artifacts.require('PropertyTitle');

contract('TitleCreatingContract', (accounts) => {
    const onlyCreatorRevertMessage = "Only the creator of the Contract has access to this!";
    const onlyOwnerRevertMessage = "Only the owner of the Contract has access to this!";
    const onlyIfLegallyAllowedRevertMessage = "The property is not legally alright.";
    const onlyForSaleRevertMessage = "This property is not for sale.";
    const onlyTitleCreatingOwnerRevertMessage = "Only one of the owners has access to this functionality.";
    const onlyRegistrarRevertMessage = "Only a registered registrar has access to this action.";
    const onlyNotOwnerRevertMessage = "You can not validate your own property";
    const onlyRelevantPropertyRevertMessage = "This Property Title Contract is no longer relavant";
    const offsetGreaterThanListLengthRevertMessage = "Offset greater than list length";

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

            const firstTitleContractsArrayElementAfterTitleDeploy = await titleCreatingContract.titleContracts(0);
            assert.equal(!!(firstTitleContractsArrayElementAfterTitleDeploy), true, 'there should be one titleContracts element');
        });

        it('should emit an event when a property title contract is deployed through this contract', async () => {
            const tx = await titleCreatingContract.deployNewPropertyTitle(
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
            const secondTitleContractsArrayElementAfterTitleDeploy = await titleCreatingContract.titleContracts(1);

            return expectEvent(tx, 'NewTitleContract', {
                ownerAddress: thirdAccount,
                titleContractAddress: secondTitleContractsArrayElementAfterTitleDeploy
            });
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

    describe('Deployed property title contracts functionality', () => {
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

            await titleCreatingContract.deployNewPropertyTitle(
                accounts[8],
                'USA',
                'Successtown',
                'Confident Street',
                'C1',
                '13',
                '89',
                '7',
                '3',
                '1',
                { from: accounts[8] }
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

            const titleCreatingContractAddress = await titleCreatingContract.address;
            this.propertyTitle = await PropertyTitle.new(
                titleCreatingContractAddress,
                firstAccount,
                country,
                city,
                street,
                streetNumber,
                apartmentNumber,
                squareMeters,
                '0',
                sellingPriceFractionalPart,
                sellingPriceFractionalPartLength,
                { from: firstAccount }
            );

            await this.propertyTitle.setRequiredDocumentsStateAndContractState(
                providedText,
                providedText,
                providedText,
                providedText,
                providedText,
                '1',
                { from: thirdAccount }
            );
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

        it('should allow the owner to list the a property title contract for sale or unlist it', async () => {
            const thirdTitleContractAddress = await titleCreatingContract.titleContracts(2);
            const propertyTitleContract = new web3.eth.Contract(propertyTitleBuild.abi, thirdTitleContractAddress);

            await propertyTitleContract.methods.modifyContractState("2").send({ from: fifthAccount });
            const contractState = await web3.eth.getStorageAt(thirdTitleContractAddress, 0);
            assert.equal(web3.utils.hexToNumber(contractState), 2, 'contract state does not change');

            await propertyTitleContract.methods.modifyContractState("1").send({ from: fifthAccount });
            const contractStateAfterSecondUpdate = await web3.eth.getStorageAt(thirdTitleContractAddress, 0);
            assert.equal(web3.utils.hexToNumber(contractStateAfterSecondUpdate), 1, 'contract state does not change');
        });

        it('should prevent the owner from making any modifications once the property title contract is set to no longer relevant', async () => {
            const thirdTitleContractAddress = await titleCreatingContract.titleContracts(2);
            const propertyTitleContract = new web3.eth.Contract(propertyTitleBuild.abi, thirdTitleContractAddress);
            await propertyTitleContract.methods.modifyContractState("3").send({ from: fifthAccount });

            return expectRevert(
                propertyTitleContract.methods.modifyPropertySquareMeters(
                    "64"
                ).send({ from: fifthAccount }), onlyRelevantPropertyRevertMessage
            );
        });

        it('should prevent a registrar from validating a property title contract once it is set to no longer relevant', async () => {
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

        it('should prevent a property title contract from being bought if it is not for sale', async () => {
            return expectRevert(
                this.propertyTitle.sendTransaction({value: ether(sellingPriceIntegralPart + '.' + sellingPriceFractionalPart), from: thirdAccount}), 
                onlyForSaleRevertMessage
            );
        });

        it('should allow other users to buy a property title contract if it is for sale and previous owner should receive the ether', async () => {
            await this.propertyTitle.modifyContractState("2", { from: firstAccount });

            const firstAccountBalanceBeforePurchase = await web3.eth.getBalance(firstAccount);
            const propertyTitleContractSellingPrice = await this.propertyTitle.getPropertySellingPrice();
            await this.propertyTitle.sendTransaction({value: ether('0' + '.' + sellingPriceFractionalPart), from: accounts[9]});
            const newOwner = await this.propertyTitle.owner();
            assert.equal(newOwner, accounts[9], 'contract owner did not change after the transaction');

            const firstAccountBalanceAfterPurchase = await web3.eth.getBalance(firstAccount);
            assert.equal(
                Math.floor((firstAccountBalanceAfterPurchase - firstAccountBalanceBeforePurchase) / 100), 
                Math.floor(propertyTitleContractSellingPrice / 100),
                'the ether has not been transferred to the previous owner'
            );
        });

        it('should emit an event when a contract that is for sale is bought by an account', async () => {
            await this.propertyTitle.modifyContractState("2", { from: accounts[9] });

            const propertyTitleContractSellingPrice = await this.propertyTitle.getPropertySellingPrice();
            const tx = await this.propertyTitle.sendTransaction({value: ether('0' + '.' + sellingPriceFractionalPart), from: accounts[8]});
            return expectEvent(tx, 'NewPropertyTitleOwner', {
                newOwnerAddress: accounts[8],
                paidPrice: propertyTitleContractSellingPrice
            });
        });

        it('should provide a list of all pending title contracts', async () => {
            const titleContractAddress = await titleCreatingContract.titleContracts(4);
            const pendingTitleContracts = await titleCreatingContract.getPendingContracts();

            assert.equal(pendingTitleContracts.length, 1, 'wrong pending title contracts array count');
            assert.equal(pendingTitleContracts[0], titleContractAddress, 'wrong pending title contract address');
        });

        it('should provide a list of pending title contracts when filtered by offset and limit', async () => {
            const titleContractAddress = await titleCreatingContract.titleContracts(4);
            const pendingTitleContracts = await titleCreatingContract.getPendingContractsByOffsetAndLimit(0, 1);

            assert.equal(pendingTitleContracts.length, 1, 'wrong pending title contracts array count');
            assert.equal(pendingTitleContracts[0], titleContractAddress, 'wrong pending title contract address');
        });

        it('should revert if a list of pending title contracts filtered by offset and limit has offset larger than the full pending contracts list length', async () => {
            return expectRevert(
                titleCreatingContract.getPendingContractsByOffsetAndLimit(2, 4),
                offsetGreaterThanListLengthRevertMessage
            );
        });

        it('should provide a list of all active title contracts', async () => {
            const titleContractAddress = await titleCreatingContract.titleContracts(0);
            const secondTitleContractAddress = await titleCreatingContract.titleContracts(1);
            const thirdContractAddress = await titleCreatingContract.titleContracts(3);
            const activeTitleContracts = await titleCreatingContract.getActiveContracts();

            assert.equal(activeTitleContracts.length, 3, 'wrong active title contracts array count');
            assert.equal(activeTitleContracts[0], titleContractAddress, 'wrong active title contract address');
            assert.equal(activeTitleContracts[1], secondTitleContractAddress, 'wrong active title contract address');
            assert.equal(activeTitleContracts[2], thirdContractAddress, 'wrong active title contract address');
        });

        it('should provide a list of active title contracts when filtered by full address text, offset and limit', async () => {
            const titleContractAddress = await titleCreatingContract.titleContracts(0);
            const secondContractAddress = await titleCreatingContract.titleContracts(1);
            const activeTitleContracts = await titleCreatingContract.getActiveContractsByAddressAndOffsetAndLimit(street.toLowerCase(), 0, 3);

            assert.equal(activeTitleContracts.length, 2, 'wrong active title contracts array count');
            assert.equal(activeTitleContracts[0], titleContractAddress, 'wrong active title contract address');
            assert.equal(activeTitleContracts[1], secondContractAddress, 'wrong active title contract address');
        });

        it('should revert if a list of active title contracts is filtered by address and offset and limit has offset larger than the active contracts list length', async () => {
            return expectRevert(
                titleCreatingContract.getActiveContractsByAddressAndOffsetAndLimit('', 6, 9),
                offsetGreaterThanListLengthRevertMessage
            );
        });

        it('should provide a list of all title contracts that are for sale', async () => {
            const firstTitleContractAddress = await titleCreatingContract.titleContracts(0);
            const secondPropertyTitleContract = new web3.eth.Contract(propertyTitleBuild.abi, firstTitleContractAddress);
            await secondPropertyTitleContract.methods.modifyContractState("2").send({ from: sixthAccount });

            const fourthTitleContractAddress = await titleCreatingContract.titleContracts(3);
            const propertyTitleContract = new web3.eth.Contract(propertyTitleBuild.abi, fourthTitleContractAddress);
            await propertyTitleContract.methods.modifyContractState("2").send({ from: firstAccount });

            const forSaleTitleContracts = await titleCreatingContract.getForSaleContracts();

            assert.equal(forSaleTitleContracts.length, 2, 'wrong for sale title contracts array count');
            assert.equal(forSaleTitleContracts[0], firstTitleContractAddress, 'wrong for sale title contract address');
            assert.equal(forSaleTitleContracts[1], fourthTitleContractAddress, 'wrong for sale title contract address');
        });

        it('should provide a list of title contracts that are for sale when filtered by full address text, offset and limit', async () => {
            const fourthTitleContractAddress = await titleCreatingContract.titleContracts(3);
            const forSaleTitleContracts = await titleCreatingContract.getActiveContractsByAddressAndOffsetAndLimit('confident', 0, 3);

            assert.equal(forSaleTitleContracts.length, 1, 'wrong active title contracts array count');
            assert.equal(forSaleTitleContracts[0], fourthTitleContractAddress, 'wrong for sale title contract address');
        });

        it('should revert if a list of title contracts that are for sale and filtered by address and offset and limit has offset larger than the full for sale contracts list length', async () => {
            return expectRevert(
                titleCreatingContract.getForSaleContractsByAddressAndOffsetAndLimit('', 6, 9),
                offsetGreaterThanListLengthRevertMessage
            );
        });
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