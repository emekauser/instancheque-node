var CryptoJS=require('crypto-js');
var db=require('./queryDB.js');
exports.createBlock=function(d,callback){
    var result={success:false};
    db.dbutility("getLastBlock",null,function(block){
        if(block.success){
             var key=d.issuerbanksignature+d.receiverbanksignature+d.time;
             var lastindex;
             var previoushash;
             if(block.index==0){
                 lastindex=0+1;
                  previoushash=calculateHash(lastindex,key);
             }else{
                 lastindex=block.index+1;
                 previoushash=block.hash;
             }
             var result={success:false};
             var ciphertext=CryptoJS.AES.encrypt(JSON.stringify(d),key);
             var newHash=calculateHash(lastindex,key);
             var transBlock={
                index:lastindex,
                time:d.time,
                previousHash:previoushash,
                data:ciphertext.toString(),
                hash:newHash
             };
             // var bytes=CryptoJS.AES.decrypt(transBlock.data,key);
             // var trans=JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
           //  console.log(JSON.stringify(trans)+" \n "+ciphertext);
             db.dbutility("addBlock",transBlock,function(r){
                  result.success=r;
                  callback(result);
              });
             
        }
    });
   
    
};
var calculateHash=function(index,key){
    return CryptoJS.SHA256(index+key).toString();
};

