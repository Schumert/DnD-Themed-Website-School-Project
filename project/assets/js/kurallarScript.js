const ruleResult = document.getElementById("ruleResult");
const onClickButton = document.getElementById("onClickButton");
const ruleInput = document.getElementById("ruleInput");

searchButton.addEventListener("click", () => {
    const ruleName = ruleInput.value.toLowerCase();
      searchRule(ruleName);
  
    
  });

  function searchRule(ruleName) {

    async function fetchData() {
            try {
                src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"
                const ruleResponse = await axios.get(`https://www.dnd5eapi.co/api/rule-sections/${ruleName}`);
                const ruleData = ruleResponse.data;
                const desc = marked.parse(ruleData.desc)

                ruleResult.innerHTML = `
                
                <div><p> ${desc}</p></div>
                
                
                
                `;


                

            } catch(error){

                ruleResult.innerHTML = "Error fetching rules" + error;
            }
        
    }
    fetchData();
  }


  var styles = `
img {
  float: right;
  width: 250px;
  height: 250px;
}
hr {
    height: 0px;

    border: 2px solid #F2CA0C;
    opacity:1;
}
 `

var styleSheet = document.createElement("style");
styleSheet.innerText = styles
document.head.appendChild(styleSheet);
  