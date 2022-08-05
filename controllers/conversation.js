const Conversation = require("../models").conversation;
const User = require("../models").adminuser;
const { Op } = require("sequelize");

exports.AddChat = async (userId, receiverId, message) => {
  let data;
  return new Promise((resolve, reject) => {
    User.findOne({
      where: {
        id: {
          [Op.eq]: userId,
        },
      },
    })
      .then(async (user) => {
        if (user) {
          await Conversation.create({
            senderId: userId,
            receiverId: receiverId,
            message: message,
          })
            .then(async (conversation) => {
              await Conversation.findAll({
                where: {
                  [Op.or]: [
                    {
                      senderId: {
                        [Op.eq]: userId,
                      },
                    },
                    {
                      receiverId: {
                        [Op.eq]: userId,
                      },
                    },
                  ],
                },
              })
                .then((conversations) => {
                  if (conversations) {
                    data = {
                      firstname: user.firstname,
                      lastname: user.lastname,

                      text: message,
                      senderId: userId,
                      receiverId: receiverId,

                      time: conversations.createdAt,
                    };
                  } else {
                    console.log("no users found");
                  }

                  resolve(data);
                })
                .catch((error) => {
                  console.log(
                    "Don't return anything, because users chat were not received" +
                      error
                  );
                });
            })
            .catch((error) => {
              console.log("dont return anything, because chat was not added");
            });
        } else {
          console.log("dont return anything, because the sender id is invalid");
        }
      })
      .catch((error) => {
        console.log(
          "dont return anything, because the sender details was not fetched"
        );
      });
  });
};

exports.newConversation = async (req, res, next) => {
  const { senderId, receiverId } = req.body;
  //const userId = [senderId, receiverId]
  try {
    const conversation = new Conversation({
      senderId,
      receiverId,
    });
    const savedConversation = await conversation.save();
    res.status(200).json({
      status: true,
      data: savedConversation,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getConversation = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const conversation = await Conversation.findAll({
      where: {
        [Op.or]: [
          {
            senderId: userId,
          },
          {
            receiverId: userId,
          },
        ],
      },
    });
    res.status(200).json({
      status: true,
      data: conversation,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.conversationPage = async (req, res, next) => {
  try {
    await Conversation.update(
      {
        read_status: true,
      },
      {
        where: {
          [Op.and]: [
            {
              read_status: {
                [Op.eq]: false,
              },
            },
            {
              senderId: {
                [Op.eq]: req.user.id,
              },
            },
          ],
        },
      }
    ).then(async (conversationUpdated) => {
      await Conversation.findAll({
        where: {
          [Op.and]: [
            {
              senderId: {
                [Op.eq]: req.user.id,
              },
            },
            {
              receiverId: {
                [Op.eq]: req.params.receiverId,
              },
            },
          ],
        },
        order: [["createdAt", "ASC"]],
        include: [
          {
            model: User,
          },
        ],
      }).then((conversation) => {
        res.json(conversation);
      });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
