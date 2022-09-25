const express = require("express");
const Message = require("../Models/Message");
const router = express.Router();

router.post('/', async(req, res) => {
    try {
        const data = req.body
        const messageModel = {
            conversationId: data.conversationId,
            sender: data.sender,
            text: data.text
        }
        const message = await Message.create(messageModel)
        res.status(200).json({ message })
    } catch (err) {
        res.status(500).json(err)
    }
})

// get conversation
router.get('/:conversationId', async(req, res) => {
    try {
        const { conversationId } = req.params
        const messages = await Message.find({ conversationId: conversationId }).lean()
        res.status(200).json({ messages })
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router;