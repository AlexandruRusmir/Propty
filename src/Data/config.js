const config = {
    titleDeployingContractAddress: '0x46dFc7a5aa3cD51aaa31e811c8f4c1e1271139Ca',
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