import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext'; // We need the user's token

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      // User is logged in, get their token
      currentUser.getIdToken().then((token) => {
        // Create new socket connection
        const newSocket = io('http://localhost:5001', { // Your backend URL
          auth: {
            token: token, // Send token for authentication
          },
        });
        
        setSocket(newSocket);

        // Disconnect when component unmounts
        return () => newSocket.close();
      });
    } else {
      // User is logged out, disconnect
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [currentUser]); // Re-run when user logs in or out

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
