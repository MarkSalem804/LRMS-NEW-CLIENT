import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const colorMap = {
  primary: "bg-primary-50 text-primary-600 border-primary-200",
  secondary: "bg-secondary-50 text-secondary-600 border-secondary-200",
  accent: "bg-accent-50 text-accent-600 border-accent-200",
  success: "bg-success-50 text-success-600 border-success-200",
  warning: "bg-warning-50 text-warning-600 border-warning-200",
  error: "bg-error-50 text-error-600 border-error-200",
};

const gradientMap = {
  primary: "from-primary-600 to-primary-400",
  secondary: "from-secondary-600 to-secondary-400",
  accent: "from-accent-600 to-accent-400",
  success: "from-success-600 to-success-400",
  warning: "from-warning-600 to-warning-400",
  error: "from-error-600 to-error-400",
};

const SubjectCard = ({ subject }) => {
  const Icon = subject.icon;
  const colorClass = colorMap[subject.color];
  const gradientClass = gradientMap[subject.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
      className="card-3d bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 h-full border-2 border-gray-300 dark:border-gray-600"
    >
      <div
        className={`h-24 bg-gradient-to-r ${gradientClass} flex items-center justify-center`}
      >
        <div className="icon-3d text-white p-4 rounded-full bg-white bg-opacity-20 backdrop-blur-sm">
          <Icon size={32} />
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {subject.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 h-16 overflow-hidden text-sm">
          {subject.description}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div
            className={`p-3 rounded-lg ${colorClass} text-center border-2 border-gray-300 dark:border-gray-600`}
          >
            <div className="text-lg font-semibold">
              {subject.stats.totalMaterials}
            </div>
            <div className="text-xs">Materials</div>
          </div>
          <div
            className={`p-3 rounded-lg ${colorClass} text-center border-2 border-gray-300 dark:border-gray-600`}
          >
            <div className="text-lg font-semibold">
              {subject.stats.newAdditions}
            </div>
            <div className="text-xs">New</div>
          </div>
        </div>

        <Link
          to={`/materials/${subject.id}`}
          className={`block w-full text-center py-2 px-4 bg-gradient-to-r ${gradientClass} text-white rounded-lg hover:opacity-90 transition-opacity font-medium`}
        >
          Explore Materials
        </Link>
      </div>
    </motion.div>
  );
};

SubjectCard.propTypes = {
  subject: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    stats: PropTypes.shape({
      totalMaterials: PropTypes.number.isRequired,
      popularCategory: PropTypes.string.isRequired,
      newAdditions: PropTypes.number.isRequired,
      averageRating: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default SubjectCard;
