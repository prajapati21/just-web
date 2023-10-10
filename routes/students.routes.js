const express = require("express");
const router = express.Router();
const studentsController = require("../controller/students.controller")

router.get("/",(request,response)=>{
        response.render("students");
});

router.post("/",(request,response)=>{
        studentsController.create(request,response);
});

module.exports = router;