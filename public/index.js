let webpageButtons = document.querySelectorAll("button");
const secToAddToLoader = 3;

for(let i=0; i<webpageButtons.length;i++){
    webpageButtons[i].addEventListener("click", checkForBackendFrontend);
    webpageButtons[i].addEventListener("click", checkFrontendReady);
    //  console.log("miss?");
}

async function checkFrontendReady(event){

}

async function checkForBackendFrontend(event){
    if(event.target.getAttribute("data-backend")){
        const backendUrl = event.target.getAttribute("data-backend");
        const loaderAnimationId = event.target.getAttribute("data-loader-id");
        const loaderAnimation = document.querySelector(`#${loaderAnimationId}`);
        const explanatoryNote = document.querySelector(`#${loaderAnimationId}-note`);

        event.target.style.display = "none";
        loaderAnimation.style.display = "flex";
        explanatoryNote.style.display = "flex";


        const loaderAnimationText = document.querySelector(`#${loaderAnimationId}-progress-text`);
        const progressBar = document.querySelector(".progress-bar");
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
            const response = await fetch(`${backendUrl}/availability`);
            // const response = await fetch("https://markdown-project-app.onrender.com");
            // console.log("hi", await response.json());
            console.log(Date.now() - date1);
            if(!response.ok){
                explanatoryNote.querySelector(".text").innerHTML = "<em>Note: </em>Something suddenly went wrong with the deploy. Will get it fixed soon";
                
            }
            // redirect code to the link if nothing is wrong
            // setTimeout(()=>{
            //     window.location.href = ""
            // },1000);
            // hide the render text
            explanatoryNote.style.display = "none";
            explanatoryNote.querySelector(".text").innerHTML = "<em>Note: </em>Apps Deployed Free On Render Typically Require a Few Seconds for the Server to Start-Up.<br/>Please Wait";
            // make progress bar and text reach 100%. used settimeout incase theres no delay from render, so it wont look too sudden.
            setTimeout(()=>{
                progressBar.style.width = "100%";
                loaderAnimationText.textContent = `100%`;
            },1500);
            
            // clear interval
            clearInterval(startIncreasingLoader);
        } catch (error) {
            
        }
        
    }
   
        
}