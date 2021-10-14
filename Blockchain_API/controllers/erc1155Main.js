var express = require("express");
var router = express.Router();
const Web3 = require("web3");
const web3 = new Web3();
const ethUtil = require("ethereumjs-util");
const ethereum_address = require("ethereum-address");

web3.setProvider(
  new web3.providers.HttpProvider(
    "https://mainnet.infura.io/v3/9255e09afae94ffa9ea052ce163b8c90"
  )
);


var abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenBurn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256[]","name":"id","type":"uint256[]"},{"internalType":"uint256[]","name":"amount","type":"uint256[]"}],"name":"TokenBurnBatch","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"newItemId","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"metadata","type":"string"},{"internalType":"string","name":"name","type":"string"}],"name":"TokenMint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256[]","name":"newItemId","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"string[]","name":"metadata","type":"string[]"},{"internalType":"string[]","name":"name","type":"string[]"}],"name":"TokenMintBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"newItemId","type":"uint256"}],"name":"getTokenMetadataHash","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"newItemId","type":"uint256"}],"name":"getTokenName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastGeneratedToken","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];


exports.getFeeForMint = async (request, response) => {

  let fromAddress = request.body.from_address;
  let privateKey = request.body.from_private_key;
  let to_address = request.body.to_address;
  let hash = request.body.MetaDataHash;
  let TokenName = request.body.TokenName;
  let TokenId = request.body.TokenId;
  let totalSupply = request.body.totalSupply;
  let contractAddress = request.body.contract_address;


  try {
    const bbal = await web3.eth.getBalance(fromAddress);

    // if (bbal == "0") {
    //   response.status(400).json({ msg: "You do not have insufficient balance" });
    // }

    const contract = await new web3.eth.Contract(abi, contractAddress);
    let count = await web3.eth.getTransactionCount(fromAddress);

    web3.eth.defaultAccount = fromAddress;

    // const tx_builder = await contract.methods.TokenMint(to_address,TokenId, totalSupply, hash,TokenName);

    // let encoded_tx = tx_builder.encodeABI();

    let gasPrice = await web3.eth.getGasPrice();
    let gasLimit = 270000;    
    // let gasLimit = await web3.eth.estimateGas({
    //   from: fromAddress,
    //   nonce: web3.utils.toHex(count),
    //   gasPrice: web3.utils.toHex(gasPrice),
    //   to: contractAddress,
    //   data: encoded_tx,
    //   chainId: web3.utils.toHex(1),
    // });

    console.log('gasPrice', gasPrice);
    console.log('gasLimit', gasLimit);

    // let transactionObject = {
    //   nonce: web3.utils.toHex(count),
    //   from: fromAddress,
    //   gasPrice: web3.utils.toHex(gasPrice),
    //   gasLimit: web3.utils.toHex(gasLimit),
    //   to: contractAddress,
    //   data: encoded_tx,
    //   chainId: web3.utils.toHex(1),
    // };

    var transactionFee = (gasPrice*gasLimit)/10**18;
    return response.status(200).json({
      tnx_fee:transactionFee
    });

  }catch (e) {
    return response.status(400).json({
      msg: "invalid transaction signing",
      e,
      statuscode: 4,
    });
  }
};


exports.mint = async (request, response) => {

  let fromAddress = request.body.from_address;
  let privateKey = request.body.from_private_key;
  let to_address = request.body.to_address;
  let hash = request.body.MetaDataHash;
  let TokenName = request.body.TokenName;
  let TokenId = request.body.TokenId;
  let totalSupply = request.body.totalSupply;
  let contractAddress = request.body.contract_address;


  try {
    const bbal = await web3.eth.getBalance(fromAddress);

    if (bbal == "0") {
      response.status(400).json({ msg: "You do not have insufficient balance" });
    }

    const contract = await new web3.eth.Contract(abi, contractAddress);
    let count = await web3.eth.getTransactionCount(fromAddress);

    web3.eth.defaultAccount = fromAddress;

    const tx_builder = await contract.methods.TokenMint(to_address,TokenId, totalSupply, hash,TokenName);

    let encoded_tx = tx_builder.encodeABI();

    let gasPrice = await web3.eth.getGasPrice();
    // let gasLimit = 500000;    
    let gasLimit = await web3.eth.estimateGas({
      from: fromAddress,
      nonce: web3.utils.toHex(count),
      gasPrice: web3.utils.toHex(gasPrice),
      to: contractAddress,
      data: encoded_tx,
      chainId: web3.utils.toHex(1),
    });

    console.log('gasPrice', gasPrice);
    console.log('gasLimit', gasLimit);

    let transactionObject = {
      nonce: web3.utils.toHex(count),
      from: fromAddress,
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(gasLimit),
      to: contractAddress,
      data: encoded_tx,
      chainId: web3.utils.toHex(1),
    };

    var transactionFee = (gasPrice*gasLimit)/10**18;

    // console.log('transaction ', transactionObject)
    web3.eth.accounts
      .signTransaction(transactionObject, privateKey)
      .then(async (signedTx) => {
        web3.eth.sendSignedTransaction(signedTx.rawTransaction, async function (
          err,
          hash
        ) {
          if (!err) {
            console.log("hash is : ", hash);
            return response.status(200).json({
              msg: "Transaction is in mining state. For more info please watch transaction hash on ropsten explorer",
              hash: hash,
              tnx_fee:transactionFee
            });
          } else {
            return response.status(400).json({
              msg: `Bad Request ${err}`,
            });
          }
        });
      })
      .catch((err) => {
        return response.status(400).json({
          msg: `Your contract parameters are not correct:  ${err}`,
        });
      });
  } catch (e) {
    return response.status(400).json({
      msg: "invalid transaction signing",
      e,
      statuscode: 4,
    });
  }
}





exports.mintBatch = async (request, response) => {

  let fromAddress = request.body.from_address;
  let privateKey = request.body.from_private_key;
  let hash = request.body.MetaDataHash;
  let totalSupply = request.body.totalSupply; //in array
  let contractAddress = request.body.contract_address;


  try {
    const bbal = await web3.eth.getBalance(fromAddress);

    if (bbal == "0") {
      response.status(400).json({ msg: "You do not have insufficient balance" });
    }

    const contract = await new web3.eth.Contract(abi, contractAddress);
    let count = await web3.eth.getTransactionCount(fromAddress);

    web3.eth.defaultAccount = fromAddress;

    const tx_builder = await contract.methods.TokenMintBatch(fromAddress, totalSupply, hash);

    let encoded_tx = tx_builder.encodeABI();

    let gasPrice = await web3.eth.getGasPrice();
    // let gasLimit = 500000;    
    let gasLimit = await web3.eth.estimateGas({
      from: fromAddress,
      nonce: web3.utils.toHex(count),
      gasPrice: web3.utils.toHex(gasPrice),
      to: contractAddress,
      data: encoded_tx,
      chainId: web3.utils.toHex(1),
    });

    console.log('gasLimit', gasLimit);

    let transactionObject = {
      nonce: web3.utils.toHex(count),
      from: fromAddress,
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(gasLimit),
      to: contractAddress,
      data: encoded_tx,
      chainId: web3.utils.toHex(1),
    };

    // console.log('transaction ', transactionObject)
    web3.eth.accounts
      .signTransaction(transactionObject, privateKey)
      .then(async (signedTx) => {
        web3.eth.sendSignedTransaction(signedTx.rawTransaction, async function (
          err,
          hash
        ) {
          if (!err) {
            console.log("hash is : ", hash);
            return response.status(200).json({
              msg: "Transaction is in mining state. For more info please watch transaction hash on ropsten explorer",
              hash: hash
            });
          } else {
            return response.status(400).json({
              msg: `Bad Request ${err}`,
            });
          }
        });
      })
      .catch((err) => {
        return response.status(400).json({
          msg: `Your contract parameters are not correct:  ${err}`,
        });
      });
  } catch (e) {
    return response.status(400).json({
      msg: "invalid transaction signing",
      e,
      statuscode: 4,
    });
  }
}





exports.getFeeFortransfer = async (request, response) => {

  let fromAddress = request.body.from_address;
  let privateKey = request.body.from_private_key;
  let tokenId = request.body.tokenId;
  let amount = request.body.amount;
  let contractAddress = request.body.contract_address;
  let to_address = request.body.to_address;
  let token_owner_address = request.body.token_owner_address;



  try {
    const bbal = await web3.eth.getBalance(fromAddress);

    // if (bbal == "0") {
    //   response.status(400).json("You do not have insufficient balance");
    // }

    const contract = await new web3.eth.Contract(abi, contractAddress);
    let count = await web3.eth.getTransactionCount(fromAddress);

    web3.eth.defaultAccount = fromAddress;

    // const tx_builder = await contract.methods.safeTransferFrom(token_owner_address, to_address, tokenId, amount, '0x7B502C3A1F48C8609AE212CDFB639DEE39673F5E');

    // let encoded_tx = tx_builder.encodeABI();

    let gasPrice = await web3.eth.getGasPrice();
    let gasLimit = 58823;    
    // let gasLimit = await web3.eth.estimateGas({
    //   from: fromAddress,
    //   nonce: web3.utils.toHex(count),
    //   gasPrice: web3.utils.toHex(gasPrice),
    //   to: contractAddress,
    //   data: encoded_tx,
    //   chainId: web3.utils.toHex(1),
    // });

    console.log('gasPrice', gasPrice);
    console.log('gasLimit', gasLimit);

    // let transactionObject = {
    //   nonce: web3.utils.toHex(count),
    //   from: fromAddress,
    //   gasPrice: web3.utils.toHex(gasPrice),
    //   gasLimit: web3.utils.toHex(gasLimit),
    //   to: contractAddress,
    //   data: encoded_tx,
    //   chainId: web3.utils.toHex(1),
    // };

    var transactionFee = (gasPrice*gasLimit)/10**18;
    return response.status(200).json({
      tnx_fee:transactionFee
    });

  } catch (e) {
    return response.status(400).json({
      msg: "invalid transaction signing",
      e,
      statuscode: 4,
    });
  }
}

exports.transfer = async (request, response) => {

  let fromAddress = request.body.from_address;
  let privateKey = request.body.from_private_key;
  let tokenId = request.body.tokenId;
  let amount = request.body.amount;
  let contractAddress = request.body.contract_address;
  let to_address = request.body.to_address;
  let token_owner_address = request.body.token_owner_address;



  try {
    const bbal = await web3.eth.getBalance(fromAddress);

    if (bbal == "0") {
      response.status(400).json("You do not have insufficient balance");
    }

    const contract = await new web3.eth.Contract(abi, contractAddress);
    let count = await web3.eth.getTransactionCount(fromAddress);

    web3.eth.defaultAccount = fromAddress;

    const tx_builder = await contract.methods.safeTransferFrom(token_owner_address, to_address, tokenId, amount, '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2');

    let encoded_tx = tx_builder.encodeABI();

    let gasPrice = await web3.eth.getGasPrice();
    // let gasLimit = 500000;    
    let gasLimit = await web3.eth.estimateGas({
      from: fromAddress,
      nonce: web3.utils.toHex(count),
      gasPrice: web3.utils.toHex(gasPrice),
      to: contractAddress,
      data: encoded_tx,
      chainId: web3.utils.toHex(1),
    });

    console.log('gasLimit', gasLimit);

    let transactionObject = {
      nonce: web3.utils.toHex(count),
      from: fromAddress,
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(gasLimit),
      to: contractAddress,
      data: encoded_tx,
      chainId: web3.utils.toHex(1),
    };
    // console.log('transaction ', transactionObject)
    web3.eth.accounts
      .signTransaction(transactionObject, privateKey)
      .then((signedTx) => {
        web3.eth.sendSignedTransaction(signedTx.rawTransaction, async function (
          err,
          hash
        ) {
          if (!err) {
            console.log("hash is : ", hash);
            return response.status(200).json({
              msg: "Transaction is in mining state. For more info please watch transaction hash on ropsten explorer",
              hash: hash,
            });
          } else {
            return response.status(400).json({
              msg: `Bad Request ${err}`,
            });
          }
        });
      })
      .catch((err) => {
        return response.status(400).json({
          msg: `Your contract parameters are not correct:  ${err}`,
        });
      });
  } catch (e) {
    return response.status(400).json({
      msg: "invalid transaction signing",
      e,
      statuscode: 4,
    });
  }
}



exports.transferBatch = async (request, response) => {

  let fromAddress = request.body.from_address;
  let privateKey = request.body.from_private_key;
  let tokenId = request.body.tokenId;//in array
  let amount = request.body.amount;//in array
  let contractAddress = request.body.contract_address;
  let to_address = request.body.to_address;



  try {
    const bbal = await web3.eth.getBalance(fromAddress);

    if (bbal == "0") {
      response.status(400).json("You do not have insufficient balance");
    }

    const contract = await new web3.eth.Contract(abi, contractAddress);
    let count = await web3.eth.getTransactionCount(fromAddress);

    web3.eth.defaultAccount = fromAddress;

    const tx_builder = await contract.methods.safeBatchTransferFrom(fromAddress, to_address, tokenId, amount, '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2');

    let encoded_tx = tx_builder.encodeABI();

    let gasPrice = await web3.eth.getGasPrice();
    // let gasLimit = 500000;    
    let gasLimit = await web3.eth.estimateGas({
      from: fromAddress,
      nonce: web3.utils.toHex(count),
      gasPrice: web3.utils.toHex(gasPrice),
      to: contractAddress,
      data: encoded_tx,
      chainId: web3.utils.toHex(1),
    });

    console.log('gasLimit', gasLimit);

    let transactionObject = {
      nonce: web3.utils.toHex(count),
      from: fromAddress,
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(gasLimit),
      to: contractAddress,
      data: encoded_tx,
      chainId: web3.utils.toHex(1),
    };
    // console.log('transaction ', transactionObject)
    web3.eth.accounts
      .signTransaction(transactionObject, privateKey)
      .then((signedTx) => {
        web3.eth.sendSignedTransaction(signedTx.rawTransaction, async function (
          err,
          hash
        ) {
          if (!err) {
            console.log("hash is : ", hash);
            return response.status(200).json({
              msg: "Transaction is in mining state. For more info please watch transaction hash on ropsten explorer",
              hash: hash,
            });
          } else {
            return response.status(400).json({
              msg: `Bad Request ${err}`,
            });
          }
        });
      })
      .catch((err) => {
        return response.status(400).json({
          msg: `Your contract parameters are not correct:  ${err}`,
        });
      });
  } catch (e) {
    return response.status(400).json({
      msg: "invalid transaction signing",
      e,
      statuscode: 4,
    });
  }
}




exports.balanceOf = async (request, response) => {
  let tokenId = request.body.tokenId;
  let address = request.body.address;
  let contractAddress = request.body.contract_address;


  try {

    const contract = await new web3.eth.Contract(abi, contractAddress);
    const resData = await contract.methods.balanceOf(address, tokenId).call();

    console.log(resData);
    return response.status(200).json({
      Balance: resData
    });
  } catch (e) {
    return response.status(400).json({
      msg: "invalid transaction signing",
      e: e,
      statuscode: 4,
    });
  }
}


exports.balanceOfBatch = async (request, response) => {
  let tokenId = request.body.tokenId;//in array
  let from_address = request.body.address;//in array
  let contractAddress = request.body.contract_address;


  try {

    const contract = await new web3.eth.Contract(abi, contractAddress);
    const BalanceArr = await contract.methods.balanceOfBatch(from_address, tokenId).call();

    let resData = []
    for (var i = 0; i < tokenId.length; i++) {
      var Address = from_address[i];
      var TokenId = tokenId[i];
      var Balance = BalanceArr[i];

      resData[i] = {
        Address: Address,
        TokenId: TokenId,
        Balance: Balance
      }
    }

    return response.status(200).json({
      TokenBalance: resData
    });
  } catch (e) {
    return response.status(400).json({
      msg: "invalid transaction signing",
      e: e,
      statuscode: 4,
    });
  }
}




exports.lastGeneratedToken = async (request, response) => {
  let contractAddress = request.body.contract_address;


  try {

    const contract = await new web3.eth.Contract(abi, contractAddress);
    const TokenIds = await contract.methods.lastGeneratedToken().call();

    return response.status(200).json({
      TokenIds: TokenIds
    });
  } catch (e) {
    return response.status(400).json({
      msg: "invalid transaction signing",
      e: e,
      statuscode: 4,
    });
  }
}
exports.approve = async (request, response) => {

  let fromAddress = request.body.from_address;
  let privateKey = request.body.from_private_key;
  let tokenId = request.body.tokenId;
  let contractAddress = request.body.contract_address;
  let to_address = request.body.to_address;



  try {
    const bbal = await web3.eth.getBalance(fromAddress);

    if (bbal == "0") {
      response.status(400).json("You do not have insufficient balance");
    }

    const contract = await new web3.eth.Contract(abi, contractAddress);
    let count = await web3.eth.getTransactionCount(fromAddress);

    web3.eth.defaultAccount = fromAddress;

    const tx_builder = await contract.methods.approve(to_address, tokenId);

    let encoded_tx = tx_builder.encodeABI();

    let gasPrice = await web3.eth.getGasPrice();
    let gasLimit = 500000;
    let transactionObject = {
      nonce: web3.utils.toHex(count),
      from: fromAddress,
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(gasLimit),
      to: contractAddress,
      data: encoded_tx,
      chainId: web3.utils.toHex(1),
    };
    // console.log('transaction ', transactionObject)
    web3.eth.accounts
      .signTransaction(transactionObject, privateKey)
      .then((signedTx) => {
        web3.eth.sendSignedTransaction(signedTx.rawTransaction, async function (
          err,
          hash
        ) {
          if (!err) {
            console.log("hash is : ", hash);
            return response.status(200).json({
              msg: "Transaction is in mining state. For more info please watch transaction hash on ropsten explorer",
              hash: hash,
            });
          } else {
            return response.status(400).json({
              msg: `Bad Request ${err}`,
            });
          }
        });
      })
      .catch((err) => {
        return response.status(400).json({
          msg: `Your contract parameters are not correct:  ${err}`,
        });
      });
  } catch (e) {
    return response.status(400).json({
      msg: "invalid transaction signing",
      e,
      statuscode: 4,
    });
  }
}





exports.getApprove = async (request, response) => {
  let tokenId = request.body.tokenId;
  let contractAddress = request.body.contract_address;


  try {

    const contract = await new web3.eth.Contract(abi, contractAddress);
    const resData = await contract.methods.getApproved(tokenId).call();

    console.log(resData);
    return response.status(200).json({
      res: resData
    });
  } catch (e) {
    return response.status(400).json({
      msg: "invalid transaction signing",
      e: e,
      statuscode: 4,
    });
  }
}






exports.createWallet = async (request, response) => {
  // const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
  // const loader = setupLoader({ provider: web3 }).web3;

  try {

    const account = web3.eth.accounts.create();
    console.log(account);

    return response.status(200).json({
      wallet: account
    });
  } catch (e) {
    return response.status(400).json({
      msg: "something went wrong",
      e: e,
    });
  }
}


exports.getBalance = async (request, response) => {

  let address = request.body.address;
  try {

    const balance = await web3.eth.getBalance(address);;
    console.log(balance);

    return response.status(200).json({
      balance: balance / 1000000000000000000,
      currency: 'ETH'
    });
  } catch (e) {
    return response.status(400).json({
      msg: "something went wrong",
      e: e,
    });
  }
}



exports.getTransaction = async (request, response) => {

  let hash = request.body.trx_hash;
  try {
    var data = await web3.eth.getTransactionReceipt(hash);

    return response.status(200).json({
      blockNumber: data.blockNumber,
      status: data.status,
      transactionIndex: data.transactionIndex
    });
  } catch (er) {
    return response.status(200).json({
      msg:"Something went wrong! please try again.",
      status:false,
      error:er
    });
  }
}