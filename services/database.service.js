const mongo = require("mongoose");
const companySchema = require("../model/company.model");
const userSchema = require("../model/user.model");
const studentSchema = require("../model/students.model");
const SchemaList = {
        companySchema : companySchema,
        userSchema : userSchema,
        studentSchema : studentSchema
}

const url = "mongodb+srv://sachinkumar:sKTcb8YuSNpiqYoJ@cluster0.y9qo4px.mongodb.net/just-web";
mongo.connect(url);

const createRecord = async (data,schema) =>{
        const currentSchema = SchemaList[schema];
        const dataRes = await new currentSchema(data).save();
        return dataRes;
}

const getRecordByQuery = async (query,schema) =>{
        const currentSchema = SchemaList[schema];
        const dataRes = await currentSchema.find(query);
        return dataRes;
}

const updateByQuery = async (query,schema,data) =>{
        const currentSchema = SchemaList[schema];
        const dataRes = await currentSchema.updateOne(query,data);
        return dataRes;
}

module.exports ={
        createRecord : createRecord,
        getRecordByQuery : getRecordByQuery,
        updateByQuery : updateByQuery
        }
