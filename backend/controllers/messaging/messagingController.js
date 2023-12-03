const Conversation = require('../../models/Conversation');
const Message = require('../../models/Message');
const Professional = require('../../models/Professional');
const User = require('../../models/User');

const sendMessage = async (req, res) => {
    try {
        console.log("SEND MESsAGE CONTROLLER CALLED");
        let sender = await User.findById(req.body.messagingSenderId);
        let senderModel = 'User';
        if (!sender) {
            sender = await Professional.findById(req.body.messagingSenderId);
            senderModel = 'Professional';
        }
        if (!sender) {
            throw new Error('Sender not found!');
        }

        let recipient = await User.findById(req.body.messagingRecipientId);
        let recipientModel = 'User';
        if (!recipient) {
            recipient = await Professional.findById(req.body.messagingRecipientId);
            recipientModel = 'Professional';
        }
        if (!recipient) {
            throw new Error('Recipient not found!');
        }


        const message = new Message({
            content: req.body.content,
            sender: sender._id,
            onModel: senderModel,
            recipient: recipient._id,
            onModelRecipient: recipientModel
        });
        await message.save();


        let conversation;
        if (senderModel === 'User') {
            conversation = await Conversation.findOne({ user: sender._id, professional: recipient._id });
        } else {
            conversation = await Conversation.findOne({ user: recipient._id, professional: sender._id });
        }

        if (!conversation) {
            console.log('NO CONVERSATION FOUND: CREATING NEW ONE')
            conversation = new Conversation({
                user: senderModel === 'User' ? sender._id : recipient._id,
                professional: senderModel === 'Professional' ? sender._id : recipient._id,
                messages: [message._id]
            });
        } else {

            conversation.messages.push(message._id);
        }

        await conversation.save();

        res.status(200).json({ message: 'Message sent successfully', messageId: message._id, conversationId: conversation._id });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getAllMessages = async (req, res) => {
    try {
        console.log("ALL MESSAGE CONTROLLER");
        const { id, role } = req.query;
        console.log("Query Params: ", req.query);
        console.log(`Finding entity with ID: ${id} and role: ${role}`);

        let entity;
        let conversations;

        if (role === 'user') {
            entity = await User.findById(id);
            if (!entity) {
                return res.status(404).json({ message: 'User not found.' });
            }
            conversations = await Conversation.find({ user: entity._id })
                .populate({
                    path: 'messages',
                    model: 'Message'
                })
                .populate({
                    path: 'professional',
                    model: 'Professional',
                    select: 'firstName lastName'
                });
        } else { // This should be else, not if
            entity = await Professional.findById(id);
            if (!entity) {
                return res.status(404).json({ message: 'Professional not found.' });
            }
            conversations = await Conversation.find({ professional: entity._id })
                .populate({
                    path: 'messages',
                    model: 'Message'
                })
                .populate({
                    path: 'user',
                    model: 'User',
                    select: 'firstName lastName'
                });
        }

        if (conversations.length === 0) {
            console.log("No conversations found for entity.");
        } else {
            console.log(`Found ${conversations.length} conversations.`);
        }

        res.status(200).json({ conversations });

    } catch (error) {
        console.error('getAllMessages error:', error);
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    sendMessage,
    getAllMessages
}