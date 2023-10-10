const tokenService = require("../services/token.service");
const dbService = require("../services/database.service");

const createCompany = async (request,response)=>{
  const token = tokenService.verifyToken(request);
  if(token)
  {
      const data = token.data;
      //now you can store data in database
      try
      {
        const dataRes = await dbService.createRecord(data,'companySchema');
        response.status(200);
        response.json({ 
          isCompanyCreated : true,
          message : "Company Created !",
          data : dataRes
        });
      }
      catch(error)
      {
          
          response.status(409);
          response.json({ 
            isCompanyCreated : false,
            message : error
          });
      }
  }
  else
  {
      response.status(401);
      response.json({
        message : "permission denied !"
      });
  }

}
 
const getCompanyId = async (request,response)=>{
    const token = await tokenService.verifyToken(request);
    if(token.isVerified)
    {
       const query = {
        email : token.data.email
       }

      const companyRes = await dbService.getRecordByQuery(query,"companySchema");
      if(companyRes.length > 0)
      {
        response.status(200);
        response.json({
          isCompanyExits : true,
          message : "Company Available!",
          data : companyRes
        });
      }
      else
      {
          response.status(404);
          response.json({
            isCompanyExits : false,
            message : "Company not found !"
          });
      }

    }
    else
    {
       response.status(401);
       response.json({
          message : "Permission Denied !"
       })
    }
}

module.exports = {
        createCompany : createCompany,
        getCompanyId  : getCompanyId
        
}