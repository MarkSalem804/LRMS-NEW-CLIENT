import {
  FaBook,
  FaSquareRootAlt,
  FaFlask,
  FaGlobe,
  FaPalette,
  FaHeart,
  FaHome,
  FaTools,
  FaBookReader,
  FaLanguage,
  FaFlag,
} from "react-icons/fa";

const learningAreas = [
  {
    id: "mtb-mle",
    name: "MTB-MLE",
    icon: FaBook,
    color: "primary",
    description:
      "Mother Tongue-Based Multilingual Education resources and materials.",
    stats: {
      totalMaterials: 128,
      popularCategory: "Modules",
      newAdditions: 12,
      averageRating: 4.7,
    },
  },
  {
    id: "mathematics",
    name: "Mathematics",
    icon: FaSquareRootAlt,
    color: "secondary",
    description:
      "Explore numbers, shapes, and patterns through our comprehensive mathematics resources.",
    stats: {
      totalMaterials: 95,
      popularCategory: "Lesson Exemplars",
      newAdditions: 8,
      averageRating: 4.5,
    },
  },
  {
    id: "science",
    name: "Science",
    icon: FaFlask,
    color: "accent",
    description:
      "Discover the natural world and scientific concepts through engaging learning materials.",
    stats: {
      totalMaterials: 112,
      popularCategory: "Modules",
      newAdditions: 15,
      averageRating: 4.6,
    },
  },
  {
    id: "filipino",
    name: "Filipino",
    icon: FaBook,
    color: "success",
    description:
      "Comprehensive Filipino language learning resources and materials.",
    stats: {
      totalMaterials: 68,
      popularCategory: "Activity Guides",
      newAdditions: 5,
      averageRating: 4.8,
    },
  },
  {
    id: "araling-panlipunan",
    name: "Araling Panlipunan",
    icon: FaGlobe,
    color: "warning",
    description:
      "Explore history, geography, and social studies through our comprehensive resources.",
    stats: {
      totalMaterials: 87,
      popularCategory: "Learning Modules",
      newAdditions: 9,
      averageRating: 4.4,
    },
  },
  {
    id: "mapeh",
    name: "MAPEH",
    icon: FaPalette,
    color: "error",
    description:
      "Music, Arts, Physical Education, and Health learning resources.",
    stats: {
      totalMaterials: 72,
      popularCategory: "Activity Guides",
      newAdditions: 7,
      averageRating: 4.9,
    },
  },
  {
    id: "esp",
    name: "Edukasyon sa Pagpapakatao",
    icon: FaHeart,
    color: "primary",
    description: "Values education and character development resources.",
    stats: {
      totalMaterials: 65,
      popularCategory: "Modules",
      newAdditions: 6,
      averageRating: 4.7,
    },
  },
  {
    id: "epp",
    name: "Edukasyong Pangtahanan at Pangkabuhayan",
    icon: FaHome,
    color: "secondary",
    description: "Home economics and livelihood education resources.",
    stats: {
      totalMaterials: 58,
      popularCategory: "Activity Guides",
      newAdditions: 4,
      averageRating: 4.6,
    },
  },
  {
    id: "tle",
    name: "Technology and Livelihood Education",
    icon: FaTools,
    color: "accent",
    description: "Technology and livelihood skills development resources.",
    stats: {
      totalMaterials: 82,
      popularCategory: "Modules",
      newAdditions: 10,
      averageRating: 4.5,
    },
  },
  {
    id: "english",
    name: "English",
    icon: FaBook,
    color: "success",
    description:
      "English language learning and communication skills resources.",
    stats: {
      totalMaterials: 94,
      popularCategory: "Modules",
      newAdditions: 11,
      averageRating: 4.8,
    },
  },
  {
    id: "reading",
    name: "Reading and Literacy",
    icon: FaBookReader,
    color: "warning",
    description: "Reading comprehension and literacy development resources.",
    stats: {
      totalMaterials: 76,
      popularCategory: "Activity Guides",
      newAdditions: 8,
      averageRating: 4.7,
    },
  },
  {
    id: "language",
    name: "Language",
    icon: FaLanguage,
    color: "error",
    description: "Language learning and communication skills resources.",
    stats: {
      totalMaterials: 69,
      popularCategory: "Modules",
      newAdditions: 7,
      averageRating: 4.6,
    },
  },
  {
    id: "makabansa",
    name: "Makabansa",
    icon: FaFlag,
    color: "primary",
    description: "Nationalism and patriotism education resources.",
    stats: {
      totalMaterials: 54,
      popularCategory: "Activity Guides",
      newAdditions: 5,
      averageRating: 4.8,
    },
  },
];

export default learningAreas;
