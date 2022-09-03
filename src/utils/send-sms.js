const axios = require('axios');
const XML = require('pixl-xml');

// TODO: get different error responses

module.exports = (phoneNumber, message) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!phoneNumber) throw new Error("Please provide a phone number!");
            if (!message) return new Error("Please provide a message!");

            message = "(NYP eTicketing System) " + message;

            const sms = await axios.post(
                'https://sms.sit.nyp.edu.sg/SMSWebService/sms.asmx/sendMessage', 
                `SMSAccount=${process.env.SMS_USERNAME}&Pwd=${process.env.SMS_PASSWORD}&Mobile=${phoneNumber}&Message=${message}`, 
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
        
            const dataRes = XML.parse(sms.data);
        
            if (dataRes._Data === "Success") {
                resolve(true);
            } else {
                reject(dataRes._Data);
            }
        } catch (error) {
            reject(error);
        }
    });
};