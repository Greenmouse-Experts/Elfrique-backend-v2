const Job = require("../models").eventjob;
const Review = require("../models").review;
const User = require("../models").adminuser;
const Assignedjob = require("../models").assignjob;

exports.createReview = async (req, res, next) => {
  const { text, rating } = req.body;

  try {
    await Review.findOne({
      where: {
        jobId: req.params.jobId,
        from: req.user.id,
        to: req.params.id,
      },
    }).then(async (review) => {
      if (review) {
        res.json("Review has already being giving for this job");
      } else {
        const result = new Review({
          jobId: req.params.jobId,
          from: req.user.id,
          to: req.params.id,
          text: text,
          rating: parseFloat(rating),
        });
        await result.save();
      }

      const output = await Review.findOne({
        where: {
          jobId: req.params.jobId,
          from: req.user.id,
          to: req.params.id,
        },
        include: [
          {
            model: User,
          },
          {
            model: Job,
          },
        ],
      });
      res.status(201).json(output);
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.getReviewOnUserJobs = async (req, res, next) => {
  try {
    const jobs = await Assignedjob.findAll({
      where: {
        userId: req.user.id,
      },
    });
    await Review.findAll({
      where: {
        to: req.user.id,
      },
      include: [
        {
          model: User,
        },
        {
          model: Job,
        },
      ],
    }).then((review) => {
      if (review) {
        res.status(200).json({
          totaljob: jobs.length,
          review: review,
        });
      } else {
        res.status(404).json("No review found for user");
      }
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.getReviewUserJobs = async (req, res, next) => {
  try {
    const jobs = await Assignedjob.findAll({
      where: {
        userId: req.params.userId,
      },
    });
    await Review.findAll({
      where: {
        to: req.params.userId,
      },
      include: [
        {
          model: User,
        },
        {
          model: Job,
        },
      ],
    }).then((review) => {
      if (review) {
        res.status(200).json({
          totaljob: jobs.length,
          review: review,
        });
      } else {
        res.status(404).json("No review found for user");
      }
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.getReviewOnSellerJobs = async (req, res, next) => {
  try {
    await Review.findAll({
      where: {
        from: req.user.id,
      },
      include: [
        {
          model: User,
        },
        {
          model: Job,
        },
      ],
    }).then((review) => {
      if (review) {
        res.status(200).json(review);
      } else {
        res.status(404).json("No review done for user");
      }
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  const { text, rating } = req.body;

  try {
    await Review.findOne({
      where: {
        jobId: req.params.jobId,
        from: req.user.id,
        to: req.params.id,
      },
    }).then(async (review) => {
      if (!review) {
        res.json("No user review for this job");
      } else {
        await Review.update(
          {
            text: text,
            rating: parseFloat(rating),
          },
          {
            where: {
              jobId: req.params.jobId,
              from: req.user.id,
              to: req.params.id,
            },
          }
        );
      }

      const output = await Review.findOne({
        where: {
          jobId: req.params.jobId,
          from: req.user.id,
          to: req.params.id,
        },
        include: [
          {
            model: User,
          },
          {
            model: Job,
          },
        ],
      });
      res.status(201).json(output);
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.getReviewOnSellerJobs = async (req, res, next) => {
  try {
    await Review.findAll({
      where: {
        from: req.user.id,
      },
      include: [
        {
          model: User,
        },
        {
          model: Job,
        },
      ],
    }).then((review) => {
      if (review) {
        res.status(200).json(review);
      } else {
        res.status(404).json("No review done for user");
      }
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    await Review.findAll({
      include: [
        {
          model: User,
        },
        {
          model: Job,
        },
      ],
    }).then((review) => {
      if (review) {
        res.status(200).json(review);
      } else {
        res.status(404).json("No review done for user");
      }
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  const { text, rating } = req.body;

  try {
    await Review.findOne({
      where: {
        jobId: req.params.jobId,
        from: req.user.id,
        to: req.params.id,
      },
    }).then(async (review) => {
      if (!review) {
        res.json("No user review for this job");
      } else {
        await Review.update(
          {
            text: text,
            rating: parseFloat(rating),
          },
          {
            where: {
              jobId: req.params.jobId,
              from: req.user.id,
              to: req.params.id,
            },
          }
        );
      }

      const output = await Review.findOne({
        where: {
          jobId: req.params.jobId,
          from: req.user.id,
          to: req.params.id,
        },
        include: [
          {
            model: User,
          },
          {
            model: Job,
          },
        ],
      });
      res.status(201).json(output);
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    await Review.findOne({
      where: {
        jobId: req.params.jobId,
        from: req.user.id,
        to: req.params.id,
      },
    }).then(async (review) => {
      if (!review) {
        res.json("No user review for this job");
      } else {
        await Review.destroy({
          where: {
            jobId: req.params.jobId,
            from: req.user.id,
            to: req.params.id,
          },
        });
      }
      res.status(201).json("Review deleted Successfully");
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
