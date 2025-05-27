import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const ConfirmationDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm mx-auto min-h-[120px] flex flex-col justify-between"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <p className="text-sm mb-6 text-gray-800 dark:text-white">
              {message}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white text-sm rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white text-sm rounded-lg shadow hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
                onClick={onConfirm}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ConfirmationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationDialog;
