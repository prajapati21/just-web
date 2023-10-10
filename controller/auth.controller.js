const tokenService = require("../services/token.service");
const dbService = require("../services/database.service");

const refreshToken = async (uid,request) =>{
        const endPoint = request.get("origin") || "http://"+request.get("host");
        const option = {
                body : uid,
                endPoint : endPoint,
                originalUrl : request.originalUrl

        }
        console.log(option);
        const expiresIn = 86400;
        const newToken = await tokenService.createCustomToken(option,expiresIn);
        
        const updateMe = {
                token : newToken,
                expiresIn : expiresIn,
                updateMe : Date.now()
        }
        await dbService.updateByQuery(uid,'userSchema',updateMe);
        return newToken;
}

const checkUserLogged = async (request,response) => {
        const tokenData = await tokenService.verifyToken(request);
        if(tokenData.isVerified)
        {
               const query ={
                token : request.cookies.authToken,
                isLogged : true
               }
               const userData = await dbService.getRecordByQuery(query,"userSchema");
               if(userData.length > 0)
               {
                    const newToken = await refreshToken(tokenData.data,request);
                    response.cookie("authToken",newToken,{maxAge : 86400*1000});
                    return true;
               }
               else
               {
                return false;
               }
        }
        else
        {
                return false;
        }
}

const logout = async (request,response) =>{
   const tokenData = tokenService.verifyToken(request);
   if(tokenData.isVerified)
   {
        const query = {
                token : request.cookies.authToken
        }
        const updateMe = {
                isLogged : false,
                updatedAt : Date.now()
        }
      const userRes = await dbService.updateByQuery(query,'userSchema',updateMe);
      if(userRes.modifiedCount)
      {
        await response.clearCookie("authToken");
        response.redirect("/profile");
      }
   }
   else
   {
        response.status(401);
        response.json({
                message : "Permission denied !"
        });
   }
}

module.exports = {
        checkUserLogged : checkUserLogged,
        logout : logout
}