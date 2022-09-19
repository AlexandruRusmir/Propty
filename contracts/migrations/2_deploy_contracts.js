var PropertyTitle = artifacts.require("PropertyTitle");
module.exports = function(deployer) {
    deployer.deploy(PropertyTitle, 
        "0xA14304638C269F716B06ccFd8f0Cc5f2a9Bb79CC",
        "0xA14304638C269F716B06ccFd8f0Cc5f2a9Bb79CC",
        "Romania",
        "Timisoara",
        "Strada Excelentei",
        "13A"
    );
    // Additional contracts can be deployed here
};
// var TestEnum = artifacts.require("TestEnum");
// module.exports = function(deployer) {
//     deployer.deploy(TestEnum);
//     // Additional contracts can be deployed here
// };