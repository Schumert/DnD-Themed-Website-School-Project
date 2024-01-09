const monsterInput = document.getElementById("monsterInput");
const searchButton = document.getElementById("searchButton");
const monsterResult = document.getElementById("monsterResult");

searchButton.addEventListener("click", () => {
  let monsterName = monsterInput.value.toLowerCase();
  monsterName = monsterName.replace(" ", "-");
  if (monsterName) {
    searchMonster(monsterName);
  } else {
    monsterResult.innerHTML = "Please enter a monster name.";
  }
});





function searchMonster(monsterName) {
  monsterResult.innerHTML = "Searching...";

  axios
    .get(`https://www.dnd5eapi.co/api/monsters`)
    .then((response) => {
      const monsters = response.data.results;
      const matchedMonster = monsters.find(
        (monster) => monster.index.toLowerCase() === monsterName
      );

      if (matchedMonster) {
        axios
          .get(`https://www.dnd5eapi.co/api/monsters/${matchedMonster.index}`)
          .then((monsterResponse) => {
            const monsterData = monsterResponse.data;
            console.log(monsterData);
            let image = "";
            
            image = "https://5e.tools/img/MM/" + monsterData.name + ".png";
            
            
            
            monsterResult.innerHTML = `
              <hr>
              <img src="${image}">
              <h2 style="color:#F2CA0C; font-size: 50px; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">${monsterData.name}</h2>
              <p style= "font-style: italic;"> ${monsterData.size} ${capitalizeFirstLetter(monsterData.type)}, ${capitalizeFirstLetter(monsterData.alignment)}</p>
              <hr> 
              <p><strong>Hit Points:</strong> ${monsterData.hit_points}</p>
              <p><strong>Armor Class:</strong> ${formatArmorClass(monsterData.armor_class)}</p>
              <p><strong>Speed:</strong> ${formatSpeed(monsterData.speed)}</p>
              <p><strong>Proficiencies:</strong>${formatProf(monsterData.proficiencies)}</p>
              <p><strong>Senses:</strong>${formatSense(monsterData.senses)}
              <p><strong>Challenge Rating:</strong> ${monsterData.challenge_rating}</p>
              <hr>
              <p>STR DEX CON INT WIS CHA</p>
              <p style="word-spacing:17px">${monsterData.strength} ${monsterData.dexterity} ${monsterData.constitution} ${monsterData.intelligence} ${monsterData.wisdom} ${monsterData.charisma}</p>
              <hr>
              <p>${formatSpecials(monsterData.special_abilities).join("")}</p>
              <hr>
              <p><strong style="color:#FFD300;font-size:20px; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Actions:</strong> 
              <hr style="margin-top:-15px; border: 1px solid #F2CA0C; opacity:1;">
              ${formatActions(monsterData.actions).join("")}</p>

              <p><strong style="color:#FFD300;font-size:20px; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Legendary Actions:</strong> 
              <hr style="margin-top:-15px; border: 1px solid #F2CA0C; opacity:1;">
              ${formatActions(monsterData.legendary_actions).join("")}</p>
              
              
              
              
              <!-- You can display more monster details here -->
            `;
          })
          .catch((error) => {
            monsterResult.innerHTML = "Error fetching monster details." + error;
          });
      } else {
        monsterResult.innerHTML = "Monster not found.";
      }
    })
    .catch((error) => {
      monsterResult.innerHTML = "Error fetching monsters." + error;
    });

}
const formatSpecials = (specials) => {
  if(!specials || !Array.isArray(specials) || specials.length ===0)
  {
    return [];
  }
  return specials.map( (special) => (
    `<li key=${special.name}>
    <strong>${special.name}.</strong> ${special.desc}${" "}
    
    </li>`
   ));
}
const formatSense = (senses) => {
  if(senses.darkvision === undefined)
  {
    return `Passive Perception: ${senses.passive_perception}`;
  }
  return ` Passive Perception: ${senses.passive_perception}, Darkvision: ${senses.darkvision} `;
}
const formatLegActions = (actions) => {
  if (!actions || !Array.isArray(actions) || actions.length === 0) {
    return [];
  }
  return actions.map((action) => (
    `<li key=${action.name}>
    <strong>${action.name}.</strong> ${action.desc}${" "}
    
    </li>`
  ));
};
const formatActions = (actions) => {
  if (!actions || !Array.isArray(actions) || actions.length === 0) {
    return [];
  }
  return actions.map((action) => (
    `<li key=${action.name}>
    <strong>${action.name}.</strong> ${action.desc}${" "}
    
    </li>`
  ));
};

const formatProf = (proficiencies) => {
  {
        return proficiencies.map( (proficiency2) =>(
          
            `<em>
              ${proficiency2.proficiency.name}: +${proficiency2.value}
            </em>`
          
          
        ));
  }
};

const formatArmorClass = (armor_class) => {
  if (!armor_class) {
    return 10; // return default AC if no AC provided
  }
  if (Array.isArray(armor_class)) {
    return armor_class.map((acObj) => `${acObj.value} ${acObj.type} `).join(', ');
  } else {
    const armorEntries = Object.entries(armor_class);
    const armorStrings = armorEntries.map(([index, element]) => `${index} ${element}`);
    return armorStrings.join(', ');
  }
}

const formatSpeed = (speed) => {
  return Object.entries(speed).map(([key, value]) =>
    `${key} ${value}`).join(', ');
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var styles =`
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


