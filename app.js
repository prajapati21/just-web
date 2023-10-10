const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require("multer");
const multiPart = multer().none();


const app = express();

const indexRouter = require("./routes/index.routers");
const signupRouter = require("./routes/signup.routes");
const loginRouter = require("./routes/login.routes");
const userRouter = require("./routes/user.routes");
const companyRouter = require("./routes/company.routes");
const tokenService = require("./services/token.service");
const profileRouter = require("./routes/profile.routes");
const logoutRouter = require("./routes/logout.routes");
const studentsRouter = require("./routes/students.routes");
const authController = require("./controller/auth.controller");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multiPart);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/",indexRouter);
app.use("/api/signup",signupRouter);
app.use("/api/login",loginRouter);


//implementing api security

app.use((request,response,next)=>{
  const isVerified = tokenService.verifyToken(request);
  
  if(isVerified.isVerified)
  {
    next();
  }
  else
  {
    response.clearCookie("authToken");
     response.status(401);
     response.redirect("/");
  }
});

const authLogger = () =>{
     return async (request,response,next) =>{
       const isLogged = await authController.checkUserLogged(request,response);
       if(isLogged)
       {
        next();
       }
       else
       {
         response.clearCookie("authToken");
         response.redirect("/");
       }
     }
}

app.use("/api/private/company",companyRouter);
app.use("/api/private/user",userRouter);
app.use("/students",studentsRouter);
app.use("/logout",logoutRouter);
app.use("/profile",authLogger(),profileRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
