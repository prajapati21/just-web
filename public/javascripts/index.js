//redirecting user if already logged
 
if(document.cookie.indexOf("authToken") != -1)
{
      window.location = "/profile"
}
//requesting login modal
$(document).ready(() => {
    $("#login-modal-request").click((e) => {
          e.preventDefault();
          $("#signup-modal").modal('hide');
          $("#login-modal").modal('show');
    });
});
//requesting signup modal
$(document).ready(() => {
      $("#signup-modal-request").click((e) => {
            e.preventDefault();
            $("#login-modal").modal('hide');
            $("#signup-modal").modal('show');
           
      });
  });

  //signup request
  $(document).ready(()=>{
      $("#signup-form").submit((e)=>{
            e.preventDefault();
            $.ajax({
                  type : "POST",
                  url : "api/signup",
                   data : new FormData(e.target),
                   contentType : false,
                   processData :false,
                   beforeSend : ()=>{
                        $(".before-send").removeClass("d-none");
                        $(".signup-btn").addClass("d-none");

                   },
                   
                   success : (response) =>{
                        console.log(response);
                        $(".before-send").addClass("d-none");
                        $(".signup-btn").removeClass("d-none");
                        if(response.isUserCreated)
                        {
                              window.location = "/profile";
                        }
                     
                   },
                   error : (error) =>{
                        $(".before-send").addClass("d-none");
                        $(".signup-btn").removeClass("d-none");
                        const errorRes = error.responseJSON;
                        if(error.status == 409)
                        {
                              const field = "."+errorRes.message.field;
                              const label = errorRes.message.label;
                              console.log(label);
                              $(field).addClass("border border-danger");
                              $(field+"-error").html(label);
                              setTimeout(function(){
                                    resetValidator(field);
                              },3000)
                        }
                        else
                        {
                              swal("500","Internal Server error ","warning");
                        }
                   }
            });
      });
  });
   //login request
   $(document).ready(()=>{
      $("#login-form").submit((e)=>{
            e.preventDefault();
            $.ajax({
                  type : "POST",
                  url : "api/login",
                   data : new FormData(e.target),
                   contentType : false,
                   processData :false,
                   beforeSend : ()=>{
                        $(".before-send").removeClass("d-none");
                        $(".login-btn").addClass("d-none");
                   },
                   success : (response) =>{
                        $(".before-send").addClass("d-none");
                        $(".login-btn").removeClass("d-none");
                        if(response.isLogged)
                        {
                              window.location = "/profile";
                        } 
                   },
                   error : (error) =>{
                        $(".before-send").addClass("d-none");
                        $(".login-btn").removeClass("d-none");
                        if(error.status == 404)
                        {
                              const field = ".username";
                              $(".username").addClass("border border-dander");
                              $(".username-error").html("User not found !");
                              setTimeout(()=>{resetValidator(field)},3000);
                        }
                        else if(error.status == 401)
                        {
                              const field = ".password";
                              $(".password").addClass("border border-dander");
                              $(".password-error").html("Wrong Password !");
                              setTimeout(()=>{resetValidator(field)},3000);
                        }
                        else if(error.status == 406)
                        {
                              const field = ".password";
                              $(".password").addClass("border border-dander");
                              $(".password-error").html(error.responseJSON.message);
                              setTimeout(()=>{resetValidator(field)},3000);
                        }

                        else
                        {
                              swal("500","Internal Server error !","warning");
                        }
                        
                        
                   }
            });
      });
  });

  const resetValidator = (field) =>{
      $(field).removeClass("border-danger");
      $(field+"-error").html('');
  }