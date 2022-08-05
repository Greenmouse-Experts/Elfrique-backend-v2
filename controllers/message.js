const Message = require('../models').message


exports.newMessage = async(req, res, next)=>{

    const { conversationId, sender, text } = req.body;
    try {
        const message = new Message({
            conversationId,
            sender,
            text
        })
        const savedMessage = await message.save();

        res.status(201).json(savedMessage)
    } catch (error) {
        console.log(error)
        next(error)
    }
} 

exports.getMessage = async(req, res, next)=>{

    
    try {
        const messages = await Message.findAll({
            where: {
                conversationId: req.params.conversationId
            }
        })
       

        res.status(201).json(messages)
    } catch (error) {
        console.log(error)
        next(error)
    }
} 