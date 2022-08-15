const old_db = require("./old_db.json");
const media_base = "https://stageapp.elfrique.com";
require("dotenv").config;
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
const generateUniqueId = require("generate-unique-id");
const db = require("../database/db");
module.exports = async (req, res) => {
  const _id = req.params.id;
  const text = "merged...";

  console.log(text);
  const migration_functions = [
    sync_admins_and_profiles,
    sync_urls,
    sync_trivia,
    sync_trivia_questions,
    sync_trivia_options,
    sync_triviaplayers,
    sync_votingcontests,
    sync_contestants,
  ];
  const _func = migration_functions[parseInt(_id) - 1];
  _func();

  res.send(text + _func.name);
};

const getItemsFromJson = (data, table) => {
  let res = [];
  old_db.map((item) =>
    item.type === "table" && item.data && item.name === table
      ? (res = item.data)
      : console.log()
  );
  return res;
};

const sync_admins_and_profiles = () => {
  ////ToDo: Sync date added and edited.
  const old_admins = getItemsFromJson(old_db, "organisers");

  old_admins.forEach(async (admin) => {
    let _role = admin.bank ? "seller" : "normalUser";
    if (admin.admin_level > 0) {
      _role = "admin";
    }
    let uniqueRef = generateUniqueId({
      length: 8,
      useLetters: true,
    });
    try {
      const newAdmin = await adminuser.create({
        firstname: admin.first_name,
        lastname: admin.last_name,
        phonenumber: admin.phone,
        email: admin.email,
        password: admin.password,
        referral_email: admin.ref_email,
        role: _role,
        email_token: admin.password_reset_token,
        activated: admin.verification_status,
        reference: uniqueRef,
        //referral_id:xxxx   //not needed
      });
      console.log("Admin create", newAdmin.id, newAdmin.firstname);
      try {
        const newProfile = await profile.create({
          firstname: admin.first_name,
          lastname: admin.last_name,
          phonenumber: admin.phone,
          email: admin.email,
          accountnumber: admin.account_number,
          accountname: admin.account_name,
          about: admin.about,
          bankname: admin.bank,
          gender: admin.gender,
          twitterURL: admin.twitter_url,
          facebookURL: admin.facebook_url,
          instagramURL: admin.instagram_url,
          adminuserId: newAdmin.id,
        });
        console.log("Profile create", newProfile.id, newProfile.firstname);
      } catch (error) {
        console.log("failed to create profile", admin.first_name); //error);
      }
    } catch (error) {
      console.log("failed to create", admin.first_name); //error);
    }
  });
};

const sync_urls = () => {
  ////ToDo: Sync date added and edited.
  const old_urls = getItemsFromJson(old_db, "urls");
  const old_admins = getItemsFromJson(old_db, "organisers");
  const baseUrl = process.env.FRONT_URL;
  old_urls.forEach(async (_url) => {
    // Get admin id
    old_admins.forEach(async (_admin_) => {
      if (_admin_.id === _url.organiser_id) {
        const organiserEmail = _admin_.email;

        const _user = await adminuser.findOne({
          where: { email: organiserEmail },
        });
        const shortUrl = `${baseUrl}/s/${_url.alias}`;
        //create
        try {
          const newUrl = await url.create({
            longUrl: _url.url,
            shortUrl: shortUrl,
            urlCode: _url.alias,
            userId: _user.id,
            //date: new Date()
          });
          console.log("url created:", newUrl.id);
        } catch (error) {
          console.log("failed to create url", _url.alias); //error);
        }
      }
    });
  });
};

const sync_trivia = () => {
  ////ToDo: Sync date added and edited.
  const old_trivia = getItemsFromJson(old_db, "trivia_details");
  const old_admins = getItemsFromJson(old_db, "organisers");
  old_trivia.forEach(async (_trivia) => {
    // Get admin id
    old_admins.forEach(async (_admin_) => {
      if (_admin_.id === _trivia.organiser_id) {
        const organiserEmail = _admin_.email;

        const _user = await adminuser.findOne({
          where: { email: organiserEmail },
        });
        //create
        try {
          const newTrivia = await trivia.create({
            title: _trivia.title,
            identification_name: _trivia.identification_name,
            image: _trivia.image
              ? `${media_base}/uploads/${_trivia.image}`
              : null,
            details: _trivia.detail,
            instruction: _trivia.instruction,
            duration: _trivia.duration,
            type: _trivia.type,
            numberoftimes: _trivia.times_to_answer,
            adminuserId: _user.id,
          });
          console.log("trivia created:", newTrivia.title);
        } catch (error) {
          console.log("failed to create trivia", _trivia.title, error); //error);
        }
      }
    });
  });
};

const sync_trivia_questions = () => {
  ////ToDo: Sync date added and edited.
  const old_trivia_questions = getItemsFromJson(old_db, "trivia_questions");
  const old_trivia_options = getItemsFromJson(old_db, "trivia_options");
  const old_trivia = getItemsFromJson(old_db, "trivia_details");
  old_trivia_questions.forEach(async (_trivia_questions) => {
    // Get admin id
    let triviaAnswer;
    for (const _options_ of old_trivia_options) {
      if (_options_.id === _trivia_questions.answer) {
        triviaAnswer = _options_.option;
        // break;
      }
    }

    old_trivia.forEach(async (_trivia) => {
      if (_trivia.id === _trivia_questions.trivia_id) {
        const _trivia_db = await trivia.findOne({
          where: { identification_name: _trivia.identification_name },
        });
        //create
        try {
          const newTriviaQuestion = await question.create({
            question: _trivia_questions.body,
            image: _trivia_questions.image
              ? `${media_base}/uploads/${_trivia_questions.image}`
              : null,
            answer: triviaAnswer,
            _id_: _trivia_questions.id,
            nature: _trivia_questions.trivia_nature,
            triviaId: _trivia_db.id,
          });
          console.log(
            "trivia question created:",
            newTriviaQuestion.question,
            newTriviaQuestion.answer
          );
        } catch (error) {
          console.log("failed to create question", error); //,error);
        }
        // break
      }
    });
  });
};

const sync_trivia_options = () => {
  ////ToDo: Sync date added and edited.
  const old_trivia_options = getItemsFromJson(old_db, "trivia_options");
  const old_questions = getItemsFromJson(old_db, "trivia_questions");
  old_trivia_options.forEach(async (_trivia_options) => {
    // Get admin id
    old_questions.forEach(async (_question_) => {
      if (_question_.id === _trivia_options.question_id) {
        const question_from_db = await question.findOne({
          where: { _id_: _question_.id },
        });
        //create
        try {
          console.log("\n\n\nques id is\n\n\n" + question_from_db.id);
          const newTriviaOption = await questionOption.create({
            option: _trivia_options.option,
            questionId: question_from_db.id,
            triviaId: question_from_db.triviaId,
          });
          console.log("option created:", newTriviaOption.option);
        } catch (error) {
          console.log("failed to create option", _trivia_options.option, error);
        }
      }
    });
  });
};

const sync_triviaplayers = () => {
  ////ToDo: Sync date added and edited.
  const old_trivia_users = getItemsFromJson(old_db, "trivia_users");
  const old_trivia_users_that_answered = getItemsFromJson(
    old_db,
    "trivia_users_that_answered"
  );
  const old_trivia = getItemsFromJson(old_db, "trivia_details");
  // let triviaUser = "";
  old_trivia_users_that_answered.forEach(async (_trivia_user_answered) => {
    // Get admin id
    old_trivia_users.forEach((_trivia_user_) => {
      if (_trivia_user_.id === _trivia_user_answered.trivia_user_id) {
        const triviaUser = _trivia_user_;
        // break

        old_trivia.forEach(async (_trivia_) => {
          if (_trivia_.id === _trivia_user_answered.trivia_id) {
            const _trivia_from_db = await trivia.findOne({
              where: { identification_name: _trivia_.identification_name },
            });

            //create
            console.log(_trivia_from_db.id);
            try {
              const newTriviaPlayer = await triviaplayer.create({
                email: triviaUser.email,
                name: triviaUser.name,
                phonenumber: triviaUser.phone,
                city: triviaUser.city,
                // score: triviaUser.,
                // timeplayed: triviaUser.,
                triviaId: _trivia_from_db.id,
              });
              console.log("trivia player created:", newTriviaPlayer.name);
            } catch (error) {
              console.log("failed to create trivia player", triviaUser.name); //error);
            }

            // break
          }
        });
      }
    });
  });
};

const sync_votingcontests = () => {
  ////ToDo: Sync date added and edited.
  const old_contest = getItemsFromJson(old_db, "voting_details");
  const old_admins = getItemsFromJson(old_db, "organisers");
  old_contest.forEach(async (_contest) => {
    // Get admin id
    old_admins.forEach(async (_admin_) => {
      if (_admin_.id === _contest.organisers_id) {
        const organiserEmail = _admin_.email;

        const _user = await adminuser.findOne({
          where: { email: organiserEmail },
        });
        let _type = "free";
        if (Number(_contest.fee) > 0) {
          _type = "paid";
        }
        //create
        try {
          const newContest = await votingContest.create({
            title: _contest.title,
            type: _type,
            identification_name: _contest.identification_name,
            fee: _contest.fee,
            votelimit: _contest.daily_limit,
            startdate: _contest.start_date_utc,
            closedate: _contest.closing_date_utc,
            timezone: _contest.timezone,
            paymentgateway: _contest.payment_gateway,
            packagestatus: _contest.status,
            image: _contest.image
              ? `${media_base}/uploads/${_contest.image}`
              : null,
            adminuserId: _user.id,
          });
          console.log("trivia created:", newContest.title);
        } catch (error) {
          console.log("failed to create trivia", _contest.title, error); //error);
        }
      }
    });
  });
};
const sync_contestants = () => {
  ////ToDo: Sync date added and edited.
  const old_contestant = getItemsFromJson(old_db, "contestants");
  const old_contestDetails = getItemsFromJson(old_db, "voting_details");
  const old_votes = getItemsFromJson(old_db, "votes");
  old_contestant.forEach(async (_contestant) => {
    // Get admin id

    old_contestDetails.forEach(async (_contest_) => {
      if (_contest_.id === _contestant.voting_details_id) {
        const contest_name = _contest_.identification_name;
        //////// continue editing from here
        const _voteCount = () => {
          let count = 0;
          for (const vote of old_votes) {
            if (
              vote.voting_details_id === _contest_.id &&
              vote.contestant_id === _contestant.id
            ) {
              count += 1;
              console.log(
                "count is",
                count,
                "(",
                vote.voting_details_id,
                _contest_.id,
                ")",
                "(",
                vote.contestant_id,
                _contestant.id,
                ")"
              );
            }
          }
          return count;
        };
        const contest = await votingContest.findOne({
          where: { identification_name: contest_name },
        });
        //create
        try {
          const newContestant = await contestants.create({
            fullname: _contestant.fullname,
            image: _contestant.image
              ? `${media_base}/uploads/${_contestant.image}`
              : null,
            identification_name: _contestant.identification_name,
            contestantnumber: _contestant.number,
            about: _contestant.about,
            voteCount: _voteCount(),
            votingContestId: contest.id,
          });
          console.log("trivia created:", newContestant.fullname);
        } catch (error) {
          console.log("failed to create trivia", _contestant.fullname, error); //error);
        }
      }
    });
  });
};

const sync_payout = () => {
  ////ToDo: Sync date added and edited.
  const old_payouts = getItemsFromJson(old_db, "payouts");
  const old_admins = getItemsFromJson(old_db, "organisers");
  old_trivia.forEach(async (_payout) => {
    // Get admin id
    old_admins.forEach(async (_admin_) => {
      if (_admin_.id === _payout.organiser_id) {
        const organiserEmail = _admin_.email;

        const _user = await adminuser.findOne({
          where: { email: organiserEmail },
        });
        //create
        try {
          const newTrivia = await trivia.create({
            title: _trivia.title,
            image: _trivia.image
              ? `${media_base}/uploads/${_trivia.image}`
              : null,
            details: _trivia.detail,
            instruction: _trivia.instruction,
            duration: _trivia.duration,
            type: _trivia.type,
            numberoftimes: _trivia.times_to_answer,
            adminuserId: _user.id,
          });
          console.log("trivia created:", newTrivia.title);
        } catch (error) {
          console.log("failed to create url", _trivia.title); //error);
        }
      }
    });
  });
};
