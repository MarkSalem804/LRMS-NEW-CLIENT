import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaTh,
  FaList,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import MaterialCard from "../components/MaterialCard";
import { Link } from "react-router-dom";
import MaterialsDetailsModal from "../components/modals/MaterialsDetailsModal";

const learningAreas = [
  "MTB-MLE",
  "Mathematics",
  "Science",
  "Filipino",
  "Araling Panlipunan",
  "MAPEH",
  "Edukasyon sa Pagpapakatao",
  "Edukasyong Pangtahanan at Pangkabuhayan",
  "Technology and Livelihood Education",
  "English",
  "Reading and Literacy",
  "Language",
  "Makabansa",
];

const eppComponents = [
  "Industrial Arts",
  "Home Economics",
  "ICT",
  "Entrepreneurship",
  "AFA",
];

const coreSubjects = [
  "Oral Communication",
  "Reading and Writing Skills",
  "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino",
  "Pagbasa at Pagsusuri ng Iba't Ibang Teksto Tungo sa Pananaliksik",
  "21st Century Literature from the Philippines and the World",
  "Contemporary Philippine Arts from the Regions",
  "Media and Information Literacy",
  "General Mathematics",
  "Statistics and Probability",
  "Earth and Life Science",
  "Physical Science",
  "Introduction to the Philosophy of the Human Person",
  "Personal Development",
  "Understanding Culture, Society and Politics",
  "Physical Education and Health",
];

const academicTracks = [
  "Accountancy, Business and Management (ABM)",
  "Humanities and Social Sciences (HUMSS)",
  "Science, Technology, Engineering, and Mathematics (STEM)",
  "General Academic Strand (GAS)",
];

const tvlTracks = [
  "Home Economics",
  "Information and Communications Technology (ICT)",
  "Agri-Fishery Arts",
  "Industrial Arts",
  "TVL Maritime",
];

const sportsTracks = [
  "Sports Coaching",
  "Sports Officiating",
  "Sports and Recreation",
];
const artsAndDesignTracks = [
  "Performing Arts",
  "Visual Arts",
  "Media Arts",
  "Literary Arts",
];

const appliedSubjects = [
  "English for Academic and Professional Purposes",
  "Practical Research 1",
  "Practical Research 2",
  "Filipino sa Piling Larang (Akademik, Isports, Sining at Tech-Voc)",
  "Empowerment Technologies (ETech): ICT for Professional Tracks",
  "Entrepreneurship",
  "Inquiries, Investigations, and Immersions",
];

// Note: Specialized subjects are numerous and vary greatly by track and strand.
// For this example, we'll use a placeholder or a general list.
// A more robust solution might involve fetching these based on selected track/strand.
const specializedSubjectsPlaceholder = [
  "Specialized Subject Example 1 (ABM)",
  "Specialized Subject Example 2 (STEM)",
  "Specialized Subject Example 3 (HUMSS)",
  "Specialized Subject Example 4 (TVL - ICT)",
  // Add more examples or fetch dynamically
];

const resourceTypes = ["Module", "Lesson Exemplar", "Activity Guide"]; // Added resource types

const Materials = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState(
    searchParams.get("grade") || ""
  );
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedResourceType, setSelectedResourceType] = useState(""); // New state for resource type
  const [isFilterOpen, setIsFilterOpen] = useState(
    !!searchParams.get("grade") || !!searchParams.get("category")
  );
  const [viewType, setViewType] = useState("card");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // SHS Filter States
  const [selectedCoreSubject, setSelectedCoreSubject] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("");
  const [selectedAppliedSubject, setSelectedAppliedSubject] = useState("");
  const [selectedSpecializedSubject, setSelectedSpecializedSubject] =
    useState("");
  const [selectedSubTrack, setSelectedSubTrack] = useState(""); // For specific tracks like TVL, Academic

  // Update selected grade and category when URL changes
  useEffect(() => {
    const gradeFromUrl = searchParams.get("grade");
    const categoryFromUrl = searchParams.get("category");

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      setSelectedGrade(""); // Clear specific grade if a category is chosen
      setIsFilterOpen(true);
      // Reset JHS/SHS specific filters based on category implicitly (grade range)
      if (categoryFromUrl === "shs") {
        setSelectedArea("");
        setSelectedComponent("");
      } else {
        // elementary or jhs
        setSelectedCoreSubject("");
        setSelectedTrack("");
        setSelectedSubTrack("");
        setSelectedAppliedSubject("");
        setSelectedSpecializedSubject("");
      }
    } else if (gradeFromUrl) {
      setSelectedGrade(gradeFromUrl);
      setSelectedCategory(""); // Clear category if a specific grade is chosen from URL
      setIsFilterOpen(!!gradeFromUrl);
      // Reset filters based on grade level (existing logic)
      if (parseInt(gradeFromUrl) >= 11) {
        setSelectedArea("");
        setSelectedComponent("");
      } else {
        setSelectedCoreSubject("");
        setSelectedTrack("");
        setSelectedSubTrack("");
        setSelectedAppliedSubject("");
        setSelectedSpecializedSubject("");
      }
    } else {
      setSelectedGrade("");
      setSelectedCategory("");
      setIsFilterOpen(false);
      // Reset all specific filters if no grade or category
      setSelectedArea("");
      setSelectedComponent("");
      setSelectedCoreSubject("");
      setSelectedTrack("");
      setSelectedSubTrack("");
      setSelectedAppliedSubject("");
      setSelectedSpecializedSubject("");
    }
    setSelectedResourceType(""); // Reset resource type on grade/category change
  }, [searchParams]);

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulated API call
    const fetchMaterials = async () => {
      // Replace with actual API call
      const mockMaterials = [
        // Mathematics Materials
        {
          id: 1,
          title: "Basic Addition",
          type: "Module",
          subject: "Mathematics",
          grade: 1,
          area: "Mathematics",
          description: "Introduction to addition with numbers 1-10",
          dateAdded: "2024-03-15",
          downloads: 245,
          rating: 4.5,
          author: "Teacher Maria Santos",
        },
        {
          id: 2,
          title: "Number Patterns",
          type: "Lesson Exemplar",
          subject: "Mathematics",
          grade: 1,
          area: "Mathematics",
          description: "Understanding number sequences and patterns",
          dateAdded: "2024-03-14",
          downloads: 189,
          rating: 4.7,
          author: "Teacher John Cruz",
        },
        {
          id: 3,
          title: "Shapes and Space",
          type: "Activity Guide",
          subject: "Mathematics",
          grade: 1,
          area: "Mathematics",
          description: "Basic geometric shapes and spatial concepts",
          dateAdded: "2024-03-13",
          downloads: 156,
          rating: 4.6,
          author: "Teacher Ana Reyes",
        },
        {
          id: 4,
          title: "Multiplication Tables",
          type: "Module",
          subject: "Mathematics",
          grade: 3,
          area: "Mathematics",
          description: "Learning multiplication tables 1-10",
          dateAdded: "2024-03-12",
          downloads: 312,
          rating: 4.8,
          author: "Teacher Pedro Santos",
        },
        {
          id: 5,
          title: "Fractions Basics",
          type: "Lesson Exemplar",
          subject: "Mathematics",
          grade: 4,
          area: "Mathematics",
          description: "Introduction to fractions and their representations",
          dateAdded: "2024-03-11",
          downloads: 278,
          rating: 4.4,
          author: "Teacher Maria Garcia",
        },
        {
          id: 6,
          title: "Algebra Fundamentals",
          type: "Module",
          subject: "Mathematics",
          grade: 7,
          area: "Mathematics",
          description: "Introduction to algebraic expressions and equations",
          dateAdded: "2024-03-10",
          downloads: 423,
          rating: 4.9,
          author: "Teacher Jose Reyes",
        },
        {
          id: "math-long-desc-1",
          title:
            "Comprehensive Introduction to Early Mathematics Concepts for Grade 1 Students Including Counting, Number Recognition, and Basic Operations",
          type: "Module",
          subject: "Mathematics",
          grade: 1,
          area: "Mathematics",
          description:
            "This extensive module is meticulously designed to introduce first-grade students to the fundamental concepts of mathematics. It covers a wide range of topics, starting from basic number recognition and counting up to 100, and progressing to simple addition and subtraction problems. The module incorporates various engaging activities, colorful illustrations, and interactive exercises to make learning enjoyable and effective. It aims to build a strong mathematical foundation by ensuring students understand not just the 'how' but also the 'why' behind these early mathematical ideas, preparing them for more advanced topics in subsequent grades.",
          dateAdded: "2024-05-10",
          downloads: 15,
          rating: 4.2,
          author: "Curriculum Development Team",
          thumbnail:
            "https://images.pexels.com/photos/1234592/pexels-photo-1234592.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },

        // English Materials
        {
          id: 7,
          title: "Phonics Basics",
          type: "Module",
          subject: "English",
          grade: 1,
          area: "English",
          description: "Introduction to letter sounds and phonics",
          dateAdded: "2024-03-09",
          downloads: 198,
          rating: 4.6,
          author: "Teacher Sarah Johnson",
        },
        {
          id: 8,
          title: "Reading Comprehension",
          type: "Lesson Exemplar",
          subject: "English",
          grade: 2,
          area: "English",
          description: "Basic reading comprehension strategies",
          dateAdded: "2024-03-08",
          downloads: 234,
          rating: 4.7,
          author: "Teacher Michael Brown",
        },
        {
          id: 9,
          title: "Grammar Essentials",
          type: "Module",
          subject: "English",
          grade: 3,
          area: "English",
          description: "Basic grammar rules and sentence structure",
          dateAdded: "2024-03-07",
          downloads: 287,
          rating: 4.5,
          author: "Teacher Lisa Chen",
        },
        {
          id: 10,
          title: "Creative Writing",
          type: "Activity Guide",
          subject: "English",
          grade: 5,
          area: "English",
          description: "Developing creative writing skills",
          dateAdded: "2024-03-06",
          downloads: 156,
          rating: 4.8,
          author: "Teacher David Wilson",
        },
        {
          id: 11,
          title: "Essay Writing",
          type: "Module",
          subject: "English",
          grade: 8,
          area: "English",
          description: "Advanced essay writing techniques",
          dateAdded: "2024-03-05",
          downloads: 345,
          rating: 4.7,
          author: "Teacher Emily Parker",
        },
        {
          id: 12,
          title: "Literature Analysis",
          type: "Lesson Exemplar",
          subject: "English",
          grade: 10,
          area: "English",
          description: "Analyzing literary works and themes",
          dateAdded: "2024-03-04",
          downloads: 289,
          rating: 4.9,
          author: "Teacher Robert Smith",
        },

        // Science Materials
        {
          id: 13,
          title: "Living Things",
          type: "Module",
          subject: "Science",
          grade: 1,
          area: "Science",
          description: "Introduction to living and non-living things",
          dateAdded: "2024-03-03",
          downloads: 267,
          rating: 4.6,
          author: "Teacher Maria Santos",
        },
        {
          id: 14,
          title: "Plant Life",
          type: "Lesson Exemplar",
          subject: "Science",
          grade: 2,
          area: "Science",
          description: "Basic plant parts and their functions",
          dateAdded: "2024-03-02",
          downloads: 198,
          rating: 4.7,
          author: "Teacher John Cruz",
        },
        {
          id: 15,
          title: "Simple Machines",
          type: "Activity Guide",
          subject: "Science",
          grade: 4,
          area: "Science",
          description: "Understanding basic machines and their uses",
          dateAdded: "2024-03-01",
          downloads: 234,
          rating: 4.5,
          author: "Teacher Ana Reyes",
        },
        {
          id: 16,
          title: "Solar System",
          type: "Module",
          subject: "Science",
          grade: 6,
          area: "Science",
          description: "Exploring planets and space",
          dateAdded: "2024-02-29",
          downloads: 312,
          rating: 4.8,
          author: "Teacher Pedro Santos",
        },
        {
          id: 17,
          title: "Cell Biology",
          type: "Lesson Exemplar",
          subject: "Science",
          grade: 8,
          area: "Science",
          description: "Introduction to cell structure and function",
          dateAdded: "2024-02-28",
          downloads: 278,
          rating: 4.7,
          author: "Teacher Maria Garcia",
        },
        {
          id: 18,
          title: "Chemical Reactions",
          type: "Module",
          subject: "Science",
          grade: 9,
          area: "Science",
          description: "Understanding basic chemical reactions",
          dateAdded: "2024-02-27",
          downloads: 345,
          rating: 4.6,
          author: "Teacher Jose Reyes",
        },

        // Filipino Materials
        {
          id: 19,
          title: "Alpabetong Filipino",
          type: "Module",
          subject: "Filipino",
          grade: 1,
          area: "Filipino",
          description: "Learning the Filipino alphabet",
          dateAdded: "2024-02-26",
          downloads: 198,
          rating: 4.8,
          author: "Teacher Sarah Johnson",
        },
        {
          id: 20,
          title: "Pangngalan",
          type: "Lesson Exemplar",
          subject: "Filipino",
          grade: 2,
          area: "Filipino",
          description: "Understanding Filipino nouns",
          dateAdded: "2024-02-25",
          downloads: 234,
          rating: 4.7,
          author: "Teacher Michael Brown",
        },
        {
          id: 21,
          title: "Pandiwa",
          type: "Module",
          subject: "Filipino",
          grade: 3,
          area: "Filipino",
          description: "Learning Filipino verbs",
          dateAdded: "2024-02-24",
          downloads: 287,
          rating: 4.6,
          author: "Teacher Lisa Chen",
        },
        {
          id: 22,
          title: "Pang-uri",
          type: "Activity Guide",
          subject: "Filipino",
          grade: 4,
          area: "Filipino",
          description: "Understanding Filipino adjectives",
          dateAdded: "2024-02-23",
          downloads: 156,
          rating: 4.9,
          author: "Teacher David Wilson",
        },
        {
          id: 23,
          title: "Tula at Awit",
          type: "Module",
          subject: "Filipino",
          grade: 6,
          area: "Filipino",
          description: "Introduction to Filipino poetry",
          dateAdded: "2024-02-22",
          downloads: 345,
          rating: 4.7,
          author: "Teacher Emily Parker",
        },
        {
          id: 24,
          title: "Maikling Kwento",
          type: "Lesson Exemplar",
          subject: "Filipino",
          grade: 8,
          area: "Filipino",
          description: "Analyzing Filipino short stories",
          dateAdded: "2024-02-21",
          downloads: 289,
          rating: 4.8,
          author: "Teacher Robert Smith",
        },

        // Araling Panlipunan Materials
        {
          id: 25,
          title: "Pamilya at Paaralan",
          type: "Module",
          subject: "Araling Panlipunan",
          grade: 1,
          area: "Araling Panlipunan",
          description: "Understanding family and school community",
          dateAdded: "2024-02-20",
          downloads: 267,
          rating: 4.6,
          author: "Teacher Maria Santos",
        },
        {
          id: 26,
          title: "Pamayanan",
          type: "Lesson Exemplar",
          subject: "Araling Panlipunan",
          grade: 2,
          area: "Araling Panlipunan",
          description: "Learning about community roles and responsibilities",
          dateAdded: "2024-02-19",
          downloads: 198,
          rating: 4.7,
          author: "Teacher John Cruz",
        },
        {
          id: 27,
          title: "Pilipinas: Ating Bansa",
          type: "Activity Guide",
          subject: "Araling Panlipunan",
          grade: 4,
          area: "Araling Panlipunan",
          description: "Introduction to Philippine geography and culture",
          dateAdded: "2024-02-18",
          downloads: 234,
          rating: 4.5,
          author: "Teacher Ana Reyes",
        },
        {
          id: 28,
          title: "Kasaysayan ng Pilipinas",
          type: "Module",
          subject: "Araling Panlipunan",
          grade: 6,
          area: "Araling Panlipunan",
          description: "Overview of Philippine history",
          dateAdded: "2024-02-17",
          downloads: 312,
          rating: 4.8,
          author: "Teacher Pedro Santos",
        },
        {
          id: 29,
          title: "Globalisasyon",
          type: "Lesson Exemplar",
          subject: "Araling Panlipunan",
          grade: 8,
          area: "Araling Panlipunan",
          description: "Understanding globalization and its effects",
          dateAdded: "2024-02-16",
          downloads: 278,
          rating: 4.7,
          author: "Teacher Maria Garcia",
        },
        {
          id: 30,
          title: "Ekonomiks",
          type: "Module",
          subject: "Araling Panlipunan",
          grade: 10,
          area: "Araling Panlipunan",
          description: "Basic economic concepts and principles",
          dateAdded: "2024-02-15",
          downloads: 345,
          rating: 4.6,
          author: "Teacher Jose Reyes",
        },

        // MAPEH Materials
        {
          id: 31,
          title: "Basic Rhythms",
          type: "Module",
          subject: "MAPEH",
          grade: 1,
          area: "MAPEH",
          description: "Introduction to basic musical rhythms",
          dateAdded: "2024-02-14",
          downloads: 198,
          rating: 4.8,
          author: "Teacher Sarah Johnson",
        },
        {
          id: 32,
          title: "Health Habits",
          type: "Lesson Exemplar",
          subject: "MAPEH",
          grade: 2,
          area: "MAPEH",
          description: "Developing healthy habits and practices",
          dateAdded: "2024-02-13",
          downloads: 234,
          rating: 4.7,
          author: "Teacher Michael Brown",
        },
        {
          id: 33,
          title: "Sports Skills",
          type: "Activity Guide",
          subject: "MAPEH",
          grade: 4,
          area: "MAPEH",
          description: "Basic sports and physical activities",
          dateAdded: "2024-02-12",
          downloads: 287,
          rating: 4.6,
          author: "Teacher Lisa Chen",
        },
        {
          id: 34,
          title: "Art Elements",
          type: "Module",
          subject: "MAPEH",
          grade: 6,
          area: "MAPEH",
          description: "Understanding elements of art",
          dateAdded: "2024-02-11",
          downloads: 156,
          rating: 4.9,
          author: "Teacher David Wilson",
        },
        {
          id: 35,
          title: "Music Theory",
          type: "Lesson Exemplar",
          subject: "MAPEH",
          grade: 8,
          area: "MAPEH",
          description: "Basic music theory and composition",
          dateAdded: "2024-02-10",
          downloads: 345,
          rating: 4.7,
          author: "Teacher Emily Parker",
        },
        {
          id: 36,
          title: "Contemporary Arts",
          type: "Module",
          subject: "MAPEH",
          grade: 10,
          area: "MAPEH",
          description: "Exploring modern art forms and expressions",
          dateAdded: "2024-02-09",
          downloads: 289,
          rating: 4.8,
          author: "Teacher Robert Smith",
        },

        // EPP Materials for Grade 4
        {
          id: 37,
          title: "Basic Computer Operations",
          type: "Module",
          subject: "Edukasyong Pangtahanan at Pangkabuhayan",
          grade: 4,
          area: "Edukasyong Pangtahanan at Pangkabuhayan",
          component: "ICT",
          description:
            "Introduction to basic computer operations and keyboarding skills",
          dateAdded: "2024-02-08",
          downloads: 267,
          rating: 4.6,
          author: "Teacher Maria Santos",
        },
        {
          id: 38,
          title: "Simple Home Repairs",
          type: "Lesson Exemplar",
          subject: "Edukasyong Pangtahanan at Pangkabuhayan",
          grade: 4,
          area: "Edukasyong Pangtahanan at Pangkabuhayan",
          component: "Industrial Arts",
          description: "Basic home maintenance and repair skills",
          dateAdded: "2024-02-07",
          downloads: 198,
          rating: 4.7,
          author: "Teacher John Cruz",
        },
        {
          id: 39,
          title: "Basic Cooking Skills",
          type: "Activity Guide",
          subject: "Edukasyong Pangtahanan at Pangkabuhayan",
          grade: 4,
          area: "Edukasyong Pangtahanan at Pangkabuhayan",
          component: "Home Economics",
          description: "Introduction to basic cooking and kitchen safety",
          dateAdded: "2024-02-06",
          downloads: 234,
          rating: 4.5,
          author: "Teacher Ana Reyes",
        },

        // EPP Materials for Grade 5
        {
          id: 40,
          title: "Word Processing Basics",
          type: "Module",
          subject: "Edukasyong Pangtahanan at Pangkabuhayan",
          grade: 5,
          area: "Edukasyong Pangtahanan at Pangkabuhayan",
          component: "ICT",
          description: "Learning basic word processing and document creation",
          dateAdded: "2024-02-05",
          downloads: 312,
          rating: 4.8,
          author: "Teacher Pedro Santos",
        },
        {
          id: 41,
          title: "Simple Woodworking",
          type: "Lesson Exemplar",
          subject: "Edukasyong Pangtahanan at Pangkabuhayan",
          grade: 5,
          area: "Edukasyong Pangtahanan at Pangkabuhayan",
          component: "Industrial Arts",
          description: "Introduction to basic woodworking tools and techniques",
          dateAdded: "2024-02-04",
          downloads: 278,
          rating: 4.7,
          author: "Teacher Maria Garcia",
        },
        {
          id: 42,
          title: "Home Management",
          type: "Activity Guide",
          subject: "Edukasyong Pangtahanan at Pangkabuhayan",
          grade: 5,
          area: "Edukasyong Pangtahanan at Pangkabuhayan",
          component: "Home Economics",
          description: "Basic home management and organization skills",
          dateAdded: "2024-02-03",
          downloads: 345,
          rating: 4.6,
          author: "Teacher Jose Reyes",
        },
        {
          id: 43,
          title: "Simple Business Concepts",
          type: "Module",
          subject: "Edukasyong Pangtahanan at Pangkabuhayan",
          grade: 5,
          area: "Edukasyong Pangtahanan at Pangkabuhayan",
          component: "Entrepreneurship",
          description:
            "Introduction to basic business concepts and money management",
          dateAdded: "2024-02-02",
          downloads: 198,
          rating: 4.8,
          author: "Teacher Sarah Johnson",
        },

        // EPP Materials for Grade 6
        {
          id: 44,
          title: "Spreadsheet Basics",
          type: "Module",
          subject: "Edukasyong Pangtahanan at Pangkabuhayan",
          grade: 6,
          area: "Edukasyong Pangtahanan at Pangkabuhayan",
          component: "ICT",
          description:
            "Learning basic spreadsheet operations and data management",
          dateAdded: "2024-02-01",
          downloads: 234,
          rating: 4.7,
          author: "Teacher Michael Brown",
        },
        {
          id: 45,
          title: "Basic Electronics",
          type: "Lesson Exemplar",
          subject: "Edukasyong Pangtahanan at Pangkabuhayan",
          grade: 6,
          area: "Edukasyong Pangtahanan at Pangkabuhayan",
          component: "Industrial Arts",
          description: "Introduction to basic electronics and simple circuits",
          dateAdded: "2024-01-31",
          downloads: 287,
          rating: 4.6,
          author: "Teacher Lisa Chen",
        },
        {
          id: 46,
          title: "Advanced Cooking",
          type: "Activity Guide",
          subject: "Edukasyong Pangtahanan at Pangkabuhayan",
          grade: 6,
          area: "Edukasyong Pangtahanan at Pangkabuhayan",
          component: "Home Economics",
          description: "Advanced cooking techniques and meal planning",
          dateAdded: "2024-01-30",
          downloads: 156,
          rating: 4.9,
          author: "Teacher David Wilson",
        },
        {
          id: 47,
          title: "Business Planning",
          type: "Module",
          subject: "Edukasyong Pangtahanan at Pangkabuhayan",
          grade: 6,
          area: "Edukasyong Pangtahanan at Pangkabuhayan",
          component: "Entrepreneurship",
          description:
            "Creating simple business plans and marketing strategies",
          dateAdded: "2024-01-29",
          downloads: 345,
          rating: 4.7,
          author: "Teacher Emily Parker",
        },
        {
          id: 48,
          title: "Basic Agriculture",
          type: "Lesson Exemplar",
          subject: "Edukasyong Pangtahanan at Pangkabuhayan",
          grade: 6,
          area: "Edukasyong Pangtahanan at Pangkabuhayan",
          component: "AFA",
          description: "Introduction to basic agriculture and plant care",
          dateAdded: "2024-01-28",
          downloads: 289,
          rating: 4.8,
          author: "Teacher Robert Smith",
        },
        {
          id: "math-activity-11",
          title: "Basic Addition",
          type: "Activity Guide",
          subject: "Mathematics",
          grade: 1,
          area: "Mathematics",
          description: "Introduction to addition with numbers 1-10.",
          dateAdded: "2024-04-20",
          downloads: 150,
          rating: 4.5,
          author: "Teacher Maria Santos",
          thumbnail:
            "https://images.pexels.com/photos/1234582/pexels-photo-1234582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
          id: "math-module-11",
          title: "Number Patterns",
          type: "Module",
          subject: "Mathematics",
          grade: 1,
          area: "Mathematics",
          description: "Understanding number sequences and patterns.",
          dateAdded: "2024-04-21",
          downloads: 200,
          rating: 4.6,
          author: "Teacher John Cruz",
          thumbnail:
            "https://images.pexels.com/photos/1234583/pexels-photo-1234583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
          id: "math-activity-12",
          title: "Shapes and Space",
          type: "Activity Guide",
          subject: "Mathematics",
          grade: 1,
          area: "Mathematics",
          description: "Basic geometric shapes and spatial concepts.",
          dateAdded: "2024-04-22",
          downloads: 180,
          rating: 4.7,
          author: "Teacher Ana Reyes",
          thumbnail:
            "https://images.pexels.com/photos/1234584/pexels-photo-1234584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
          id: "math-module-12",
          title: "Counting to 50",
          type: "Module",
          subject: "Mathematics",
          grade: 1,
          area: "Mathematics",
          description: "Fun activities to help students count to 50.",
          dateAdded: "2024-04-23",
          downloads: 220,
          rating: 4.8,
          author: "Teacher Sarah Johnson",
          thumbnail:
            "https://images.pexels.com/photos/1234585/pexels-photo-1234585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
          id: "math-activity-13",
          title: "Introduction to Subtraction",
          type: "Activity Guide",
          subject: "Mathematics",
          grade: 1,
          area: "Mathematics",
          description: "Basic subtraction concepts using visual aids.",
          dateAdded: "2024-04-24",
          downloads: 160,
          rating: 4.5,
          author: "Teacher Michael Green",
          thumbnail:
            "https://images.pexels.com/photos/1234586/pexels-photo-1234586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
          id: "math-module-13",
          title: "Understanding Money",
          type: "Module",
          subject: "Mathematics",
          grade: 1,
          area: "Mathematics",
          description: "Learning about coins and their values.",
          dateAdded: "2024-04-25",
          downloads: 190,
          rating: 4.6,
          author: "Teacher Lisa Chen",
          thumbnail:
            "https://images.pexels.com/photos/1234587/pexels-photo-1234587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
          id: "math-activity-14",
          title: "Measurement Basics",
          type: "Activity Guide",
          subject: "Mathematics",
          grade: 1,
          area: "Mathematics",
          description:
            "Introduction to measuring length using non-standard units.",
          dateAdded: "2024-04-26",
          downloads: 170,
          rating: 4.7,
          author: "Teacher John Doe",
          thumbnail:
            "https://images.pexels.com/photos/1234588/pexels-photo-1234588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
          id: "math-module-14",
          title: "Exploring Time",
          type: "Module",
          subject: "Mathematics",
          grade: 1,
          area: "Mathematics",
          description: "Understanding clocks and telling time.",
          dateAdded: "2024-04-27",
          downloads: 240,
          rating: 4.8,
          author: "Teacher Sarah Blue",
          thumbnail:
            "https://images.pexels.com/photos/1234589/pexels-photo-1234589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
          id: "math-activity-15",
          title: "Fun with Fractions",
          type: "Activity Guide",
          subject: "Mathematics",
          grade: 1,
          area: "Mathematics",
          description: "Introduction to basic fractions using visual aids.",
          dateAdded: "2024-04-28",
          downloads: 150,
          rating: 4.6,
          author: "Teacher Emily White",
          thumbnail:
            "https://images.pexels.com/photos/1234590/pexels-photo-1234590.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
          id: "math-module-15",
          title: "Math Games",
          type: "Module",
          subject: "Mathematics",
          grade: 1,
          area: "Mathematics",
          description: "A collection of fun math games for young learners.",
          dateAdded: "2024-04-29",
          downloads: 300,
          rating: 4.9,
          author: "Teacher Michael Red",
          thumbnail:
            "https://images.pexels.com/photos/1234591/pexels-photo-1234591.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
          id: "shs-core-1",
          title: "Oral Communication Skills Enhancement",
          type: "Module",
          subject: "Oral Communication", // Matches a core subject
          grade: 11,
          coreSubject: "Oral Communication",
          description: "Advanced techniques for public speaking.",
          dateAdded: "2024-05-01",
          downloads: 120,
          rating: 4.8,
          author: "Dr. Jane Doe",
        },
        {
          id: "shs-track-abm-1",
          title: "Business Ethics and Social Responsibility",
          type: "Lesson Exemplar",
          subject: "Business Ethics", // Example specialized subject
          grade: 12,
          track: "Academic Track",
          subTrack: "Accountancy, Business and Management (ABM)", // Matches an academic track
          specializedSubject: "Business Ethics and Social Responsibility", // Example, could be more specific
          description: "Case studies in business ethics.",
          dateAdded: "2024-05-02",
          downloads: 90,
          rating: 4.7,
          author: "Prof. John Smith",
        },
        {
          id: "shs-applied-1",
          title: "Practical Research 1: Qualitative Research",
          type: "Module",
          subject: "Practical Research 1", // Matches an applied subject
          grade: 11,
          appliedSubject: "Practical Research 1",
          description: "Step-by-step guide to qualitative research methods.",
          dateAdded: "2024-05-03",
          downloads: 150,
          rating: 4.9,
          author: "Dr. Emily White",
        },
        {
          id: "shs-tvl-ict-1",
          title: "Introduction to Java Programming",
          type: "Module",
          subject: "Java Programming", // Example specialized for TVL-ICT
          grade: 12,
          track: "TVL Track",
          subTrack: "Information and Communications Technology (ICT)",
          specializedSubject: "Java Programming Fundamentals",
          description: "Basics of Java programming for TVL students.",
          dateAdded: "2024-05-04",
          downloads: 110,
          rating: 4.6,
          author: "Mr. Robert Black",
        },
      ];
      setMaterials(mockMaterials);
    };

    fetchMaterials();
  }, []);

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Resource Type Filter
    const matchesResourceType =
      !selectedResourceType || material.type === selectedResourceType;
    if (!matchesResourceType) return false; // Early exit if type doesn't match

    // Grade and Category Filtering
    let matchesGradeCriteria = true;
    if (selectedCategory) {
      if (selectedCategory === "elementary") {
        matchesGradeCriteria = material.grade >= 1 && material.grade <= 6;
      } else if (selectedCategory === "jhs") {
        matchesGradeCriteria = material.grade >= 7 && material.grade <= 10;
      } else if (selectedCategory === "shs") {
        matchesGradeCriteria = material.grade >= 11 && material.grade <= 12;
      }
      // If a specific grade is also selected, it must match within the category
      if (selectedGrade && matchesGradeCriteria) {
        matchesGradeCriteria = material.grade === parseInt(selectedGrade);
      }
    } else if (selectedGrade) {
      // Only specific grade is selected (no category)
      matchesGradeCriteria = material.grade === parseInt(selectedGrade);
    } // If neither selectedCategory nor selectedGrade, all grades pass this stage

    if (!matchesGradeCriteria) return false;

    // JHS/SHS Specific Filters - Applied based on the material's actual grade
    if (material.grade >= 1 && material.grade <= 10) {
      const matchesArea = !selectedArea || material.area === selectedArea;
      const matchesComponent =
        !selectedComponent || material.component === selectedComponent;
      return matchesSearch && matchesArea && matchesComponent;
    } else if (material.grade >= 11 && material.grade <= 12) {
      const matchesCoreSubject =
        !selectedCoreSubject || material.coreSubject === selectedCoreSubject;
      const matchesTrack = !selectedTrack || material.track === selectedTrack;
      const matchesSubTrack =
        !selectedSubTrack || material.subTrack === selectedSubTrack;
      const matchesAppliedSubject =
        !selectedAppliedSubject ||
        material.appliedSubject === selectedAppliedSubject;
      const matchesSpecializedSubject =
        !selectedSpecializedSubject ||
        material.specializedSubject === selectedSpecializedSubject;
      return (
        matchesSearch &&
        matchesCoreSubject &&
        matchesTrack &&
        matchesSubTrack &&
        matchesAppliedSubject &&
        matchesSpecializedSubject
      );
    }
    // Should ideally not be reached if material.grade is always within 1-12
    // but as a fallback, if it's outside these, it only matches search term.
    return matchesSearch;
  });

  const handleGradeChange = (grade) => {
    setSelectedGrade(grade);
    setSelectedCategory(""); // Clear category when a specific grade is selected
    setSearchParams(grade ? { grade } : {}); // Update URL, removing category
    setSelectedResourceType(""); // Reset resource type
    // Reset filters based on grade level
    if (grade && parseInt(grade) >= 11) {
      setSelectedArea("");
      setSelectedComponent("");
    } else {
      setSelectedCoreSubject("");
      setSelectedTrack("");
      setSelectedSubTrack("");
      setSelectedAppliedSubject("");
      setSelectedSpecializedSubject("");
    }
  };

  const handleDelete = (id) => {
    // Logic to delete the material by id
    setMaterials((prevMaterials) =>
      prevMaterials.filter((material) => material.id !== id)
    );
  };

  // Function to open the modal
  const openModal = (material) => {
    setSelectedMaterial(material);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMaterial(null);
  };

  // Determine Grade Level options based on selectedCategory
  let gradeOptions = Array.from({ length: 12 }, (_, i) => i + 1); // Default 1-12
  if (selectedCategory === "elementary") {
    gradeOptions = Array.from({ length: 6 }, (_, i) => i + 1); // 1-6
  } else if (selectedCategory === "jhs") {
    gradeOptions = Array.from({ length: 4 }, (_, i) => i + 7); // 7-10
  } else if (selectedCategory === "shs") {
    gradeOptions = Array.from({ length: 2 }, (_, i) => i + 11); // 11-12
  }

  // Determine Title Suffix
  let titleSuffix = "";
  if (selectedCategory === "elementary") {
    titleSuffix = " - Elementary";
  } else if (selectedCategory === "jhs") {
    titleSuffix = " - Junior High School";
  } else if (selectedCategory === "shs") {
    titleSuffix = " - Senior High School";
  }

  if (selectedGrade) {
    // If a category is selected, append grade in parentheses
    // If no category, just show "- Grade X"
    titleSuffix = selectedCategory
      ? `${titleSuffix} (Grade ${selectedGrade})`
      : ` - Grade ${selectedGrade}`;
  } else if (!selectedCategory) {
    titleSuffix = ""; // All materials, no specific grade or category
  }

  return (
    <div className="p-4 md:p-6 flex flex-col h-full">
      <div className="mb-6 flex flex-col flex-grow">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-between">
          Learning Materials{titleSuffix}
          <div className="flex space-x-2 ml-auto">
            <div
              onClick={() => setViewType("card")}
              className={`cursor-pointer p-1 rounded-lg transition-colors ${
                viewType === "card"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <FaTh size={20} />
            </div>
            <div
              onClick={() => setViewType("list")}
              className={`cursor-pointer p-1 rounded-lg transition-colors ${
                viewType === "list"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <FaList size={20} />
            </div>
          </div>
        </h1>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <FaFilter />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 shadow-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Grade Level
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => handleGradeChange(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">
                    {" "}
                    {/* Default option based on context */}
                    {selectedCategory
                      ? `All ${selectedCategory.toUpperCase()} Grades`
                      : "All Grades"}
                  </option>
                  {gradeOptions.map((gradeNum) => (
                    <option key={gradeNum} value={gradeNum}>
                      Grade {gradeNum}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resource Type Filter - Added Here, will be part of the 3-column grid */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resource Type
                </label>
                <select
                  value={selectedResourceType}
                  onChange={(e) => setSelectedResourceType(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">All Types</option>
                  {resourceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conditional Rendering of JHS/Elementary vs SHS filters */}
              {(selectedCategory === "elementary" ||
                selectedCategory === "jhs" ||
                (selectedGrade && parseInt(selectedGrade) <= 10)) &&
                !(
                  selectedCategory === "shs" ||
                  (selectedGrade && parseInt(selectedGrade) >= 11)
                ) && (
                  <>
                    {/* JHS/Elementary Filters */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Learning Area
                      </label>
                      <select
                        value={selectedArea}
                        onChange={(e) => {
                          setSelectedArea(e.target.value);
                          setSelectedComponent(""); // Reset component when area changes
                        }}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="">All Areas</option>
                        {learningAreas.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* EPP Components Filter */}
                    {selectedArea ===
                      "Edukasyong Pangtahanan at Pangkabuhayan" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          EPP Component
                        </label>
                        <select
                          value={selectedComponent}
                          onChange={(e) => setSelectedComponent(e.target.value)}
                          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="">All Components</option>
                          {eppComponents.map((component) => (
                            <option key={component} value={component}>
                              {component}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}

              {(selectedCategory === "shs" ||
                (selectedGrade && parseInt(selectedGrade) >= 11)) && (
                <>
                  {/* SHS Filters */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Core Subject
                    </label>
                    <select
                      value={selectedCoreSubject}
                      onChange={(e) => setSelectedCoreSubject(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">All Core Subjects</option>
                      {coreSubjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Track
                    </label>
                    <select
                      value={selectedTrack}
                      onChange={(e) => {
                        setSelectedTrack(e.target.value);
                        setSelectedSubTrack(""); // Reset sub-track when main track changes
                        setSelectedSpecializedSubject(""); // Reset specialized subject
                      }}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">All Tracks</option>
                      <option value="Academic Track">Academic Track</option>
                      <option value="TVL Track">TVL Track</option>
                      <option value="Sports Track">Sports Track</option>
                      <option value="Arts and Design Track">
                        Arts and Design Track
                      </option>
                    </select>
                  </div>

                  {/* Conditional Sub-Track for Academic Track */}
                  {selectedTrack === "Academic Track" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Academic Strand
                      </label>
                      <select
                        value={selectedSubTrack}
                        onChange={(e) => setSelectedSubTrack(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="">All Strands</option>
                        {academicTracks.map((strand) => (
                          <option key={strand} value={strand}>
                            {strand}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Conditional Sub-Track for TVL Track */}
                  {selectedTrack === "TVL Track" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        TVL Strand
                      </label>
                      <select
                        value={selectedSubTrack}
                        onChange={(e) => setSelectedSubTrack(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="">All Strands</option>
                        {tvlTracks.map((strand) => (
                          <option key={strand} value={strand}>
                            {strand}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {/* Conditional Sub-Track for Sports Track */}
                  {selectedTrack === "Sports Track" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sports Strand
                      </label>
                      <select
                        value={selectedSubTrack}
                        onChange={(e) => setSelectedSubTrack(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="">All Strands</option>
                        {sportsTracks.map((strand) => (
                          <option key={strand} value={strand}>
                            {strand}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Conditional Sub-Track for Arts and Design Track */}
                  {selectedTrack === "Arts and Design Track" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Arts and Design Strand
                      </label>
                      <select
                        value={selectedSubTrack}
                        onChange={(e) => setSelectedSubTrack(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="">All Strands</option>
                        {artsAndDesignTracks.map((strand) => (
                          <option key={strand} value={strand}>
                            {strand}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Applied Subject
                    </label>
                    <select
                      value={selectedAppliedSubject}
                      onChange={(e) =>
                        setSelectedAppliedSubject(e.target.value)
                      }
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">All Applied Subjects</option>
                      {appliedSubjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Specialized Subject (Placeholder)
                    </label>
                    <select
                      value={selectedSpecializedSubject}
                      onChange={(e) =>
                        setSelectedSpecializedSubject(e.target.value)
                      }
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">All Specialized Subjects</option>
                      {specializedSubjectsPlaceholder.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Container for Materials Grid - Made responsive and scrollbar hidden on desktop */}
        <div className="md:overflow-y-auto md:max-h-[40rem] md:[&::-webkit-scrollbar]:hidden md:[scrollbar-width:none] md:[-ms-overflow-style:none]">
          {filteredMaterials.length > 0 ? (
            <div
              className={`grid ${
                viewType === "list"
                  ? "grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              } gap-6`}
            >
              {filteredMaterials.map((material) =>
                viewType === "card" ? (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    onView={() => openModal(material)}
                  />
                ) : (
                  <div
                    key={material.id}
                    className="flex items-center border-b border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="flex-grow min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {material.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                        {material.description}
                      </p>
                      {/* Grade and Area/Subject Info for List View */}
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-2">
                        <span>
                          <span className="font-semibold">Grade:</span>{" "}
                          {material.grade}
                        </span>
                        <span>|</span>
                        <span>
                          {material.coreSubject ||
                            material.appliedSubject ||
                            material.track ||
                            material.area ||
                            material.subject ||
                            "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="ml-2 sm:ml-4 flex space-x-1 sm:space-x-2 flex-shrink-0">
                      <div
                        onClick={() => openModal(material)}
                        className="text-primary-600 hover:text-primary-700 cursor-pointer"
                      >
                        <FaEye size={16} />
                      </div>
                      <Link
                        to={`/materials/edit/${material.id}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <FaEdit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(material.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No materials found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Viewing Material Details */}
      {isModalOpen && (
        <MaterialsDetailsModal
          material={selectedMaterial}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Materials;
