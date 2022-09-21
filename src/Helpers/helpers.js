export function getNumberOfTrailingCharacters (string = '') {
    let characterCount = 0;
    if (!((string[string.length - 1] >= 'a' && string[string.length - 1] <= 'z') ||
            (string[string.length - 1] >= 'A' && string[string.length - 1] <= 'Z') ||
            (string[string.length - 1] >= '0' && string[string.length - 1] <= '9'))) {
        characterCount++;
    } else {
        return 0;
    }

    for (let index = string.length - 2; index >= 0; index--) {
        if (string.charCodeAt(index) === 0) {
            characterCount++;
        } else {
            break;
        }
    }

    return characterCount;
}

export function getSellingPrice (sellingPriceIntegralPart, sellingPriceFractionalPart, sellingPriceFractionalPartLength) {
    return sellingPriceIntegralPart + sellingPriceFractionalPart * 10 ** (-sellingPriceFractionalPartLength);
}

export function getCorrespondingContractStateMessage (enumNumber) {
    switch(enumNumber) {
        case 0:
            return 'Initialized';
        case 1:
            return 'Owned';
        case 2:
            return 'For sale';
        case 3:
            return 'No longer Relevant';
    }

    return 'Not a valid contract state enum number';
}

export function getCorrespondingHousingTenure (enumNumber) {
    switch(enumNumber) {
        case 0:
            return 'Owner Occupancy';
        case 1:
            return 'Tenancy';
        case 2:
            return 'Cooperative';
        case 3:
            return 'Condomium';
        case 4:
            return 'Public Housing';
        case 5:
            return 'Squatting';
        case 6:
            return 'Land Trust';
    }

    return 'Not a valid housing tenure enum number';
}