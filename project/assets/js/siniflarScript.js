



const classResult = document.getElementById("classResult");
const classResult2 = document.getElementById("classResult2");
const classResult3 = document.getElementById("classResult3");
const onClickButton = document.getElementById("onClickButton");
const classInput = document.getElementById("classInput");

searchButton.addEventListener("click", () => {
  const className = classInput.value.toLowerCase();
  if (className) {
    searchSchool(className);

  } else {
    classResult.innerHTML = "Please enter a class name.";

  }
});


function searchSchool(className) {
  classResult.innerHTML = "Searching...";
  classResult2.innerHTML = "Searching...";
  classResult3.innerHTML = "Searching...";

  axios
    .get(`https://www.dnd5eapi.co/api/classes`)
    .then((response) => {
      const classes = response.data.results;
      const matchedClass = classes.find(
        (Class) => Class.index === className
      );
      if (matchedClass) {
        axios
          .get(`https://www.dnd5eapi.co/api/classes/${matchedClass.index}`)

          .then((classResponse) => {
            const classData = classResponse.data;
            console.log(matchedClass.index)



            classResult.innerHTML = `
                    <div style="font-size:15px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">
                    <p style="font-size:25px">${classData.name}</p>
                    <div style="font-size:20px";>Hit Points</div>
                    <div>Hit Die: ${classData.hit_die}</div>
                    <p> </p>
                    <div style="font-size:20px";>Proficiencies</div>
                    <div>${formatProf(classData.proficiencies)}</div>
                    <div>Skills: ${formatProfChoice(classData.proficiency_choices)}</div>
                    <p> </p>
                    <div style="font-size:20px";>Starting Equipment</div>
                    <div>You start with the following items, plus anything provided by your background. </div>
                    <p> </p>
                    <ul> 
                    <li>${formatStartingEq(classData.starting_equipment)}</li>
                    </ul>
                    ${formatStartingEqOpts(classData.starting_equipment_options).join("")}
                    </div>
                    <p> </p>
                    <div style="font-size:20px";>Multiclassing</div>
                    <div>When you gain a level in a class other than your first, you gain only some of that class's starting proficiencies.</div>
                    <div>${formatProficiencies(classData.multi_classing.proficiencies).join("")}</div>
                    
                    `

          })
          .catch((err) => {
            classResult.innerHTML = err;
          });



      }

      async function fetchData() {
        try {
          const promises = [];

          promises.push(`<h2 style="margin-bottom:30px;"><strong style="color:#FFD300; ">Features</strong></h2>`)
          const classResponse = await axios.get(`https://www.dnd5eapi.co/api/classes/${matchedClass.index}/levels`);
          const classData = classResponse.data;
          

          

          for (const element of classData) {
            for (const element2 of element.features) {
              const classFeatureURL = `https://www.dnd5eapi.co${element2.url}`;
              const promise = axios.get(classFeatureURL).then(async (classResponse2) => {
                const classData2 = classResponse2.data;
                let featureInfo = `
                <h4 style="color:#F2CA0C;">${classData2.name}</h2>
                <hr style="margin-top:-5px; border: 1px solid #F2CA0C; opacity:1;">
                <p> ${classData2.desc.join("<p>")}</p>`;
                

                

                if (classData2.feature_specific && classData2.feature_specific.subfeature_options) { //Eğer böyle bir bölüm varsa
                  featureInfo += `<p>Options:</p><ul>`;
                  //console.log(classData2.feature_specific.subfeature_options.from.options[0].item.name)
                  for (const option of classData2.feature_specific.subfeature_options.from.options) {
                    if (option.item && option.item.url) {
                      try {
                        const itemResponse = await axios.get(`https://www.dnd5eapi.co${option.item.url}`);
                        const itemData = itemResponse.data;
                        //console.log(itemData.desc)
                        featureInfo += `<li><p>${option.item.name}: ${itemData.desc.join(`<p></p>`)}</li></p>`;
                      } catch (itemError) {
                        console.error("Error fetching item data:", itemError);
                        featureInfo += `<li>Error fetching item data</li>`;
                      }

                    }

                    else {
                      featureInfo += `<li>${option.item.name}</li>`;

                    }

                  }
                  


                } else if(classData2.feature_specific && classData2.feature_specific.expertise_options) {
                  featureInfo += `<p>Options:</p><ul>`;
                  //console.log(classData2.feature_specific.subfeature_options.from.options[0].item.name)
                  for (const option of classData2.feature_specific.expertise_options.from.options) {
                    if (option.item && option.item.url) {
                      try {
                        const itemResponse = await axios.get(`https://www.dnd5eapi.co${option.item.url}`);
                        const itemData = itemResponse.data;
                        //console.log(itemData.desc)
                        featureInfo += `<li><p>${option.item.name}</li></p>`;
                      } catch (itemError) {
                        console.error("Error fetching item data:", itemError);
                        featureInfo += `<li>Error fetching item data</li>`;
                      }

                    }

                    else {
                      featureInfo += `<li>${option.item.name}</li>`;

                    }

                  }
                }
                //burada bitiyor
                featureInfo += `</ul>`
    

                return featureInfo;
              });
              promises.push(promise);

            }
          }
          promises.push(`<h2><strong style="color:#FFD300;">Spellcasting</strong></h2>`)
          const promise2 = axios.get(`https://www.dnd5eapi.co/api/classes/${matchedClass.index}`).then(async (classResponse) => {
            const classData = classResponse.data;
            let spellInfo =``;
            if(classData.spellcasting) {
  
              for(const element of classData.spellcasting.info) {
                spellInfo +=`<p>${element.desc}</p>`;
              }
            }
           
            
            return spellInfo;
            });
          promises.push(promise2);



          const results = await Promise.all(promises);
          classResult2.innerHTML = results.join('');

          
        } catch (error) {
          classResult2.innerHTML = "Error fetching data:" + error;
        }
      }

      fetchData();


      async function fetchSubClassData() {

        try {
          const promises = [];
            promises.push(`<h2 style="margin-bottom: 30px;"><strong style="color:#FFD300;">Sub-Classes</strong></h2>`)
            const promise3 = axios.get(`https://www.dnd5eapi.co/api/classes/${matchedClass.index}`).then(async (classResponse) => {
              const classData = classResponse.data;
              let subClassInfo =``;
              if(classData.subclasses) {
                
                for(const element of classData.subclasses) {
                  try {
                    const subclassesResponse = await axios.get(`https://www.dnd5eapi.co${element.url}`);
                    const subclassesData = subclassesResponse.data
                    subClassInfo += `
                    <h2 style="color:#F2CA0C;"><strong>${subclassesData.name}</strong></h4>
                    <p><strong>${subclassesData.desc.join(` `)}</strong></p>`
  
                    try {
                        const subclassesLevelResponse = await axios.get(`https://www.dnd5eapi.co${subclassesData.subclass_levels}`);
                        const subclassesLevelData = subclassesLevelResponse.data;
  
                        for(const element of subclassesLevelData) {
                          for(const element2 of element.features) {
                              try {
                                const subclassesFeatureResponse = await axios.get(`https://www.dnd5eapi.co${element2.url}`);
                                const subclassesFeatureData = subclassesFeatureResponse.data;
                                subClassInfo += `
                                <h4 style="color:#F2CA0C;"><strong>${subclassesFeatureData.name}</strong></h4>
                                <hr style="margin-top:-5px; border: 1px solid #F2CA0C; opacity:1;">
                                <p>${subclassesFeatureData.name}:  ${subclassesFeatureData.desc.join(` `)} </p>`


                                if (subclassesFeatureData.feature_specific && subclassesFeatureData.feature_specific.subfeature_options) { //Eğer böyle bir bölüm varsa
                                  subClassInfo += `<p>Options:</p><ul>`;
                                  //console.log(classData2.feature_specific.subfeature_options.from.options[0].item.name)
                                  for (const option of subclassesFeatureData.feature_specific.subfeature_options.from.options) {
                                    if (option.item && option.item.url) {
                                      try {
                                        const itemResponse = await axios.get(`https://www.dnd5eapi.co${option.item.url}`);
                                        const itemData = itemResponse.data;
                                        //console.log(itemData.desc)
                                        subClassInfo += `<li><p>${option.item.name}: ${itemData.desc}</li></p>`;
                                      } catch (itemError) {
                                        console.error("Error fetching item data:", itemError);
                                        subClassInfo += `<li>Error fetching item data</li>`;
                                      }
                
                                    }
                
                                    else {
                                      subClassInfo += `<li>${option.item.name}</li>`;
                
                                    }
                
                                  }
                                  subClassInfo += `</ul>`
                                }
                              } catch (error) {
                                classResult3.innerHTML = "Error fetching subclass level feature data: " + error;
                              }
                          }
                        }
  
                    } catch (error) {
                      classResult3.innerHTML = "Error fetching subclass level data: " + error;
                    }
  
                  } catch (error) {
                    classResult3.innerHTML = "Error fetching subclass data: " + error;
                  }
                  
                }
              }
             
              
              return subClassInfo;
              });
            promises.push(promise3);
  
            
  
  
  
            
            const results = await Promise.all(promises);
            classResult3.innerHTML = results.join('');
          
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }

      fetchSubClassData();



    })
    .catch((err) => {
      classResult.innerHTML = err;
    });

    

};

const formatProf = (proficiencies) => {
  {
    return proficiencies.map((proficiency2) => (

      `<em>
                ${proficiency2.name}
              </em>`


    ));
  }
};
const formatProfChoice = (proficiencies) => {
  {
    return proficiencies.map((proficiency2) => (

      `
                ${proficiency2.desc}
              `


    ));
  }
};
const formatStartingEq = (equipments) => {
  {
    return equipments.map((equipment2) => (

      `<em>
                ${equipment2.quantity} ${equipment2.equipment.name}
              </em>`


    ));
  }
};
const formatStartingEqOpts = (equipments) => {
  {
    return equipments.map((equipment2) => (

      `<ul>
                <li>${equipment2.desc}: choose ${equipment2.choose} </li>
              </ul>`


    ));
  }
};
const formatprerequisities = (prerequisites) => {
  {
    return prerequisites.map((prerequisity) => (

      `
              Ability Score Minimum: ${prerequisity.ability_score.name} ${prerequisity.minimum_score}
              `


    ));
  }
};
const formatProficiencies = (proficiency) => {
  {
    return proficiency.map((proficiency2) => (

      `
              <ul>
                <li>${proficiency2.name} </li>
              </ul>
              `


    ));
  }
};

const formatClassURL = (class_) => {
  {
    return class_.map((class2_) => (

      `${formatClassFeature(class2_.features)}`


    ));
  }
};

const formatClassFeature = (features) => {
  {
    return features.map((feature) => (

      `https://www.dnd5eapi.co${feature.url}`


    ));
  }
};

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