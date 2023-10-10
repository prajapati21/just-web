const ajax = require("supertest");

const postRequest = async (request) =>{
       const response =  await ajax(request.endPoint)//end point
        .post(request.api)//api
        .send({token : request.data});//data
        return response.body;
}

const getRequest = async (request) =>{
        const response =  await ajax(request.endPoint)//end point
         .get(request.api+"/"+request.data)//api
         .set({'X-Auth-Token' : request.data}) // api
         return response.body;
 }

 const putRequest = async (request) =>{
        const response =  await ajax(request.endPoint)//end point
         .put(request.api+"/"+request.data)//api
         .send({token : request.data}) // api
         return response.body;
 }

module.exports = {
        postRequest : postRequest,
        getRequest :  getRequest,
        putRequest : putRequest
}