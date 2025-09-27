// frontend/components/BookingChat.jsx
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function BookingChat({ propertyId, userId, ownerId }) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // 1. Create or get booking chat
  useEffect(() => {
    fetch('/api/chat/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, ownerId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setConversationId(data.data.conversation._id);

        socket.emit('joinRoom', data.data.conversation._id);

        fetch(`/api/chat/messages/${data.data.conversation._id}`)
          .then((res) => res.json())
          .then((m) => setMessages(m.data.messages));
      });
  }, [propertyId, ownerId]);

  // 2. Listen for messages
  useEffect(() => {
    socket.on('messageReceived', (message) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => socket.off('messageReceived');
  }, [conversationId]);

  // 3. Send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId,
        receiverId: ownerId, // or tenantId depending on user role
        content: newMessage,
      }),
    });

    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <h2>Booking Chat</h2>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={msg.senderId === userId ? 'my-msg' : 'their-msg'}>
            {msg.content}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
