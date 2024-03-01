console.log("ETH test!!!!!!!!!");

var Web3 = require('web3');
var web3 = new Web3('http://localhost:8814');


////////////// create //////////////////////////

var bytecode = "608060405234801561001057600080fd5b506103f7806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063ae327cae1461003b578063c54e81ca14610059575b600080fd5b610043610063565b6040516100509190610145565b60405180910390f35b610061610087565b005b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000604051610095906100f7565b604051809103906000f0801580156100b1573d6000803e3d6000fd5b509050806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6102618061016183390190565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061012f82610104565b9050919050565b61013f81610124565b82525050565b600060208201905061015a6000830184610136565b9291505056fe608060405234801561001057600080fd5b506064600081905550610239806100286000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80633fa4f2451461004657806360fe47b114610064578063767800de14610080575b600080fd5b61004e61009e565b60405161005b919061012e565b60405180910390f35b61007e6004803603810190610079919061017a565b6100a4565b005b6100886100ef565b60405161009591906101e8565b60405180910390f35b60005481565b8060008190555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000819050919050565b61012881610115565b82525050565b6000602082019050610143600083018461011f565b92915050565b600080fd5b61015781610115565b811461016257600080fd5b50565b6000813590506101748161014e565b92915050565b6000602082840312156101905761018f610149565b5b600061019e84828501610165565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006101d2826101a7565b9050919050565b6101e2816101c7565b82525050565b60006020820190506101fd60008301846101d9565b9291505056fea26469706673582212201c53d407a71d25addacb268153088ef6ed29536ddbb617a7b21a2a9f5088b76c64736f6c63430008120033a264697066735822122067784cf4f75f045ff2d8f19ad5055b748a709bedd450422791b4d6fbba4c2aac64736f6c63430008120033";
web3.eth.estimateGas({code: bytecode})
.then(console.log);

var abi = JSON.parse('[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[],\"name\":\"create1\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"create1_addr\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]');
var myContract = new web3.eth.Contract(abi);


myContract.deploy({
    data: bytecode
})
.send({
    from: '0x5962974eeb0b17b43edabfc9b747839317aa852f',
    gas: 990000,
    gasPrice: '3000000000000'
}, function(error, transactionHash){ console.log(transactionHash); })
.on('error', function(error){ console.log(error); })
//.on('transactionHash', function(transactionHash){ console.log(transactionHash); })
// .on('receipt', function(receipt){
//    console.log(receipt.contractAddress) // 收据中包含了新的合约地址
// })
//.on('confirmation', function(confirmationNumber, receipt){ console.log(receipt); })
.then(function(newContractInstance){
    console.log(newContractInstance.options.address) // 新地址的合约实例
});