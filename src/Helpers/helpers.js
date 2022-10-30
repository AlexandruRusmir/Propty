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
    return (sellingPriceIntegralPart + sellingPriceFractionalPart * 10 ** (-sellingPriceFractionalPartLength)).toFixed(4);
}

export function getCorrespondingContractStateMessage (enumNumber) {
    if (enumNumber == 0) {
        return 'Initialized';
    }

    if (enumNumber == 1) {
        return 'Owned';
    }

    if (enumNumber == 2) {
        return 'For sale';
    }

    if (enumNumber == 3) {
        return 'No longer Relevant';
    }

    return 'Not a valid contract state enum number';
}

export function getCorrespondingHousingTenure (enumNumber) {
    if (enumNumber == 0) {
        return 'Owner Occupancy';
    }

    if (enumNumber == 1) {
        return 'Tenancy';
    }

    if (enumNumber == 2) {
        return 'Cooperative';
    }

    if (enumNumber == 3) {
        return 'Condomium';
    }

    if (enumNumber == 4) {
        return 'Public Housing';
    }

    if (enumNumber == 5) {
        return 'Squatting';
    }

    if (enumNumber == 6) {
        return 'Land Trust';
    }

    return 'Not a valid housing tenure enum number';
}

export function getMessageForRequiredDocuments (boolValue) {
    switch (boolValue) {
        case 0:
            return 'Not provided';
        case 1:
            return 'Provided';
    }

    return 'Invalid bool value'; 
}