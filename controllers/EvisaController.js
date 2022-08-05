require("dotenv").config();
const generateUniqueId = require("generate-unique-id");
const uniqueString = require("unique-string");
const nodemailer = require("nodemailer");
const User = require("../models").adminuser;
const Profile = require("../models").profile;
const Evisa = require("../models").evisa;
const EmailService = require("../service/emailService");
const Evisamessage = require("../models").evisamessage;

const excludeAtrrbutes = { exclude: ["createdAt", "updatedAt", "deletedAt"] };

// imports initialization
const { Op } = require("sequelize");
const cloudinary = require("../helpers/cloudinary");
const upload = require("../helpers/upload");

exports.submitApplication = async (req, res) => {
  try {
    const {
      fullname,
      dapart_date,
      return_date,
      visa_type,
      email,
      phone_number,
      additional_info,
      destination,
    } = req.body;
    const evisa = await Evisa.create(req.body);
    message = ` <h1>Hello ${fullname}</h1>
    <p>Your ${destination} Evisa Application has been submitted successfully.</p>
    <p>We will get back to you soon. Meanwhile, you could as well call us on +234 906 141 2204 to hasten your request."</p>
    <p>Thank you.</p>
    <p>Elfrique Team</p>
    `; // message to be sent
    await EmailService.sendMail(
      email,
      message,
      `${destination} Evisa Application`
    );
    return res.status(201).send({
      evisa,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.findAllApplication = async (req, res) => {
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
    const evisa = await Evisa.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).send({
      evisa,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.deleteApplication = async (req, res) => {
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
    const { id } = req.params;
    const evisa = await Evisa.findOne({
      where: {
        id,
      },
    });
    if (!evisa) {
      return res.status(404).send({ message: "Evisa not found" });
    }
    await evisa.destroy();
    return res.status(200).send({ message: "Evisa deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.sendMessage = async (req, res) => {
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

    const { id } = req.params;
    const evisa = await Evisa.findOne({
      where: {
        id,
      },
    });
    if (!evisa) {
      return res.status(404).send({ message: "Evisa not found" });
    }
    const message = ` <h1>Hello ${evisa.fullname}</h1>
    <p>${req.body.message}</p>
    <p>Thank you.</p>
    <p>Elfrique Team</p>
    `; // message to be sent
    await EmailService.sendMail(
      evisa.email,
      message,
      `${evisa.destination} Evisa Application`
    );

    const evisamessage = await Evisamessage.create(req.body);
    return res.status(200).send({
      evisa,
      evisamessage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.approveApplication = async (req, res) => {
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

    const { id } = req.params;
    const evisa = await Evisa.findOne({
      where: {
        id,
      },
    });
    if (!evisa) {
      return res.status(404).send({ message: "Evisa not found" });
    }

    evisa.approval_status = "approved";
    await evisa.save();

    const message = ` <h1>Hello ${evisa.fullname}</h1>
    <p>Your ${evisa.destination} Evisa Application has been approved successfully.</p>
    <p>We will get back to you soon.</p>
    <p>Thank you.</p>
    <p>Elfrique Team</p>
    `; // message to be sent
    await EmailService.sendMail(
      evisa.email,
      message,
      `${evisa.destination} Evisa Application`
    );
    return res.status(200).send({
      evisa,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getAllMessages = async (req, res) => {
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

    const evisamessage = await Evisamessage.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).send({
      evisamessage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
