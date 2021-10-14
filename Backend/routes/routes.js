const jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var config = require('../config');
var db = require('../utils/connection');
/* stripe includes*/
//const express = require("express");
const app = express();
require("dotenv").config();
//const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
/*-------------------*/

router.use(bodyParser.json());
router.use(
    bodyParser.urlencoded({
        extended: true,
    })
);     


var multer  = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      console.log(file.originalname);
      var filetype = '';
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      if(file.mimetype === 'image/jpg') {
        filetype = 'jpg';
      }
      if(file.mimetype === 'video/mp4') {
        filetype = 'mp4';profile
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({storage: storage});
var pageUpload = upload.fields([{ name: 'avatar', maxCount: 1 }])
var userupload = upload.fields([{ name: 'profile_pic', maxCount: 1 }, { name: 'banner', maxCount: 8 }])
var sliderUpload = upload.fields([{ name: 'slider1', maxCount: 1 }, { name: 'slider2', maxCount: 8 }, { name: 'slider3', maxCount: 8 }, { name: 'logo', maxCount: 8 }, { name: 'favicon', maxCount: 8 }, { name: 'realEstateImage', maxCount: 8 }])

var addnftImage = upload.fields([{ name: 'image', maxCount: 1 }])

// ---------------Controllers--------
const signup = require('../controllers/signup');
const login = require('../controllers/login');
const admin = require('../controllers/admin/admin');
const getFile = require('../controllers/getFile');
const marketplace = require('../controllers/marketplace');


router.post('/getCategoryById',marketplace.getCategoryById.bind(this,db));
router.post('/listAdminItem',admin.listAdminItem.bind(this, db));
router.post('/login', login.login.bind(this, db));
router.post('/verifyAccount/:token', signup.activateAccount.bind(this, db));
router.post('/register', signup.register.bind(this, db));
router.post('/resetpassword', signup.Resetpassword.bind(this, db));
router.post('/twoAuthenticationVerify',marketplace.twoAuthenticationVerify.bind(this,db));
router.get('/getitem',admin.getItem.bind(this, db));
router.post('/getPayoutAddress',marketplace.getPayoutAddress.bind(this,db));
router.post('/setPayoutAddress',marketplace.setPayoutAddress.bind(this,db));
router.post('/getwalletDetails',admin.getwalletDetails.bind(this, db));
router.get('/getWebImage',admin.getWebImage.bind(this, db));
router.post('/itemView',marketplace.itemView.bind(this,db));
router.post('/getItemLikeCount',marketplace.getItemLikeCount.bind(this,db));
router.post('/itemdetail',marketplace.itemDetails.bind(this,db));
router.post('/likeItem',marketplace.likeItem.bind(this,db));
router.post('/getMarketActivity',marketplace.getMarketActivity.bind(this,db));
router.post('/purchaseNft',marketplace.purchaseNft.bind(this,db));
router.post('/insertUserCollection',marketplace.insertUserCollection.bind(this,db));
router.post('/addNftByUser',addnftImage, marketplace.addNftByUser.bind(this,db));
router.post('/getUserDetail',signup.getUserDetail.bind(this, db))
router.post('/insertView',signup.insertView.bind(this, db))
router.post('/follow',signup.follow.bind(this, db))
router.post('/getUserCollection',marketplace.getUserCollection.bind(this,db));
router.get('/getDigitalCategory', admin.getDigitalCategory.bind(this, db));
router.post('/getUserItem',marketplace.getUserItem.bind(this,db));
router.post('/getSingleUserCollection',marketplace.getSingleUserCollection.bind(this,db));
router.post('/updateUserCollection',marketplace.updateUserCollection.bind(this,db));
router.post('/deleteUserCollection',marketplace.deleteUserCollection.bind(this,db));
router.post('/getTelentStatus',marketplace.getTelentStatus.bind(this,db));
router.post('/getProfilePic', signup.getProfilePic.bind(this, db));
router.post('/updateProfilePic', userupload, signup.updateProfilePic.bind(this, db));
router.post('/changepassword', signup.changePassword.bind(this, db));
router.post('/getQR',marketplace.getQR.bind(this,db));
router.post('/getAboutDetail',signup.getAboutDetail.bind(this,db));
router.post('/updateAboutDetail',signup.updateAboutDetail.bind(this,db));
router.post('/getUserSale',marketplace.getUserSale.bind(this,db));
router.post('/getUserPurchase',marketplace.getUserPurchase.bind(this,db));
router.post('/transactionDetail',marketplace.transactionDetail.bind(this,db));
router.post('/forgot', signup.forgot.bind(this, db));
router.post('/addSubscriber',signup.addSubscriber.bind(this, db));
router.post('/allSearch',marketplace.allSearch.bind(this,db));





router.post('/adminlogin', admin.login.bind(this, db));
router.get('/dashboarditem',admin.dashboardItem.bind(this, db));
router.get('/getuser',admin.getUsers.bind(this, db));
router.post('/deleteuser',admin.deleteUser.bind(this, db));
router.get('/getcategory', admin.getCategory.bind(this, db));
router.post('/deletecategory', admin.deleteCategory.bind(this, db));
router.post('/updatecategory', admin.updateCategory.bind(this, db));
router.post('/insertcategory', admin.insertCategory.bind(this, db));
router.get('/getitem',admin.getItem.bind(this, db));
router.post('/insertitem',addnftImage,admin.insertItem.bind(this, db));
router.post('/updateitem',admin.updateItem.bind(this, db));
router.post('/deleteitem', admin.deleteItem.bind(this, db));
router.post('/adminprofilepic', admin.getProfilePic.bind(this, db));
router.post('/updateprofilepic', admin.insertProfilePic.bind(this, db));
router.post('/adminpassword',admin.changePassword.bind(this, db));

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
            if(req.user.email != req.body.email){
                return res.sendStatus(403);
            }
            next();
        }
    })
}

module.exports.routes = router;
