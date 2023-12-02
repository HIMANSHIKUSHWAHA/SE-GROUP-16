import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
// import './MessagingWindow.css';
import {
    Avatar, Button, CssBaseline, TextField, Link, Grid, Box,
    Typography, Container, Paper, createTheme, ThemeProvider
} from '@mui/material';
import { UserContext } from '../../../context';

function Messaging() {
    const [conversations, setConversations] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [expandedConversations, setExpandedConversations] = useState(new Set());
    const [isMessagingOpen, setIsMessagingOpen] = useState(false);
    const { user } = useContext(UserContext);
    const pollInterval = 30000;
    const [activeConversationId, setActiveConversationId] = useState(null);

    useEffect(() => {
        const fetchConversations = () => {
            axios.get('/api/v1/messages/getAllMessages', { params: { id: user.id, role: user.role } })
                .then(response => {
                    console.log(response.data);
                    setConversations(response.data.conversations);
                })
                .catch(error => console.error('Error fetching messages:', error));
        };

        fetchConversations();

        const intervalId = setInterval(fetchConversations, pollInterval);

        return () => clearInterval(intervalId);
    }, [user?.id, user?.role]);

    const getRecipientId = (conversation) => {
        return conversation.user === user.id ? conversation.professional : conversation.user;
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
            messagingSenderId: user.id,
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
            messagingSenderId: user.id,
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
        if (conversation.user._id === user.id) {
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
        return message.sender.toString() === user.id;
    };

    return (
        <>
            <Button
                variant="contained"
                onClick={handleToggleMessaging}
                sx={{
                    position: 'fixed',
                    bottom: 10,
                    right: 10,
                    zIndex: 1010, // Adjusted to be above the messaging container
                }}>
                {isMessagingOpen ? 'Close Messages' : 'Open Messages'}
            </Button>

            <Box
                sx={{
                    position: 'fixed',
                    bottom: 60, // Adjusted to be above the toggle button
                    right: 10,
                    width: 300,
                    backgroundColor: 'white',
                    border: 1,
                    borderColor: '#ccc',
                    borderRadius: 1,
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: isMessagingOpen ? 400 : 0, // Controlled by isMessagingOpen
                    overflow: 'hidden',
                    transition: 'max-height 0.3s',
                }}>
                <Typography variant="h4" sx={{ p: 2 }}>Messages</Typography>
                <Box
                    className="message-list"
                    sx={{
                        overflowY: 'auto',
                        p: 1,
                    }}>
                    {/* Message list here */}
                </Box>
                {activeConversationId && (
                    <Box
                        className="message-input"
                        sx={{
                            borderTop: 1,
                            borderColor: '#ccc',
                            p: 1,
                        }}>
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
                )}
            </Box>
        </>
    );
}


export default Messaging;