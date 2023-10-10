// get country code
$(document).ready(()=>{
        $(".country").on("input",async function(){
                let keyword = $(this).val().trim().toLowerCase();
                const localData = checkInLs("country-code");
               if (localData.isExists)
               {
                    const countries = localData.data;
                    for(let country of countries)
                    {
                        if(country.name.toLowerCase().indexOf(keyword) != -1)
                        {
                                const dial_code = country.dial_code;
                                $(".code").html(dial_code)
                        }
                    }
               }
               else 
               {
                const request = {
                        type : "GET",
                        url : "../json/country-code.json"
                }
               const response = await ajax(request);
               localStorage.setItem("country-code",JSON.stringify(response));
               }
               
        });
});


const checkInLs = (key) =>{
        if(localStorage.getItem(key) != null)
        {
                let tem = JSON.parse(localStorage.getItem(key));
                return{
                        isExists : true,
                        data : tem
                }
        }
        else
        {
                return {
                        isExists : false
                
                }

        }
}



const ajax = (request) =>{
       return new Promise((resolve,reject)=>{
        $.ajax({
                type : request.type,
                url : request.url,
                success : (response) =>{
                        resolve(response);
                },
                error : (error) => {
                        reject(error);
                }
        });
       });
}