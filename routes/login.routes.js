const express = require("express");
const router = express.Router();
const tokenService = require("../services/token.service");
const httpService = require("../services/http.service");
const bcryptService = require("../services/bcrypt.service");

router.post("/",async(request,response)=>{
        let expireIn = 120;
        const token = await tokenService.createToken(request,expireIn);
       // getting company id
      const companyRes = await httpService.getRequest({
        endPoint  : request.get("origin"),
        api : "/api/private/company",
        data : token
       });
      if(companyRes.isCompanyExits)
      {
          const uid = companyRes.data[0]._id;
         
          const query = {
            body : {
              uid : uid
            },
            endPoint : request.get("origin"),
            originalUrl : request.originalUrl
          }
            
          const uidToken = await tokenService.createCustomToken(query,expireIn);
          
           ///getting user id

          const userRes = await httpService.getRequest({
            endPoint  : request.get("origin"),
            api : "/api/private/user",
            data : uidToken
           });
          
         //get user password
         
         if(userRes.isCompanyExits)
         {
             //alow single device login
            //  if(userRes.data[0].isLogged)
            //  {
            //     response.status(406);
            //     response.json({
            //       message : "Please logout From other device !"
            //     });
            //     return false;
            //  }


          const realPassword = userRes.data[0].password;
          const isLoged = await bcryptService.decrypt(realPassword,request.body.password);
          if(isLoged)
          {
            const oneDayInSecond = 86400;//seven day login
          const authToken = await tokenService.createCustomToken(query,oneDayInSecond);

          // store token in database
         const dbToken = await httpService.putRequest({
            endPoint : request.get("origin"),
            api : "/api/private/user",
            data : authToken
          });

          response.cookie("authToken",authToken,{maxAge : oneDayInSecond*1000});
            response.status(200);
            response.json({
              isLoged : true,
              message : " success!"
            });
          }
          else
          {
            response.status(401);
            response.json({
              isLoged : false,
              message : "Wrong Password !"
            });
          }
         }
         else
         {
          response.status(userRes.status); 
        response.json(userRes);
         }


      }
      else
      {
        response.status(404); 
        response.json(companyRes);
      }
});

module.exports = router;