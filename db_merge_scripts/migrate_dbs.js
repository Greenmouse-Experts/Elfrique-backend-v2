const {
  adminuser,
  profile,
  url,
  trivia,
  question,
  questionOption,
  votingContest,
  contestants,
  payout,
  triviaplayer,
  formOption,
  formQuestion,
} = require("../models");

module.exports = async (req, res) => {
  const text = "migrating...";
  adminuser.sync({ alter: true });
  res.send(text);
  console.log(text);
  profile.sync({ alter: true });
  url.sync({ alter: true });
  payout.sync({ alter: true });
  trivia.sync({ alter: true });
  question.sync({ alter: true });
  questionOption.sync({ alter: true });
  votingContest.sync({ alter: true });
  contestants.sync({ alter: true });
  // payout.sync({ alter: true });
  triviaplayer.sync({ alter: true });
  formOption.sync({ alter: true });
  formQuestion.sync({ alter: true });

  console.log("Added models");
};
