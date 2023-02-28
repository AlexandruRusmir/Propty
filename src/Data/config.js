const config = {
    titleDeployingContractAddress: '0x6e3CC47DF8D06311B674faa6Cb0E61776d6a10f8',
    contractState: {
        PENDING: 0,
        OWNED: 1, 
        FOR_SALE: 2, 
        NO_LONGER_RELEVANT: 3
    },
    housingTenure: {
        OWNER_OCCUPANCY: 0,
        TENANCY: 1,
        COOPERATIVE: 2,
        CONDOMIUM: 3,
        PUBLIC_HOUSING: 4,
        SQUATTING: 5,
        LAND_TRUST: 6
    },
    selectHousingTenures: [
        {
            value: '0',
            label: 'Owner Occupancy',
        },
        {
            value: '1',
            label: 'Tenancy',
        },
        {
            value: '2',
            label: 'Cooperative',
        },
        {
            value: '3',
            label: 'Condomium',
        },
        {
            value: '4',
            label: 'Public Housing',
        },
        {
            value: '5',
            label: 'Squatting',
        },
        {
            value: '6',
            label: 'Land Trust',
        },
    ],
    documentsProvidedMessage: 'Provided',
    documentsNotProvidedMessage: 'Not Provided'
}

module.exports = config