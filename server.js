var verifyaccount=require('./verifyCustomers.js');
var db=require('./queryDB.js');
var et=require('./executetransaction.js');
var express = require('express');
var cors = require('cors');
var bodybarts=require('body-parser');
var fileUpload=require('express-fileupload');
var app = express();
app.use(bodybarts.json());
app.use(bodybarts.urlencoded());
app.use(fileUpload());

//app.options('/transaction',cors());
 app.use(function(req,res,next){
      res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Method','POST');
    next();

 });

app.post('/transaction', function(req, res){
      res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Method','POST');
    var messagetype=req.body.messagetype;
    var r_obj="";
    if(messagetype=="verifycustomers"){
      var issuer=req.body.issuer;
      var receiver=req.body.receiver;
      
      verifyaccount.verify(issuer,receiver,function(r){
           res.setHeader('Access-Control-Allow-Origin','*');
               res.setHeader('Access-Control-Allow-Method','POST');
               r_obj=r;
              res.send(r_obj);
      });
    }else if(messagetype=="executetransaction"){
       let fingerprint=req.files.fingerprint;
       let cheque=req.files.cheque;
       var transaction=JSON.parse(req.body.transaction);
       et.executeTransaction(transaction,cheque,fingerprint,function(r){
              res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Method','POST');
               r_obj=r;
              res.send(r_obj);
       });
           
    }
   
});
app.post('/user', function(req, res){
  
    var messagetype=req.body.messagetype;
    var r_obj="";
    if(messagetype=="authenticate"){
        
      var username=req.body.username;
      var password=req.body.password;
      r_obj={"messagetype":messagetype,"response":false};
      if(username=="admin"&&password=="12345678"){
           res.setHeader('Access-Control-Allow-Origin','*');
          res.setHeader('Access-Control-Allow-Method','POST'); 
          r_obj.response=true;
         r_obj.isAdmin=true;
         r_obj.adminType="super";
          res.send(r_obj);
      }
      if(!r_obj.response){
         r_obj= db.dbutility(messagetype,{"username":username,"password":password,page:req.body.page},function(r){
               res.setHeader('Access-Control-Allow-Origin','*');
               res.setHeader('Access-Control-Allow-Method','POST');
               r_obj=r;
              res.send(r_obj);
          });
      }
       }else if(messagetype=="forgetpassword"){
            r_obj= db.dbutility(messagetype,{"username":req.body.username},function(r){
               res.setHeader('Access-Control-Allow-Origin','*');
               res.setHeader('Access-Control-Allow-Method','POST');
               r_obj=r;
              res.send(r_obj);
          });
      }else if(messagetype=="getpassword"){
            r_obj= db.dbutility(messagetype,{"username":req.body.username,"passcode":req.body.passcode},function(r){
               res.setHeader('Access-Control-Allow-Origin','*');
               res.setHeader('Access-Control-Allow-Method','POST');
               r_obj=r;
              res.send(r_obj);
          });
      }else if(messagetype=="addBank"){
          var b=req.body.bank;
          var a=req.body.admin;
          r_obj=db.dbutility(messagetype,{bank:b,admin:a},function(r){
               res.setHeader('Access-Control-Allow-Origin','*');
               res.setHeader('Access-Control-Allow-Method','POST');
               r_obj=r;
              res.send(r_obj);
          });
      }else if(messagetype=="loadBanks"){
          db.dbutility(messagetype,{_id:0,bank:1},function(r){
               res.setHeader('Access-Control-Allow-Origin','*');
               res.setHeader('Access-Control-Allow-Method','POST');
               r_obj=r;
              res.send(r_obj);
          });
      }else if(messagetype=="addUser"){
          var u=req.body.user;
          r_obj=db.dbutility(messagetype,{user:u},function(r){
               res.setHeader('Access-Control-Allow-Origin','*');
               res.setHeader('Access-Control-Allow-Method','POST');
               r_obj=r;
              res.send(r_obj);
          });
      }else if(messagetype=="deleteAdmin"){
          var a=req.body.admin;
          r_obj=db.dbutility(messagetype,{username:a},function(r){
               res.setHeader('Access-Control-Allow-Origin','*');
               res.setHeader('Access-Control-Allow-Method','POST');
               r_obj=r;
              res.send(r_obj);
          });
      }else if(messagetype=="deleteUser"){
          var u=req.body.user;
          r_obj=db.dbutility(messagetype,{username:u},function(r){
               res.setHeader('Access-Control-Allow-Origin','*');
               res.setHeader('Access-Control-Allow-Method','POST');
               r_obj=r;
              res.send(r_obj);
          });
      }else if(messagetype=="getAdmin"){
          var a=req.body.admin;
          r_obj=db.dbutility(messagetype,{username:a,bank:req.body.bank,role:"admin"},function(r){
               res.setHeader('Access-Control-Allow-Origin','*');
               res.setHeader('Access-Control-Allow-Method','POST');
               r_obj=r;
              res.send(r_obj);
          });
      }else if(messagetype=="getUser"){
          var u=req.body.user;
          r_obj=db.dbutility(messagetype,{username:u,bank:req.body.bank,role:"user"},function(r){
               res.setHeader('Access-Control-Allow-Origin','*');
               res.setHeader('Access-Control-Allow-Method','POST');
               r_obj=r;
              res.send(r_obj);
          });
      }else if(messagetype=="loadAdmins"){
         
          r_obj=db.dbutility(messagetype,{bank:req.body.bank,role:"admin"},function(r){
               res.setHeader('Access-Control-Allow-Origin','*');
               res.setHeader('Access-Control-Allow-Method','POST');
               r_obj=r;
              res.send(r_obj);
          });
      }else if(messagetype=="loadUsers"){
         
          r_obj=db.dbutility(messagetype,{bank:req.body.bank,role:"user"},function(r){
               res.setHeader('Access-Control-Allow-Origin','*');
               res.setHeader('Access-Control-Allow-Method','POST');
               r_obj=r;
              res.send(r_obj);
          });
      }else if(messagetype=="changePassword"){
          r_obj=db.dbutility(messagetype,{username:req.body.username,oldpassword:req.body.oldpassword,newpassword:req.body.newpassword},function(r){
               res.setHeader('Access-Control-Allow-Origin','*');
               res.setHeader('Access-Control-Allow-Method','POST');
               r_obj=r;
              res.send(r_obj);
          });
      }
    
   
});
app.get('/bank', function(req, res){
     res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Method','POST');
  res.send('Hello bank');
});
/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}