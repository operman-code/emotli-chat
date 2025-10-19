import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/SocketContext';

const Chat = () => {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('receive_message', (msg) => setMessages((prev) => [...prev, msg]));
  }, [socket]);

  const send = () => {
    socket.emit('send_message', { message });
    setMessage('');
  };

  return (
    <div>
      <h2>Global Chat</h2>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={send}>Send</button>
      <div>{messages.map((m, i) => <p key={i}>{m.message}</p>)}</div>
    </div>
  );
};

export default Chat;
