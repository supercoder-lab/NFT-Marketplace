const jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var config = require('../config');
//var db = require('../utils/connection');
var request = require("request");




// ---------------Controllers--------

var erc1155Test = require("../controllers/erc1155Test");
var erc1155Main = require("../controllers/erc1155Main");
var ethereumTest = require("../controllers/ethereumTest");
var ethereumMain = require("../controllers/ethereumMain");
// var nftTokenMainnet =  require("../controllers/nftTokenMainnetBSC");

// ==================================





router.use(bodyParser.json());
router.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

//==============Post Status API ===================================

router.post('/eth/testnet/transfer',ethereumTest.transfer.bind(this));
router.post('/eth/testnet/getBalance',ethereumTest.getBalance.bind(this));
router.get('/eth/testnet/getTransaction/:hash',ethereumTest.getTransaction.bind(this));

router.post('/eth/mainnet/transfer',ethereumMain.transfer.bind(this));
router.post('/eth/mainnet/getBalance',ethereumMain.getBalance.bind(this));
router.get('/eth/mainnet/getTransaction/:hash',ethereumMain.getTransaction.bind(this));

// ------testnet--------------
router.post('/erc1155/getFeeForMint',erc1155Test.getFeeForMint.bind(this));
router.post('/erc1155/mint',erc1155Test.mint.bind(this));
router.post('/erc1155/mintBatch',erc1155Test.mintBatch.bind(this));

router.post('/erc1155/getTransaction', erc1155Test.getTransaction.bind(this));
router.post('/erc1155/lastGeneratedToken', erc1155Test.lastGeneratedToken.bind(this));

// router.post('/erc1155/burn', erc1155Test.burn.bind(this));
// router.post('/erc1155/butnBatch', erc1155Test.butnBatch.bind(this));
router.post('/erc1155/balanceOf', erc1155Test.balanceOf.bind(this));
router.post('/erc1155/balanceOfBatch', erc1155Test.balanceOfBatch.bind(this));


router.post('/erc1155/getFeeFortransfer',erc1155Test.getFeeFortransfer.bind(this));
router.post('/erc1155/transfer', erc1155Test.transfer.bind(this));
router.post('/erc1155/transferBatch', erc1155Test.transferBatch.bind(this));

router.post('/erc1155/getBalance', erc1155Test.getBalance.bind(this));
router.get('/erc1155/createWallet', erc1155Test.createWallet.bind(this));





 // -------------Mainnet----------------------------

router.post('/erc1155/mainnet/getFeeForMint',erc1155Main.getFeeForMint.bind(this));
router.post('/erc1155/mainnet/mint',erc1155Main.mint.bind(this));
router.post('/erc1155/mainnet/mintBatch',erc1155Main.mintBatch.bind(this));

router.post('/erc1155/mainnet/getTransaction', erc1155Main.getTransaction.bind(this));
router.post('/erc1155/mainnet/lastGeneratedToken', erc1155Main.lastGeneratedToken.bind(this));

// router.post('/erc1155/mainnet/burn', erc1155Main.burn.bind(this));
// router.post('/erc1155/mainnet/butnBatch', erc1155Main.butnBatch.bind(this));
router.post('/erc1155/mainnet/balanceOf', erc1155Main.balanceOf.bind(this));
router.post('/erc1155/mainnet/balanceOfBatch', erc1155Main.balanceOfBatch.bind(this));


router.post('/erc1155/mainnet/getFeeFortransfer',erc1155Main.getFeeFortransfer.bind(this));
router.post('/erc1155/mainnet/transfer', erc1155Main.transfer.bind(this));
router.post('/erc1155/mainnet/transferBatch', erc1155Main.transferBatch.bind(this));

router.post('/erc1155/mainnet/getBalance', erc1155Main.getBalance.bind(this));
router.get('/erc1155/mainnet/createWallet', erc1155Main.createWallet.bind(this));




router.get("/", function (request, response) {
    response.contentType("routerlication/json");
    response.end(JSON.stringify("Node is running"));
});

router.get("*", function (req, res) {
    return res.status(200).json({
        code: 404,
        data: null,
        msg: "Invalid Request {URL Not Found}",
    });
});

router.post("*", function (req, res) {
    return res.status(200).json({
        code: 404,
        data: null,
        msg: "Invalid Request {URL Not Found}",
    });
});

function ensureWebToken(req, res, next) {

    const x_access_token = req.headers['authorization'];
    if (typeof x_access_token !== undefined) {
        req.token = x_access_token;
        verifyJWT(req, res, next);
    } else {
        res.sendStatus(403);
    }
}

async function verifyJWT(req, res, next) {

    jwt.verify(req.token, config.JWT_SECRET_KEY, async function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            const _data = await jwt.decode(req.token, {
                complete: true,
                json: true
            });
            req.user = _data['payload'];
            next();
        }
    })
}
module.exports.routes = router;
