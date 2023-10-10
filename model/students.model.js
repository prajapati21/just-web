
const mongo = require("mongoose");
const { Schema } = mongo;

const studentSchema = new Schema({
  companyId: String,
  studentName: String,
  studentEmail: {
    type: String,
    unique: true,
  },
  studentFather: String,
  studentDob: Date,
  studentMobile: Number,
  studentCountry: String,
  studentState: String,
  studentPinCode: String,
  studentAddress: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongo.model("student", studentSchema);