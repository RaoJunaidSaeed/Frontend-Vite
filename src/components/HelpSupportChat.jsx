// frontend/components/HelpSupportChat.jsx
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import API from '../api/axios';

// ⚡ Socket connection (reuse same instance)
const socket = io('http://localhost:5000', { autoConnect: false });

export default function HelpSupportChat({ userId }) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  // 1. Initialize chat (get/create support conversation)
  useEffect(() => {
    const initChat = async () => {
      try {
        const { data } = await API.post('/v1/chats/support');
        const { conversation, messages } = data;

        setConversationId(conversation._id);
        setMessages(messages);

        socket.connect();

        socket.on('connect', () => {
          socket.emit('joinRoom', conversation._id);
        });
      } catch (err) {
        console.error('❌ Error initializing chat:', err.response?.data || err.message);
      }
    };

    initChat();

    return () => socket.disconnect();
  }, []);

  // 2. Listen for messages
  useEffect(() => {
    const handleMessage = (message) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on('messageReceived', handleMessage);
    return () => socket.off('messageReceived', handleMessage);
  }, [conversationId]);

  // 3. Auto-scroll to bottom on new messages
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
    <div className="flex flex-col h-auto w-[100%]  mx-auto border  shadow bg-gradient-to-br from-gray-900 to-green-900">
      {/* <div className="flex flex-col h-full w-full border rounded-lg shadow-lg bg-white"> */}
      {/* Header */}
      {/* <div className="p-4 bg-green-600 text-white font-semibold rounded-t-lg">Help & Support</div> */}

      {/* Messages */}
      <div className="flex-1  p-4 overflow-y-auto bg-gradient-to-br from-gray-900 to-green-900">
        {messages.length > 0 ? (
          messages.map((msg, i) => (
            <div
              key={msg._id || i}
              className={`max-w-[70%] md:max-w-[40%]  mb-3 p-3 rounded-lg text-sm shadow-sm ${
                msg.senderId === userId
                  ? 'ml-auto bg-gradient-to-r from-primary to-secondary text-white rounded-br-none'
                  : 'mr-auto bg-white/80 text-gray-900 border rounded-bl-none'
              }`}
            >
              <div>{msg.content}</div>
              {msg.senderId === userId && (
                <div className="text-[10px] mt-1 text-right text-gray-200">
                  {console.log(msg.seen)}
                  {msg.seen ? 'Seen' : 'Sent'}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
        )}
        {typing && <p className="text-xs text-gray-400 italic mt-2">Admin is typing...</p>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3  border-t flex items-center bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
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

// ✨✨✨✨✨✨🗃️🗃️🗃️📂📂📂😎😎😎

// // frontend/components/HelpSupportChat.jsx
// import { useEffect, useState, useRef } from 'react';
// import { io } from 'socket.io-client';
// import API from '../api/axios';

// // ⚡ Socket connection (reuse same instance)
// const socket = io('http://localhost:5000/api', { autoConnect: false });
// // const socket = io('http://localhost:5000', { autoConnect: false });

// export default function HelpSupportChat({ userId }) {
//   const [conversationId, setConversationId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [typing, setTyping] = useState(false);
//   const bottomRef = useRef(null);

//   // 1. Initialize chat (get/create support conversation)
//   useEffect(() => {
//     const initChat = async () => {
//       try {
//         const { data } = await API.post('/v1/chats/support');
//         const { conversation, messages } = data;

//         setConversationId(conversation._id);
//         setMessages(messages);

//         // connect socket + join room
//         socket.connect();
//         socket.emit('joinRoom', conversation._id);
//       } catch (err) {
//         console.error('❌ Error initializing chat:', err.response?.data || err.message);
//       }
//     };

//     initChat();

//     // cleanup socket on unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   // 2. Listen for messages
//   useEffect(() => {
//     const handleMessage = (message) => {
//       if (message.conversationId === conversationId) {
//         setMessages((prev) => [...prev, message]);
//       }
//     };

//     socket.on('messageReceived', handleMessage);
//     return () => socket.off('messageReceived', handleMessage);
//   }, [conversationId]);

//   // 3. Auto-scroll to bottom on new messages
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // 4. Send message
//   const sendMessage = async () => {
//     if (!newMessage.trim() || !conversationId) return;

//     try {
//       await API.post('/v1/chats/message', {
//         conversationId,
//         content: newMessage,
//       });

//       setNewMessage('');
//     } catch (err) {
//       console.error('❌ Error sending message:', err.response?.data || err.message);
//     }
//   };

//   return (
//     <div className="flex flex-col h-auto w-[100%]  mx-auto border  shadow bg-gradient-to-br from-gray-900 to-green-900">
//       {/* <div className="flex flex-col h-full w-full border rounded-lg shadow-lg bg-white"> */}
//       {/* Header */}
//       {/* <div className="p-4 bg-green-600 text-white font-semibold rounded-t-lg">Help & Support</div> */}

//       {/* Messages */}
//       <div className="flex-1  p-4 overflow-y-auto bg-gradient-to-br from-gray-900 to-green-900">
//         {messages.length > 0 ? (
//           messages.map((msg, i) => (
//             <div
//               key={msg._id || i}
//               className={`max-w-[70%] md:max-w-[40%]  mb-3 p-3 rounded-lg text-sm shadow-sm ${
//                 msg.senderId === userId
//                   ? 'ml-auto bg-gradient-to-r from-primary to-secondary text-white rounded-br-none'
//                   : 'mr-auto bg-white/80 text-gray-900 border rounded-bl-none'
//               }`}
//             >
//               <div>{msg.content}</div>
//               {msg.senderId === userId && (
//                 <div className="text-[10px] mt-1 text-right text-gray-200">
//                   {console.log(msg.seen)}
//                   {msg.seen ? 'Seen' : 'Sent'}
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
//         )}
//         {typing && <p className="text-xs text-gray-400 italic mt-2">Admin is typing...</p>}
//         <div ref={bottomRef} />
//       </div>

//       {/* Input */}
//       <div className="p-3  border-t flex items-center bg-white">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type your message..."
//           className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
//           onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//         />
//         <button
//           onClick={sendMessage}
//           className="ml-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// 🗃️📂😎📂🗃️✨

// // frontend/components/HelpSupportChat.jsx
// import { useEffect, useState, useRef } from 'react';
// import { io } from 'socket.io-client';
// import API from '../api/axios';

// // Connect socket to backend
// const socket = io('http://localhost:5000'); // 🔄 change for production

// export default function HelpSupportChat({ userId }) {
//   const [conversationId, setConversationId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const bottomRef = useRef(null);

//   // 1. Initialize chat (create or get support chat + load messages)
//   useEffect(() => {
//     const initChat = async () => {
//       try {
//         const { data } = await API.post('/v1/chats/support');
//         const { conversation, messages } = data;
//         console.log(conversation);
//         setConversationId(conversation._id);
//         setMessages(messages);

//         // Join socket room
//         socket.emit('joinRoom', conversation._id);
//       } catch (err) {
//         console.error('❌ Error initializing chat:', err.response?.data || err.message);
//       }
//     };

//     initChat();
//   }, []);

//   // 2. Listen for incoming messages
//   useEffect(() => {
//     const handleMessage = (message) => {
//       if (message.conversationId === conversationId) {
//         setMessages((prev) => [...prev, message]);
//       }
//     };

//     socket.on('messageReceived', handleMessage);
//     return () => socket.off('messageReceived', handleMessage);
//   }, [conversationId]);

//   // 3. Auto-scroll to latest message
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // 4. Send message
//   const sendMessage = async () => {
//     if (!newMessage.trim() || !conversationId) return;

//     try {
//       await API.post('/v1/chats/message', {
//         conversationId,
//         content: newMessage,
//       });

//       // ✅ Wait for socket to broadcast back
//       setNewMessage('');
//     } catch (err) {
//       console.error('❌ Error sending message:', err.response?.data || err.message);
//     }
//   };

//   return (
//     <div className="flex flex-col h-[90vh] max-w-lg mx-auto border rounded-lg shadow-lg bg-white">
//       {/* Header */}
//       <div className="p-4 bg-green-600 text-white font-semibold rounded-t-lg">Help & Support</div>

//       {/* Messages */}
//       <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
//         {messages.length > 0 ? (
//           messages.map((msg, i) => (
//             <div
//               key={msg._id || i}
//               className={`max-w-[70%] mb-2 p-2 rounded-lg text-sm relative ${
//                 msg.senderId === userId
//                   ? 'ml-auto bg-green-500 text-white rounded-br-none' // ✅ sender
//                   : 'mr-auto bg-white text-gray-800 border rounded-bl-none' // ✅ receiver
//               }`}
//             >
//               <div>{msg.content}</div>

//               {/* Seen / Sent status (only for current user messages) */}
//               {msg.senderId === userId && (
//                 <div className="text-[10px] mt-1 text-right text-gray-200">
//                   {msg.seen ? 'Seen' : 'Sent'}
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
//         )}
//         <div ref={bottomRef} />
//       </div>

//       {/* Input */}
//       <div className="p-3 border-t flex items-center bg-white">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type your message..."
//           className="flex-1 px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
//           onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//         />
//         <button
//           onClick={sendMessage}
//           className="ml-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
