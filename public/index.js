let webpageButtons = document.querySelectorAll('button');
const secToAddToLoader = 3;
const defaultRenderMessage = "<em>Note: </em>Apps Deployed Free On Render Typically Require a Few Seconds for the Server to Start-Up.<br/>Please Wait";
const defaultVercelMessage = "<em>Note: </em>Verifying vercel's availability.....<br/>Please Wait."

for(let i=0; i<webpageButtons.length;i++){
    // console.log(webpageButtons[i]);
    // webpageButtons[i].addEventListener("click", checkBackendReady);
    // webpageButtons[i].addEventListener("click", checkFrontendReady);
    webpageButtons[i].addEventListener("click", callBackendAndFrontendTogether);
    //  console.log("miss?");
}
async function callBackendAndFrontendTogether(event){
   
    const [backend, frontend] = await Promise.allSettled([checkBackendReady(event), checkFrontendReady(event)]);
    console.log(backend, frontend);
    if(backend.value===true && frontend.value===true){
       setTimeout(()=>{
        // to check if the home page has an extra slug or param. basically that it isnt "/"
        const homepageExtraArgs = event.target.getAttribute("data-homepage");
        if(homepageExtraArgs){
            window.location.href = `${event.target.getAttribute("data-frontend")}/${homepageExtraArgs}`;
        }else{
            window.location.href = `${event.target.getAttribute("data-frontend")}/fff`;
        }
        
       }, 1000);  
    } else if(backend.value==null && frontend.value===true){
        window.location.href = `${event.target.getAttribute("data-frontend")}/`;
    }
      
}

async function checkFrontendReady(eventButton){
    const backendUrl = eventButton.target.getAttribute("data-backend");
    const frontendUrl = eventButton.target.getAttribute("data-frontend"); //no need to check it exists cos frontend has to
    const loaderAnimationId = eventButton.target.getAttribute("data-loader-id");
    const explanatoryNote = document.querySelector(`#${loaderAnimationId}-note`);

    if(backendUrl){ //if backend url exists, loader would be triggered already,so ignore doing that here.
        
        try {
            const date1 = Date.now();
            const response = await fetch(`${frontendUrl}/availability`);
            
            console.log(Date.now() - date1);
            if(!response.ok){
                if(explanatoryNote.style.display == "none"){
                    explanatoryNote.style.display == "flex";
                }

                explanatoryNote.querySelector(".text").innerHTML = "<em>Note: </em>Something suddenly went wrong with the frontend deploy. Will get it fixed soon";
                
                setTimeout(()=>{
                    explanatoryNote.style.display = "none";
                    explanatoryNote.querySelector(".text").innerHTML = defaultRenderMessage;
                }, 5000);

                return false;
            }
           
        } catch (error) {
            
        }
        // console.log("true?");
        return true;
        
    }else{
        return await checkBackendOrFrontend(eventButton, frontendUrl);
    }
}

async function checkBackendOrFrontend(eventButton, theUrl){
    // const theUrl = event.target.getAttribute(urlAttribute);
        const loaderAnimationId = eventButton.target.getAttribute("data-loader-id");
        const loaderAnimation = document.querySelector(`#${loaderAnimationId}`);
        const explanatoryNote = document.querySelector(`#${loaderAnimationId}-note`);

        eventButton.target.style.display = "none";
        loaderAnimation.style.display = "flex";
        // if(eventButton.target.getAttribute("data-deployed-on") == "render"){
            explanatoryNote.style.display = "flex";
        // }
        


        const loaderAnimationText = document.querySelector(`#${loaderAnimationId}-progress-text`);
        const progressBar = document.querySelector(`#${loaderAnimationId}-progress-bar`);
        // console.log(progressBar);
        const startIncreasingLoader = setInterval(()=>{
            
            let loaderText = parseInt(loaderAnimationText.textContent);
            if( loaderText < 99){
                loaderText += secToAddToLoader;
                progressBar.style.width = `${loaderText}%`;
                loaderAnimationText.textContent = `${loaderText}%`;
            }
        },1000);

        try {
            const date1 = Date.now();
            const response = await fetch(`${theUrl}/availability`);
             
            console.log(Date.now() - date1);
            if(!response.ok){
                setTimeout(()=>{
                clearInterval(startIncreasingLoader);
                explanatoryNote.querySelector(".text").innerHTML = "<em>Note: </em>Something suddenly went wrong with the deploy. Will get it fixed soon";
                
                

                },7000);
                setTimeout(()=>{
                explanatoryNote.style.display = "none";
                    if(eventButton.target.getAttribute("data-deployed-on") =="render"){
                        explanatoryNote.querySelector(".text").innerHTML = defaultRenderMessage;
                    }else{
                        explanatoryNote.querySelector(".text").innerHTML = defaultVercelMessage;
                    }
                }, 18000);
                return false;
            }

            // make progress bar and text reach 100%. used settimeout incase theres no delay from render, so it wont look too sudden.
            progressBar.style.width = "100%";
            loaderAnimationText.textContent = `100%`;
        
            clearInterval(startIncreasingLoader);
            return true;
        } catch (error) {
            
            setTimeout(()=>{
                clearInterval(startIncreasingLoader);
                explanatoryNote.querySelector(".text").innerHTML = "<em>Note: </em>Something suddenly went wrong with the deploy. Will get it fixed soon";
                
                

            },7000);
            setTimeout(()=>{
                explanatoryNote.style.display = "none";
                    if(eventButton.target.getAttribute("data-deployed-on") =="render"){
                        explanatoryNote.querySelector(".text").innerHTML = defaultRenderMessage;
                    }else{
                        explanatoryNote.querySelector(".text").innerHTML = defaultVercelMessage;
                    }
            }, 18000);
            
            return false;
        }
}

async function checkBackendReady(eventButton){
    if(eventButton.target.getAttribute("data-backend")){
        const backendUrl = eventButton.target.getAttribute("data-backend")
        return await checkBackendOrFrontend(eventButton, backendUrl);
        
        
    }
    return null;
   
        
}