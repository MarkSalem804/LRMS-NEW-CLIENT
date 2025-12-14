/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import { initializeSocket, disconnectSocket } from "../services/socket-service";

const StateContext = createContext();

export function ContextProvider({ children }) {
  const storedAuth = localStorage.getItem("lrms-auth");
  const [auth, setAuth] = useState(JSON.parse(storedAuth) || null);
  const [isMainLanding, setIsMainLanding] = useState(false);
  const [closeMenus, setCloseMenus] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newTicketsCount, setNewTicketsCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  // Initialize Socket.io when user logs in
  useEffect(() => {
    if (auth && auth.id) {
      console.log("🔌 Initializing Socket.io for user:", auth.email);
      initializeSocket(auth);
    } else {
      console.log("🔌 Disconnecting Socket.io");
      disconnectSocket();
    }

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, [auth]);

  // Method to update the new tickets count
  const updateNewTicketsCount = (count) => {
    setNewTicketsCount(count);
  };

  // Method to set success message
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    // Auto-clear after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const contextValue = useMemo(
    () => ({
      auth,
      setAuth,
      isMainLanding,
      setIsMainLanding,
      closeMenus,
      setCloseMenus,
      selectedCategory,
      setSelectedCategory,
      newTicketsCount,
      updateNewTicketsCount, // Added function to update the count
      successMessage,
      showSuccessMessage, // Added function to show success message
    }),
    [
      auth,
      setAuth,
      isMainLanding,
      setIsMainLanding,
      closeMenus,
      setCloseMenus,
      selectedCategory,
      setSelectedCategory,
      newTicketsCount,
      successMessage,
    ]
  );

  // console.log(newTicketsCount);

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
}

export const useStateContext = () => useContext(StateContext);

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
