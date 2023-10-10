const bcrypt = require("bcrypt");

const encrypt = async (data) =>{
       const encrypted = await bcrypt.hash(data,12);
       return encrypted;   
}

const decrypt  = async (realPassword,typePassword) =>{
        const isVerified =  await bcrypt.compare(typePassword,realPassword);
        return isVerified;
}

module.exports = {
        encrypt : encrypt,
        decrypt : decrypt 
}