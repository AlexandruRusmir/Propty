const errorMessages = {
    illegalCharacters: '([{}])*^%$#@~`',
    deployTitleMessages: {
        illegalCharactersInput: 'This input contains illegal characters!',
        invalidHousingTenureValue: 'The provided housing tenure value is invalid!',
        lessThan3CharactersValue: "This input's value can not be less than 3 characters long!",
        moreThan32CharactersValue: "This input's value can not be more than 32 characters long!",
        lessThan1CharacterValue: "This input's value can not be less than 1 character long!",
    }
}

module.exports = errorMessages