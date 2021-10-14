const CryptoJS = require("crypto-js");
var fetch = require('node-fetch');
const config = require('../../config');
const adminQueries = require("../../services/adminQueries");
var validator = require("email-validator");
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const axios = require('axios');
const jwt = require('jsonwebtoken');
var ipfsCompress = require('../ipfsCompress/imagecompress');

const marketplaceQueries = require("../../services/marketplaceQueries");

var FormData = require('form-data');

// Login User
exports.login = async (db, req, res) => {
  
    var email = req.body.email;
    var password = req.body.password;
      
    console.log(email);
    try {
        if (email=='') {
            return res.status(400).send({
                success: false,
                msg: "Email required!! "
            });
        }
        if (password=='') {
            return res.status(400).send({
                success: false,
                msg: "Password required!!"
            });
        }
        if (!validator.validate(email)) {
            return res.status(400).send({
                success: false,
                msg: "Enter a valid email address!!"
            });
        }

     
    db.query(adminQueries.getUsersEmail,email, async function (error, user) {
        console.log(user);
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Unexpected error occured!!",
                    error
                });
            } else if (user.length == 0) {
                return res.status(400).send({
                    success: false,
                    msg: "No user found!!"
                });
               }
            
             else {
                var hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
                if (user[0].password === hash){
                
                    const jwtToken = jwt.sign({
                        email: req.body.email,
                        id: user[0].id,
                    }, config.JWT_SECRET_KEY, {
                        expiresIn: config.SESSION_EXPIRES_IN
                    })
                   
                    return res.status(200).send({
                        success: true,
                         msg: "Login successfully!!",
                         Token : jwtToken,
                        data : {
                            id : user[0].id,
                            user_email : user[0].email,
                            username : user[0].username,
                          }
                    });
                } else {
                    return res.status(400).send({
                        success: false,
                        msg: "Password does not match!!"
                    });
                }

            }
        
     
    
    })
    } catch (err) {
        console.log(err)
        return res.status(400).send({
            success: false,
            msg: "Unexpected internal error!!",
            err
        });
    }

}

exports.getFooter = async (db,req,res)=>{
   
    await db.query(adminQueries.getFooter, function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured!!",
            error
        });
    }
        if(data.length > 0){
    res.status(200).send({
        success:true,
        msg : "Footer details",
        response : data[0]
    });
        }else{
            res.status(400).send({
                success:false,
                msg:"No data found!!"
            });            
        }
    });
}


exports.updateFooter = async (db,req,res)=>{

        var description = req.body.description;
        var email = req.body.email;
        var contact = req.body.contact;
        
        if (description=='') {
            return res.status(400).send({
                success: false,
                msg: "Description required!!"
            });
        }
        
        if (email=='') {
            return res.status(400).send({
                success: false,
                msg: "Email required!!"
            });
        }
        if (!validator.validate(email)) {
            return res.status(400).send({
                success: false,
                msg: "Enter a valid email address!!"
            });
        }
        if (contact=='') {
            return res.status(400).send({
                success: false,
                msg: "Contact required!!"
            });
        }
        if(contact.length=='') {
            return res.status(400).send({
                success: false,
                msg: "Contact number length must be 10 digit!!"
            });
        }
       

    await db.query(adminQueries.updateFooter,[description,email,contact],function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured!!",
            error
        });
    }
        if(data){
    res.status(200).send({
        success:true,
        msg : "Footer Updated",
     
    });
        }else{
            res.status(400).send({
                success:false,
                msg:"No data found!!"
            });            
        }
    });
}


exports.getWebContent = async (db,req,res)=>{
   
    await db.query(adminQueries.getWebContent, function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured!!",
            error
        });
    }
        if(data.length > 0){
    res.status(200).send({
        success:true,
        msg : "Web Content Details",
        response : data[0]
    });
        }else{
            res.status(400).send({
                success:false,
                msg:"No data!!"
            });            
        }
    }); 
}

exports.updateWebContent = async (db,req,res)=>{


        var form = new formidable.IncomingForm();
        form.parse(req, async  function (err, fields, files) {
 
            if (logo=='') {
                return res.status(400).send({
                    success: false,
                    msg: "Logo required!!"
                });
            }
            var favicon_upload = (!files.favicon)?null:(!files.favicon.name)?null:files.favicon; 
            var logo_upload = (!files.logo)?null:(!files.logo.name)?null:files.logo;
            if (title=='') {
                return res.status(400).send({
                    success: false,
                    msg: "Title required!!"
                });
            }
            if (description=='') {
                return res.status(400).send({
                    success: false,
                    msg: "Description required!!"
                });
            }
        
    if(!favicon_upload)
    {
        var favicon ='';
        
    }else{
        var oldpath = files.favicon.path;
       
        var filePath = "./uploads/"
        let newfilename = filePath +files.favicon.name
 
      // Read the file
     await fs.readFile(oldpath,async function (err, data) {
        if (err) throw err;
            // Write the file
        await  fs.writeFile(newfilename, data, function (err) {
                if (err) throw err;
    
            });
        });
        var favicon = files.favicon.name;
        
    }
    if(!logo_upload)
    {
        var logo ='';
    }else{
        var oldpath = files.logo.path;
            var filePath = "./uploads/"
          let newfilename = filePath +files.logo.name
     
          // Read the file
      await   fs.readFile(oldpath, async function (err, data) {
            if (err) throw err;
                // Write the file
             await   fs.writeFile(newfilename, data, function (err) {
                    if (err) throw err;
                   
                })
            });   
            var logo = files.logo.name;
    }      
    
   
    var title = fields.title;
    var description = fields.description;

   db.query(adminQueries.getWebContent,function(error,result){
    if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured!!",
            error
        });
    }
    var webContent = {
        "favicon" : favicon,  
        "logo" : logo,
        "title" : title,
        "description" : description
    }
    if(!favicon)
    {
    webContent.favicon = result[0].favicon;
    }
if(!logo)
    {
    webContent.logo = result[0].logo;
    }
    
 db.query(adminQueries.updateWebContent,webContent,function(error,data){
    if(error){
    return res.status(400).send({
        success: false,
        msg: "Error occured!!",
        error
    });
}
    if(data){
res.status(200).send({
    success:true,
    msg : "Web Content Updated",
 
});
    }else{
        res.status(400).send({
            success:false,
            msg:"No data found!!"
        });            
    }
});
});
          });
        
}

     exports.insertMarketPlace = async (db, req, res) => {

        try {
     
        var form = new formidable.IncomingForm();
        form.parse(req, async  function (err, fields, files) {
 
            if (item_image=='') {
                return res.status(400).send({
                    success: false,
                    msg: "Item image required!!"
                });
            }
            var item_image_upload = (!files.item_image)?null:(!files.item_image.name)?null:files.item_image; 
            if (fields.title=='') {
                return res.status(400).send({
                    success: false,
                    msg: "Title required!!"
                });
            }
            if (fields.price=='') {
                return res.status(400).send({
                    success: false,
                    msg: "Price required!!"
                });
            }
    if(!item_image_upload)
    {
        var item_image ='';
        
    }else{
        var oldpath = files.item_image.path;
       
        var filePath = "./uploads/"
        let newfilename = filePath +files.item_image.name
 
      // Read the file
     await fs.readFile(oldpath,async function (err, data) {
        if (err) throw err;
            // Write the file
        await  fs.writeFile(newfilename, data, function (err) {
                if (err) throw err;
    
            });
        });
        var item_image = files.item_image.name;
        
    }
    var title = fields.title;
    var description = fields.description;
    var author = fields.author;
    var web_link = fields.web_link;
    var price = fields.price;
    var datetime = new Date();   
 
            var users = {
               "title" : title,
               "author" : author,
              "description" : description,
             "item_image" : item_image,
              "web_link" : web_link,
              "price" :price,
              "datetime" : datetime
            }
        db.query(adminQueries.insertMarketPlace,[users],function(error,result){
            if(error){
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
            if(result){
            res.status(200).send({
                success:true,
                msg : "Inserted Successfully",
             });
            }else{
                res.status(200).send({
                    success:true,
                    msg : "Insertion Failed",
                 });
            }               
        })
        });       

        } catch (err) {
           // console.log(err)
            return res.status(400).send({
                success: false,
                msg: "Unexpected internal error!!",
                err
            });
        }
     
     }
     
exports.getMarketPlace = async (db,req,res)=>{
  

    await db.query(adminQueries.getMarketPlace, function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured!!",
            error
        });
    }
        if(data.length > 0){
    res.status(200).send({
        success:true,
        msg : "Market Places",
        response : data
    });
        }else{
            res.status(400).send({
                success:false,
                msg:"No data found!!"
            });            
        }
    });
}


exports.listItem = async (db,req,res)=>{
  
    var category_id=req.body.category_id;
    var limit = req.body.limit;

    if (!category_id) {
        return res.status(400).send({
            success: false,
            msg: "category_id required!!"
        });
    }
    if (!limit) {
        return res.status(400).send({
            success: false,
            msg: "limit required!!"
        });
    }

    var qry =" Select i.id,ie.id as item_edition_id, case when length(i.name)>=30 then concat(left(i.name,30),'...')  else i.name end as name,i.name as item_fullname,i.description,i.image,i.file_type,i.owner,i.item_category_id,i.token_id,ie.price,coalesce(i.start_date,i.datetime) as start_date,i.end_date,ie.edition_text,ie.edition_no,ie.is_sold,ie.expiry_date from item_edition as ie left join item as i on i.id=ie.item_id where  ie.is_sold=0 and ie.id in (select min(id) from item_edition where is_sold=0 group by item_id)  and (ie.expiry_date >= now() or ie.expiry_date is null) and i.is_active=1";
    
    if(category_id!='0'){
        if(category_id==='-1'){
            qry= qry+' and i.start_date>CURRENT_DATE and i.start_date is not null'
        }else{
            qry= qry+' and i.item_category_id ='+ category_id;
            qry=qry+' and (i.start_date<CURRENT_DATE or i.start_date is null)' ;
        }  
     }else{
        qry=qry+' and (i.start_date<CURRENT_DATE or i.start_date is null)' ;
     }

     qry= qry+' order by ie.id desc  ';
     
     if(limit !='0'){
        qry= qry+' LIMIT '+limit
     }
     
     //console.log(qry);
    await db.query(qry, function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured!!",
            error
        });
    }
        if(data.length > 0){
    res.status(200).send({
        success:true,
     
        response : data
    });
        }else{
            res.status(400).send({
                success:false,
                msg:"No data found!!"
            });            
        }
    });
}


exports.listAdminItem = async (db,req,res)=>{
  
    var category_id=req.body.category_id;
    var limit = req.body.limit;

    if (!category_id) {
        return res.status(400).send({
            success: false,
            msg: "category_id required!!"
        });
    }
    if (!limit) {
        return res.status(400).send({
            success: false,
            msg: "limit required!!"
        });
    }

    var qry =" Select i.id,ie.id as item_edition_id, case when length(i.name)>=30 then concat(left(i.name,30),'...')  else i.name end as name,i.name as item_fullname,i.description,i.image,i.file_type,i.owner,i.item_category_id,i.token_id,ie.price,coalesce(i.start_date,i.datetime) as start_date,i.end_date,i.expiry_date,ie.edition_text,ie.edition_no,ie.is_sold from item_edition as ie left join item as i on i.id=ie.item_id where i.created_by=1 and i.is_active=1 and ie.id in (select min(id) from item_edition group by item_id)  and (i.expiry_date >= now() or i.expiry_date is null) and i.is_active=1";
    
    if(category_id!='0'){
        if(category_id==='-1'){
            qry= qry+' and i.start_date>CURRENT_DATE and i.start_date is not null'
        }else{
            qry= qry+' and i.item_category_id ='+ category_id;
            qry=qry+' and (i.start_date<CURRENT_DATE or i.start_date is null)' ;
        }  
     }else{
        qry=qry+' and (i.start_date<CURRENT_DATE or i.start_date is null)' ;
     }

     qry= qry+' order by ie.id desc  ';
     
     if(limit !='0'){
        qry= qry+' LIMIT '+limit
     }
     
     //console.log(qry);
    await db.query(qry, function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured!!",
            error
        });
    }
        if(data.length > 0){
    res.status(200).send({
        success:true,
     
        response : data
    });
        }else{
            res.status(400).send({
                success:false,
                msg:"No data found!!"
            });            
        }
    });
}

exports.listSingleItem = async (db,req,res)=>{
  
    var item_edition_id = req.body.item_edition_id;
    await db.query(adminQueries.listSingleItem,[item_edition_id], function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured!!",
            error
        });
    }
        if(data.length > 0){
    res.status(200).send({
        success:true,
     
        response : data[0]
    });
        }else{
            res.status(400).send({
                success:false,
                msg:"No data found!!"
            });            
        }
    });
}

exports.insertCategory = async (db,req,res)=>{

    var name = req.body.name;
    var nft_type_id = req.body.nft_type_id;
    
    if (name=='') {
        return res.status(400).send({
            success: false,
            msg: "name required!! "
        });
    }

    if (nft_type_id=='') {
        return res.status(400).send({
            success: false,
            msg: "name required!! "
        });
    }

    var users = {
       "name" : name,
        "nft_type_id" : nft_type_id
    }

    await db.query(adminQueries.insertCategory,[users],function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured!!",
            error
        });
    }
        if(data){
    res.status(200).send({
        success:true,
        msg : "Insert Item in Category Successfully "
     });
        }else{
            res.status(200).send({
                success:false,
                msg:"Insertion failed!!"
            });            
        }
    });
    }

exports.getCategory = async (db,req,res)=>{
        await db.query(adminQueries.Category,function(error,data){
            if(error){
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
            if(data.length>0){
        res.status(200).send({
            success:true,
            msg : "Category Item Details",
            response:data
         });
            }else{
                res.status(200).send({
                    success:false,
                    msg:"No data found!!"
                });            
            }
        });
        }
exports.getDigitalCategory = async (db,req,res)=>{
            await db.query(adminQueries.getDigitalCategory,function(error,data){
                if(error){
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
                if(data.length>0){
            res.status(200).send({
                success:true,
                msg : "Category Item Details",
                response:data
             });
                }else{
                    res.status(200).send({
                        success:false,
                        msg:"No data found!!"
                    });            
                }
            });
            }

        exports.getRealEstateCategory = async (db,req,res)=>{
            await db.query(adminQueries.getRealEstateCategory,function(error,data){
                if(error){
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
                if(data.length>0){
            res.status(200).send({
                success:true,
                msg : "Category Item Details",
                response:data
             });
                }else{
                    res.status(200).send({
                        success:false,
                        msg:"No data found!!"
                    });            
                }
            });
            }

 exports.singleCategory = async (db,req,res)=>{

        var id = req.body.id;

    await db.query(adminQueries.singleCategory,[id],function(error,data){
                if(error){
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
                if(data.length>0){
            res.status(200).send({
                success:true,
                msg : "Category Single Item Details",
                response:data[0]
             });
                }else{
                    res.status(200).send({
                        success:false,
                        msg:"No data found!!"
                    });            
                }
            });
            }
exports.getNftType = async (db,req,res)=>{
await db.query(adminQueries.getNftType,function(error,data){
            if(error){
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
            if(data.length>0){
        res.status(200).send({
            success:true,
            msg : "NFT type Details",
            response:data 
            });
            }else{
                res.status(200).send({
                    success:false,
                    msg:"No data found!!"
                });            
            }
        });
        }
exports.updateCategory = async (db,req,res)=>{

        var id = req.body.id;
        var name = req.body.name;
        var nft_type_id = req.body.nft_type_id;
        
        if (name=='') {
            return res.status(400).send({
                success: false,
                msg: "name required!! "
            });
        }
        var users = {
           "name" : name,
           "nft_type_id": nft_type_id
        }
        
        await db.query(adminQueries.updateCategory,[users,id],function(error,data){
            if(error){
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
            if(data){
        res.status(200).send({
            success:true,
            msg : "Category Item Updated Successfully "
         });
            }else{
                res.status(200).send({
                    success:false,
                    msg:"Updation failed!!"
                });            
            }
        });
        }
            
exports.addFeatured = async (db,req,res)=>{
    var user_id = req.body.user_id;
    if (!user_id) {
        return res.status(400).send({
            success: false,
            msg: "user_id required!! "
        });
    }
    var updateData = {
        "is_featured" : 1
    }
    await db.query(adminQueries.updateUser,[updateData,user_id],function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured!!",
            error
        });
    }
  else{
            res.status(200).send({
                success:true,
                msg:"User Updated!!"
            });            
        }
    });
    }

exports.removeFeatured = async (db,req,res)=>{
    var user_id = req.body.user_id;
    if (!user_id) {
        return res.status(400).send({
            success: false,
            msg: "user_id required!! "
        });
    }
    var updateData = {
        "is_featured" : 0
    }
    await db.query(adminQueries.updateUser,[updateData,user_id],function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured!!",
            error
        });
    }
    else{
            res.status(200).send({
                success:true,
                msg:"User Updated!!"
            });            
        }
    });
    }

          
exports.showNFT = async (db,req,res)=>{
    var item_id = req.body.item_id;
    if (!item_id) {
        return res.status(400).send({
            success: false,
            msg: "item_id required!! "
        });
    }
    var updateData = {
        "is_active" : 1
    }
    await db.query(adminQueries.updateItem,[updateData,item_id],function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured!!",
            error
        });
    }
    else{
            res.status(200).send({
                success:true,
                msg:"NFT Updated!!"
            });            
        }
    });
    }

exports.hideNFT = async (db,req,res)=>{
    var item_id = req.body.item_id;
    if (!item_id) {
        return res.status(400).send({
            success: false,
            msg: "item_id required!! "
        });
    }
    var updateData = {
        "is_active" : 0
    }
    await db.query(adminQueries.updateItem,[updateData,item_id],function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured!!",
            error
        });
    }
    else{
            res.status(200).send({
                success:true,
                msg:"NFT Updated!!"
            });            
        }
    });
    }


exports.deleteCategory = async (db,req,res)=>{

    var id = req.body.id;

    await db.query(adminQueries.deleteCategory,[id],function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured!!",
            error
        });
    }
        if(data){
    res.status(200).send({
        success:true,
        msg : "Category Item Deleted Successfully "
     });
        }else{
            res.status(200).send({
                success:false,
                msg:"Deletion failed!!"
            });            
        }
    });
    }
    
/* -------------------Insert Item -------------------------*/ 

exports.insertItem = async (db,req,res)=>{

    var name = req.body.name;
    var description = req.body.description;
    var image =  req.body.image;
    var file_type =req.body.file_type;
  //  var owner = req.body.owner;
    var item_category_id = req.body.item_category_id;
    var price = req.body.price;
    var sell_type = req.body.sell_type;
    var user_collection_id = req.body.user_collection_id;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var expiry_date = req.body.expiry_date;
    var quantity = (!req.body.quantity || req.body.quantity == 0)?1:req.body.quantity;
    var ip = null;
    var datetime = new Date();
    var image_low=req.body.image;
 //   if(file_type==='image'){
    var recCompress = await ipfsCompress.compressImages(["https://ipfs.io/ipfs/"+image],file_type); 
    if(recCompress.success==false){
       // return res.status(400).send({
        //     success: false,
        //     msg: "Image compress issue "
        // });
        var image_low = image;
    }else{
        var image_low = recCompress.imageHash[0];
    }
   //  return res.json({
   //     image_low:image_low,
   //     image:image
   //  })       
//}
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
    // if (!owner) {
    //     return res.status(400).send({
    //         success: false,
    //         msg: "owner required!! "
    //     });
    // }
    // if (!token_id) {
    //     return res.status(400).send({
    //         success: false,
    //         msg: "token_id required "
    //     });
    // }
    if (!price) {
        return res.status(400).send({
            success: false,
            msg: "price required!! "
        });
    }

    if (!quantity) {
        return res.status(400).send({
            success: false,
            msg: "quantity required!! "
        });
    }

    var users = {
       "name" : name,
       "description":description,
       "image": image_low,
       "image_original": image,
       "owner": "vulnerary",
       "item_category_id":item_category_id,
       "price" : price,
       "sell_type":sell_type,
       "created_by":1,
       "owner_id":1,
       "user_collection_id" : user_collection_id,
       "start_date" : start_date,
       "end_date" : end_date,
       "expiry_date": expiry_date,
       "quantity" : quantity,
        "ip" : ip,
        "datetime":datetime,
        "file_type":file_type
    }

    await db.query(adminQueries.insertItem,[users],async function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured in insertItem!!",
            error
        });
    }

/**---------------------------IPFS Json ---------------------------------- */
var additem = {
"name" : name,
"description" : description,
"image" :'ipfs://'+image
}
var userfile = 'item_'.concat(data.insertId,'.json');
console.log(userfile);


fs.writeFile(`./metadata/${userfile}`, JSON.stringify(additem), async (err,fd) => {

// Checking for errors
if (err) throw err; 

console.log("Done writing"); // Success




const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

let formdata = new FormData();

console.log("Done writing"); // Success
formdata.append('file', fs.createReadStream('./metadata/'+userfile));


//   console.log(fs.createReadStream('./metadata/'+userfile)); // Success
var filedata = await  axios.post(url,
formdata,
{
maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
headers: {
// 'Content-Type' : `application/json;boundary=${formdata._boundary}`,
'Content-Type': `multipart/form-data; boundary=${formdata._boundary}`,
   'pinata_api_key' : 'b26a087893e3f0033bbf',
   'pinata_secret_api_key' : '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
}
}
)
console.log(filedata.data.IpfsHash);

db.query(marketplaceQueries.updatemeta,[filedata.data.IpfsHash,data.insertId],(error,data235)=>{
console.log(data235);
})

});

 
/*-------------------------------------------------------------------------------------*/





/*  -----------------------------------Insertinto Edition */ 
          
for(var i=1; i <= quantity; i++){
      
          
    var item_ed = {
        "edition_text" : `Edition ${i} of ${quantity}`,
        "edition_no" : i,
        "item_id"  :  data.insertId,
        "is_sold"  : 0,
        "owner_id" : 1,
        "user_collection_id" : user_collection_id,
        "start_date": start_date,
        "end_date":end_date,
        "expiry_date":expiry_date,
        "price":price,
        "ip" : null,
        "datetime" : new Date()
    };
    
     await db.query(adminQueries.insertEdition,[item_ed])
    }
    /* ---------------------------------------------------------- */


        if(data){
                   / create NFT and update into table /

                   const response1 = await fetch(`${config.blockchainApiUrl}mint`,{ method:'POST', headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify( {
                        "from_address" : `${config.contractOwnerAddress}`,
                        "from_private_key":`${config.contractOwnerPrivateKey}`,
                        "contract_address":`${config.contractAddress}`,
                        "to_address":`${config.contractOwnerAddress}`,
                        "MetaDataHash":`${filedata.data.IpfsHash}`,
                        "TokenName":`${name}`,
                        "TokenId":`${data.insertId}`,
                        "totalSupply":`${quantity}`
                })
                });
                const data1 = await response1.json();
                console.log(data1);
                if(!data1.hash){
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured in mint NFT!!",
                        error
                    });
                }
                console.log(data1);
                var updateData = {
                    "token_hash":data1.hash,
                    "token_id":data.insertId
                }
                await db.query(adminQueries.updateItem,[updateData,data.insertId],async function(error,data){
                    if(error){
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured in update item!! ",
                        error
                    });
                }
            })

    res.status(200).send({
        success:true,
        msg : "Insert Item in Category Successfully "
     });
        }else{
            res.status(200).send({
                success:false,
                msg:"Insertion failed!!"
            });            
        }
    });
    }
            
            


 exports.getItem= async (db,req,res)=>{

            await db.query(adminQueries.getItem,function(error,data){
                if(error){
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
                if(data.length>0){
            res.status(200).send({
                success:true,
                msg : "Item Details",
                response:data
             });
                }else{
                    res.status(200).send({
                        success:false,
                        msg:"No data found!!"
                    });            
                }
            });
            }

exports.updateWallet = async (db,req,res)=>{
    var user_id = req.body.user_id;
    var public= req.body.public;
    var private = req.body.private;

    var updateData = {
        public :public,
        private  : private
    }

await db.query(adminQueries.updateWallet,[updateData,user_id],function(error,data){
                    if(error){
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured!!",
                        error
                    });
                }
                    if(data){
                res.status(200).send({
                    success:true,
                    msg : "Wallet Updated!!",
    
                });
                    }else{
                        res.status(400).send({
                            success:false,
                            msg:"Something Wrong due to internal Error"
                        });            
                    }
                });
                }
        
    
exports.updateItem = async (db,req,res)=>{

        var item_id = req.body.item_id;    
        var name = req.body.name;
        var description = req.body.description;
        var image =  req.body.image;
        var file_type = req.body.file_type
        var item_category_id = req.body.item_category_id;
        var price = req.body.price;
        var expiry_date = req.body.expiry_date;
        var start_date = req.body.start_date;
        
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
        if (!price) {
            return res.status(400).send({
                success: false,
                msg: "Price required!! "
            });
        }
        await db.query(adminQueries.getItem,async function(error,result){
            if(error){
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
        var updateData = {
           "name" : name,
           "description":description,
           "image" : image,
           "file_type":file_type,
           "file_type":file_type,
           "item_category_id":item_category_id,
           "price" : price,
            "expiry_date" : expiry_date,
            "start_date":start_date
        }
        if(!image)
        {
        users.image = result[0].image;
        }
    
            await db.query(adminQueries.updateItem,[updateData,item_id],function(error,data){
                if(error){
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
                if(data){
            res.status(200).send({
                success:true,
                msg : "Item Updated Successfully "
             });
                }else{
                    res.status(200).send({
                        success:false,
                        msg:"Updation failed!!"
                    });            
                }
            });
        });
}                
    
exports.deleteItem = async (db,req,res)=>{
 
            var item_edition_id = req.body.id;
            if (!item_edition_id) {
                return res.status(400).send({
                    success: false,
                    msg: "item_edition_id required!! "
                });
            }

            await db.query(adminQueries.deleteItem,[item_edition_id],function(error,data){
                if(error){
                return res.status(400).send({
                    success: false,
                    msg: "You can't delete NFT purchased by other or in bid process!!",
                    error
                });
            }
                if(data){
            res.status(200).send({
                success:true,
                msg : "Item Delete Successfully"
             });
                }else{
                    res.status(200).send({
                        success:false,
                        msg:"Deletion failed!!"
                    });            
                }
            });
            }
        

 exports.getUsers= async (db,req,res)=>{
                await db.query(adminQueries.getUsers,function(error,data){
                    if(error){
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured!!",
                        error
                    });
                }
                    if(data.length>0){
                res.status(200).send({
                    success:true,
                    msg : "Users Details",
                    response:data
                 });
                    }else{
                        res.status(200).send({
                            success:false,
                            msg:"No data found"
                        });            
                    }
                });
            }

exports.getRealEstateUsers= async (db,req,res)=>{

    await db.query(adminQueries.getRealEstateUsers,function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "error occured!!",
            error
        });
    }
        if(data.length>0){
    res.status(200).send({
        success:true,
        msg : "Real estate user Detail!!",
        response:data
        });
        }else{
            res.status(200).send({
                success:false,
                msg:"No data found!!"
            });            
        }
    });
}

 exports.getTelentUsers= async (db,req,res)=>{

                await db.query(adminQueries.getTelentUsers,function(error,data){
                    if(error){
                    return res.status(400).send({
                        success: false,
                        msg: "error occured!!",
                        error
                    });
                }
                    if(data.length>0){
                res.status(200).send({
                    success:true,
                    msg : "Telent User Details",
                    response:data
                 });
                    }else{
                        res.status(200).send({
                            success:false,
                            msg:"No data found!!"
                        });            
                    }
                });
            }

   
exports.deleteUser = async (db,req,res)=>{
 
    var id = req.body.id;
    if (id=='') {
        return res.status(400).send({
            success: false,
            msg: "ID required!! "
        });
    }

    await db.query(adminQueries.deleteUser,[id],function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured!!",
            error
        });
    }
        if(data){
    res.status(200).send({
        success:true,
        msg : "User Deleted Successfully"
     });
        }else{
            res.status(200).send({
                success:false,
                msg:"Deletion failed!!"
            });            
        }
    });
    }
           


exports.dashboardItem= async (db,req,res)=>{

                await db.query(adminQueries.dashItem,function(error,data){
                    if(error){
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured!!",
                        error
                    });
                }
                    if(data.length>0){
                res.status(200).send({
                    success:true,
                    msg : "Item Details",
                    response:data[0]
                 });
                    }else{
                        res.status(200).send({
                            success:false,
                            msg:"No data found!!"
                        });            
                    }
                });
                }


exports.getProfilePic = async (db,req,res)=>{
    var email = req.body.email;
    
    await db.query(adminQueries.getProfile,[email],function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured!!",
            error
        });
    }
        if(data.length > 0){
    res.status(200).send({
        success:true,
        msg : "Profile Pic",
        response : data[0]
    });
        }else{
            res.status(204).send({
                success:false,
                msg:"No data found!!"
            });            
        }
    });
 }
  
exports.insertProfilePic = async (db, req, res) => {
  
    try {
    var form = new formidable.IncomingForm();
    form.parse(req, async  function (err, fields, files) {
     
        if (profile_pic=='') {
            return res.status(400).send({
                success: false,
                msg: "Profile_pic required!!"
            });
        }
        var profile_pic_upload = (!files.profile_pic)?null:(!files.profile_pic.name)?null:files.profile_pic; 
       
 if(!profile_pic_upload)
 {
    var profile_pic ='';
    
 }else{
    var oldpath = files.profile_pic.path;
   
    var filePath = "./uploads/"
    let newfilename = filePath +files.profile_pic.name
 
  // Read the file
 await fs.readFile(oldpath,async function (err, data) {
    if (err) throw err;
        // Write the file
    await  fs.writeFile(newfilename, data, function (err) {
            if (err) throw err;
 
        });
    });
    var profile_pic = files.profile_pic.name;
    
 }
 var email = fields.email;
 
    db.query(adminQueries.updateProfile,[profile_pic,email],function(error,result){
        if(error){
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if(result){
        res.status(200).send({
            success:true,
            msg : "Update Profile Successfully",
         });
        }else{
            res.status(200).send({
                success:true,
                msg : "update Profile Failed",
             });
        }               
    })
    });       
 
    } catch (err) {
       // console.log(err)
        return res.status(400).send({
            success: false,
            msg: "Unexpected internal error!!",
            err
        });
    }
 
 }



 exports.changePassword = async (db, req, res) => {

        var email = req.body.email;
        var currentPassword = req.body.currentPassword;
        var password = req.body.password;
        var password2 = req.body.password2;   
     
        try {
            if (currentPassword=='') {
                return res.status(200).send({
                    success: false,
                    msg: "Current password required!! "
                });
            }
     
            if (password=='') {
              return res.status(200).send({
                  success: false,
                  msg: "New password required!! "
              });
          }
          if (password2=='') {
           return res.status(200).send({
               success: false,
               msg: "Re-type password required!! "
           });
       }
       if (password!=password2) {
        return res.status(200).send({
            success: false,
            msg: "New password and re-type password not match!!"
        });
     }
     if (password.length < 6) {
        return res.status(200).send({
            success: false,
            msg: "password length should be 6 characters or more!!"
        });
    }


     
     db.query(adminQueries.getPassword,[email],function(error,result){
      
        if (error) {
           return res.status(200).send({
               success: false,
               msg: "error occured in getPassword",
               error
           });
       }
      // console.log('result',result);
       const hashpassword = CryptoJS.SHA256(currentPassword).toString(CryptoJS.enc.Hex);
        if(result[0].password==hashpassword){
      
           const newpassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
      
           db.query(adminQueries.updatepassword,[newpassword,email],function(error,result){
              if (error) {
                 return res.status(200).send({
                     success: false,
                     msg: "error occured in updatepassword!!",
                     error
                 });
             }
             if(result){
                return res.status(200).send({
                   success: true,
                   msg : "Password Changed Successfully"
                })
             }else{
              return res.status(200).send({
                 success: false,
                 msg : "Password Changed Failed due to Error"
              })
             }
            });
        }else{
           return res.status(200).send({
              success: false,
              msg : "Current Password Wrong"
           })
        
        }
     });
     }
         catch (err) {
          //  console.log(err)
            return res.status(400).send({
                success: false,
                msg: "Unexpected internal error!!",
                err
            });
        }
     
     }


exports.getRealEstateImage = async (db,req,res)=>{
        
        await db.query(adminQueries.getRealEstateImage,function(error,data){
            if(error){
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
            if(data.length > 0){
        res.status(200).send({
            success:true,
            msg : "Real estate images!!",
            response : data
        });
            }else{
                res.status(400).send({
                    success:false,
                    msg:"No data found!!"
                });            
            }
        });
     }
    

exports.updateWebImage = async (db,req,res)=>{

   var id = req.body.id;
   var slider1=  (!req.files['slider1'])?null:req.files['slider1'][0].filename;
   var slider2=  (!req.files['slider2'])?null:req.files['slider2'][0].filename;
   var slider3=  (!req.files['slider3'])?null:req.files['slider3'][0].filename;
   var text1=req.body.text1;
   var text2=req.body.text2;
   var text3=req.body.text3;
   var realEstateImage=  (!req.files['realEstateImage'])?null:req.files['realEstateImage'][0].filename;
   var logo=  (!req.files['logo'])?null:req.files['logo'][0].filename;
   var favicon=  (!req.files['favicon'])?null:req.files['favicon'][0].filename;

   await db.query(adminQueries.getWebImage, async function(error,result1){
            if(error){
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
     
        if(!slider1)
        {
            slider1 = result1[0].slider1;
        }
        if(!slider2)
      {
        slider2 = result1[0].slider2;
      }
      if(!slider3)
      {
        slider3 = result1[0].slider3;
      }
      if(!text1)
      {
       text1 = result1[0].text1;
      }
      if(!text2)
    {
       text2 = result1[0].text2;
    }
    if(!text3)
    {
       text3 = result1[0].text3;
    }
      if(!realEstateImage)
      {
        realEstateImage = result1[0].realEstateImage;
      }
      if(!logo)
      {
        logo = result1[0].logo;
      }
      if(!favicon)
      {
        favicon = result1[0].favicon;
      }
        var users = {
            "slider1" : slider1,
            "slider2" : slider2,
            "slider3"   : slider3,
            "logo"  :  logo,
            "favicon" : favicon,
            "realEstateImage":realEstateImage,
            "text1":text1,
            "text2":text2,
            "text3":text3
        }

        await db.query(adminQueries.updateWebImage,[users,id],function(error,data){
            if(error){
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
            if(data){
        res.status(200).send({
            success:true,
            msg : "Web Images Updated",
         
        });
            }else{
                res.status(400).send({
                    success:false,
                    msg:"No data found!!"
                });            
            }
        });
    });
     }


     exports.getWebImage = async (db,req,res)=>{
        
        await db.query(adminQueries.getWebImage,function(error,data){
            if(error){
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
            if(data.length > 0){
        res.status(200).send({
            success:true,
            msg : "Web Images",
            response : data,
            data:data[0]
        });
            }else{
                res.status(400).send({
                    success:false,
                    msg:"No data found!!"
                });            
            }
        });
     }

     exports.getwalletDetails = async (db,req,res)=>{
        var user_id = req.body.user_id
        await db.query(adminQueries.getwalletDetails, user_id ,function(error,data){
            if(error){
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
            if(data.length > 0){
        res.status(200).send({
            success:true,
            msg : "Wallet Details",
            response : data,
            data:data[0]
        });
            }else{
                res.status(400).send({
                    success:false,
                    msg:"No data found!!"
                });            
            }
        });
     }     
    
exports.updateRealEstateImage = async (db,req,res)=>{

    var id = req.body.id;
    var slider1=  (!req.files['slider1'])?null:req.files['slider1'][0].filename;
    var slider2=  (!req.files['slider2'])?null:req.files['slider2'][0].filename;
    var slider3=  (!req.files['slider3'])?null:req.files['slider3'][0].filename;
    var text1=req.body.text1;
    var text2=req.body.text2;
    var text3=req.body.text3;

    await db.query(adminQueries.getRealEstateImage, async function(error,result1){
             if(error){
             return res.status(400).send({
                 success: false,
                 msg: "Error occured!!",
                 error
             });
         }
      
         if(!slider1)
         {
             slider1 = result1[0].slider1;
         }
         if(!slider2)
       {
         slider2 = result1[0].slider2;
       }
       if(!slider3)
       {
         slider3 = result1[0].slider3;
       }
     
       if(!text1)
       {
        text1 = result1[0].text1;
       }
       if(!text2)
     {
        text2 = result1[0].text2;
     }
     if(!text3)
     {
        text3 = result1[0].text3;
     }

         var users = {
             "slider1" : slider1,
             "slider2" : slider2,
             "slider3"   : slider3,
             "text1":text1,
             "text2":text2,
             "text3":text3
            }
            console.log(users)
         await db.query(adminQueries.updateRealEstateImage,[users,id],function(error,data){
             if(error){
             return res.status(400).send({
                 success: false,
                 msg: "Error occured!!",
                 error
             });
         }
             if(data){
         res.status(200).send({
             success:true,
             msg : "Real estate images and text updated!!",
          
         });
             }else{
                 res.status(400).send({
                     success:false,
                     msg:"No data found!!"
                 });            
             }
         });
     });
      }
/* -------------------End Item -------------------------*/