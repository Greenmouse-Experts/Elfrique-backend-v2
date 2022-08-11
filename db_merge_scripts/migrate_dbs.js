const {
  adminuser,
  profile,
  url,
  trivia,
  question,
  payout,
} = require("../models");

module.exports = async (req, res) => {
  const text = "migrating...";
  res.send(text);
  console.log(text);
  profile.sync({ alter: true });
  url.sync({ alter: true });
  trivia.sync({ alter: true });
  question.sync({ alter: true });
  payout.sync({ alter: true });
  //   adminuser.sync({alter:true})

  console.log("Added models");
};
