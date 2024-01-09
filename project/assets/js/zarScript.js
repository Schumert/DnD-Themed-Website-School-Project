
let oldResults ="";
const zarInputAmount = document.getElementById("zarInputAmount");
const zarInputSide = document.getElementById("zarInputSide");
const zarResult = document.getElementById("zarResult");
const atButton = document.getElementById("atButton");

atButton.addEventListener("click", () => {
    const zarNotation = zarInputAmount.value.toString() + "d" + zarInputSide.value.toString();
    if (zarInputAmount.value && zarInputSide.value &&!(isNaN(zarInputAmount.value) || isNaN(zarInputSide.value))) {
        if(zarInputAmount.value <= 100 && zarInputSide.value <= 100) {
        zarAt(zarNotation);
        } else {
            zarResult.innerHTML = "<div style='color:black'>100 veya 100'den küçük değer girin.</div>";
        }
    } else {
        zarResult.innerHTML = "<div style='color:black'>Zar notasyonu girin.</div>";
    }
})



function zarAt(zarInput) {
    const diceRoller = new rpgDiceRoller.DiceRoller();
    let diceRoll = diceRoller.roll(zarInput).toString();
    const result = diceRoll.slice(diceRoll.indexOf('=') + 1);
    
    oldResults += diceRoll + ", ";
    let imgUrl ="";
    if(zarInputSide.value.toString() === "4" && zarInputAmount.value.toString() === "1") {
         imgUrl = "https://rolladie.net/images/dice/d4.png"
    } 
    else if(zarInputSide.value.toString() === "8" && zarInputAmount.value.toString() === "1") {
        imgUrl = "https://rolladie.net/images/dice/d8.png"
    }
    else if(zarInputSide.value.toString() === "10" && zarInputAmount.value.toString() === "1") {
        imgUrl = "https://rolladie.net/images/dice/d10.png"
    } else if(zarInputSide.value.toString() === "12" && zarInputAmount.value.toString() === "1") {
        imgUrl = "https://rolladie.net/images/dice/d12.png"
    } else if(zarInputSide.value.toString() === "20" && zarInputAmount.value.toString() === "1") {
        imgUrl = "https://rolladie.net/images/dice/d20.png"
    } else {
        imgUrl ="./assets/img/black.png"
    }
    zarResult.innerHTML = `
    
    
    <div class="container">
    <img style="height: 100px; width: 100px; position:absolute; margin-left: -50px;
    ${zarInputSide.value.toString() === "10" ? ':margin-top:-20px': 'margin-top:-14px'};" src="${imgUrl}">
    <div class="overlay-text">${result} </div>
    

</div>
<div style="margin-top: 0px; width:500px; margin-left:-550px">${diceRoll}</div>
<div style="margin-top: -300px; width:500px; margin-left:-550px"></div>

    
    `
     
}

var styles = `
hr {
    height: 0px;

    border: 2px solid #F2CA0C;
    opacity:1;
}
.overlay-text {
    position: absolute;
    top: 50%; 
    left: 707px; 
    transform: translate(-50%, -50%); 
    padding: 10px 20px; 
    font-size: 20px;
    margin-top: -140px;
    
}
 `

var styleSheet = document.createElement("style");
styleSheet.innerText = styles
document.head.appendChild(styleSheet);