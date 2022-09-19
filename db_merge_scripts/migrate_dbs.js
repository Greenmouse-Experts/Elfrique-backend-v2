const {
  adminuser,
  profile,
  url,
  trivia,
  question,
  questionOption,
  votingContest,
  contestants,
  eventform,
  event,
  eventsTicket,
  notifications,
  ads,
  eventjob,
  eventReferral,
  proposal,
  awardCategories,
  awardContest,
  awardNominees,
  blog,
  flightBook,
  transaction,
  contestVote,
  awardVote,
  eventsticket_booked,

  payout,
  triviaplayer,
  formOption,
  formQuestion,
} = require("../models");

module.exports = async (req, res) => {
  const text = "migrating...<br/><a href='/api/v1/merge'>Merge dbs</a>";
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
  eventform.sync({ alter: true });
  event.sync({ alter: true });
  eventjob.sync({ alter: true });
  eventsTicket.sync({ alter: true });
  triviaplayer.sync({ alter: true });
  formOption.sync({ alter: true });
  formQuestion.sync({ alter: true });
  notifications.sync({ alter: true });
  ads.sync({ alter: true });
  eventReferral.sync({ alter: true });
  proposal.sync({ alter: true });
  awardCategories.sync({ alter: true });
  awardContest.sync({ alter: true });
  awardNominees.sync({ alter: true });
  blog.sync({ alter: true });
  // flightBook.sync({ alter: true });
  transaction.sync({ alter: true });
  contestVote.sync({ alter: true });
  awardVote.sync({ alter: true });
  eventsticket_booked.sync({ alter: true });

  console.log("Added models");
};
