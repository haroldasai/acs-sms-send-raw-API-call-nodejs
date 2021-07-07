var  XMLHttpRequest  = require("xmlhttprequest").XMLHttpRequest;
var CryptoJS = require("crypto-js");

function main() {
  //Instanciate XMLHttpRequest object
  var xmlhttp = new XMLHttpRequest();

  //for logging
  xmlhttp.onload = function () {
    if (xmlhttp.readyState === xmlhttp.DONE) {
      console.log(xmlhttp.response);
      console.log(xmlhttp.responseText);
    }
  };

  var verb = "POST";  //http verb in capital letters
  var date = (new Date()).toUTCString();  //get current date in RFC 1123 date format
  var url = "https://<your ACS resource endpoint>/sms?api-version=2021-03-07";
  var pathAndQuery = '/sms?api-version=2021-03-07';  //path and query from the request url
  var host = "<your ACS resource endpoint>";   //etc. johndoe.communication.azure.com
  var secret = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=='; //your ACS key that can be found in Azure Portal

  //request body
  var body = {
    "from": "+1xxxxxxxxxx",
    "smsRecipients": [
      {
        "to": "+1xxxxxxxxxx"
      }
    ],
    "message": "Raw API Call Test",
    "smsSendOptions": {
      "enableDeliveryReport": true,
      "tag": "testSmsRequest"
    }
  };

  //convert request body to json string and get the sha256 hash value
  var contentHash = CryptoJS.SHA256(JSON.stringify(body)).toString(CryptoJS.enc.Base64);
  
  //create string to sign with ACS key
  var stringToSign = 
  verb + '\n' +                              // VERB
  pathAndQuery + '\n' +                               // path_and_query
  date + ';' + host + ';' + contentHash;   // Semicolon separated SignedHeaders values

  //sign the string with ACS key to get the signature
  var signature = CryptoJS.HmacSHA256(stringToSign, CryptoJS.enc.Base64.parse(secret)).toString(CryptoJS.enc.Base64);

  var signedHeaders = "x-ms-date;host;x-ms-content-sha256"; // Semicolon separated header names

  xmlhttp.open(verb, url);

  //configure http request header
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.setRequestHeader("x-ms-date", date);
  xmlhttp.setRequestHeader("x-ms-content-sha256", contentHash);
  xmlhttp.setRequestHeader("Authorization", "HMAC-SHA256 SignedHeaders="+ signedHeaders + "&Signature=" +signature);
  
  //finally, send http request with json body.
  xmlhttp.send(JSON.stringify(body));
}
  
main();
