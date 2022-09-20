const Proposal = require("../models").proposal;
const Eventjob = require("../models").eventjob;
const Event = require("../models").event;
const User = require("../models").adminuser;
const cloudinary = require("../helpers/cloudinary");

exports.createProposal = async (req, res, next) => {
  // const { description, price } = req.body;
  console.log(req.body);
  try {
    var newProposal;
    await Proposal.findOne({
      where: {
        email: req.body.email ? req.body.email : "none",
        jobId: req.params.jobId,
      },
    }).then(async (proposal) => {
      if (proposal) {
        res.status(406).json({
          status: true,
          message: "Bid Created Already",
        });
      } else {
        // const description = req.body.description;
        // const price = req.body.price;
        // console.log("body items", req.body);
        if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path);
          newProposal = await Proposal.create({
            // userId: req.user.id,
            jobId: req.params.jobId,
            // description: description,
            // price: price,
            img_id: result.public_id,
            img_url: result.secure_url,
            ...req.body,
          });
        } else {
          newProposal = await Proposal.create({
            // userId: req.user.id,
            jobId: req.params.jobId,
            // description: description,
            // price: price,
            ...req.body,
          });
        }
      }
    });

    // var proposal = await Proposal.findOne({
    //   where: {
    //     userId: req.user.id,
    //   },
    // });
    return res.status(201).json({
      status: true,
      message: "Bid Successfully Created",
      data: newProposal,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.getProposalUser = async (req, res, next) => {
  const userEmail = req.query.email;
  const userPhone = req.query.phone;
  try {
    await Proposal.findAll({
      where: {
        email: userEmail,
        phone: userPhone,
      },
      include: [
        {
          model: Eventjob,
          include: [
            {
              model: Event,
              include: [
                {
                  model: User,
                  attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                  },
                },
              ],
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    }).then((proposal) => res.status(200).json(proposal));
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.getProposalSeller = async (req, res, next) => {
  try {
    await Proposal.findAll({
      where: {
        jobId: req.params.jobId,
        userId: req.params.userId,
      },
      include: [
        {
          model: Eventjob,
          include: [
            {
              model: Event,
              include: [
                {
                  model: User,
                  attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                  },
                },
              ],
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    }).then((proposal) => res.status(200).json(proposal));
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.getAllProposal = async (req, res, next) => {
  try {
    await Proposal.findAll({
      where: {
        jobId: req.params.jobId,
      },
      include: [
        {
          model: Eventjob,
          include: [
            {
              model: Event,
              include: [
                {
                  model: User,
                  attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                  },
                },
              ],
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    }).then((proposal) => res.status(200).json(proposal));
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.updateProposal = async (req, res, next) => {
  try {
    await Proposal.findOne({
      where: {
        userId: req.user.id,
        id: req.params.id,
      },
    }).then(async (proposal) => {
      if (proposal) {
        if (req.body) {
          if (req.file) {
            await Proposal.update(req.body, {
              where: {
                id: proposal.id,
              },
            });
            await cloudinary.uploader.destroy(proposal.img_id);
            const result = await cloudinary.uploader.upload(req.file.path);
            await Proposal.update(
              {
                img_id: result.public_id,
                img_url: result.secure_url,
              },
              {
                where: {
                  id: proposal.id,
                },
              }
            );
          } else {
            await Proposal.update(req.body, {
              where: {
                id: proposal.id,
              },
            });
          }
        } else {
          if (req.file) {
            await cloudinary.uploader.destroy(proposal.img_id);
            const result = await cloudinary.uploader.upload(req.file.path);
            await Proposal.update(
              {
                img_id: result.public_id,
                img_url: result.secure_url,
              },
              {
                where: {
                  id: proposal.id,
                },
              }
            );
          } else {
            res.status(404).json({
              status: false,
              message: "Nothing to update",
            });
          }
        }
        const adsres = await Proposal.findOne({
          where: {
            JobId: req.params.JobId,
            UserId: req.user.id,
          },
        });
        res.status(200).json({
          status: true,
          message: "Bid Updated Successfully",
          data: adsres,
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Bid not found",
        });
      }
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.deleteProposal = async (req, res, next) => {
  try {
    const _proposal = await Proposal.findOne({
      where: {
        id: req.params.id,
        // userId: req.user.id,
      },
    });
    _proposal.destroy().then((proposal) =>
      res.status(200).json({
        status: true,
        message: "Bid Deleted Successfully",
      })
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
