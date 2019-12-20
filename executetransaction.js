var Request=require('request');
var db=require('./queryDB.js');
var bankurl="";
exports.executeTransaction=function(trans,ch,fp,callback){
    var transResposne={messagetype:"executetransaction"};
    var issuer=trans.issuer;
    var receiver=trans.receiver;
    var t=new Date().getTime();
    var res={};
     var transaction={
                      issueraccountnumber:issuer.accountnumber,
                      issueraccountname:issuer.accountname,
                     // issuernumbers:issuer.numbers,
                      fundenquiry:issuer.fundenquiry,
                      chequepolicy:issuer.chequepolicy,
                      issuerbank:issuer.bankname,
                      debitamount:issuer.debitamount,
                      receiveraccountnumber:receiver.accountnumber,
                      receiveraccountname:receiver.accountname,
                     // receivernumbers:"",   
                      acceptancepolicy:receiver.acceptancepolicy,
                      receiverbank:receiver.bankname,
                      creditamount:receiver.creditamount,
                      issuerbanksignature:"",
                      receiverbanksignature:"",
                     // validity:false,
                      tellerfullname:trans.tellerfullname,
                      tellerusername:trans.tellerusername,
                      transactionbank:trans.transactionbank,
                      transactionCharge:trans.transactionCharge,
                      whotoCharge:trans.whotoCharge,
                      time:t,
                      transactionID:t
                  };
   callbank(bankurl,issuer,issuer.debitamount,"debit",function(r){
      res=r;
      if(res.success){
          //after debiting issuer signed the contract
            db.dbutility("getBankKey",{bank:issuer.bankname},function(ky){
                transaction.issuerbanksignature=ky.key;
                transaction.issuerbanktransId=res.transactionID;
            });          
         callbank(bankurl,receiver,receiver.creditamount,"credit",function(r1){
            res=r1;
            if(res.success){
                  //after crediting the receiver signed the contract
                   db.dbutility("getBankKey",{bank:receiver.bankname},function(ky){
                          transaction.receiverbanksignature=ky.key;
                          transaction.receiverbanktransId=res.transactionID;
                    });
                    db.dbutility("addContracts",transaction,function(r){});
                  var c={
                     contentType:ch.mimetype,
                     size:ch.size,
                     cheque:Buffer.from(ch.data,'base64'),
                     issuerbank:issuer.bankname,
                     receiverbank:receiver.bankname,
                     chequeID:trans.chequeId,
                     transactionID:t,
                 };
            db.dbutility("addCheque",c,function(r){
                
            });
            var f ={
            contentType:fp.mimetype,
            size:fp.size,
            fingerprint:Buffer.from(fp.data,'base64'),
            issuerbank:issuer.bankname,
            receiverbank:receiver.bankname,
            transactionID:t,
           };
            db.dbutility("addFingerprint",f,function(r){});
            var bankStats={
            issuerbank:issuer.bankname,
            receiverbank:receiver.bankname,
            transactionamount:issuer.debitamount,
            tellerfullname:trans.tellerfullname,
            tellerusername:trans.tellerusername,
            transactionbank:trans.transactionbank,
            time:t 
           };
           //console.log(JSON.stringify(issuer));
            bankStats.bank=issuer.bankname;
            db.dbutility("addBankStats",bankStats,function(r){});
            bankStats.bank=receiver.bankname;
            db.dbutility("addBankStats",bankStats,function(r){});
            if(trans.whotoCharge=="receiver"){
                transactionFee(bankurl,receiver,trans.transactionCharge,"transactionfee",function(r){});
            }else{
                transactionFee(bankurl,issuer,trans.transactionCharge,"transactionfee",function(r){});
            }
            transResposne.success=true;
            callback(transResposne);
        }else{
            callbank(bankurl,issuer,issuer.debitamount,"credit",function(r){
                //success=r;
            });
             db.dbutility("addFailedtransaction",transaction,function(fails){
              
             });
            transResposne.success=false;
            transResposne.info="Transaction failed! "+receiver.bankname+" failed to credit customer's account, issuer has been refunded";
            callback(transResposne);
        }
             
     });  
    }else{
         db.dbutility("addFailedtransaction",transaction,function(fails){
                transResposne.success=false;
                transResposne.info="Transaction failed! "+issuer.bankname+" failed to debit customer's account, Receiver was not credited";
                 callback(transResposne);
             });
    }
  });
  
};

var callbank=function(burl,data,am,tp,callback){
    var res={};
     Request.post(
        burl,
       {'data':{
        accountnumber:data.accountnumber,
        accountname:data.accountname,
        type:tp,
        amount:am,
       instanchequeAuth:""}}
        ,function(error,response,body){
            if(error){
                res.success=false;
                  //stimulate
                  res.success=true;
                  res.transactionID=1828939393;
                 //stimulate
                 callback(res);
            }else{
                if(response){
                    res.success=true;
                    res.transactionID=body.transactionID;
                }else{
                    res.success=false;
                }
                callback(res);
            }
        }
        );
        
};
var transactionFee=function(burl,data,am,tp,callback){
    var res={};
     Request.post(burl,
        {'data':{
        accountnumber:data.accountnumber,
        accountname:data.accountname,
        type:tp,
        amount:am,
        instanchequeAuth:""}}
        ,function(error,response,body){
            if(error){
                res.success=false;
                 //stimulate
                 res.success=true;
                 res.transactionID=1828939393;
                //stimulate
                 callback(res);
            }else{
                if(response){
                    res.success=true;
                    res.transactionID=body.transactionID;
                }else{
                    res.success=false;
                }
                callback(res);
            }
        
        });
       
};

