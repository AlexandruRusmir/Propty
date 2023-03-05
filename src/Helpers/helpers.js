export const getNumberOfTrailingCharacters = (string = '') => {
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

export const getSellingPriceComponentsFromString = (sellingPriceString) => {
    const splitArray = sellingPriceString.split('.');
    if (splitArray.length > 2) {
        return;
    }

    const sellingPriceIntegralPart = splitArray[0];
    let sellingPriceFractionalPart = 0;
    let sellingPriceFractionalPartLength = 0;
    if (splitArray[1]) {
        sellingPriceFractionalPart = splitArray[1];
        sellingPriceFractionalPartLength = splitArray[1].length;
    }

    return {sellingPriceIntegralPart, sellingPriceFractionalPart, sellingPriceFractionalPartLength};
}

export const getSellingPrice = (sellingPriceIntegralPart, sellingPriceFractionalPart, sellingPriceFractionalPartLength) => {
    return (sellingPriceIntegralPart + sellingPriceFractionalPart * 10 ** (-sellingPriceFractionalPartLength)).toFixed(4);
}

export const getCorrespondingContractStateMessage = (enumNumber) => {
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

export const getCorrespondingHousingTenure = (enumNumber) => {
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

export const getMessageForRequiredDocuments = (boolValue) => {
    switch (boolValue) {
        case 0:
            return 'Not provided';
        case 1:
            return 'Provided';
    }

    return 'Invalid bool value'; 
}

export const checkIfNumberIsValid = (inputValue) => {
    if (inputValue.length === 0) {
        return true;
    }
    if (inputValue.length > 31) {
        return false;
    }
    const splitArray = inputValue.split('.');
    if (!splitArray[0].length) {
        return false;
    }
    if (splitArray.length > 2) {
        return false;
    }
    if (!((inputValue[inputValue.length -1] >= '0' && inputValue[inputValue.length -1] <= '9') || inputValue[inputValue.length - 1] === '.')) {
        return false;
    }

    return true;
};

export const getApartmentNumberToDisplay = (apartmentNumber) => {
    if (apartmentNumber == 0) {
        return '-';
    }
    return apartmentNumber;
}

export const unixToDateString = (unixTimestamp, timestampFormat = 'ro-RO') => {
    const millisecondsTime = unixTimestamp * 1000;
    const dateObject = new Date(millisecondsTime);

    return dateObject.toLocaleString(timestampFormat);
}