import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

// ----- ConversationList Component -----
function ConversationList({ onSelectConversation }) {
  const [conversations, setConversations] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const fetchConversations = async () => {
        const token = await currentUser.getIdToken();
        try {
          const res = await axios.get('http://localhost:5001/api/chat/conversations', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setConversations(res.data);
        } catch (error) {
          console.error('Error fetching conversations:', error);
        }
      };
      fetchConversations();
    }
  }, [currentUser]);

  return (
    <div className="conversation-list">
      <h3>Your Chats</h3>
      {conversations.map((convo) => (
        <div key={convo._id} onClick={() => onSelectConversation(convo._id)}>
          {/* A simple name - you can make this smarter for DMs */}
          {convo.name || convo.participants.find(p => p.email !== currentUser.email)?.name || 'DM Chat'}
        </div>
      ))}
    </div>
  );
}

// ----- ChatWindow Component -----
function ChatWindow({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { currentUser } = useAuth();
  const socket = useSocket();

  // 1. Effect for fetching message history
  useEffect(() => {
    if (!conversationId || !currentUser) return;

    // Fetch message history
    const fetchMessages = async () => {
      const token = await currentUser.getIdToken();
      try {
        const res = await axios.get(`http://localhost:5001/api/chat/conversations/${conversationId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();

    // Join the socket room
    if (socket) {
      socket.emit('joinRoom', conversationId);
    }

    // Leave room on cleanup
    return () => {
      if (socket) {
        socket.emit('leaveRoom', conversationId);
      }
    };
  }, [conversationId, currentUser, socket]);

  // 2. Effect for listening to new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      // Only add message if it belongs to the current conversation
      if (message.conversation === conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };
    
    socket.on('newMessage', handleNewMessage);

    // Cleanup listener
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, conversationId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!socket || !newMessage.trim()) return;

    // Send message to server
    socket.emit('sendMessage', {
      conversationId: conversationId,
      content: newMessage,
    });
    setNewMessage('');
  };

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg._id} className={msg.sender.email === currentUser.email ? 'my-message' : 'other-message'}>
            <strong>{msg.sender.name}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

// ----- Main ChatPage Component -----
export default function ChatPage() {
  const [activeConversationId, setActiveConversationId] = useState(null);

  return (
    <div style={{ display: 'flex' }}>
      <ConversationList onSelectConversation={setActiveConversationId} />
      {activeConversationId ? (
        <ChatWindow conversationId={activeConversationId} />
      ) : (
        <h3>Select a conversation to start chatting</h3>
      )}
    </div>
  );
}
