const express = require("express");
const Conversation = require("../Models/Conversation");
const router = express.Router();

// new conversation

router.post('/', async(req, res) => {
    try {
        const { senderId, receiverId } = req.body
        const conversationModel = {
            messages: [senderId, receiverId]
        }
        const conversation = await Conversation.create(conversationModel)
        res.status(200).json({ conversation })
    } catch (err) {
        res.status(500).json(err)
    }
})

// get conversation
router.get('/:userId', async(req, res) => {
    try {
        const { userId } = req.params
        const conversation = await Conversation.find({ messages: { $in: [userId] } }).lean()
        res.status(200).json({ conversation })
    } catch (err) {
        res.status(500).json(err)
    }
})

// get consversation b/t two ids
router.get('/find/:fUserId/:sUserId', async(req, res) => {
    try {
        const { fUserId, sUserId } = req.params
        const convsersation = await Conversation.findOne({ members: { $all: [fUserId, sUserId] } })
        res.status(200).json(convsersation)
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router;