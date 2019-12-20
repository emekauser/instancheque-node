var nodemailer =require('nodemailer');
var transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'-----',
        pass:"----"
    }
    });
    exports.sendMail=function(message,towho,sub,callback){
        var m="<!DOCTYPE html>"
             +' <html>'
   +"<head>"
       +" <title></title>"
        +'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">'
         +'<meta name="viewport" content="width=device-width, initial-scale=1">'
   +"</head>"
   +"<body>"
        +"<div style=\"width:100%;\">"
            +"<div style=\"background: #000066;width: 100%;height: 100px;\">"
                +"<h2 style=\"color: white; padding: 40px;text-align: center\">InstanCheque</h2>"
           +" </div>"
            +"<div style=\"width: 100%;background: white;margin: 0px\">"
                +"<p>"+message+"</p>"    
           + "</div>"
      + " </div>"
   + "</body>"
+"</html>";
        var mailOptions={
            from:"elanolco@gmailc.oom",
            to:towho,
            subject:sub,
            html:m
        };
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error);
                callback(false);
            }else{
                console.log("Email sent "+info.response)
                callback(true);
            }
        });
    };
