// frontend/components/BookingChat.jsx
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import API from '../api/axios';

const socket = io('https://rentofix-backend-live-api.onrender.com', { autoConnect: false });

export default function BookingChat({ userId, propertyId, ownerId, tenantId }) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef(null);

  // 1. Init booking chat
  useEffect(() => {
    const initChat = async () => {
      try {
        const { data } = await API.post('/v1/chats/booking', {
          propertyId,
          tenantId,
          ownerId,
        });

        setConversationId(data.conversation._id);
        setMessages(data.messages);

        socket.connect();
        socket.emit('joinRoom', data.conversation._id);
      } catch (err) {
        console.error('❌ Error init booking chat:', err.response?.data || err.message);
      }
    };

    initChat();

    return () => {
      socket.disconnect();
    };
  }, [propertyId, tenantId, ownerId]);

  // 2. Listen for socket messages
  useEffect(() => {
    const handleMessage = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('messageReceived', handleMessage);
    return () => socket.off('messageReceived', handleMessage);
  }, [conversationId]);

  // 3. Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 4. Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    try {
      await API.post('/v1/chats/message', {
        conversationId,
        content: newMessage,
      });
      setNewMessage('');
    } catch (err) {
      console.error('❌ Error sending message:', err.response?.data || err.message);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] w-full border rounded-lg shadow bg-white">
      <div className="p-3 bg-green-600 text-white font-semibold rounded-t-lg">Booking Chat</div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.length > 0 ? (
          messages.map((msg, i) => (
            <div
              key={msg._id || i}
              className={`max-w-[70%] mb-2 p-2 rounded-lg text-sm shadow ${
                msg.senderId === userId
                  ? 'ml-auto bg-green-500 text-white rounded-br-none'
                  : 'mr-auto bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t flex items-center bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
