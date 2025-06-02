/* eslint-disable no-unused-vars */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const LoadingDialog = ({ isOpen, message = "Loading..." }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl"
        >
          <p className="text-gray-900 dark:text-white text-center font-normal">
            {message}
          </p>
          {/* Add a spinner here */}
          <div className="mt-4 flex justify-center">
            <div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

LoadingDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string,
};

export default LoadingDialog;
