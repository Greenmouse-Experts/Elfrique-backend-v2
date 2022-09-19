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
const Ticket = require("../models").eventsTicket;
const Booked_eventsticket = require("../models").eventsticket_booked;
const { Service } = require("../service/payment");

const excludeAtrrbutes = { exclude: ["createdAt", "updatedAt", "deletedAt"] };

// imports initialization
const { Op } = require("sequelize");
const { request } = require("express");

exports.verifyTransaction = async (req, res) => {
  try {
    const { reference } = req.body;
    const transaction = await Service.Paystack.verifyPayment(reference);
    if (transaction.data.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Transaction Successful",
        transaction,
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "Transaction Failed",
        transaction,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.makeTransaction = (req, res) => {
  console.log("your body is:", req.body);
  const transaction = {
    payer_name: req.body.payer_name,
    email: req.body.email,
    admin_id: req.body.admin_id,
    method: req.body.method,
    category: req.body.category,
    reference: req.body.reference,
    amount: req.body.amount,
    currency: req.body.currency,
    phone_no: req.body.phone_no,
    product_title: req.body.product_title,
    product_id: req.body.product_id,
    phone_no: req.body.phone_no,
  };

  let ticketQuantity = req.body.ticketQuantity;
  console.log(ticketQuantity);

  if (transaction.category == "Event Ticket") {
    ticketQuantity.forEach((data) => {
      console.log(data);
      console.log(res);
      const _ticket = Ticket.findOne({
        where: {
          id: data.id,
        },
      }).then((res) => {
        /* let quantity = res.quantity
          let newQty = quantity - parseInt(data.quantity) */
        //console.log(newQty);
        res
          .update(
            {
              quantity: res.quantity - parseInt(data.quantity),
              booked: res.booked + parseInt(data.quantity),
            },
            { where: { id: data.id } }
          )
          .then((result) => console.log("success"))
          .catch((err) => console.log("error"));
        console.log("ticket eventidd", res.eventId);
        Booked_eventsticket.create({
          ...transaction,
          name: transaction.payer_name,
          payment_method: transaction.method,
          quantity: data.quantity,
          eventId: res.eventId,
          eventsTicketId: data.id,
        })
          .then((result) => console.log("success"))
          .catch((err) => console.log("error creating book"));
      });
    });
  }
  Transaction.create(transaction)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Notification.",
      });
    });
};

exports.transactionHistoryByUser = async (req, res) => {
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
      console.log(profile);
      return res.status(404).send({
        message: "User not found",
      });
    }
    const transactions = await Transaction.findAll({
      where: {
        admin_id: adminuserId,
      },
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });
    res.status(200).json({
      status: "success",
      message: "Transaction History",
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.transactionHistoryByCategory = async (req, res) => {
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
    const { category } = req.params;
    const transactions = await Transaction.findAll({
      where: {
        category,
      },
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });
    res.status(200).json({
      status: "success",
      message: "Transaction History",
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
