const spellResult = document.getElementById("spellResult");
const onClickButton = document.getElementById("onClickButton");
const schoolInput = document.getElementById("schoolInput");
const classInput = document.getElementById("classInput");
const levelInput = document.getElementById("levelInput");

searchButton.addEventListener("click", () => {
    const schoolName = schoolInput.value.toLowerCase();
    const levelName = levelInput.value.toLowerCase();
     searchSchoolAndLevel(schoolName, levelName);

     
});
/**searchButton2.addEventListener("click", () => {
    const className = classInput.value.toLowerCase();
    if (className) {
        searchClass(className);
    } 
});**/


function searchSchoolAndLevel(schoolName, levelName) {
    spellResult.innerHTML = "Searching...";



    async function fetchData() {
            const promises = [];

            try {
                let  url = ``;
            if(schoolName && levelName) {
             url= `https://www.dnd5eapi.co/api/spells?school=${schoolName}&level=${levelName}`
                } else if(schoolName)
             url = `https://www.dnd5eapi.co/api/spells?school=${schoolName}`
             else if(levelName) {
                url= `https://www.dnd5eapi.co/api/spells?level=${levelName}`
             } else {
             url = 'https://www.dnd5eapi.co/api/spells';
             }
                const schoolResponse = await axios.get(url);

                const schoolData = schoolResponse.data;
                console.log(schoolResponse);





                for (const element of schoolData.results) {
                    const spellURL = element.url;

                    const promise = axios.get(`https://www.dnd5eapi.co${spellURL}`).then(async (spellResponse) => {
                        const spellData = spellResponse.data;

                        let classes = [];
                        
                        for(const element2 of spellData.classes) {
                            classes.push(element2.name);

                        }
                        let subclasses = [];
                        for(const element2 of spellData.subclasses) {
                            subclasses.push(element2.name);

                        }
                        const spellDescInOneArray = spellData.desc.join("<p style='margin-top: 10px'> </p>");
                        const spellDescMarked = marked.parse(spellDescInOneArray)

                        let spellInfo = `<div style="background-color: #392C2A;box-shadow: 0 1px 15px rgba(189, 186, 186, 0.475); border-radius:8px; padding:30px; margin-top: 50px; margin-left:30px">
                       <h2 style="color:#F2CA0C; font-size: 50px;"> ${spellData.name} </h2>
                       
                        <p> ${spellData.level === 0 ? 'Cantrip ' : `Level: ${spellData.level}`} ${spellData.school.name}</p>
                        <p><strong>Classes:  </strong> ${classes.join(", ")} </p>
                        <p><strong>Subclasses:  </strong> ${subclasses.join(", ")} </p>
                        <p><strong>Casting Time: </strong> ${spellData.casting_time} </p>
                        <p><strong> Range: </strong> ${spellData.range}
                        <p><strong> Components: </strong> ${spellData.components.join(", ")} ${
                            spellData.material ? `: ${spellData.material}`: ''
                        }
                         </p>
                        <p><strong> Duration: </strong> ${spellData.duration} </p>

                       <hr>

                       <p style=""> ${spellDescMarked} </p>
                       <p style="margin-top: 20px"><strong>At Higher Levels: </strong>  ${spellData.higher_level.join("<p style='margin-top: 10px'> </p>")} </p>
                       
                       
                       </div>`;


                        return spellInfo;
                    });

                    promises.push(promise);
                }




                const results = await Promise.all(promises);
                spellResult.innerHTML = results.join('');
            } catch (error) {
                spellResult.innerHTML = 'Error fetching spell data: ' + error;
            }



    }

    fetchData();




};

/**function searchClass(className) {
    spellResult.innerHTML = "Searching...";



    async function fetchData() {
        try {
            const promises = [];

            try {
                const classResponse = await axios.get(`https://www.dnd5eapi.co/api/classes/${className}/spells`);

                const classData = classResponse.data;





                for (const element of classData.results) {
                    const spellURL = element.url;

                    const promise = axios.get(`https://www.dnd5eapi.co${spellURL}`).then(async (spellResponse) => {
                        const spellData = spellResponse.data;

                        let classes = [];
                        
                        for(const element2 of spellData.classes) {
                            classes.push(element2.name);

                        }
                        let subclasses = [];
                        for(const element2 of spellData.subclasses) {
                            subclasses.push(element2.name);

                        }


                        let spellInfo = `<div style="background-color: #392C2A;box-shadow: 0 1px 15px rgba(189, 186, 186, 0.475); border-radius:8px; padding:30px; margin-top: 50px; margin-left:30px">
                       <h2 style="color:#F2CA0C; font-size: 50px;"> ${spellData.name} </h2>
                       
                        <p> ${spellData.level === 0 ? 'Cantrip ' : `Level: ${spellData.level}`} ${spellData.school.name}</p>
                        <p><strong>Classes:  </strong> ${classes.join(", ")} </p>
                        <p><strong>Subclasses:  </strong> ${subclasses.join(", ")} </p>
                        <p><strong>Casting Time: </strong> ${spellData.casting_time} </p>
                        <p><strong> Range: </strong> ${spellData.range}
                        <p><strong> Components: </strong> ${spellData.components.join(", ")} ${
                            spellData.material ? `: ${spellData.material}`: ''
                        }
                         </p>
                        <p><strong> Duration: </strong> ${spellData.duration} </p>

                       <hr>

                       <p style=""> ${spellData.desc.join("<p style='margin-top: 10px'> </p>")} </p>
                       <p style="margin-top: 20px"><strong>At Higher Levels: </strong>  ${spellData.higher_level.join("<p style='margin-top: 10px'> </p>")} </p>
                       
                       
                       </div>`;


                        return spellInfo;
                    });

                    promises.push(promise);
                }




                const results = await Promise.all(promises);
                spellResult.innerHTML = results.join('');
            } catch (error) {
                console.error('error', error);
            }



        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    fetchData();




}; **/




var styles = `
hr {
    height: 0px;

    border: 2px solid #F2CA0C;
    opacity:1;
}

p {
margin: 0;
padding: 0;
color:white;
}

    
 `

var styleSheet = document.createElement("style");
styleSheet.innerText = styles
document.head.appendChild(styleSheet);