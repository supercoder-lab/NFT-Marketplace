
var fetch = require('node-fetch');
const config = require('../config');
var ipfsCompress = require('./ipfsCompress/imagecompress');
const fs = require('fs');
var nodemailer = require('nodemailer')
var speakeasy = require('speakeasy');
/* stripe includes*/
const express = require("express");
const jwt = require('jsonwebtoken');
const app = express();
require("dotenv").config();

const bodyParser = require("body-parser");
const cors = require("cors");
var FormData = require('form-data');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
/*-------------------*/

const marketplaceQueries = require("../services/marketplaceQueries");

const mysql = require('mysql2');
// create the pool
const pool = mysql.createPool({ host: config.mysqlHost, user: config.user, password: config.password, database: config.database, port: config.mysqlPort });
// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();
// query database using promises

exports.getCategoryById = async (db, req, res) => {

    var item_category_id = req.body.item_category_id;
    var limit = req.body.limit;


    var qry = "Select i.id as item_id,ie.id as item_edition_id,i.image,i.file_type,case when length(i.name)>=30 then concat(left(i.name,30),'...')  else i.name end as name,i.name as item_fullname,i.price,i.description from item_edition as ie left join item as i on i.id=ie.item_id where ie.is_sold=0 and ie.id in (select min(id) from item_edition where is_sold=0 and (expiry_date >= now() or expiry_date is null) group by item_id) ";

    if (item_category_id > 0) {
        qry = qry + ` and i.item_category_id=${item_category_id}`
    }
    qry = qry + " order by rand() ";
    if (limit > 0) {
        qry = qry + ` limit ${limit}`
    }

    //console.log(qry);       
    await db.query(qry, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Category Item Detail",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}

exports.twoAuthenticationVerify = async (db, req, res) => {

    var user_id = req.body.user_id;
    var userToken = req.body.SecretKey;
    var enableTwoFactor = req.body.enableTwoFactor;
    await db.query(marketplaceQueries.getUserAuth, [user_id], async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }

        var abc = data[0].googleAuthCode;
        var tokenValidates = speakeasy.totp.verify({
            secret: abc,
            encoding: 'base32',
            token: userToken,
            window: 0
        });

        if (tokenValidates) {
            await db.query(marketplaceQueries.updateUsersAuth, [enableTwoFactor, user_id]);

            res.status(200).send({
                success: true,
                msg: "Result",
                response: tokenValidates
            });

        } else {
            res.status(400).send({
                success: false,
                msg: "Token misMatch"
            });
        }

    });
}


exports.updatePayoutAddress = async (db, req, res) => {
    var user_id = req.body.user_id;
    var payout_address = req.body.payout_address;

    var updateData = {
        "payout_address": payout_address
    }

    await db.query(marketplaceQueries.updatePayoutAddress, [updateData, user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Payout address updated!!",

            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}


exports.getPayoutAddress = async (db, req, res) => {

    var user_id = req.body.user_id

    await db.query(marketplaceQueries.getPayout_address, [user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        //console.log(data);
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Payout Address!!",
                response: data[0]
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}

exports.setPayoutAddress = async (db, req, res) => {

    var user_id = req.body.user_id
    var address = req.body.address
    var arr = {
        'public' : address,
        'user_id' : user_id
    }
    console.log(arr);
    await db.query(marketplaceQueries.setPayoutAddress, arr, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }else{
            res.status(200).send({
                success: true,
                msg: "Payout Address!!"
            });
        }
    });
}

exports.itemView = async (db, req, res) => {
    var user_id = req.body.user_id;
    var item_edition_id = req.body.item_edition_id;

    if (!user_id) {
        res.status(400).send({
            success: false,
            msg: "user_id required!!"
        });
    }
    if (!item_edition_id) {
        res.status(400).send({
            success: false,
            msg: "item_edition_id required!!"
        });
    }
    var views = {
        "user_id": user_id,
        'item_edition_id': item_edition_id
    }

    await db.query(marketplaceQueries.itemView, [views], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Insert item view successfully!!",
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Error in insertion!!"
            });
        }
    });
}

exports.getItemLikeCount = async (db, req, res) => {

    var item_edition_id = req.body.item_edition_id
    var user_id = req.body.user_id

    await db.query(marketplaceQueries.getItemLikeCount, [user_id, item_edition_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Item like count",
                response: data[0]
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}

exports.itemDetails = async (db, req, res) => {
    var item_edition_id = req.body.item_edition_id;
    var user_id = req.body.user_id;
    if (!user_id) {
        user_id = 0;
    }
    //console.log(user_id);
    await db.query(marketplaceQueries.itemdetail, [item_edition_id, user_id, item_edition_id, item_edition_id], async function (error, data) {

        //console.log(data);
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }


        await db.query(marketplaceQueries.getWalletDetail, [user_id], async function (error, walletData) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured in wallet detail!!",
                    error
                });
            }
            
            await db.query(marketplaceQueries.getImages, [item_edition_id,item_edition_id], async function (error, imageData) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured in ImageData!!",
                        error
                    });
                }

            const response2 = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/buy', {
                method: 'GET', headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const usdPrice = await response2.json();


            if (data.length > 0) {
                itemcategoryid = data[0].item_category_id;
            }
            else {
                itemcategoryid = 0;
            }
            await db.query(marketplaceQueries.itemCategory, [itemcategoryid, item_edition_id], function (error, data1) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured!!",
                        error
                    });
                }
                if (data.length > 0) {
                    var wallet_balance_usd = 0;
                    var wallet_balance_eth = 0;
                    if (walletData.length > 0) {
                        wallet_balance_usd = walletData[0].balance;
                        wallet_balance_eth = walletData[0].balance / usdPrice['data']['amount'];

                    }

                    var extrafee = 3;
                    res.status(200).send({
                        success: true,
                        price_eth: (data[0].price / usdPrice['data']['amount']).toFixed(6),
                        wallet_balance_usd: wallet_balance_usd.toFixed(2),
                        wallet_balance_eth: wallet_balance_eth.toFixed(6),
                        response: data[0],
                        data: data1
,                        imageData : imageData

                    });

                }
                else {
                    return res.status(400).send({
                        success: false,
                        msg: "No Data"
                    });
                }
            });
        });
    });
});
}

exports.likeItem = async (
    db, req, res) => {
    //required fields
    var user_id = req.body.user_id;
    var item_edition_id = req.body.item_edition_id;
    if (!user_id) {
        return res.status(400).send({
            success: false,
            msg: "user_id required!!"
        });
    }

    if (!item_edition_id) {
        return res.status(400).send({
            success: false,
            msg: "item_edition_id required!!"
        });
    }

    var itemlike = {
        "item_edition_id": item_edition_id,
        "user_id": user_id
    }
    await db.query(marketplaceQueries.getItemLike, [item_edition_id, user_id], async function (err, result1) {

        if (err) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                err
            });
        }
        if (result1.length > 0) {
            await db.query(marketplaceQueries.deleteItemLike, [item_edition_id, user_id], async function (err, result) {

                if (err) {
                    return res.status(400).send({
                        success: false,
                        msg: err
                    });
                }
            });
            return res.status(200).send({
                success: true,
                msg: "Like removed!!",
                err
            });
        }
        else {
            await db.query(marketplaceQueries.insertItemLike, itemlike, async function (err, result2) {

                if (err) {
                    return res.status(400).send({
                        success: false,
                        msg: err
                    });

                }
                return res.status(200).send({
                    success: true,
                    msg: "Item liked successfully!!",
                    err
                });
            })
        }
    });

}

exports.getMarketActivity = async (db, req, res) => {
    var item_id = req.body.item_id;
    await db.query(marketplaceQueries.getMarketActivity, [item_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Activity details!!",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}

exports.purchaseNft = async (db, req, res) => {

    var nftid = req.body.nftid;
    var toAddress = req.body.toAddress;
    var remainingAmount = req.body.remainingAmount;
    var user_id = req.body.user_id;
    var item_edition_id = req.body.item_edition_id;
    var amount = req.body.amount;
    var seller_id = req.body.seller_id;
    var trxHash = req.body.trxHash;

    var ownerTransferArr = JSON.stringify({
        "from_address": `${config.contractOwnerAddress}`,
        "from_private_key": `${config.contractOwnerPrivateKey}`,
        "contract_address": `${config.contractAddress}`,
        "to_address": `${toAddress}`,
        "token_owner_address": `${config.contractOwnerAddress}`,
        "tokenId": nftid+'3000',
        "amount": 1
    })

    console.log(ownerTransferArr);

    const response1 = await fetch(`${config.blockchainApiUrl}transfer`, {
        method: 'POST', headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: ownerTransferArr
    });
    const data1 = await response1.json();
    console.log(data1);
    if(data1.hash){
        var arr = {
            'transfer_hash' : data1.hash,
            'owner_id' : user_id,
            'is_sold' : 1,
            'payment_hash' : trxHash
        }
        await db.query(marketplaceQueries.updateItem, [arr, nftid], async function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured updateItemBid!!",
                    error
                });
            }else{

                var updateData1 = {
                    "transfer_hash": data1.hash,
                    'owner_id' : user_id
                }
                await db.query(marketplaceQueries.itemEditionUpdate, [updateData1, nftid], async function (error, datalimited) {

                })

                var updateWalletData = {
                    "balance": remainingAmount
                }
                await db.query(marketplaceQueries.updateWalletBalance, [updateWalletData, user_id], async function (error, dataWallet) {

                })   
                
                transactionArr = {
                    'user_id' : user_id,
                    'item_id' : nftid,
                    'item_edition_id' : item_edition_id,
                    'transaction_type_id' : 6,
                    'amount' : amount,
                    'currency' : 'USD',
                    'status' : 1,
                    'user_address' : toAddress

                }

                await db.query(marketplaceQueries.insertTransaction, [transactionArr], async function (error, data) {

                })

                var samount = amount*0.7
                sellerTransactionArr = {
                    'user_id' : seller_id,
                    'item_id' : nftid,
                    'item_edition_id' : item_edition_id,
                    'transaction_type_id' : 1,
                    'amount' : samount,
                    'currency' : 'USD',
                    'status' : 1,
                    'user_address' : toAddress

                }

                await db.query(marketplaceQueries.insertTransaction, [sellerTransactionArr], async function (error, data) {

                })                

                return res.status(200).send({
                    success: true,
                    msg: "NFT purchased successfully!",
                });                
            }
        });
    }else{
        return res.status(400).send({
            success: false,
            msg: "Error occured!"
        });        
    }
}

exports.insertUserCollection = async (db, req, res) => {

    var user_id = req.body.user_id;
    var name = req.body.name;
    var description = req.body.description;
    var ip = req.body.ip;
    var datetime = new Date();

    var users = {
        user_id: user_id,
        name: name,
        description: description,
        ip: ip,
        datetime: datetime
    }

    await db.query(marketplaceQueries.insertUserCollection, [users], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "User Collection Inserted Successfully",
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}

exports.addNftByUser = async (db, req, res) => {

    var user_id = req.body.user_id;
    var name = req.body.name;
    var description = req.body.description;
    var image = req.body.image;
    var file_type = req.body.file_type;
    var item_category_id = req.body.item_category_id;
    var price = req.body.price;
    var quantity = req.body.quantity;
    var sell_type = req.body.sell_type;
    var edition_type = req.body.edition_type;
    var user_collection_id = req.body.user_collection_id;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var expiry_date = req.body.expiry_date;
    var image_low = req.body.image;
    var user_address = req.body.user_address;

    var recCompress = await ipfsCompress.compressImages(["https://ipfs.io/ipfs/" + image],file_type);
    if (recCompress.success == false) {
        console.log("compress false");
        var image_low = image;
    }else{
        console.log("compressed")
        var image_low = recCompress.imageHash[0];
    }

    if (!name) {
        return res.status(400).send({
            success: false,
            msg: "name required!! "
        });
    }
    if (!image) {
        return res.status(400).send({
            success: false,
            msg: "image required!! "
        });
    }
    if (!file_type) {
        return res.status(400).send({
            success: false,
            msg: "file_type required!! "
        });
    }
    if (!description) {
        return res.status(400).send({
            success: false,
            msg: "description required!! "
        });
    }

    if (!price) {
        return res.status(400).send({
            success: false,
            msg: "Price required!! "
        });
    }
    if (!sell_type) {
        return res.status(400).send({
            success: false,
            msg: "Sell type required!! "
        });
    }
    if (!edition_type) {
        return res.status(400).send({
            success: false,
            msg: "edition_type required!!"
        });
    }
    if (!quantity && edition_type === '1') {
        return res.status(400).send({
            success: false,
            msg: "quantity required!! "
        });
    }

    var users = {
        "name": name,
        "description": description,
        "image": image_low,
        "image_original": image,
        "file_type": file_type,
        "item_category_id": item_category_id,
        "user_collection_id": user_collection_id,
        "start_date": start_date,
        "end_date": end_date,
        "price": price,
        "owner_id": user_id,
        "created_by": user_id,
        "sell_type": sell_type,
        "expiry_date": expiry_date,
        "quantity": quantity,
        "local_image" : recCompress.images[0]
    }

    var mint_quantity = quantity;
    if (edition_type === '2') {
        quantity = 1;
        mint_quantity = 1;
    }
    await db.query(marketplaceQueries.insertItem, [users], async function (error, data) {
        if (error) {

            return res.status(400).send({
                success: false,
                msg: "error occured in item insert",
                error
            });
        }

        /**---------------------------IPFS Json ---------------------------------- */
        var additem = {
            "name": name,
            "description": description,
            "image": 'https://ipfs.io/ipfs/' + image
        }
        var userfile = 'item_'.concat(data.insertId, '.json');
        try {
            fs.writeFile(`./metadata/${userfile}`, JSON.stringify(additem), async (err, fd) => {

                if (err) throw err;
                const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
                let formdata = new FormData();
                formdata.append('file', fs.createReadStream('./metadata/' + userfile))
                const response2 = await fetch(url, {
                    method: 'POST', headers: {
                        'Content-Type': `multipart/form-data; boundary=${formdata._boundary}`,
                        'pinata_api_key': 'b26a087893e3f0033bbf',
                        'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
                    },
                    body: formdata
                });
                const filedata = await response2.json();
                db.query(marketplaceQueries.updatemeta, [filedata.IpfsHash, data.insertId], (error, data235) => {
     
                })

                for (var i = 1; i <= quantity; i++) {
                    var item_ed = {
                        "edition_text": `${i} of ${quantity}`,
                        "edition_no": i,
                        "item_id": data.insertId,
                        "is_sold": 0,
                        "owner_id": user_id,
                        "user_collection_id": user_collection_id,
                        "start_date": start_date,
                        "end_date": end_date,
                        "expiry_date": expiry_date,
                        "user_address": user_address,
                        "price": price,
                        "ip": null,
                        "datetime": new Date()
                    };

                    await db.query(marketplaceQueries.insertEdition, [item_ed])
                }
                /* ---------------------------------------------------------- */
                await db.query(marketplaceQueries.getItemEdition, [data.insertId], async function (error, iedata) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "error occured in item insert",
                            error
                        });
                    }

                    if (iedata) {
                        await db.query(marketplaceQueries.getWalletDetail, [user_id], async function (error, walletData) {
                            if (error) {
                                return res.status(400).send({
                                    success: false,
                                    msg: "error occured in item insert",
                                    error
                                });
                            }

                            var contract = `${config.contractAddress}`; // TEST CONTRACT
                            // var contract = `${config.contractAddress}`; //LIVE CONTRACT

                            var mintArr = JSON.stringify({
                                "from_address": `${config.contractOwnerAddress}`,
                                "from_private_key": `${config.contractOwnerPrivateKey}`,
                                "contract_address": `${contract}`,
                                "to_address": `${config.contractOwnerAddress}`,
                                "MetaDataHash": `${filedata.IpfsHash}`,
                                "TokenName": `${name}`,
                                "TokenId": `${data.insertId}`+'3000',
                                "totalSupply": `${mint_quantity}`
                            })

                            console.log(mintArr);

                            const response1 = await fetch(`${config.blockchainApiUrl}mint`, {
                                method: 'POST', headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: mintArr
                            });

                            const data1 = await response1.json();
                            console.log(data1);
                            if (!data1.hash) {
                                return res.status(400).send({
                                    success: false,
                                    msg: "error occured in mint NFT",
                                    error
                                });
                            }

                            var updateData = {
                                "token_hash": data1.hash,
                                "token_id": data.insertId+'3000'
                            }
                            await db.query(marketplaceQueries.updateItem, [updateData, data.insertId], async function (error, dataRes) {
                                if (error) {
                                    return res.status(400).send({
                                        success: false,
                                        msg: "error occured in update item table",
                                        error
                                    });

                                }else{

                                    res.status(200).send({
                                        success: true,
                                        msg: "Item Inserted Successfully",
                                        item_edition_id: iedata[0].id
                                    });                                    
                                }
                            })

                        });

                    } else {
                        res.status(400).send({
                            success: false,
                            msg: "Something Wrong due to internal Error"
                        });
                    }
                });
            });
        } catch (e) {
            return res.status(400).send({
                success: false,
                e
            });
        }

    });

}

exports.getUserCollection = async (db, req, res) => {
    var user_id = req.body.user_id;
    await db.query(marketplaceQueries.getUserCollection, [user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "User Collection Details",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}

exports.getUserItem = async (db, req, res) => {

    var user_id = req.body.user_id;
    var user_collection_id = req.body.user_collection_id;
    var limit = req.body.limit;

    var qry = `Select it.id as item_id,ie.id as item_edition_id,it.name,it.description,it.image,it.file_type,it.owner,it.item_category_id,it.token_id,ie.price,cl.id as collection_id,cl.user_id,ie.is_sold from item_edition as ie left join item as it on it.id=ie.item_id LEFT JOIN user_collection as cl ON cl.id = it.user_collection_id where ie.id in (select min(id) from item_edition where ie.owner_id=${user_id} group by item_id) and it.nft_type_id=1 and it.is_active=1`

    if (user_id > 0) {
        qry = qry + ` and ie.owner_id=${user_id} `
    }

    if (user_collection_id > 0) {
        qry = qry + ` and cl.id=${user_collection_id}`
    }
    if (limit > 0) {
        qry = qry + ` order by ie.id desc limit ${limit}`
    }
    else {
        qry = qry +` order by ie.id desc `
    }

    await db.query(qry, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "User Item Details",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No Data"
            });
        }
    });
}

exports.getSingleUserCollection = async (db, req, res) => {

    var user_id = req.body.user_id;
    var collection_id = req.body.collection_id;
    if (!collection_id) {
        return res.status(400).send({
            success: false,
            msg: "collection_id required!!"
        });
    }
    await db.query(marketplaceQueries.getSingleUserCollection, [collection_id, user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "User Collection Details",
                response: data[0]
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}

exports.updateUserCollection = async (db, req, res) => {

    var user_id = req.body.user_id;
    var collection_id = req.body.collection_id;
    var name = req.body.name;
    var description = req.body.description;

    var userColl = {
        name: name,
        description: description,
        ip: "null",
        datetime: new Date()
    }

    await db.query(marketplaceQueries.updateUserCollection, [userColl, collection_id, user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "User Collection Updated",

            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}

exports.deleteUserCollection = async (db, req, res) => {

    var collection_id = req.body.collection_id;


    await db.query(marketplaceQueries.getCollectionItemCount, [collection_id], async function (error, cnt) {
        if (cnt[0].itemCount > 0) {
            return res.status(400).send({
                success: false,
                msg: "You can't delete collectoin if any NFT exists in it !!"
            });
        }
        await db.query(marketplaceQueries.deleteUserCollection, [collection_id], function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
            if (data) {
                res.status(200).send({
                    success: true,
                    msg: "User Collection Deleted!!",

                });
            } else {
                res.status(400).send({
                    success: false,
                    msg: "Something Wrong due to internal Error"
                });
            }
        });
    });
}

exports.getTelentStatus = async (db, req, res) => {

    var user_id = req.body.user_id
    //console.log(user_id);
    await db.query(marketplaceQueries.getTelentStatus, [user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        //console.log(data.length);
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Users Telent Status",
                response: data
            });
        } else {
            res.status(204).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}

exports.getQR = async (db, req, res) => {


    var user_id = req.body.user_id;

    await db.query(marketplaceQueries.getUserAuth, [user_id], async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }


        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "QR Code",
                response: data[0]
            });

        } else {
            res.status(400).send({
                success: false,
                msg: "No Data Found"
            });
        }

    });
}

exports.getUserSale = async (db, req, res) => {

    var user_id = req.body.user_id

    await db.query(marketplaceQueries.getUserSale, [user_id, user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "User Sale detail",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}

exports.getUserPurchase = async (db, req, res) => {
    var user_id = req.body.user_id

    await db.query(marketplaceQueries.getWalletDetail,[user_id],async function (error, walletData) {
    await db.query(marketplaceQueries.getSettingData,async function (error, settingData) {
    await db.query(marketplaceQueries.getUserPurchase, [user_id],async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            const response2 = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/buy', {
                method: 'GET', headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const usdPrice = await response2.json();
            
            res.status(200).send({
                success: true,
                msg: "User purchase detail",
                resale_charges : (settingData[0].resale_charges).toFixed(2),
                resale_charges_eth : (settingData[0].resale_charges/usdPrice['data']['amount']).toFixed(6),
                wallet_balance_usd : walletData[0].balance,
                wallet_balance_eth : walletData[0].balance/usdPrice['data']['amount'],
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
});
    });
}

exports.transactionDetail = async (db, req, res) => {

    var transaction_id = req.body.transaction_id

    await db.query(marketplaceQueries.getTransactionDetail, [transaction_id], async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Transactions Detail",
                response: data[0]
            });
        } else {
            await db.query(marketplaceQueries.getTransactionDetail1, [transaction_id], function (error, data1) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured!!",
                        error
                    });
                }

                res.status(200).send({
                    success: true,
                    msg: "Transactions Detail",
                    response: data1[0]
                });
            });

        }
    });
}


exports.allSearch = async (
    db, req, res) => {

    var search = (!req.body.search) ? '' : req.body.search;


    if (!search) {
        return res.status(400).send({
            success: false,
            msg: "Search parameter required"
        });
    }
    qry = "select t.user_id as id,t.email,u.user_name,concat(t.first_name,' ',t.last_name) as full_name,u.profile_pic,'talent' as type from telent as t left join users as u on u.id=t.user_id where t.first_name like '" + `${search}` + "%' or t.last_name like '" + `${search}` + "%' or u.user_name like '" + `${search}` + "%' or u.email like '" + `${search}` + "%' or concat(t.first_name,' ',t.last_name) like '" + `${search}` + "%'  union all select ie.id,u.email,u.user_name,i.name,i.image as profile_pic,'nft' as type from item_edition as ie left join item as i on i.id=ie.item_id left join users as u on u.id=i.created_by where i.name like '" + `${search}` + "%' and ie.id in (select min(id) from item_edition where is_sold=0 group by item_id)";
    //console.log(qry);
    try {
        await db.query(qry, async function (err, result) {
            if (err) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured ",
                    error
                });
            }
            else if (result.length > 0) {
                return res.status(200).send({
                    success: true,
                    msg: 'data  found',
                    response: result

                });
            }
            else {
                return res.status(400).send({
                    success: false,
                    msg: "No data found ",
                    data: []
                });
            }
        })



    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `unable to add customer address due to internal error :${err}`
        });
    }
}
