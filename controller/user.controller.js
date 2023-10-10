const tokenService = require("../services/token.service");
const dbService = require("../services/database.service");
const createUser = async (request,response) =>{
        const token = await tokenService.verifyToken(request,response);
       
       if(token.isVerified)
       {
             try{
              // start auto login during signup
              const uidJson = {
                uid : token.data.uid
              }
                   const endPoint = request.get("origin") || "http://"+request.get("host");
                   const option = {
                     body : uidJson,
                     endPoint : endPoint,
                     originalUrl : request.originalUrl
      
             }
             console.log(option);
             const expiresIn = 86400;
             const newToken = await tokenService.createCustomToken(option,expiresIn);

             token.data['token'] = newToken,
             token.data['expiresIn'] = expiresIn,
             token.data['isLogged'] = true

               // end auto login during signup
               const userRes = await dbService.createRecord(token.data,'userSchema');
               response.status(200);
               response.json({
                    token : newToken,
                    isUserCreated  : true,
                    message : "User Created !"

               });

             }
             catch(error)
             {
                 response.status(500);
                 response.json({
                    isUserCreated  : false,
                    message : "Internal Server Error !"
                 });
             }
       }
       else
       {
           response.status(401)
           response.json({
                message : "permission denied !"
           });
       }
 }

 const getUserPassword = async (request,response) =>{
  const token = await tokenService.verifyToken(request);
  if(token.isVerified)
  {
      const query = token.data;
      const dataRes = await dbService.getRecordByQuery(query,'userSchema');
      if(dataRes.length > 0)
      {

        response.status(200);
        response.json({
          isCompanyExits : true,
          message : 'Company Found',
          data : dataRes
        });
      }
      else
      {
        response.status(404);
        response.json({
          isCompanyExits : false,
          message : 'Company Not Found'
        });
      }
  }
  else
  {
    response.status(401);
    response.json({
      message : "permission Denied !"
    });
  }

 }

 const createLog = async (request,response) =>{
  const token = await tokenService.verifyToken(request);
  if(token.isVerified)
  {
    const query = {
      uid : token.data.uid
    }
    const data = {
      token : request.body.token,
      expiresIn : 86400,
      isLogged : true,
      updatedAt : Date.now()
    }

   const userRes = await dbService.updateByQuery(query,"userSchema",data);
   response.status(201),
   response.json({
    message : "update success !"
   });

  }
  else
  {
    response.status(401);
    response.json({
      message : "permission Denied !"
    });
  }

 }

module.exports = {
        createUser : createUser,
        getUserPassword : getUserPassword,
        createLog : createLog
} 