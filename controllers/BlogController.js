require("dotenv").config();
const User = require("../models").adminuser;
const Profile = require("../models").profile;
const Blog = require("../models").blog;

const excludeAtrrbutes = { exclude: ["createdAt", "updatedAt", "deletedAt"] };

// imports initialization
const { Op } = require("sequelize");
const cloudinary = require("../helpers/cloudinary");
const upload = require("../helpers/upload");

exports.createBlog = async (req, res) => {
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.img_id = result.public_id;
      req.body.img_url = result.secure_url;
    }
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
    const blog = await Blog.create(req.body);
    return res.status(201).send({
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).send({
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getABlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!blog) {
      return res.status(404).send({
        message: "Blog not found",
      });
    }
    return res.status(200).send({
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.updateABlog = async (req, res) => {
  try {
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
    const blog = await Blog.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!blog) {
      return res.status(404).send({
        message: "Blog not found",
      });
    }
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.img_id = result.public_id;
      req.body.img_url = result.secure_url;
    }
    const updatedBlog = await blog.update(req.body);
    return res.status(200).send({
      updatedBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.deleteABlog = async (req, res) => {
  try {
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
    const blog = await Blog.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!blog) {
      return res.status(404).send({
        message: "Blog not found",
      });
    }
    const deletedBlog = await blog.destroy();
    return res.status(200).send({
      deletedBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
