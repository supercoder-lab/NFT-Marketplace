const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const config = require('../config');
const authQueries = require("../services/authQueries");
var validator = require("email-validator");
var fetch = require('node-fetch');
// Login User
exports.login = async (db, req, res) => {
    console.log("in login");
    var email = req.body.email;
    var password = req.body.password;
      

    try {
        if (email=='') {
            return res.status(400).send({
                success: false,
                msg: "Email required "
            });
        }
        if (password=='') {
            return res.status(400).send({
                success: false,
                msg: "password required"
            });
        }
        if (!validator.validate(email)) {
            return res.status(400).send({
                success: false,
                msg: "Email is not validate"
            });
        }

     
    db.query(authQueries.getUsersEmail,email, async function (error, user) {
            console.log(user);
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "unexpected error occured",
                    error
                });
            } else if (user.length == 0) {
                return res.status(400).send({
                    success: false,
                    msg: "No User found"
                });
               }
              else if(user[0].is_email_verify===0){
                return res.status(400).send({
                    success: false,
                    msg: "Please verify your Account"
                });
              }   
              else if(user[0].deactivate_account==1){
                return res.status(400).send({
                    success: false,
                    msg: "You are Account is Deactivated,Please contact to Admin"
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

            await db.query(authQueries.getUsersEmail,[email],async function(error,data){
                if(error){
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            }
        
                    return res.status(200).send({
                        success: true,
                         msg: "Login Successfully",
                        Token : jwtToken,
                        data : {
                            id : user[0].id,
                            user_email : user[0].email,
                            user_name : user[0].user_name,
                            full_name : user[0].full_name,  
                            user_address : data[0].public,
                            telent_status: user[0].telent_status,  
                            enableTwoFactor : user[0].enableTwoFactor
                          }
                    });
                })
                } else {
                    return res.status(400).send({
                        success: false,
                        msg: "Password does not match"
                    });
                }

            }
          })    
    } catch (err) {
        console.log(err)
        return res.status(400).send({
            success: false,
            msg: "unexpected internal error",
            err
        });
    }
}

