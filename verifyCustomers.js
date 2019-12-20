var Request=require('request');
var bankurl='http://www.bank.com';
exports.verify=function(isr,rc,callback){
         var message={
        "issuer":{},
        "receiver":"",
        "messagetype":"verifycustomers"
       };
       
       callbank(bankurl,isr,isr.debitamount,"getAccountInfoIssuer",function(r){
           var d=r;
          
            if(d.success){///////////verfiy issuer
               message.issuer={
                "bankname":isr.bankname,
                "accountname":d.data.accountname,
                "accountnumber":d.data.accountnumber,
                "debitamount":d.data.debitamount,
                "fundenquiry":d.data.fundenquiry,
                "chequepolicy":d.data.chequepolicy,
                "Signatory":d.data.signatory
             };
           callbank(bankurl,rc,rc.creditamount,"getAccountInfoForReceiver",function(r1){
               d=r1;
               console.log(r1)
               if(d.success){
               message.receiver={
                "bankname":rc.bankname,
                "accountname":d.data.accountname,
                "accountnumber":d.data.accountnumber,
                "creditamount":d.data.creditamount,
                "acceptancepolicy":d.data.acceptancepolicy
            
               } ;
                 callback(message);
             }else{
                   callback(message);
             }
           });
           
        }else{
            callback(message);
        }
       });
      
    };
    var callbank=function(burl,data,am,tp,callback){
       // [
           //   {  "number":"08137779209",
            //  "signature":""}
        //]
        var res={};
     res.success=false;
     Request.post(
        burl,
        {'data':{
        accountnumber:data.accountnumber,
        accountname:data.accountname,
        type:tp,
        amount:am,
        instanchequeAuth:""}
        }
        ,function(error,response,body){
           
           if(error){  
                
                 console.log(error);
                res.success=false;
                 //stimulate
                if(tp=="getAccountInfoForReceiver"){
                   data.acceptancepolicy="This accout can accept maximum of 200, 000";
                }else{
                   data.signatory=[
                      {  "number":"08137779209",
                      "signature":""}
                    ];
                   data.fundenquiry="sufficient";
                   data.chequepolicy="One to sign";
                 }
                res.data=data;
                 res.success=true;
                //stimulate
                callback(res);
            }else{
                 res.data=JSON.parse(body);
                 res.success=true;
                  callback(res);
            }
        }
        );
     
};