const { Op } = require("sequelize");
const Notifications = require("../models").notifications;

exports.AddNotification = (req, res) => {
  const notification = {
    receiverId: req.body.receiverId,
    type: req.body.type,
    message: req.body.message,
  };
  Notifications.create(notification)
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

exports.findAllNotification = (req, res) => {
  if (req.query.constructor === Object && Object.keys(req.query).length === 0) {
    console.log("empty");
  }
  else {
    let convert = JSON.parse(req.query.data)
    console.log(convert.receiverId);
    let condition_req = {
      receiverId: convert.receiverId,
      type: convert.type,
    };
    Notifications.findAll({
    where: {
      [Op.or]: [
        {
          receiverId: {
            [Op.eq]: condition_req.receiverId,
          },
        },
        {
          type: {
            [Op.eq]: condition_req.type,
          },
        },
      ],
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving notifications.",
      });
    });
  }
  if (req.body.constructor === Object && Object.keys(req.body).length === 0 ) {
    console.log("empty");
  }else {
    let condition_req = {
      receiverId: req.body.receiverId,
      type: req.body.type,
    };
    Notifications.findAll({
    where: {
      [Op.or]: [
        {
          receiverId: {
            [Op.eq]: condition_req.receiverId,
          },
        },
        {
          type: {
            [Op.eq]: condition_req.type,
          },
        },
      ],
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving notifications.",
      });
    });
  }
  
  
};

exports.deleteNotification = (req, res) => {
  const id = req.params.id;
  Notifications.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Notification was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Notification with id=${id}. Maybe Notification was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Notification with id=" + id,
      });
    });
};

exports.deleteAllNotification = (req, res) => {
  const id = req.params.id;
  Notifications.destroy({
    where: { receiverId: id },
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Notification were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all notifications."
      });
    });
};
