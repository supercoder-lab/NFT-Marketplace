
const config = require('../config');
const authQueries = require('../services/authQueries');
const marketplaceQueries = require('../services/marketplaceQueries');
const CryptoJS = require("crypto-js");
var validator = require("email-validator");
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer')
var fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const { user } = require('../config');
var QRCode = require('qrcode');
var speakeasy = require("speakeasy");
const { Console } = require('console');
const adminQueries = require('../services/adminQueries');
// Register new user
exports.register = async (
    db, req, res) => {

   var full_name = req.body.full_name;
    var user_name = req.body.user_name;
    var email = req.body.email;
    var confirm_email =req.body.confirm_email;
    var password = req.body.password;
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    var num2 = /[0123456789]+/;
    var is_subscribed = req.body.is_subscribed;
  

    try {
      if(!num2.test(password) ){
         return res.status(400).send({
            success: false,
            msg: "password should include one numeric character"
        });
         }

      if(!format.test(password)){
         return res.status(400).send({
            success: false,
            msg: "password should include one special character"
        });
         }
        
            
      if (!full_name) {
         return res.status(400).send({
             success: false,
             msg: "Full Name required "
         });
     }  
       if (!user_name) {
      return res.status(400).send({
          success: false,
          msg: "User Name required "
      });
  }
        if (!email) {
            return res.status(400).send({
                success: false,
                msg: "Email required "
            });
        }
        if (!validator.validate(email)) {
         return res.status(400).send({
             success: false,
             msg: "Email is not validate"
         });
     }
        if (!password) {
            return res.status(400).send({
                success: false,
                msg: "password required"
            });
        }

        if (!confirm_email) {
            return res.status(400).send({
                success: false,
                msg: "Confirm email required"
            });
        }


        if (email !== confirm_email) {
            return res.status(400).send({
                success: false,
                msg: "email not match"
            });
        }

        if (password.length < 8) {
            return res.status(400).send({
                success: false,
                msg: "password length should be 8 characters or more"
            });
        }

        
        await db.query(authQueries.getUsersEmail, [email], async function (error, results) {
                    
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            } else if (results.length > 0) {
                    if(email === results[0].email) {
                        return res.status(400).send({
                            success: false,
                            msg: "Email Already Registered! Try New Email."
                    
                        });
                    }     
            }
            
            if(is_subscribed == 1) {
                      
                var sub = {
                    "email" : email,
                    "ip" : null,
                    "datetime" : new Date()
                }
    
                await db.query(authQueries.addSubscriber,[sub])
             
            }
         
              const Token = jwt.sign({
                email: req.body.email
           
            }, config.JWT_SECRET_KEY, {
                expiresIn: config.SESSION_EXPIRES_IN
            })

            // var transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //       user: `bilal.espsofttech@gmail.com`,
            //       pass: `Bilal123#`
            //     }
            //   });
                    
            var transporter = nodemailer.createTransport({
               host: 'espsofttechnologies.com',
               port:465,
               secure: true,
               auth: {
                 user: 'developer@espsofttechnologies.com',
                 pass:  'Espsoft123#'
               },
               tls: {
                   rejectUnauthorized: false
               }
             });
           

      var mailOptions = {
         from: 'developer@espsofttechnologies.com',
     //   from : 'bilal.espsofttech@gmail.com', 
        to: `${email}`,
        subject: 'Account Activation Link',
        html : `<div style="background-color:#f4f4f4">
        <div>
           <div style="margin:0px auto;max-width:800px">
              <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%">
                 <tbody>
                    <tr>
                       <td style="direction:ltr;font-size:0px;padding:10px 0px;text-align:center">
                       </td>
                    </tr>
                 </tbody>
              </table>
           
           </div>
       <div style="background:black;background-color:#6f43ec;margin:0px auto;border-radius:5px;max-width:800px">
          <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;border-radius:5px">
             <tbody>
                <tr>
                   <td style="direction:ltr;font-size:0px;padding:8px 0;text-align:center">
                      <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                         <table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
                            <tbody>
                               <tr>
                                  <td align="center" style="font-size:0px;padding:0px 25px 0px 25px;word-break:break-word">
                                     <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px">
                                        <tbody>
                                           <tr>
                                              <td style="width:126px">
                                                 <img height="auto" src="images/logo-new.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px" width="150"  class="CToWUd">
                                              </td>
                                           </tr>
                                        </tbody>
                                     </table>
                                  </td>
                               </tr>
                            </tbody>
                         </table>
                      </div>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
           <div style="height:20px">
              &nbsp;
           </div>
           <div style="background:#fff;margin:0px auto;border-radius:5px;max-width:800px">
              <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;border-radius:5px">
                 <tbody>
                    <tr>
                       <td style="direction:ltr;font-size:0px;padding:0px;text-align:center">
                          <div style="margin:0px auto;max-width:800px">
                             <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%">
                                <tbody>
                                   <tr>
                                      <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
                                         <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                                            <table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
                 <tbody>
                    <tr>
                       <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
                          <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1;text-align:left;color:#000"><b>Dear ${user_name},</b></div>
                       </td>
                    </tr>
                    <tr>
                       <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
                          <div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
                          <h2>Please <a href='http://localhost:8000/api/verifyAccount/${Token}'>click here </a> to activate your account</h2>
                           
                            </div>
                       </td>
                    </tr>
                    <tr>
                       <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
                          <div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
                            Thanks <br>
                            Vulnerary Team
                          </div>
                       </td>
                    </tr>
                    
                 </tbody>
                </table>
                                         </div>
                                      </td>
                                   </tr>
                                </tbody>
                             </table>
                          </div>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>
           <div style="height:20px">
              &nbsp;
           </div>
           <div style="background:#000;background-color:#000;margin:0px auto;border-radius:5px;max-width:800px">
              <font color="#888888">
                    </font><font color="#888888">
                 </font><font color="#888888">
              </font><table align="center" border="0" cellpadding="0" cellspacing="0" style="background:#b09af7;background-color:#000;width:100%;border-radius:5px">
                 <tbody>
                    <tr>
                       <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
                          <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                             <font color="#888888">
                                   </font><font color="#888888">
                                </font><font color="#888888">
                             </font><table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
                                <tbody>
                                   <tr>
                                      <td align="center" style="font-size:0px;padding:0px 25px;word-break:break-word">
                                         <div style="font-family:Arial,sans-serif;font-size:13px;line-height:25px;text-align:left;color:#fff"><b>Vulnerary Team

                                         </b></div>
                                      </td>
                                      <td align="center" style="font-size:0px;padding:0px 25px;word-break:break-word">
                                         <div style="font-family:Arial,sans-serif;font-size:13px;line-height:25px;text-align:right;color:#fff"><b style="color:white"><a href="mailto:support@vulnerary.io" target="_blank">support@vulnerary.io</a></b></div><font color="#888888">
                                      </font></td></tr></tbody></table><font color="#888888">
                          </font></div><font color="#888888">
                       </font></td></tr></tbody></table><font color="#888888">
           </font></div><font color="#888888">
        </font></div><font color="#888888">
     </font></div>`
      };
        
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
       //   console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      var secret = speakeasy.generateSecret({length: 20});

      QRCode.toDataURL(secret.otpauth_url, function(err, data_url) {
        
        // const hash = bcrypt.hashSync(password, 8);
               const hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
        //     console.log('hash',hash);
                var users = {
                    "full_name" : full_name,
                    "user_name" : user_name,
                    "email": email,
                    "password": hash,
                    "is_email_verify" : 0,
                    "googleAuthCode" : secret.base32,
                    "QR_code" : data_url,
                    "deactivate_account" : 0,
                    "is_subscribed" : is_subscribed
                }
                 db.query(authQueries.insertUserData, users,async function(error,result){
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "error occured",
                            error
                        });
                    }       
                
                  return res.status(200).send({
                    success: true,
                    msg: "Email has been sent, kindly activate your account"
                });
            });  
        });
    });
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "user not registered due to internal error"
        });
    }
}

exports.activateAccount = async (db,req,res)=>{
    var token = req.params;
  //console.log(token)
    if(token){
        jwt.verify(token.token,config.JWT_SECRET_KEY, async function(err,decodedToken){
         if(err){
            return res.status(400).send({
                success: false,
                msg: "Incorrect or Expired Link"
            });
         }   
       //  console.log('decode',decodedToken.email); 
      
         
            await db.query(authQueries.updateStatus,[decodedToken.email],function(err,data){
                if(err) throw err;
                
             
            });
            return res.status(200).send({
                success: true,
                msg: "Account Successfully Verified"
            });    
        })
    }else{ 
         return res.status(400).send({
        success: false,
        msg: "something went wrong"
    });
    }
}


exports.forgot = async (
   db, req, res) => {
   
   var email = req.body.email;
   try {
       
       if (email=='') {
           return res.status(400).send({
               success: false,
               msg: "Email required "
           });
       }
       if (!validator.validate(email)) {
         return res.status(400).send({
             success: false,
             msg: "Email is not validate"
         });
     }
   
  
       await db.query(authQueries.getUsersEmail, [email], async function (error, results) {
        
           
           if (error) {
               return res.status(400).send({
                   success: false,
                   msg: "error occured",
                   error
               });
               
           }   
           else if (results.length > 0) {
                
         
             
                    
             const Token = jwt.sign({
               email: req.body.email
          
           }, config.JWT_SECRET_KEY, {
               expiresIn: config.SESSION_EXPIRES_IN
           })

           var transporter = nodemailer.createTransport({
            host: 'espsofttechnologies.com',
            port:465,
            secure: true,
            auth: {
              user: 'developer@espsofttechnologies.com',
              pass:  'Espsoft123#'
            },
            tls: {
                rejectUnauthorized: false
            }
          });

         //   var transporter = nodemailer.createTransport({
         //       service: 'gmail',
         //       auth: {
         //          user: `bilal.espsofttech@gmail.com`,
         //          pass: `Bilal123#`
         //       }
         //     });
                              
     var mailOptions = {
        from: 'developer@espsofttechnologies.com',
      // from : "bilal.espsofttech@gmail.com",
       to: `${email}`,
       subject: 'Reset Password Link',
       html : `<div style="background-color:#f4f4f4">
       <div>
          <div style="margin:0px auto;max-width:800px">
             <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%">
                <tbody>
                   <tr>
                      <td style="direction:ltr;font-size:0px;padding:10px 0px;text-align:center">
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
      <div style="background:black;background-color:black;margin:0px auto;border-radius:5px;max-width:800px">
         <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;border-radius:5px">
            <tbody>
               <tr>
                  <td style="direction:ltr;font-size:0px;padding:8px 0;text-align:center">
                     <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                        <table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
                           <tbody>
                              <tr>
                                 <td align="center" style="font-size:0px;padding:0px 25px 0px 25px;word-break:break-word">
                                    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px">
                                       <tbody>
                                          <tr>
                                             <td style="width:126px">
                                                <img height="auto" src="images/logo-new.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px" width="150" class="CToWUd">
                                             </td>
                                          </tr>
                                       </tbody>
                                    </table>
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>
          <div style="height:20px">
             &nbsp;
          </div>
          <div style="background:#fff;margin:0px auto;border-radius:5px;max-width:800px">
             <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;border-radius:5px">
                <tbody>
                   <tr>
                      <td style="direction:ltr;font-size:0px;padding:0px;text-align:center">
                         <div style="margin:0px auto;max-width:800px">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%">
                               <tbody>
                                  <tr>
                                     <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
                                        <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                                           <table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
                <tbody>
                   <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
                         <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1;text-align:left;color:#000"><b>Dear ${results[0].full_name}</b></div>
                      </td>
                   </tr>
                   <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
                         <div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
                         <h4>Please <a href='http://localhost:8000/api/resetpassword/${Token}'>click here </a>  to Reset  your Password</h4>
                         
           
                         </div>
                      </td>
                   </tr>
                   <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
                         <div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
                           Thanks <br>
                           Vulnerary Team
                         </div>
                      </td>
                   </tr>
                   
                </tbody>
               </table>
                                        </div>
                                     </td>
                                  </tr>
                               </tbody>
                            </table>
                         </div>
                      </td>
                   </tr>
                </tbody>
             </table
          </div>
          <div style="height:20px">
             &nbsp;
          </div>
          <div style="background:#000;background-color:#000;margin:0px auto;border-radius:5px;max-width:800px">
             <font color="#888888">
                   </font><font color="#888888">
                </font><font color="#888888">
             </font><table align="center" border="0" cellpadding="0" cellspacing="0" style="background:#000;background-color:#000;width:100%;border-radius:5px">
                <tbody>
                   <tr>
                      <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
                         <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                            <font color="#888888">
                                  </font><font color="#888888">
                               </font><font color="#888888">
                            </font><table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
                               <tbody>
                                  <tr>
                                     <td align="center" style="font-size:0px;padding:0px 25px;word-break:break-word">
                                        <div style="font-family:Arial,sans-serif;font-size:13px;line-height:25px;text-align:left;color:#fff"><b>Vulnerary Team

                                        </b></div>
                                     </td>
                                     <td align="center" style="font-size:0px;padding:0px 25px;word-break:break-word">
                                        <div style="font-family:Arial,sans-serif;font-size:13px;line-height:25px;text-align:right;color:#fff"><b style="color:white"><a href="mailto:support@vulnerary.io" target="_blank">support@vulnerary.io</a></b></div><font color="#888888">
                                     </font></td></tr></tbody></table><font color="#888888">
                         </font></div><font color="#888888">
                      </font></td></tr></tbody></table><font color="#888888">
          </font></div><font color="#888888">
       </font></div><font color="#888888">
    </font></div>`
     };
       
     transporter.sendMail(mailOptions, function(error, info){
       if (error) {
     //    console.log(error);
       } else {
         console.log('Email sent: ' + info.response);
       }
     });

          
                 return res.status(200).send({
                   success: true,
                   msg: "Check your email for a link to reset your password"
           });  
      
         }
                     else{
                     return res.status(400).send({
                           success: false,
                           msg: "Email Not in Database."
                   
                       });
                   }
             
                  
               });
   } catch (err) {
       return res.status(500).send({
           success: false,
           msg: "user not registered due to internal error"
       });
   }
}



exports.Resetpassword = async (db,req,res)=>{
   var token = req.body;
   var email = req.body.email;
   var password = req.body.password;
   var password2 = req.body.password2;
   var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
   var num2 = /[0123456789]+/;

     if(!num2.test(password) ){
        return res.status(400).send({
           success: false,
           msg: "password should include one numeric character"
       });
        }

     if(!format.test(password)){
        return res.status(400).send({
           success: false,
           msg: "password should include one special character"
       });
        }
       
   if(password=='') {
      return res.status(200).send({
          success: false,
          msg: "password required"
      });
  } 
  if(password2=='') {
   return res.status(200).send({
       success: false,
       msg: "Confirm  password required"
   });
}  

if (password.length < 6) {
   return res.status(200).send({
       success: false,
       msg: "password length should be 8 characters or more"
   });
}

if (password !== password2) {
   return res.status(200).send({
       success: false,
       msg: "password not match"
   });
}
   if(token){
       jwt.verify(token.token,config.JWT_SECRET_KEY, async function(err,decodedToken){
        // if(err){
        //    return res.status(400).send({
        //        success: false,
        //        msg: "Incorrect or Expired Link"
        //    });
        // }   
     //  console.log('decode',decodedToken.email); 
        const hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
        
           await db.query(authQueries.updatepassword,[hash,email],function(err,data){
               if(err) throw err;
               
            
           });
           return res.status(200).send({
               success: true,
               msg: "You are Password Changed, Now Login"
           });    
       })
   }else{ 
        return res.status(400).send({
       success: false,
       msg: "something went wrong"
   });
   }
}



exports.getCountry = async (db, req, res) => {

   try {
       db.query(authQueries.getCountry,function(error,result){
         if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }
        if(result.length>0){
           return res.status(200).send({
              success: true,
              msg : "Country Details",
             response : result
           })
        }else{
         return res.status(400).send({
            success: false,
            msg : "No Data"
         })
        }
       })
    
   } catch (err) {
      // console.log(err)
       return res.status(400).send({
           success: false,
           msg: "unexpected internal error",
           err
       });
   }

}

exports.getUserProfile = async (db, req, res) => {

   var email = req.body.email;
   try {
       db.query(authQueries.getUserProfile,[email],function(error,result){
         if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }
        if(result.length>0){
           return res.status(200).send({
              success: true,
              msg : "UserProfile Details",
             response : result[0]
           })
        }else{
         return res.status(400).send({
            success: false,
            msg : "No Data"
         })
        }
       })
    
   } catch (err) {
    //   console.log(err)
       return res.status(400).send({
           success: false,
           msg: "unexpected internal error",
           err
       });
   }

}

exports.userProfile = async (db, req, res) => {

   var email = req.body.email;
   var user_name = req.body.user_name;
   var first_name = req.body.first_name;
   var last_name = req.body.last_name;
   var dob = req.body.dob;
   var phone = req.body.phone;
   var country_id = req.body.country_id;   

   try {
       if (user_name=='') {
           return res.status(200).send({
               success: false,
               msg: "User Name required "
           });
       }
       if (first_name=='') {
         return res.status(200).send({
             success: false,
             msg: "First Name required "
         });
     }
     if (last_name=='') {
      return res.status(200).send({
          success: false,
          msg: "Last Name required "
      });
  }

   //     if (contact.length !=10) {
   //       return res.status(400).send({
   //           success: false,
   //           msg: "Contact number must be 10 Digit number"
   //       });
   //   }
     
       var users = {
          "user_name" : user_name,
         "first_name" : first_name,
         "last_name" : last_name,
        "dob" : dob,
        "phone": phone,
         "country_id" : country_id
       }

       db.query(authQueries.updateUser,[users,email],function(error,result){
         if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }
        if(result){
           return res.status(200).send({
              success: true,
              msg : "User Profile Updated"
           })
        }else{
         return res.status(400).send({
            success: false,
            msg : "User Profile Updation Failed due to Error"
         })
        }
       })
    
   } catch (err) {
      // console.log(err)
       return res.status(400).send({
           success: false,
           msg: "unexpected internal error",
           err
       });
   }

}


exports.changePassword = async (db, req, res) => {

   var email = req.body.email;
   var currentPassword = req.body.currentPassword;
   var password = req.body.password;
   var password2 = req.body.password2;   
   var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
   var num2 = /[0123456789]+/;


   try {
    if(!num2.test(password) ){
        return res.status(400).send({
           success: false,
           msg: "password should include one numeric character"
       });
        }

     if(!format.test(password)){
        return res.status(400).send({
           success: false,
           msg: "password should include one special character"
       });
        }
       
      
       if (currentPassword=='') {
           return res.status(200).send({
               success: false,
               msg: "Current Password required "
           });
       }

       if (password=='') {
         return res.status(200).send({
             success: false,
             msg: "New Password required "
         });
     }
     if (password2=='') {
      return res.status(200).send({
          success: false,
          msg: "Re-Type Password required "
      });
  }
  if (password!=password2) {
   return res.status(200).send({
       success: false,
       msg: "New Password and Re-type Password not Match"
   });
}

db.query(authQueries.getPassword,[email],function(error,result){
 
   if (error) {
      return res.status(400).send({
          success: false,
          msg: "error occured",
          error
      });
  }
// console.log('result',result[0].password);
  const hashpassword = CryptoJS.SHA256(currentPassword).toString(CryptoJS.enc.Hex);
 
  
  if(result[0].password==hashpassword){
 
      const newpassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
 
      db.query(authQueries.updatepassword,[newpassword,email],function(error,result){
         if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }
        if(result){
           return res.status(200).send({
              success: true,
              msg : "Password Changed Successfully"
           })
        }else{
         return res.status(400).send({
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
           msg: "unexpected internal error",
           err
       });
   }

}

exports.deActivateAccount = async (db, req, res) => {

   var email = req.body.email;
   try {
       db.query(authQueries.updateAccount,[email],function(error,result){
         if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }
        if(result){
           return res.status(200).send({
              success: true,
              msg : "You are Account Now Deactivated",
            })
        }else{
         return res.status(400).send({
            success: false,
            msg : "No Data"
         })
        }
       })
    
   } catch (err) {
    //   console.log(err)
       return res.status(400).send({
           success: false,
           msg: "unexpected internal error",
           err
       });
   }

}


exports.updateProfilePic = async (db, req, res) => {

   var email = req.body.email;
   var profile_pic =  (!req.files['profile_pic'])?null:req.files['profile_pic'][0].filename;
   var banner =  (!req.files['banner'])?null:req.files['banner'][0].filename;
  

   db.query(authQueries.getProfile,[email],function(error,result1){
      if(error){
         return res.status(400).send({
             success: false,
             msg: "error occured",
             error
         });
     }
    
  if(!profile_pic)
      {
      profile_pic = result1[0].profile_pic;
      }
  if(!banner)
      {
      banner = result1[0].banner;
      }


   db.query(authQueries.updateProfile,[profile_pic,banner,email],function(error,result){
       if(error){
           return res.status(400).send({
               success: false,
               msg: "error occured",
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
}

exports.getProfilePic = async (db,req,res)=>{
   var email = req.body.email;
   
   await db.query(authQueries.getProfile,[email],function(error,data){
       if(error){
       return res.status(400).send({
           success: false,
           msg: "error occured",
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
               msg:"No Data"
           });            
       }
   });
}

exports.getAboutDetail = async (db,req,res)=>{
   var email = req.body.email;
   
   await db.query(authQueries.aboutDetail,[email],function(error,data){
       if(error){
       return res.status(400).send({
           success: false,
           msg: "error occured",
           error
       });
   }
       if(data.length > 0){
   res.status(200).send({
       success:true,
       msg : "About Details",
       response : data[0]
   });
       }else{
           res.status(400).send({
               success:false,
               msg:"No Data"
           });            
       }
   });
}


exports.updateAboutDetail = async (db,req,res)=>{
   var email = req.body.email;
   var description = req.body.description;
   var facebook = req.body.facebook;
   var insta = req.body.insta;
   var twitter= req.body.twitter;
   var pinterest = req.body.pinterest;
   var website  = req.body.website;
   var youtube  = req.body.youtube;
   var artstation = req.body.artstation;
   var behance = req.body.behance;
   var steemit = req.body.steemit


   await db.query(authQueries.updateaboutDetail,[description,facebook,insta,twitter,pinterest,website,youtube,artstation,behance,steemit,email],function(error,data){
       if(error){
       return res.status(400).send({
           success: false,
           msg: "error occured",
           error
       });
   }
       if(data){
   res.status(200).send({
       success:true,
       msg : "About Details Updated"
   });
       }else{
           res.status(400).send({
               success:false,
               msg:"Updation Error"
           });            
       }
   });
}

exports.follow = async (db,req,res)=>{
 
   var follower_id = req.body.follower_id;
   var following_id = req.body.following_id;
   var ip = null;
   var datetime = new Date();
   
try{
   if(!follower_id){
       return res.status(400).send({
           success: false,
           msg: "Follower ID Required"
       }); 
   }

 
   if (!following_id) {
       return res.status(400).send({
           success: false,
           msg: "Following ID required"
       });
   } 

   //For Get Follow
   await db.query(authQueries.getFollow,[follower_id,following_id],function(error,data){
       if(error){
           res.status(400).send({
               success:false,
               msg : "get Error",
               error
           });
       }
     
       if(data.length > 0){
          //For Unfollow
    db.query(authQueries.removeFollow,[follower_id,following_id], function(error,data){
       if(error){
       return res.status(400).send({
           success: false,
           msg: "error occured | Remove Error",
           error
       });
   }   
           res.status(200).send({
               success:true,
               msg:"Unfollow Successfully",
           });  
       
            });    
       }else{

   var follow = {
       follower_id : follower_id,
       following_id : following_id,
       ip : ip,
       datetime : datetime,
   }
    
           //For Add Follow
   db.query(authQueries.addFollow,follow, function(error,result){
       if(error){
           res.status(400).send({
               success:false,
               msg: "error occured | add Error",
               error: error.sqlMessage
           });
       }
       res.status(200).send({
           success:true,
           msg:"Follower And Following Add successfully"
       });
   });
   }
   });

}catch(error){
   res.status(400).send({
       success:false,
       msg:"Something want wrong, Please try again!",
       err:error
   });
}
}
  

exports.insertView = async (db,req,res)=>{
   var user_id = req.body.user_id;
   var viewer_id = req.body.viewer_id;
   var ip = null;
   var datetime = new Date();
   
   
   var views = {
      "user_id" : user_id,
      'viewer_id' : viewer_id,
      "ip" : ip,
      "datetime" : datetime,
  }
   

   await db.query(authQueries.insertView,[views],function(error,data){
       if(error){
       return res.status(400).send({
           success: false,
           msg: "error occured",
           error
       });
   }
       if(data){
   res.status(200).send({
       success:true,
       msg : "Insert View Successfully",
   });
       }else{
           res.status(400).send({
               success:false,
               msg:"Error in Insertion"
           });            
       }
   });
}


exports.getUserDetail = async (db,req,res)=>{
 
   var user_id = req.body.user_id;
   var following_id = req.body.following_id;

   await db.query(authQueries.getUserDetail,[user_id,following_id],async function(error,data){
       if(error){
       return res.status(400).send({
           success: false,
           msg: "error occured",
           error
       });
   }
    await db.query(marketplaceQueries.getWalletDetail,[user_id], async function(error,walletData){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "Error occured in wallet detail!!",
            error
        });
    }
        if(walletData.balance>=0){
        data[0].wallet_balance_usd=(walletData[0].balance).toFixed(2);
        }
        else{
            data[0].wallet_balance_usd=0.00;
        data[0].wallet_balance_eth=0.00;
        }

       if(data.length>0){
        res.status(200).send({
       success:true,
       msg : "Get User Details",
       response : data[0]
   });
       }else{
           res.status(400).send({
               success:false,
               msg:"No Data"
           });            
       }
   });
});
}

exports.addSubscriber = async (db,req,res)=>{
   
    var email = req.body.email;


    await db.query(authQueries.getSubscriber,email, async function(error,data){
        if(error){
        return res.status(400).send({
            success: false,
            msg: "error occured",
            error
        });
    }
  
        if(data.length > 0){
        res.status(400).send({
        success:false,
        msg : "This email is already Subscribed!!",
    });
        }else{
            var sub = {
                "email" : email,
                "ip" : null,
                "datetime" : new Date()
            }

            await db.query(authQueries.addSubscriber,[sub],function(error,result){
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
                    msg : "You are subscribed successfully!!",
                });
            }else{
                res.status(400).send({
                    success:false,
                    msg:"Insertion Error!! "
                });  
            }
    });
        }
});
}
 