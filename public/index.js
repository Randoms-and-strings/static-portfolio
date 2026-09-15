let webpageButtons = document.querySelectorAll("button");
const renderDeployed = [
    {
        markdownAppBackend: "https://markdown-project-backend.onrender.com",
        markdownAppFrontend: "https://markdown-project-app.onrender.com"
    }
];

for(let i=0; i<webpageButtons.length;i++){
    webpageButtons[i].addEventListener("click", checkForBackendFrontend);
    //  console.log("miss?");
}

async function checkForBackendFrontend(event){
    if(event.target.getAttribute("data-backend")){
        const backendUrl = event.target.getAttribute("data-backend");
        const loaderAnimationId = event.target.getAttribute("data-loader-id");
        const loaderAnimation = document.querySelector(`#${loaderAnimationId}`);
        const loaderAnimationText = document.querySelector
        const explanatoryNote = document.querySelector(`#${loaderAnimationId}-note`);
        event.target.style.display = "none";
        loaderAnimation.style.display = "flex";
        explanatoryNote.style.display = "flex";
        setTimeout(()=>{

        },3000);
        try {
            const date1 = Date.now();
            const response = await fetch(`${backendUrl}/availability`);
            // const response = await fetch("https://markdown-project-app.onrender.com");
            console.log("hi", await response.json());
            console.log(Date.now() - date1);
        } catch (error) {
            
        }
        
    }
   
        
}