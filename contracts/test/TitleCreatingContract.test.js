const { expectRevert, ether } = require('@openzeppelin/test-helpers');

const TitleCreatingContract = artifacts.require('TitleCreatingContract');

contract('TitleCreatingContract', (accounts) => {
    const onlyCreatorRevertMessage = "Only the creator of the Contract has access to this!";
    const onlyOwnerRevertMessage = "Only the owner of the Contract has access to this!";
    const onlyIfLegallyAllowedRevertMessage = "The property is not legally alright.";
    const onlyForSaleRevertMessage = "This property is not for sale.";
    const onlyTitleCreatingOwnerRevertMessage = "Only one of the owners has access to this functionality.";

    const firstAccount = accounts[0], secondAccount = accounts[1], thirdAccount = accounts[2], fourthAccount = accounts[3], fifthAccount = accounts[4], sixthAccount = accounts[5];
    const country = 'Romania', city = 'Timisoara', street = 'Strada Liberatii', streetNumber = '31A', apartmentNumber = '7', squareMeters = '128';
    const sellingPriceIntegralPart = '15', sellingPriceFractionalPart = '254', sellingPriceFractionalPartLength = '3';

    describe('Title creating contract functionality', () => {
        before(async () => {
            this.titleCreatingContract = await TitleCreatingContract.new(
                [
                    firstAccount,
                    secondAccount
                ]
            );
        });

        it('should recognize whether an account has owner rights or not', async () => {
            const titleCreatingContractFirstOwner = await this.titleCreatingContract.owners(0);
            const titleCreatingContractSecondOwner = await this.titleCreatingContract.owners(1);
            const firstAccountIsOwner = await this.titleCreatingContract.isOwner(firstAccount);
            const secondAccountIsOwner = await this.titleCreatingContract.isOwner(secondAccount);
            const thirdAccountIsOwner = await this.titleCreatingContract.isOwner(thirdAccount);

            assert.equal(titleCreatingContractFirstOwner, firstAccount, 'wrong owners array assignment');
            assert.equal(titleCreatingContractSecondOwner, secondAccount, 'wrong owners array assignment');
            assert.equal(firstAccountIsOwner, true, 'wrong first account owner status');
            assert.equal(secondAccountIsOwner, true, 'wrong second account owner status');
            assert.equal(thirdAccountIsOwner, false, 'wrong third account owner status');
        });

        it('should prevent anyone who is not an owner from adding registrars', async () => {
            return expectRevert(
                this.titleCreatingContract.addRegistrars(
                    [
                        fourthAccount
                    ],
                    { from: thirdAccount }
                ), onlyTitleCreatingOwnerRevertMessage
            );
        });

        it('should allow owners to add registrars and the changes should be seen in the contract state', async () => {
            await this.titleCreatingContract.addRegistrars(
                    [
                        thirdAccount,
                        fourthAccount
                    ],
                    { from: firstAccount }
                );
            
            const titleCreatingContractFirstRegistrar = await this.titleCreatingContract.registrars(0);
            const titleCreatingContractSecondRegistrar = await this.titleCreatingContract.registrars(1);
            const thirdAccountIsRegistrar = await this.titleCreatingContract.isRegistrar(thirdAccount);
            const fourthAccountIsRegistrar = await this.titleCreatingContract.isRegistrar(fourthAccount);
            const firstAccountIsRegistrar = await this.titleCreatingContract.isRegistrar(firstAccount);

            assert.equal(titleCreatingContractFirstRegistrar, thirdAccount, 'wrong registrars array assignment');
            assert.equal(titleCreatingContractSecondRegistrar, fourthAccount, 'wrong registrars array assignment');
            assert.equal(thirdAccountIsRegistrar, true, 'wrong third account registrar status');
            assert.equal(fourthAccountIsRegistrar, true, 'wrong fourth account registrar status');
            assert.equal(firstAccountIsRegistrar, false, 'wrong first account registrar status');
        });

        it('should allow owners to remove the registrar role from accounts', async () => {
            await this.titleCreatingContract.removeRegistrarRole(
                    [
                        thirdAccount,
                        fourthAccount
                    ],
                    { from: firstAccount }
                );
            
            const titleCreatingContractFirstRegistrar = await this.titleCreatingContract.registrars(0);
            const titleCreatingContractSecondRegistrar = await this.titleCreatingContract.registrars(1);
            const thirdAccountIsRegistrar = await this.titleCreatingContract.isRegistrar(thirdAccount);
            const fourthAccountIsRegistrar = await this.titleCreatingContract.isRegistrar(fourthAccount);

            assert.equal(titleCreatingContractFirstRegistrar, thirdAccount, 'wrong registrars array assignment');
            assert.equal(titleCreatingContractSecondRegistrar, fourthAccount, 'wrong registrars array assignment');
            assert.equal(thirdAccountIsRegistrar, false, 'wrong third account registrar status');
            assert.equal(fourthAccountIsRegistrar, false, 'wrong fourth account registrar status');
        });

        it('should allow owners to reactivate the registrar role for accounts', async () => {
            await this.titleCreatingContract.reactivateRegistrarRole(
                    [
                        thirdAccount,
                        fourthAccount
                    ],
                    { from: firstAccount }
                );
            
            const titleCreatingContractFirstRegistrar = await this.titleCreatingContract.registrars(0);
            const titleCreatingContractSecondRegistrar = await this.titleCreatingContract.registrars(1);
            const thirdAccountIsRegistrar = await this.titleCreatingContract.isRegistrar(thirdAccount);
            const fourthAccountIsRegistrar = await this.titleCreatingContract.isRegistrar(fourthAccount);

            assert.equal(titleCreatingContractFirstRegistrar, thirdAccount, 'wrong registrars array assignment');
            assert.equal(titleCreatingContractSecondRegistrar, fourthAccount, 'wrong registrars array assignment');
            assert.equal(thirdAccountIsRegistrar, true, 'wrong third account registrar status');
            assert.equal(fourthAccountIsRegistrar, true, 'wrong fourth account registrar status');
        });
    });

    describe('Title creating contract helper functions functionality', () => {
        before(async () => {
            this.titleCreatingContract = await TitleCreatingContract.new(
                [
                    firstAccount,
                    secondAccount
                ]
            );
        });

        it('should have a function that returns whether a string contains a substring', async () => {
            const firstStringInclusionResult = await this.titleCreatingContract.stringContains('This is the string to search in', 'string to search');
            const secondStringInclusionResult = await this.titleCreatingContract.stringContains('This is the string to search in', 'strink');
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
            const lowerCaseString = await this.titleCreatingContract.toLower('THis is My ID');
            assert.equal(
                lowerCaseString, 
                'this is my id', 
                'toLower function not working properly.'
            );
        });
    });
});