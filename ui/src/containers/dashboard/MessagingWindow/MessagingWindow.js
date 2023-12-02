import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MessagingWindow.css';

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
            <button onClick={handleToggleMessaging} className="messaging-toggle">
                {isMessagingOpen ? 'Close Messages' : 'Open Messages'}
            </button>

            <div className={`messaging-container ${!isMessagingOpen ? 'messaging-collapsed' : ''}`}>
                <h2>Messages</h2>
                <div className="message-list">
                    {conversations.map((conversation, index) => (
                        <div key={index}>
                            <h3>{getOtherParticipantName(conversation)}</h3>
                            {expandedConversations.has(index) ? (
                                conversation.messages.map((msg, msgIndex) => (
                                    <div key={msgIndex} className={isMessageSentByCurrentUser(msg) ? 'message-sent' : 'message-received'}>
                                        <p>{msg.content}</p>
                                    </div>
                                ))
                            ) : (
                                <div>
                                    <p>{conversation.messages[conversation.messages.length - 1].content}</p>
                                </div>
                            )}
                            {conversation.messages.length > 1 && (
                                <button onClick={() => {
                                    toggleConversation(index);
                                    setActiveConversationId(conversation._id); // Set the active conversation for replying
                                }}>
                                    {expandedConversations.has(index) ? 'Show Less' : 'Show More'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {activeConversationId && (
                    <div className="reply-section">
                        <div className="message-input">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message here"
                            />
                            <button onClick={handleSendReply}>
                                Reply to Message
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}


export default Messaging;