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
const votingContest = require("../models").votingcontest;
const awardContest = require("../models").awardContest;
const awardCategories = require("../models").awardCategories;
const awardNominees = require("../models").awardNominees;
const awardVote = require("../models").awardVote;
const Transaction = require("../models").transaction;

const excludeAtrrbutes = { exclude: ["createdAt", "updatedAt", "deletedAt"] };

// imports initialization
const { Op } = require("sequelize");
const cloudinary = require("../helpers/cloudinary");
const upload = require("../helpers/upload");

//controllers

exports.createAwardContest = async (req, res) => {
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
    const awards = await awardContest.create(req.body);
    return res.status(200).send({
      awards,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getAllAwardsContest = async (req, res) => {
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
    const awards = await awardContest.findAll({
      where: { adminuserId },
    });
    return res.status(200).send({
      awards,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getSingleAwardContest = async (req, res) => {
  try {
    const awards = await awardContest.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: awardCategories,
          include: [
            {
              model: awardNominees,
              as: "nominees",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },

        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
          include: [
            {
              model: Profile,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            },
          ],
        },
      ],
    });
    return res.status(200).send({
      awards,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.updateAwardContest = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    req.body.adminuserId = adminuserId;
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
    const awards = await awardContest.findOne({
      where: { id: req.params.id },
    });
    if (!awards) {
      return res.status(404).send({
        message: "AwardContest not found",
      });
    }
    await awardContest.update(req.body);
    return res.status(200).send({
      awardContest,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.deleteAwardContest = async (req, res) => {
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
    const awards = await awardContest.findOne({
      where: { id: req.params.id },
    });
    if (!awards) {
      return res.status(404).send({
        message: "AwardContest not found",
      });
    }
    await awardContest.destroy();
    return res.status(200).send({
      message: "AwardContest deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.createAwardCategories = async (req, res) => {
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
    const awards = await awardContest.findOne({
      where: { id: req.params.id },
    });
    if (!awards) {
      return res.status(404).send({
        message: "AwardContest not found",
      });
    }
    req.body.awardContestId = awards.id;

    const Categories = await awardCategories.create(req.body);
    return res.status(200).send({
      Categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
exports.getAllAwardCategories = async (req, res) => {
  try {
    const awards = await awardContest.findOne({
      where: { id: req.params.id },
    });
    if (!awards) {
      return res.status(404).send({
        message: "AwardContest not found",
      });
    }
    const Categories = await awardCategories.findAll({
      where: { awardContestId: awards.id },
      include: [
        {
          model: awardNominees,
          as: "nominees",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    return res.status(200).send({
      Categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getSingleCategory = async (req, res) => {
  try {
    const Categories = await awardCategories.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: awardNominees,
          as: "nominees",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
        {
          model: awardContest,
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          include: [
            {
              model: User,
              attributes: {
                exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
              },
              include: [
                {
                  model: Profile,
                  attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                  },
                },
              ],
            },
          ],
        },
      ],
    });
    return res.status(200).send({
      Categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.createAwardNominees = async (req, res) => {
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
    const awards = await awardContest.findOne({
      where: { title: req.params.title },
    });
    if (!awards) {
      return res.status(404).send({
        message: "AwardContest not found",
      });
    }
    //console.log(awards);
    req.body.awardContestId = awards.id;
    const Categories = await awardCategories.findOne({
      where: { id: req.params.id },
    });
    if (!Categories) {
      return res.status(404).send({
        message: "AwardCategories not found",
      });
    }
    req.body.awardCategoriesId = Categories.id; //check this
    const Nominees = await awardNominees.create(req.body);
    return res.status(200).send({
      Nominees,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getSingleNominee = async (req, res) => {
  try {
    const Nominees = await awardNominees.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: awardCategories,
          as: "Categories",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    return res.status(200).send({
      Nominees,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.findAllAwards = async (req, res) => {
  try {
    const awards = await awardContest.findAll({
      where: {
        status: true,
      },
      include: [
        {
          model: awardCategories,
          include: [
            {
              model: awardNominees,
              as: "nominees",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },

        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    return res.status(200).send({
      awards,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

//-------new---------
exports.createUserVote = async (req, res) => {
  try {
    const Nominee = await awardNominees.findOne({
      where: { id: req.params.nomineeId },
      include: [
        {
          model: awardContest,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
        {
          model: awardCategories,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
          as: "Categories",
        },
      ],
    });
    if (!Nominee) {
      return res.status(404).send({
        message: "Nominee not found",
      });
    }

    const { type, method, reference, numberOfVote, amount, fullname } =
      req.body;

    if (type === "free") {
      const numVote = 1;
      await Nominee.increment("voteCount", { by: numVote });
      await awardVote.create({
        ...req.body,
        numberOfVote: numVote,
        voters_name: fullname,
        payment_method: "free",
        payment_gateway: "free",
        payment_status: "free",
        amount: 0,
        awardNomineeId: Nominee.id,
        awardContestId: Nominee.awardContestId,
      });
      return res.status(200).send({
        status: true,
        message: "Your Vote has been Successfully Submitted",
        data: Nominee,
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
        await Nominee.increment("voteCount", { by: numVote });
        await awardVote.create({
          ...req.body,
          numberOfVote: numVote,
          voters_name: fullname,
          payment_method: method,
          payment_gateway: method,
          payment_status: type,
          awardNomineeId: Nominee.id,
          awardContestId: Nominee.awardContestId,
        });
        return res.status(200).send({
          status: true,
          message:
            "Payment Successful and Your Vote has been Successfully Submitted",
          data: Nominee,
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
    const userAwards = await awardContest.findAll({
      where: { adminuserId },
      include: [
        // {
        //   model: awardNominees,
        //   attributes: {
        //     exclude: ["createdAt", "updatedAt", "deletedAt"],
        //   },
        // },
        {
          model: awardVote,
          include: [{ model: awardNominees }],
        },
      ],
      attributes: {
        exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
      },
    });
    const awardVotes = [].concat.apply(
      [],
      userAwards.map((item) => item.awardVotes)
    );
    return res.status(200).send({
      awardVotes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getUserAwardVotes = async (req, res) => {
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
    const awardId = req.params.awardContestId;
    const userAward = await awardContest.findOne({
      where: { id: awardId },
    });
    if (!userContest) {
      return res.status(404).send({
        message: "Award contest not found",
      });
    }
    const _awardVotes = await awardVote.findAll({
      where: { awardContestId: awardId },
    });
    return res.status(200).send({
      _awardVotes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.adminGetAllUserAwardsAndVotes = async (req, res) => {
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
    const userAwardsWithVotes = await awardContest.findAll({
      // where: { id: contestId },
      include: [
        {
          model: awardVote,
        },
      ],
    });
    return res.status(200).send({
      userAwardsWithVotes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
