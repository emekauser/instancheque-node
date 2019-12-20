var MongoClient = require('mongodb').MongoClient;
var moment=require('moment-timezone');
var CryptoJS=require('crypto-js');
var mail=require('./sendMail.js');
var createDb=function(){
    var url="mongodb://localhost:27017/instancheque";
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
        console.log("Database instancheque created");
        db.close();
    });
};
var createCollection=function(collname){
     var url="mongodb://localhost:27017/";
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var dbc=db.db("instancheque");
        dbc.createCollection(collname,function(err,res){
             console.log("Database collection created ="+collname);
               db.close();
        });
       
    });
};
var addBank=function(collname,bank,callback){
      var re=false;
     var url="mongodb://localhost:27017/";
    MongoClient.connect(url,function(err,db){
         if(err) {
            throw err; 
            re=false;
        }else{
        var dbc=db.db("instancheque");
        dbc.collection(collname).insertOne(bank,function(err,res){
              if(err) {
               throw err; 
               re=false;
               }else{ 
               console.log("bank inserted "+res);
               re=true; 
               }
                db.close(); 
               callback(re);
              
        });
      }
    });
    
};
var deleteBank=function(collname,bank,callback){
    var re=false;
     var url="mongodb://localhost:27017/";
    MongoClient.connect(url,function(err,db){
        if(err) {
             throw err;
            re=false;
        }else{
        var dbc=db.db("instancheque");
        dbc.collection(collname).deleteOne(bank,function(err,res){
            if(err) {
                throw err; 
               re=false;
            } else{
              re=true;
              console.log("bank delete "+res);
            }
              db.close(); 
            callback(re);
        
        });
        }
    });
};
//can be used to insert admin,users,transations infos
var addGeneral=function(collname,bank,callback){
    var re=false;
     var url="mongodb://localhost:27017/";
    MongoClient.connect(url,function(err,db){
         if(err) {
               re=false;
         } else{
        var dbc=db.db("instancheque");
        dbc.collection(collname).insertOne(bank,function(err,res){
           
          
            if(err) {
               throw err;
               re=false;
            } else{
                re=true; 
            }
             db.close(); 
            callback(re);
              
        });
        }
    });
  
};
var deleteGeneral=function(collname,bank,callback){
      var re=false;
     var url="mongodb://localhost:27017/";
    MongoClient.connect(url,function(err,db){
         if(err) {
            re=false;
        } else{
        var dbc=db.db("instancheque");
        dbc.collection(collname).deleteOne(bank,function(err,res){
           
           
             if(err) {
                throw err;  
               re=false;
            }else{
              re=true; 
            } 
             db.close(); 
            callback(re);
           
        });
      }
    });
};

var update=function(collname,query,update,callback){
      var re=false;
     var url="mongodb://localhost:27017/";
    MongoClient.connect(url,function(err,db){
        if(err) {
           re=false;
        } else{
        var dbc=db.db("instancheque");
        dbc.collection(collname).updateOne(query,update,function(err,res){
            
            if(err) {
                throw err; 
               re=false;
            }else{ 
               re=true; 
            }
             db.close();
            callback(re);
               
        });
        }
    });
    return re
};
var get=function(collname,query,callback){
    var re;
     var url="mongodb://localhost:27017/";
    MongoClient.connect(url,function(err,db){
        if(err) {
            throw err;
        }else{
        var dbc=db.db("instancheque");
        dbc.collection(collname).find(query).toArray(function(err,result){
           if(err) {
               throw err;
                db.close(); 
           } else{
              re=result;
                db.close(); 
              callback(re);
           }
          
        });
        }
    });
 
};
var getAll=function(collname,query,callback){
    var re=[];
     var url="mongodb://localhost:27017/";
    MongoClient.connect(url,function(err,db){
        if(err) {
            throw err;
        }else{
        var dbc=db.db("instancheque");
        dbc.collection(collname).find({},query).toArray(function(err,result){
           if(err) {
               throw err;
db.close();  
            }else{
              re=result;
              db.close(); 
              callback(re);
              
            }
               
        });
        }
    });
};

var getAndSort=function(collname,query,callback){
    var re=[];
     var url="mongodb://localhost:27017/";
    MongoClient.connect(url,function(err,db){
        if(err) {
            throw err;
        }else{
        var dbc=db.db("instancheque");
        dbc.collection(collname).find().sort(query).toArray(function(err,result){
           if(err) {
              // throw err;
                db.close();  
            }else{
              re=result;
              db.close(); 
              callback(re);
              
            }
               
        });
        }
    });
};

var collectionExists=function(collname){
    var success=false;
     var url="mongodb://localhost:27017/";
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var dbc=db.db("instancheque");
        dbc.listCollections({name:collname}).next(function(err,collinfo){
               if(collinfo){
                  success=true; 
               }
               db.close();
        });
       
    });
};

var analyseStats=function(stats){
    var analyze={
        years:{},
        months:{1:0,2:0,3:0},
        topmonthlyemployee:{},
        weeks:{},
        toptransactingbanks:{}
        
        };
    for(var i=0 ;i<stats.length ;i++){
        var d=new Date(moment().tz(stats[i].time,"Africa/Luanda").format());
        var now=new Date(moment().tz("Africa/Luanda").format());
        if(now.getYear()==d.getYear()){
            if(d.getMonth()==analyze.months){
                analyze.months=analyze.months+1;
                if(d.getMonth==now.getMonth()){
                   // analyze.weeks=d.
                }
            }
            
           // analyse.year.
        }
    }
};
function getMonth(data,info){
   // data.
}

exports.dbutility=function(type,value,callback){
    var response={};
    response.messagetype=type;
    if(type=="addBank"){
        value.bank.key=calculateHash("instancheque.com"+value.bank.bank);
        addBank("banks",value.bank,function(re){
             value.admin.password=CryptoJS.AES.encrypt(value.admin.password,key);
             addGeneral("users",value.admin,function(r){
                  response.success=true;
                  response.info="Bank successfully added" ;
                  
                  callback(response);
                   //send maill to user
                   mail.sendMail("Hello "+arr[0].fullname+", </br>  "+value.bank.bank+" just got listed on InstanCheque platform. "+
                   value.admin.Admin+" is selected as the Admin for "+value.bank.bank+
                   "Your rignt include adding/Remove users(workers) and also mornitoring your bank transactions through our platform."+
                   "Your username is "+value.admin.Admin+" and password is "+value.admin.password+" Change your password immediately here"+
                   "htpps://www.instancheque.com/account.php?"+value.admin.Admin,"InstanCheque Team",function(r){});
                 });
            
        });
       
    }else if(type=="getBankKey"){
       getAll("banks",{bank:value.bank},function(re){
           var arr=re;
           if(arr.length!=0)
              response.key=arr[0].key;
              callback(response);
       });
      
    }else if(type=="loadBanks"){
        getAll("banks",value,function(re){
            var arr=re;
             var arr2=[];
            if(arr.length!=0){
                for(var i=0; i<arr.length ;i++){
                      arr2[i]={bank:arr[i].bank};
                }
            }
            response.banks=arr2;;
            response.messagetype=type;
            
            callback(response);
        });
         
    }else if(type=="addUser"){
      get("users",{username:value.user.username},function(re2){
             var suc=false;
             var arr=re2;
             
             if(arr.length!=0){
                   response.username=value.user.username;
                   
                   response.success=false;
                   callback(response);
             }else{
                 var p=value.user.password;
                value.user.password=CryptoJS.AES.encrypt(value.user.password,key);
                addGeneral("users",value.user,function(re){
                 response.username=value.user.username;
                 response.success=re;
                 callback(response);
                 if(value.user.role=="admin"){
                     mail.sendMail("Hello "+arr[0].fullname+", </br> Your have been added to instanCheque as an admin for "+
                       value.user.bank+
                   "Your rignt include adding/Remove users(workers) and also mornitoring your bank transactions through our platform."+
                   "Your username is "+value.user.username+" and password is "+p+" Change your password immediately here"+
                   "htpps://www.instancheque.com/account.php?u="+value.user.username,"InstanCheque Team",function(r){});
                 }else{
                  //send maill to user
                  mail.sendMail("Hello "+arr[0].fullname+", </br> Your have been added to instanCheque as a User for "+
                    value.user.bank+
                   "Your rignt include processing cheque transaction."+
                   "Your username is "+value.user.username+" and password is "+p+" Change your password immediately here"+
                   "htpps://www.instancheque.com/account.php?"+value.user.username,"InstanCheque Team",function(r){});
               });
                }
              
             }
    });
        
    }else if(type=="getAdmin"){
          get("users",value,function(re2){
                    var arr=re2;
                    if(arr.length!=0){
                         response.username=arr[0].Admin;
                         response.success=true;
                         response.fullname=arr[0].fullname;
                         callback(response);
                    }else{
                        response.success=false;
                         callback(response);
                    }
        
        });
    }else if(type=="getUser"){
      get("users",value,function(re2){
             var suc=false;
             var arr=re2;
             
             if(arr.length!=0){
                   response.username=arr[0].User;
                   response.fullname=arr[0].fullname;
                   response.success=true;
                   callback(response);
             }else{
                      response.success=false;
                         callback(response);
             }
      });
        
    }else if(type=="loadAdmins"){
          get("users",value,function(re2){
                    var arr=re2;
                    var arr2=[];
                    if(arr.length!=0){
                        for(var i=0; i<arr.length ;i++){
                            arr2[i]={Admin:arr[i].Admin,fullname:arr[i].fullname};
                        
                        }
                         response.admins=arr2;
                         response.success=true;
                         callback(response);
                    }else{
                        response.success=false;
                         callback(response);
                    }
        
        });
    }else if(type=="loadUsers"){
      get("users",value,function(re2){
             var suc=false;
             var arr=re2;
             var arr2=[];
            if(arr.length!=0){
                for(var i=0; i<arr.length ;i++){
                      arr2[i]={User:arr[i].User,fullname:arr[i].fullname};
                }
                   response.users=arr2;
                   response.success=true;
                   callback(response);
             }else{
                      response.success=false;
                         callback(response);
             }
    });
        
    }else if(type=="deleteUser"){
        deleteGeneral("users",value,function(re){
             response.username=value.username;
             response.success=re;
             callback(response);
        });
        
    }else if(type=="deleteAdmin"){
        deleteGeneral("users",value,function(re){
             response.username=value.username;
             response.success=re;
             callback(response);
        });
       
    }else if(type=="changePassword"){  
        value.oldpassword=CryptoJS.AES.encrypt(value.oldpassword,key);
        get("users",{username:value.username,password:value.oldpassword},function(re){
             var suc=false;
             var arr=re;
             
             if(arr.length!=0){
                 value.newpassword=CryptoJS.AES.encrypt(value.newpassword,key);
                 update("users",{User:value.username,password:value.oldpassword},{$set:{password:value.newpassword}},function(r){
                    console.log(r);
                     if(r){
                         response.success=true;
                         response.info="Password successfully change";
                         callback(response);
                     }else{
                        
                        response.success=false;
                        response.info="Wrong passwords specified";
                        callback(response);
                       
                     }
                 });
                 
             }else{
               
                        response.success=false;
                        response.info="No user with this username;
                        callback(response);
             
                
             }
        });
    }else if(type=="getpassword"){  
          get("passcode",{username:value.username,passcode:value.passcode},function(re){
             var suc=false;
             var arr=re;
             
             if(arr.length!=0){
                 deleteGeneral("passcode",{username:arr[0].username,passcode:arr[0].passcode},function(rt){ 
                      get("users",{username:value.username},function(re1){
                            var ar=re1;
                            if(ar.length!=0){
                                var dp=CryptoJS.AES.decrypt(ar[0].password,key);
                                 response.success=true;
                                 response.info="Your password is "+dp.toString(CryptoJS.enc.Utf8);
                                 callback(response);
                            }else{   
                             
                                 response.success=false;
                                 response.info="error occurs this user does not exist";
                                 callback(response);
                            }
                       });
                });
               
            }else{
                response.success=false;
                response.info="wrong passcode.";
                callback(response);
                
            }
        });
    }else if(type=="forgetpassword"){
       get("users",{username:value.username},function(re){
             var suc=false;
             var arr=re;
             
             if(arr.length!=0){
                 var pass=Math.floor((Math.random() * 100000) + 1);
                
                if(arr[0].role=="admin"){
                    addGeneral("passcode",{username:arr[0].username,passcode:pass,time:new Date().getTime(),isAdmin:true},function(rt){ });
                        mail.sendMail("Hello "+arr[0].fullname+", </br> Your pass code is "+pass,arr[0].username,"Forget Password",function(r){
                       response.info="A mail has been sent to your, check your mail box or spam box ";
                       response.success=true;
                       callback(response);
                     });
                }else{
                     addGeneral("passcode",{username:arr[0].username,passcode:pass,time:new Date().getTime(),isAdmin:false},function(rt){ });
                     mail.sendMail("Hello "+arr[0].fullname+", </br> Your pass Code is "+pass,arr[0].username,"Forget Password",function(r){
                     response.info="A mail has been sent to your, check your mail box or spam box ";
                       response.success=true;
                    callback(response);
                  });
                 
                }
             }else{
                
                response.info="This user does not exist";
                response.success=false;
                callback(response);
            }
            ;
                
  
        
    }else if(type=="authenticate"){  
         value.password=CryptoJS.AES.encrypt(value.password,key);
        get("users",{username:value.username,password:value.password},function(re){
            var arr=re;
           
            var suc=false;
            if(arr.length!=0){
                suc=true;
               response.success=suc;
               response.isAdmin=false;
               response.fullname=arr[0].fullname;
               response.username=arr[0].username;
               response.bank=arr[0].bank;
               if(arr[0].role=="admin"){
                    response.isAdmin=true;
                     if(value.page=="managebanks"){
                             response.success=false;
                            response.info="You are not authorize to access this page";
                    }
               }
               if(value.page=="people"||value.page=="dashboard"){
                 response.success=false;
                 response.info="You are not authorize to access this page";
               }
               callback(response);
            }else{
               
                response.success=false;
                response.info="Wrong authentication credentials ore";
                callback(response);
              
            }
        });
       

    }else if(type=="addCheque"){
        addGeneral("cheques",value,function(re){
            response.success=re;
            callback(response);
        });
    }else if(type=="addFingerprint"){
        response.success=addGeneral("fingerprints",value,function(re){
            response.success=re;
            callback(response);
        });
    }else if(type=="addBankStats"){
        var b=value.bank;
        var bankname=b.replace(/\n/g, "");
       addGeneral(bankname,value,function(re){
            response.success=re;
            callback(response);
       });
    }else if(type=="addBlock"){
       addGeneral("transactions",value,function(re){
            response.success=re;
            callback(response);
       });
    }else if(type=="addContracts"){
       addGeneral("contracts",value,function(re){
            response.success=re;
            callback(response);
       });
    }else if(type=="loadContracts"){
        getAndSort("contracts",{index:1},function(re){
            var arr=re;
            response.contracts=arr;
            response.messagetype=type;
            callback(response);
        });
         
    }else if(type=="loadBankStats"){
        var b=value.bank;
        var bankname=b.replace(/\n/g, "");
        getAndSort(bankname,{index:-1},function(re){
            var arr=re;
            response.stats=arr;
            response.messagetype=type;
            callback(response);
        });
         
    }else if(type=="addFailedtransaction"){
       addGeneral("failedtransactions",value,function(re){
            response.success=re;
            callback(response);
       });
    }else if(type=="deleteContract"){
        deleteGeneral("contracts",value,function(re){  
             response.success=re;
             callback(response);
        });
       
    }else if(type=="getLastBlock"){
        getAndSort("transactions",{index:-1},function(re){
            var arr=re;
            if(arr.length!=0){
            response.index=arr[0].index;
            response.hash=arr[0].hash;
            
            }else{
               response.index=0; 
            }
            response.messagetype=type;
            response.success=true;
            callback(response);
        });
         
    }else if(type=="getBlock"){
        get("transactions",{time:value.time},function(re){
            var arr=re;
            var key;
            dbutility("getBankKey",{bank:arr[0].issuerbank},function(ky){
                   key=key+ ky.key;
                dbutility("getBankKey",{bank:arr[0].receiverbank},function(k){
                   key=key+k.key+arr[0].time;
                  var bytes=CryptoJS.AES.decrypt(arr[0].data,key);
                  var trans=JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                  response.trans=trans;
                  response.messagetype=type;
                  response.success=true; callback(response);
                 }); 
            });   
            
        });
         
    }else if(type=="getBlocks"){
        getAndSort("transactions",{index:-1},function(re){
            var arr=re;
            
            response.messagetype=type;
            response.blocks=arr;
            callback(response);
        });
         
    }
};
var calculateHash=function(key){
    return CryptoJS.SHA256(key).toString();
};