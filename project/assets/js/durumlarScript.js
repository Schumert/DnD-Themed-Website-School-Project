const resultArea = document.getElementById("result");
const onClickButton = document.getElementById("onClickButton");



window.onload = function () {
    resultArea.innerHTML = `<p>LOADING...</p>`
    fetchData();
}




async function fetchData() {
    const promises = [];
try{
    
    const conditionsResponse = await axios.get(`https://www.dnd5eapi.co/api/conditions`)
    const conditionsData = conditionsResponse.data;
    
    for(element of conditionsData.results)
    {
        const conditionURL = `https://www.dnd5eapi.co${element.url}`;

        const promise = axios.get(conditionURL).then(async (conditionResponse) => {  

            const conditionData = conditionResponse.data;

            let conditionInfo = `<p><strong style="color:#F2CA0C">${conditionData.name}:</strong><hr><p style="margin:0; padding:0;">
            ${conditionData.desc.join(`<p style="margin:0; padding:0;"></p>`)}
            </p></p>`;
             

            
            return conditionInfo;
           
        });
        promises.push(promise);
    }
    const results = await Promise.all(promises);
    
    resultArea.innerHTML = results.join('');
    
} catch(error) {
    resultArea.innerHTML = "Error fetching conditions: " + error;
}

}

var styles =`

hr {
    height: 0px;
    border: 1px solid #F2CA0C;
    opacity:1;
    margin-top:-15px; 
}
 `

var styleSheet = document.createElement("style");
styleSheet.innerText = styles
document.head.appendChild(styleSheet);

