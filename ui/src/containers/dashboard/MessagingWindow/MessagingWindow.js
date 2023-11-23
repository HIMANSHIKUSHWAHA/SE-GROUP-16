import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Messaging() {
    const [conversations, setConversations] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [expandedConversations, setExpandedConversations] = useState(new Set());

    useEffect(() => {
        axios.get('/api/v1/messages/getAllMessages', { /* include necessary parameters here */ })
            .then(response => {
                setConversations(response.data.conversations);
            })
            .catch(error => console.error('Error fetching messages:', error));
    }, []);

    const handleSendMessage = () => {
        axios.post('/api/v1/messages/sendMessage', { /* include necessary parameters and newMessage content here */ })
            .then(response => {
                // Update the conversations with the new message
                // You'll need to implement logic to add the new message to the right conversation
            })
            .catch(error => console.error('Error sending message:', error));
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

    return (
        <div>
            <h2>Messages</h2>
            {conversations.map((conversation, index) => (
                <div key={index}>
                    <p>{conversation.messages[0].content}</p>
                    {expandedConversations.has(index) &&
                        conversation.messages.slice(1).map((msg, msgIndex) => (
                            <p key={msgIndex}>{msg.content}</p>
                        ))
                    }
                    {conversation.messages.length > 1 && (
                        <button onClick={() => toggleConversation(index)}>
                            {expandedConversations.has(index) ? 'Show Less' : 'Show More'}
                        </button>
                    )}
                </div>
            ))}
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here"
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
}

export default Messaging;