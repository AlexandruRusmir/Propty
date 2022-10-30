// var PropertyTitle = artifacts.require("PropertyTitle");
// module.exports = function(deployer) {
//     deployer.deploy(PropertyTitle, 
//         "0xA14304638C269F716B06ccFd8f0Cc5f2a9Bb79CC",
//         "0xA14304638C269F716B06ccFd8f0Cc5f2a9Bb79CC",
//         "Romania",
//         "Timisoara",
//         "Strada Excelentei",
//         "13A",
//         7,
//         100
//     );
//     // Additional contracts can be deployed here
// };

var TitleCreatingContract = artifacts.require('TitleCreatingContract');
module.exports = function(deployer) {
    deployer.deploy(TitleCreatingContract, 
        [
            "0xA14304638C269F716B06ccFd8f0Cc5f2a9Bb79CC",
            "0x4C49309510AF9DAb56d1F2464d0BDCa1EaC447f7"
        ]
    );
    // Additional contracts can be deployed here
};