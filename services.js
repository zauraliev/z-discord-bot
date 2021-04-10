const Database = require("@replit/database");
const db = new Database();

const getMotivations = initMotivations => {
  db.get("motivations").then(motivations => {
    if (!motivations || motivations.length < 1) {
      db.set("motivations", initMotivations);
      console.log(motivations);
    }
    console.log(">>>", motivations);
  });
}

const updateMotivation = motivationMSG => {
  db.get("motivations").then(motivations =>{
    motivations.push(motivationMSG);
    db.set("motivations", motivations)
      .then(() => {
        db.get("motivations").then(motivations => {
          console.log(motivations);
        })
      })
  })
}

const deleteMotivation = index => {
  db.get("motivations").then(motivations => {
    if(motivations.length > index) {
      motivations.splice(index, 1);
      db.set("motivations", motivations)
        .then(() => {
          db.get("motivations").then(motivations => {
            console.log(motivations);
          })
        })
    }
  })
}

module.exports = {
  getMotivations: getMotivations,
  updateMotivation: updateMotivation,
  deleteMotivation: deleteMotivation
}