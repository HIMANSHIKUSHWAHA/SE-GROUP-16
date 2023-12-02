import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './MessagingWindow.css';
import {
    Avatar, Button, CssBaseline, TextField, Link, Grid, Box,
    Typography, Container, Paper, createTheme, ThemeProvider
} from '@mui/material';

function Messaging() {
    const [conversations, setConversations] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [expandedConversations, setExpandedConversations] = useState(new Set());
    const [isMessagingOpen, setIsMessagingOpen] = useState(false);
    const currentUserId = localStorage.getItem("UserId");
    const pollInterval = 30000;
    const [activeConversationId, setActiveConversationId] = useState(null);

    useEffect(() => {
        const fetchConversations = () => {
            axios.get('/api/v1/messages/getAllMessages', { params: { id: currentUserId } })
                .then(response => {
                    setConversations(response.data.conversations);
                })
                .catch(error => console.error('Error fetching messages:', error));
        };

        fetchConversations();

        const intervalId = setInterval(fetchConversations, pollInterval);

        return () => clearInterval(intervalId);
    }, [currentUserId]);

    const getRecipientId = (conversation) => {
        return conversation.user === currentUserId ? conversation.professional : conversation.user;
    };

    const handleSendMessage = (conversationId) => {
        if (newMessage.trim() === '') {
            console.error('Error sending message: Message content is empty');
            return;
        }

        const conversation = conversations.find(convo => convo._id === conversationId);
        if (!conversation) {
            console.error('Error: Conversation not found');
            return;
        }

        const recipientId = getRecipientId(conversation);

        axios.post('/api/v1/messages/sendMessage', {
            content: newMessage,
            messagingSenderId: currentUserId,
            messagingRecipientId: recipientId
        })
            .then(response => {
                setNewMessage('');
            })
            .catch(error => console.error('Error sending message:', error));
    };

    const handleToggleMessaging = () => {
        setIsMessagingOpen(!isMessagingOpen);
    };

    const handleSendReply = (conversationId) => {
        if (newMessage.trim() === '') {
            console.error('Error sending reply: Message content is empty');
            return;
        }

        const conversation = conversations.find(convo => convo._id === conversationId);
        if (!conversation) {
            console.error('Error: Conversation not found');
            return;
        }

        const recipientId = getRecipientId(conversation);

        axios.post('/api/v1/messages/sendMessage', {
            content: newMessage,
            conversationId: conversationId,
            messagingSenderId: currentUserId,
            messagingRecipientId: recipientId
        })
            .then(response => {
                setNewMessage('');
            })
            .catch(error => console.error('Error sending reply:', error));
    };

    const toggleConversation = (conversationId) => {
        const newSet = new Set(expandedConversations);
        if (newSet.has(conversationId)) {
            newSet.delete(conversationId);
        } else {
            newSet.add(conversationId);
        }
        setExpandedConversations(newSet);
    };

    const getOtherParticipantName = (conversation) => {
        if (conversation.user._id === currentUserId) {
            // If the current user ID matches the user ID in the conversation, they are the user.
            // So return the professional's name.
            return `${conversation.professional.firstName} ${conversation.professional.lastName}`;
        } else {
            // If the current user ID does not match the user ID in the conversation,
            // they are the professional, so return the user's name.
            return `${conversation.user.firstName} ${conversation.user.lastName}`;
        }
    };


    const isMessageSentByCurrentUser = (message) => {
        return message.sender.toString() === currentUserId;
    };

    return (
        <>
            <Button
                variant="contained"
                onClick={handleToggleMessaging}
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    zIndex: 1000
                }}>
                {isMessagingOpen ? 'Close Messages' : 'Open Messages'}
            </Button>

            <Box className={`messaging-container ${!isMessagingOpen ? 'messaging-collapsed' : ''}`}>
                <Typography variant="h4">Messages</Typography>
                <Box className="message-list">
                    {conversations.map((conversation, index) => (
                        <Box key={index}>
                            <Typography variant="h5">{getOtherParticipantName(conversation)}</Typography>
                            {expandedConversations.has(index) ? (
                                conversation.messages.map((msg, msgIndex) => (
                                    <Box key={msgIndex} className={isMessageSentByCurrentUser(msg) ? 'message-sent' : 'message-received'}>
                                        <Typography>{msg.content}</Typography>
                                    </Box>
                                ))
                            ) : (
                                <Box>
                                    <Typography>{conversation.messages[conversation.messages.length - 1].content}</Typography>
                                </Box>
                            )}
                            {conversation.messages.length > 1 && (
                                <Button variant="outlined" onClick={() => {
                                    toggleConversation(index);
                                    setActiveConversationId(conversation._id);
                                }}>
                                    {expandedConversations.has(index) ? 'Show Less' : 'Show More'}
                                </Button>
                            )}
                        </Box>
                    ))}
                </Box>
                {activeConversationId && (
                    <Box className="reply-section">
                        <Box className="message-input">
                            <TextField
                                fullWidth
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message here"
                            />
                            <Button variant="contained" onClick={handleSendReply}>
                                Reply to Message
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </>
    );
}


export default Messaging;