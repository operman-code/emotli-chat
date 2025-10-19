import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { getMessages, sendMessage } from '../api/chat';
import './Chat.css';

const Chat = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const socket = React.useContext(SocketContext);
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (socket && user) {
      socket.emit('authenticate', user.id);
      loadMessages();
      
      // Listen for private messages
      socket.on('receive_private_message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      // Listen for typing indicators
      socket.on('user_typing', (data) => {
        if (data.userId === parseInt(userId)) {
          setIsTyping(data.isTyping);
        }
      });

      return () => {
        socket.off('receive_private_message');
        socket.off('user_typing');
      };
    }
  }, [socket, user, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await getMessages(user.id, userId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage({ receiverId: userId, message: newMessage });
      socket.emit('send_private_message', { receiverId: userId, message: newMessage });
      setNewMessage('');
      setTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!typing) {
      setTyping(true);
      socket.emit('typing_start', { room: `user_${userId}` });
    }

    // Clear typing indicator after 3 seconds of no typing
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      setTyping(false);
      socket.emit('typing_stop', { room: `user_${userId}` });
    }, 3000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="chat-loading">Loading messages...</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back
        </button>
        <div className="chat-user-info">
          <div className="user-avatar">
            {userId.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>User {userId}</h3>
            <span className="online-status">Online</span>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender_id === user.id ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-time">
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <span>User is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
};

export default Chat;
