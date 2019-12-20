var CryptoJS=require('crypto-js');
var db=require('./queryDB.js');
var block=require('./block.js');
var bankurl="http://url.com";
var Request=require('request');
    setInterval(function(){
          console.log("PoW Executing........");
        db.dbutility("loadContracts",{},function(c){
            var arr=c.contracts;
           
            for(var i=0; i<arr.length ;i++){
               
                var trans=arr[i];
               
                confirmTransactionformBanks(bankurl,trans.issuerbanktransId,"getPoW",trans,function(m,t){
                    var trans1=t;
                // if(m.amount==trans1.debitamount&&m.accountnumber==trans1.issueraccountnumber){
                     trans1.issuerPoW=true;
                   confirmTransactionformBanks(bankurl,trans1.receiverbanktransId,"getPoW",trans1,function(m1,t2){
                       var trans2=t2;
                       //if(m1.amount==trans2.creditamount&&m1.accountnumber==trans2.receiveraccountnumber){
                           trans2.receiverPoW=true;
                           block.createBlock(trans2,function(r){
                               if(r){
                                   db.dbutility("deleteContract",{transactionID:trans2.transactionID},function(r1){console.log("transaction deleted")});
                                   
                               }
                          });
                      // }
                   }); 
                   
                // }
                });
            }
        });

    },60000);

var confirmTransactionformBanks=function(burl,id,tp,trans,callback){
    var re={};
    var success=false;
     Request.post(
        burl,
       {'data':{
        transactionID:id,
        type:tp,
        instanchequeAuth:""}}
        ,function(error,response,body){
            if(error){
                re.success=false;
                  //stimulate
                  re.accountnumber="";
                    re.accountname="";
                    re.amount="";
                    re.success=true;
                    
                 //stimulate
                 callback(re,trans);
            }else{
                if(response){
                    re.accountnumber="";
                    re.accountname="";
                    re.amount="";
                    re.success=true;
                }else{
                    re.success=false;
                }
                callback(re,trans);
            }
        }
        );
        
};