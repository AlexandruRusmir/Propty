var TestContract = artifacts.require("TestContract");
module.exports = function(deployer) {
    deployer.deploy(TestContract, 2);
    // Additional contracts can be deployed here
};