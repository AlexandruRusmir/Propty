const config = {
    titleDeployingContractAddress: '0x843FFB9CB80c0De05aAd87c727dC6CaCc82c1339',
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
    }
}

module.exports = config