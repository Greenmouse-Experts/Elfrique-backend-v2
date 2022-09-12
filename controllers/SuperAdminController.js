require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateUniqueId = require("generate-unique-id");
const uniqueString = require("unique-string");
const nodemailer = require("nodemailer");
const User = require("../models").adminuser;
const ResetPasswords = require("../models").resetpassword;
const profile = require("../models").profile;
const SuperAdmin = require("../models").superadmin;
const VoteContestController = require("../controllers/VotingContest");
const Url = require("../models").url;
const AwardContestController = require("../controllers/AwardContest");

const EventController = require("../controllers/EventController");

const TicketController = require("../controllers/TicketController");

const TriviaController = require("../controllers/TriviaController");

const FormController = require("../controllers/FormController");

const excludeAtrrbutes = { exclude: ["createdAt", "updatedAt", "deletedAt"] };

// imports initialization
const { Op } = require("sequelize");

exports.getAllUsers = async (req, res) => {
  try {
    const adminId = req.user.id;
    const superadmin = await User.findOne({
      where: {
        id: adminId,
      },
    });
    if (superadmin.role !== "admin") {
      return res.status(404).send({
        message: "Only SuperAdmin can access this route",
      });
    }

    const users = await User.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
      },
      include: [
        {
          model: profile,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    return res.status(200).send({
      users,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

exports.getAllContest = async (req, res) => {
  try {
    const adminId = req.user.id;
    const superadmin = await User.findOne({
      where: {
        id: adminId,
      },
    });
    if (superadmin.role !== "admin") {
      return res.status(404).send({
        message: "Only SuperAdmin can access this route",
      });
    }
console.log("\n\nsuperadmiiiin\n\n");
    const contest = await VoteContestController.findAllVoteContest(req, res);

    return contest;
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const adminId = req.user.id;
    const superadmin = await User.findOne({
      where: {
        id: adminId,
      },
    });
    if (superadmin.role !== "admin") {
      return res.status(404).send({
        message: "Only SuperAdmin can access this route",
      });
    }

    const events = await EventController.findAllEvents(req, res);

    return events;
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

exports.getAllForms = async (req, res) => {
  try {
    const adminId = req.user.id;
    const superadmin = await User.findOne({
      where: {
        id: adminId,
      },
    });
    if (superadmin.role !== "admin") {
      return res.status(404).send({
        message: "Only SuperAdmin can access this route",
      });
    }

    const forms = await FormController.findAllForms(req, res);

    return forms;
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

exports.getAllTrivia = async (req, res) => {
  try {
    const adminId = req.user.id;
    const superadmin = await User.findOne({
      where: {
        id: adminId,
      },
    });
    if (superadmin.role !== "admin") {
      return res.status(404).send({
        message: "Only SuperAdmin can access this route",
      });
    }

    const trivia = await TriviaController.findAllTrivias(req, res);

    return trivia;
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

exports.getAllShortUrl = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const superadmin = await User.findOne({
      where: {
        id: adminId,
      },
    });
    if (superadmin.role !== "admin") {
      return res.status(404).send({
        message: "Only SuperAdmin can access this route",
      });
    }

    await Url.findAll().then((url) => {
      if (url) {
        res.status(200).json({
          status: true,
          data: url,
        });
      } else {
        res.status(404).json({
          status: false,
          message: "No URL Found",
        });
      }
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
