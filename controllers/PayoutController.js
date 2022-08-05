require("dotenv").config();
const User = require("../models").adminuser;
const Profile = require("../models").profile;
const Payout = require("../models").payout;

const excludeAtrrbutes = { exclude: ["createdAt", "updatedAt", "deletedAt"] };

// imports initialization
const { Op } = require("sequelize");
const cloudinary = require("../helpers/cloudinary");
const upload = require("../helpers/upload");

exports.requestPayOut = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    req.body.userId = adminuserId;
    const adminId = req.user.id;

    const seller = await User.findOne({
      where: {
        id: adminId,
      },
    });
    if (!seller || seller.role !== "seller") {
      return res.status(400).send({
        message: "Only seller can access this route",
      });
    }
    const payout = await Payout.create(req.body);
    return res.status(201).send({
      payout,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getAllPayouts = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    req.body.userId = adminuserId;
    const adminId = req.user.id;

    const superadmin = await User.findOne({
      where: {
        id: adminId,
      },
    });
    if (!superadmin || superadmin.role !== "admin") {
      return res.status(400).send({
        message: "Only SuperAdmin can access this route",
      });
    }
    const payouts = await Payout.findAll({
      order: [["createdAt", "ASC"]],
    });
    return res.status(200).send({
      payouts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getPayOutByUser = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    req.body.userId = adminuserId;
    const adminId = req.user.id;

    const seller = await User.findOne({
      where: {
        id: adminId,
      },
    });
    if (!seller || seller.role !== "seller") {
      return res.status(400).send({
        message: "Only seller can access this route",
      });
    }
    const payouts = await Payout.findAll({
      where: {
        userId: req.user.id,
      },
      order: [["createdAt", "ASC"]],
    });
    return res.status(200).send({
      payouts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.approvePayOut = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    req.body.userId = adminuserId;
    const adminId = req.user.id;

    const seller = await User.findOne({
      where: {
        id: adminId,
      },
    });
    if (!seller || seller.role !== "admin") {
      return res.status(400).send({
        message: "Only superadmin can access this route",
      });
    }
    const payout = await Payout.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!payout) {
      return res.status(404).send({
        message: "Payout not found",
      });
    }
    payout.approval_status = "approved";
    payout.save();
    return res.status(200).send({
      payout,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.rejectPayOut = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    req.body.userId = adminuserId;
    const adminId = req.user.id;

    const seller = await User.findOne({
      where: {
        id: adminId,
      },
    });
    if (!seller || seller.role !== "admin") {
      return res.status(400).send({
        message: "Only superadmin can access this route",
      });
    }
    const payout = await Payout.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!payout) {
      return res.status(404).send({
        message: "Payout not found",
      });
    }
    payout.approval_status = "rejected";
    payout.save();
    return res.status(200).send({
      payout,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
