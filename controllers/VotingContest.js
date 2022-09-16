require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateUniqueId = require("generate-unique-id");
const uniqueString = require("unique-string");
const nodemailer = require("nodemailer");
//const sequelize = require("../config/db");
const User = require("../models").adminuser;
const ResetPasswords = require("../models").resetpassword;
const Profile = require("../models").profile;
const votingContest = require("../models").votingContest;
const contestant = require("../models").contestants;
const sponsors = require("../models").sponsors;
const contestInfo = require("../models").contestInfo;
const awardContest = require("../models").awardContest;
const Transaction = require("../models").transaction;
const contestVote = require("../models").contestVote;
const { Service } = require("../service/payment");

const excludeAtrrbutes = { exclude: ["createdAt", "updatedAt", "deletedAt"] };

// imports initialization
const { Op } = require("sequelize");
const cloudinary = require("../helpers/cloudinary");
const upload = require("../helpers/upload");

exports.createVoteContest = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const adminuserId = req.user.id;
    req.body.adminuserId = adminuserId;
    req.body.image = result.secure_url;
    const profile = await Profile.findOne({
      where: { adminuserId },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    if (!profile) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const voteContest = await votingContest.create(req.body);
    return res.status(200).send({
      voteContest,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getallVOteContest = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    const profile = await Profile.findOne({
      where: { adminuserId },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    if (!profile) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const voteContest = await votingContest.findAll({
      where: {
        adminuserId: req.user.id,
      },
    });
    return res.status(200).send({
      voteContest,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getSingleVoteContest = async (req, res) => {
  try {
    const voteContest = await votingContest.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: contestant,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
        {
          model: User,
          include: [
            {
              model: Profile,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            },
          ],
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    return res.status(200).send({
      voteContest,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.updateVoteContest = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    const profile = await Profile.findOne({
      where: { adminuserId },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    if (!profile) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const voteContest = await votingContest.findOne({
      where: { id: req.params.id },
    });
    if (!voteContest) {
      return res.status(404).send({
        message: "votingContest not found",
      });
    }
    await votingContest.update(req.body);
    return res.status(200).send({
      votingContest,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.deleteVoteContest = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    const profile = await Profile.findOne({
      where: { adminuserId },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    if (!profile) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const voteContest = await voteContest.findOne({
      where: { id: req.params.id },
    });
    if (!voteContest) {
      return res.status(404).send({
        message: "AwardContest not found",
      });
    }
    const vote = await votingContest.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).send({
      vote,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.createContestants = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const adminuserId = req.user.id;
    //req.body.adminuserId = adminuserId;
    req.body.image = result.secure_url;
    const profile = await Profile.findOne({
      where: { adminuserId },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    if (!profile) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const voteContest = await votingContest.findOne({
      where: { id: req.params.id },
    });
    if (!voteContest) {
      return res.status(404).send({
        message: "Contest not found",
      });
    }
    req.body.votingContestId = voteContest.id;
    const contestantbody = await contestant.create(req.body);
    return res.status(200).send({
      contestantbody,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getAllContestants = async (req, res) => {
  try {
    const voteContest = await votingContest.findOne({
      where: { id: req.params.id },
    });
    if (!voteContest) {
      return res.status(404).send({
        message: "Contest not found",
      });
    }
    const contestants = await contestant.findAll({
      where: {
        votingContestId: req.params.id,
        status: true,
      },
    });
    return res.status(200).send({
      contestants,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
exports.getUserContestants = async (req, res) => {
  try {
    const _adminuserId = req.user.id;
    const user = await User.findOne({
      where: { id: _adminuserId },
    });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const voteContest = await votingContest.findOne({
      where: { id: req.params.contestId },
    });
    if (!voteContest) {
      return res.status(404).send({
        message: "Contest not found",
      });
    }
    const contestants = await contestant.findAll({
      where: {
        votingContestId: req.params.contestId,
        status: true,
      },
    });
    return res.status(200).send({
      contestants,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getAllUserContests = async (req, res) => {
  try {
    const _adminuserId = req.user.id;
    const user = await User.findOne({
      where: { id: _adminuserId },
    });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const voteContests = await votingContest.findAll({
      where: {
        status: true,
        adminuserId: user.id,
      },
      include: [
        {
          model: contestant,
          as: "contestants",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
        {
          model: User,
          include: [
            {
              model: Profile,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            },
          ],
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    return res.status(200).send({
      voteContests,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getSingleContestant = async (req, res) => {
  try {
    const contestants = await contestant.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: votingContest,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    return res.status(200).send({
      contestants,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.addSponsor = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const adminuserId = req.user.id;
    //req.body.adminuserId = adminuserId;
    req.body.image = result.secure_url;
    //const adminuserId = req.user.id;
    const profile = await Profile.findOne({
      where: { adminuserId },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    if (!profile) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const voteContest = await votingContest.findOne({
      where: { id: req.params.id },
    });
    if (!voteContest) {
      const awardContests = await awardContest.findOne({
        where: { id: req.params.id },
      });
      if (!awardContests) {
        return res.status(404).send({ message: "Contest not found" });
      }
      req.body.awardContestId = awardContests.id;
    } else {
      req.body.votingContestId = voteContest.id;
    }
    const sponsor = await sponsors.create(req.body);
    return res.status(200).send({
      sponsor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.addInfo = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    const profile = await Profile.findOne({
      where: { adminuserId },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    if (!profile) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const voteContest = await votingContest.findOne({
      where: { id: req.params.id },
    });
    if (!voteContest) {
      const awardContests = await awardContest.findOne({
        where: { id: req.params.id },
      });
      if (!awardContests) {
        return res.status(404).send({ message: "Contest not found" });
      }
      req.body.awardContestId = awardContests.id;
    } else {
      req.body.votingContestId = voteContest.id;
    }
    const infos = await contestInfo.create(req.body);
    return res.status(200).send({
      infos,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.findAllVoteContest = async (req, res) => {
  try {
    const voteContests = await votingContest.findAll({
      where: {
        status: true,
      },
      include: [
        {
          model: contestant,
          as: "contestants",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
        {
          model: User,
          include: [
            {
              model: Profile,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            },
          ],
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    return res.status(200).send({
      voteContests,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.voteAContestant = async (req, res) => {
  try {
    const Contestant = await contestant.findOne({
      where: { id: req.params.contestantId },
      include: [
        {
          model: votingContest,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    if (!Contestant) {
      return res.status(404).send({
        message: "Contestant not found",
      });
    }

    const { type, method, reference, numberOfVote, amount, fullname } =
      req.body;

    if (type === "free") {
      await Contestant.increment("voteCount", { by: 1 });
      return res.status(200).send({
        status: true,
        message: "Your Vote has been Successfully Submitted",
        data: Contestant,
      });
    } else if (type === "paid") {
      const checktxn = await Transaction.findOne({
        where: { reference },
      });

      if (checktxn) {
        return res.status(400).send({
          status: false,
          message: "Transaction Already Exist, cannot continue this operation",
        });
      } else {
        await Contestant.increment("voteCount", { by: Number(numberOfVote) });
        return res.status(200).send({
          status: true,
          message:
            "Payment Successful and Your Vote has been Successfully Submitted",
          data: Contestant,
        });
        /* res.status(200).json({
          status: "error",
          message: "Transaction was not successful",
          transaction,
        }); */
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

//------ new-----------
exports.createUserVote = async (req, res) => {
  try {
    const Contestant = await contestant.findOne({
      where: { id: req.params.contestantId },
      include: [
        {
          model: votingContest,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    if (!Contestant) {
      return res.status(404).send({
        message: "Contestant not found",
      });
    }

    const { type, method, reference, numberOfVote, amount, fullname } =
      req.body;

    if (type === "free") {
      const numVote = 1;
      await Contestant.increment("voteCount", { by: numVote });
      await contestVote.create({
        numberOfVote: numVote,
        voters_name: fullname,
        payment_method: "free",
        payment_gateway: "free",
        payment_status: "free",
        ...req.body,
      });
      return res.status(200).send({
        status: true,
        message: "Your Vote has been Successfully Submitted",
        data: Contestant,
      });
    } else if (type === "paid") {
      const checktxn = await Transaction.findOne({
        where: { reference },
      });

      if (checktxn) {
        return res.status(400).send({
          status: false,
          message: "Transaction Already Exist, cannot continue this operation",
        });
      } else {
        const numVote = numberOfVote;
        await Contestant.increment("voteCount", { by: numVote });
        console.log("boooddy", req.body);
        await contestVote.create({
          numberOfVote: numVote,
          voters_name: fullname,
          payment_method: method,
          payment_gateway: method,
          payment_status: type,
          // ...req.body,
        });
        return res.status(200).send({
          status: true,
          message:
            "Payment Successful and Your Vote has been Successfully Submitted",
          data: Contestant,
        });
        /* res.status(200).json({
          status: "error",
          message: "Transaction was not successful",
          transaction,
        }); */
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
exports.getAllUserVotes = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    const user = await User.findOne({
      where: { id: adminuserId },
    });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const userContests = await votingContest.findAll({
      where: { adminuserId },
      include: [
        {
          model: contestant,
          as: "contestants",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
        {
          model: contestVote,
        },
      ],
      attributes: {
        exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
      },
    });
    return res.status(200).send({
      userContests,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
exports.getUserContestVotes = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    const user = await User.findOne({
      where: { id: adminuserId },
    });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const contestId = req.params.votingContestId;
    const userContest = await votingContest.findOne({
      where: { id: contestId },
    });
    if (!userContest) {
      return res.status(404).send({
        message: "Contest not found",
      });
    }
    const contestVotes = await contestVote.findAll({
      where: { votingContestId: contestId },
    });
    return res.status(200).send({
      contestVotes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.adminGetAllUserContestsAndVotes = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    const superadmin = await User.findOne({
      where: { id: adminuserId },
    });
    if (superadmin.role !== "admin") {
      return res.status(404).send({
        message: "Only SuperAdmin can access this route",
      });
    }
    // const contestId = req.params.votingContestId;
    const userContestsWithVotes = await votingContest.findAll({
      // where: { id: contestId },
      include: [
        {
          model: contestVote,
        },
      ],
    });
    return res.status(200).send({
      userContestsWithVotes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

