import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";

const AlertDialog = ({ isOpen, message, type = "success", onClose }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-green-500 text-2xl" />;
      case "error":
        return <FaExclamationCircle className="text-red-500 text-2xl" />;
      case "info":
        return <FaInfoCircle className="text-blue-500 text-2xl" />;
      default:
        return <FaInfoCircle className="text-blue-500 text-2xl" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "bg-green-600 hover:bg-green-700";
      case "error":
        return "bg-red-600 hover:bg-red-700";
      case "info":
        return "bg-blue-600 hover:bg-blue-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm mx-auto min-h-[120px] flex flex-col justify-between"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              {getIcon()}
              <p className="text-sm text-gray-800 dark:text-white flex-1">
                {message}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                className={`px-6 py-2 ${getButtonColor()} text-white text-sm rounded-lg shadow hover:shadow-lg transition-all`}
                onClick={onClose}
              >
                OK
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

AlertDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "info"]),
  onClose: PropTypes.func.isRequired,
};

export default AlertDialog;
