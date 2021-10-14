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