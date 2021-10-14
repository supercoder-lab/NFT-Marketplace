//This module help to listen request
var express = require("express");
var router = express.Router();
const Web3 = require("web3");
const web3 = new Web3();
const axios = require('axios');
const Web3EthAccounts = require('web3-eth-accounts');
const ethUtil = require("ethereumjs-util");
const ethereum_address = require("ethereum-address");

web3.setProvider(
    new web3.providers.HttpProvider(
    "https://mainnet.infura.io/v3/9255e09afae94ffa9ea052ce163b8c90"
    )
);

// ---------------------------------Create Account----------------------------------------------

exports.getBalance = async (request, response) => {

    let address = request.params.address;
   try {

    const balance =  await web3.eth.getBalance(address);;
    console.log(balance);

      return response.status(200).json({
        balance:balance/1000000000000000000,
        currency:'ETH' 
      });
  } catch (e) {
    return response.status(400).json({
      msg: "something went wrong",
      e:e,
    });
  }
}


  exports.transfer = async (request, response) => {

    let fromAddress = request.body.from_address;
    let privateKey = request.body.from_private_key;
    let amount = request.body.value;
    let to_address = request.body.to_address;
    console.log(request.body);
    try {
      var bbal = await web3.eth.getBalance(fromAddress);
      bbal = bbal/10**18;
      if (bbal == "0") {
        response.status(400).json({msg:"You do not have insufficient balance"});
      }
      
      let count = await web3.eth.getTransactionCount(fromAddress);
  
      web3.eth.defaultAccount = fromAddress;
      amount = web3.utils.toWei(amount, "ether");
      console.log('amount',amount);
      let gasPrice = await web3.eth.getGasPrice();
      let gasLimit = await web3.eth.estimateGas({
        from: fromAddress,
        nonce: web3.utils.toHex(count),
        gasPrice: web3.utils.toHex(gasPrice),
        to: to_address,
        chainId: web3.utils.toHex(1),
        value:web3.utils.toHex(amount),
      });
  
      let transactionObject = {
        nonce: web3.utils.toHex(count),
        from: fromAddress,
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        to: to_address,
        value:web3.utils.toHex(amount),
        chainId: web3.utils.toHex(1),
      };
      console.log('transaction ', transactionObject)
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
//----------------------------------Send Ethers----------------------------------------------





exports.getTransaction = async (request, response) => {

    let hash = request.params.hash;
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
