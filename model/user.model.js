const mongo = require("mongoose");
const bcryptService = require("../services/bcrypt.service");
const { Schema } = mongo;

const userSchema = new Schema({
        uid : {
                type : String,
                unique : true
        },
        password : {
                type : String,
                required : true
        },
        token : String,
        expiresIn : Number,
        isLogged : Boolean,
        updatedAt : {
                type : Date,
                default : Date.now
        },
        createdAt : {
                type : Date,
                default : Date.now
        }
        


});

userSchema.pre("save",async function(next){
        const data = this.password;
        const encryptedPassword =  await bcryptService.encrypt(data);
        this.password = encryptedPassword;
        next();
});

module.exports = mongo.model("User",userSchema);