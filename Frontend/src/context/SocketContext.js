import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const connection = io(process.env.REACT_APP_API_URL);
    setSocket(connection);
    return () => connection.disconnect();
  }, []);
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
