const { expectRevert, ether } = require('@openzeppelin/test-helpers');

const PropertyTitle = artifacts.require('PropertyTitle');

contract('PropertyTitle', (accounts) => {
    const onlyOwnerRevertMessage = "Only the owner of the Contract has access to this!";
    const onlyIfLegallyAllowedRevertMessage = "The property is not legally alright.";
    const onlyForSaleRevertMessage = "This property is not for sale.";

    const creator = accounts[0], owner = accounts[1], other = accounts[2];
    const country = 'Romania', city = 'Timisoara', street = 'Strada Liberatii', streetNumber = '31A', apartmentNumber = '7', squareMeters = '128';
    const sellingPriceIntegralPart = '15', sellingPriceFractionalPart = '254', sellingPriceFractionalPartLength = '3';

    describe('Deployed but not yet validated Property Title contract functionality', () => {
        before(async () => {
            this.propertyTitle = await PropertyTitle.new(
                creator,
                owner,
                country,
                city,
                street,
                streetNumber,
                apartmentNumber,
                squareMeters,
                sellingPriceIntegralPart,
                sellingPriceFractionalPart,
                sellingPriceFractionalPartLength,
                { from: creator }
            );
        });

        it('should prevent edits from being made if message sender is not owner', () => {
            return expectRevert(
                this.propertyTitle.insertPropertyDetails(
                    '1',
                    '125',
                    { from: other }
                ), onlyOwnerRevertMessage
            );
        });

        it('should prevent edits from being made if documents have not been validated', () => {
            return expectRevert(
                this.propertyTitle.modifyContractState(
                    '1',
                    { from: owner }
                ), onlyIfLegallyAllowedRevertMessage
            );
        });

        it('should not be able to receive ether if it hasn\'t been activated by registrar', () => {
            return expectRevert(
                this.propertyTitle.sendTransaction({ from: other, value: ether(sellingPriceIntegralPart + '.' + sellingPriceFractionalPart).toString() }), onlyForSaleRevertMessage
            );
        });

        it('should return false when checkIfAllDocumentsAreProvided function is called after deploy', async () => {
            const documentsProvied = await this.propertyTitle.checkIfAllDocumentsAreProvided();
            assert.equal(documentsProvied, false, 'checkIfAllDocumentsAreProvided not working properly.')
        });

        it('should calculate the selling price in wei', async () => {
            const sellingPriceInWei = await this.propertyTitle.getPropertySellingPrice();
            assert.equal(
                sellingPriceInWei.toString(), 
                ether(sellingPriceIntegralPart + '.' + sellingPriceFractionalPart).toString(), 
                'getPropertySellingPrice function not working properly.'
            );
        });

        it('should calculate the selling price in wei', async () => {
            const fullPropertyAddress = await this.propertyTitle.getFullPropertyAddress();
            assert.equal(
                fullPropertyAddress, 
                country + city + street + streetNumber, 
                'getFullPropertyAddress function not working properly.'
            );
        });

    });

    describe('Property title helper functions functionality', () => {
        before(async () => {
            this.propertyTitle = await PropertyTitle.new(
                creator,
                owner,
                country,
                city,
                street,
                streetNumber,
                apartmentNumber,
                squareMeters,
                sellingPriceIntegralPart,
                sellingPriceFractionalPart,
                sellingPriceFractionalPartLength,
                { from: creator }
            );
        });

        it('should have a function that returns whether two strings are equal or not', async () => {
            const stringsEqualityFirstComparison = await this.propertyTitle.checkStringsEquality('test string', 'test string');
            const stringsEqualitySecondComparison = await this.propertyTitle.checkStringsEquality('test string', 'test String');
            assert.equal(
                stringsEqualityFirstComparison, 
                true, 
                'checkStringsEquality function not working properly.'
            );
            assert.equal(
                stringsEqualitySecondComparison, 
                false, 
                'checkStringsEquality function not working properly.'
            );
        });
    });
});