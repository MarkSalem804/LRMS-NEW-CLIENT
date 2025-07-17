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
import MaterialCard from "../../components/MaterialCard";
import { Link } from "react-router-dom";
import MaterialsDetailsModal from "../../components/modals/MaterialsDetailsModal";
import {
  getAllMaterials,
  getFilterOptions,
} from "../../services/lrms-endpoints"; // Import the API functions

// Default filter options (fallback if API fails)
const defaultFilterOptions = {
  learningAreas: [
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
  ],
  components: [
    "Industrial Arts",
    "Home Economics",
    "ICT",
    "Entrepreneurship",
    "AFA",
  ],
  coreSubjects: [
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
  ],
  tracks: [
    "Academic Track",
    "TVL Track",
    "Sports Track",
    "Arts and Design Track",
  ],
  strands: [
    "Accountancy, Business and Management (ABM)",
    "Humanities and Social Sciences (HUMSS)",
    "Science, Technology, Engineering, and Mathematics (STEM)",
    "General Academic Strand (GAS)",
    "Home Economics",
    "Information and Communications Technology (ICT)",
    "Agri-Fishery Arts",
    "Industrial Arts",
    "TVL Maritime",
    "Sports Coaching",
    "Sports Officiating",
    "Sports and Recreation",
    "Performing Arts",
    "Visual Arts",
    "Media Arts",
    "Literary Arts",
  ],
  appliedSubjects: [
    "English for Academic and Professional Purposes",
    "Practical Research 1",
    "Practical Research 2",
    "Filipino sa Piling Larang (Akademik, Isports, Sining at Tech-Voc)",
    "Empowerment Technologies (ETech): ICT for Professional Tracks",
    "Entrepreneurship",
    "Inquiries, Investigations, and Immersions",
  ],
  specializedSubjects: [
    "Specialized Subject Example 1 (ABM)",
    "Specialized Subject Example 2 (STEM)",
    "Specialized Subject Example 3 (HUMSS)",
    "Specialized Subject Example 4 (TVL - ICT)",
  ],
  types: ["Module", "Lesson Exemplar", "Activity Guide"],
};

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
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [filterOptions, setFilterOptions] = useState(defaultFilterOptions); // Dynamic filter options
  const [isLoadingFilters, setIsLoadingFilters] = useState(true); // Loading state for filters

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

  // Fetch filter options from the API
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setIsLoadingFilters(true);
      try {
        const response = await getFilterOptions();
        if (response.success) {
          setFilterOptions(response.data);
        } else {
          console.error("Failed to fetch filter options:", response.message);
          // Keep using defaultFilterOptions as fallback
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
        // Keep using defaultFilterOptions as fallback
      } finally {
        setIsLoadingFilters(false);
      }
    };

    fetchFilterOptions();
  }, []); // Empty dependency array means this runs once on mount

  // Fetch materials from the API
  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await getAllMaterials();
        // Assuming the API returns an object like { success: true, data: [...] }
        if (response.success) {
          console.log("API Response (getAllMaterials):", response); // Corrected: use comma instead of period
          setMaterials(response.data); // Update materials state with fetched data
        } else {
          console.error("Failed to fetch materials:", response.message);
          // Optionally set an error state here
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
        // Optionally set an error state here
      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchMaterials();
  }, []); // Empty dependency array means this runs once on mount

  const filteredMaterials = materials.filter((material) => {
    // Check if the material object itself is valid
    if (!material) return false;

    const matchesSearch =
      !searchTerm || // If no search term, search matches
      (material.title &&
        material.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (material.description &&
        material.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // If search term is active and doesn't match, return false immediately
    if (searchTerm && !matchesSearch) return false;

    // Resource Type Filter - Use typeName from API response
    const matchesResourceType =
      !selectedResourceType ||
      (material.typeName && material.typeName === selectedResourceType);
    if (!matchesResourceType) return false; // If resource type filter is active and doesn't match, return false

    // Grade and Category Filtering - Use gradeLevelName from API response
    let matchesGradeCriteria = true;
    const materialGradeName = material.gradeLevelName;

    // Apply grade/category filters only if a category or specific grade is selected.
    // If NO category or specific grade is selected, all materials pass this criteria.
    if (selectedCategory || selectedGrade) {
      let materialGrade = null;
      if (materialGradeName) {
        const gradeNum = parseInt(materialGradeName.replace("Grade ", ""));
        if (!isNaN(gradeNum)) materialGrade = gradeNum;
      }

      // If a category is selected, check if the material's grade falls within that category's range
      if (selectedCategory === "elementary") {
        matchesGradeCriteria =
          materialGrade !== null && materialGrade >= 1 && materialGrade <= 6;
      } else if (selectedCategory === "jhs") {
        matchesGradeCriteria =
          materialGrade !== null && materialGrade >= 7 && materialGrade <= 10;
      } else if (selectedCategory === "shs") {
        matchesGradeCriteria =
          materialGrade !== null && materialGrade >= 11 && materialGrade <= 12;
      }

      // If a specific grade is selected (and potentially a category), check if the material's grade matches the specific grade
      if (selectedGrade) {
        // If a category is also selected, the material must match both the category range and the specific grade
        if (selectedCategory) {
          matchesGradeCriteria =
            matchesGradeCriteria &&
            materialGrade !== null &&
            materialGrade === parseInt(selectedGrade);
        } else {
          // If only a specific grade is selected without a category
          matchesGradeCriteria =
            materialGrade !== null && materialGrade === parseInt(selectedGrade);
        }
      }

      // If a category or specific grade is selected but doesn't match the material's grade, return false
      if (!matchesGradeCriteria) return false;
    }

    // JHS/SHS Specific Filters - Applied based on the material's actual grade category
    // Determine the material's grade category based on gradeLevelName
    let materialCategory = null;
    if (materialGradeName) {
      const gradeNum = parseInt(materialGradeName.replace("Grade ", ""));
      if (!isNaN(gradeNum)) {
        if (gradeNum >= 1 && gradeNum <= 6) materialCategory = "elementary";
        else if (gradeNum >= 7 && gradeNum <= 10) materialCategory = "jhs";
        else if (gradeNum >= 11 && gradeNum <= 12) materialCategory = "shs";
      }
    }

    // Apply JHS/Elementary specific filters only if the material is in JHS/Elementary category
    if (selectedArea || selectedComponent) {
      if (materialCategory !== "elementary" && materialCategory !== "jhs")
        return false; // Filter out if not in the correct category

      const matchesArea =
        !selectedArea ||
        (material.learningAreaName &&
          material.learningAreaName === selectedArea);
      const matchesComponent =
        !selectedComponent ||
        (material.componentName &&
          material.componentName === selectedComponent);

      // If any JHS/Elementary filter is active and doesn't match, return false
      if (
        (selectedArea && !matchesArea) ||
        (selectedComponent && !matchesComponent)
      )
        return false;
    }

    // Apply SHS specific filters only if the material is in SHS category
    if (
      selectedCoreSubject ||
      selectedTrack ||
      selectedSubTrack ||
      selectedAppliedSubject ||
      selectedSpecializedSubject
    ) {
      if (materialCategory !== "shs") return false; // Filter out if not in the correct category

      // Note: The API response uses subjectTypeName for what was core/applied/specialized in mock data.
      // You may need to adjust these comparisons based on the actual values in subjectTypeName.
      const matchesCoreSubject =
        !selectedCoreSubject ||
        (material.subjectTypeName &&
          material.subjectTypeName === selectedCoreSubject); // Using subjectTypeName
      const matchesTrack =
        !selectedTrack ||
        (material.trackName && material.trackName === selectedTrack); // Using trackName
      const matchesSubTrack =
        !selectedSubTrack ||
        (material.strandName && material.strandName === selectedSubTrack); // Using strandName for sub-track
      const matchesAppliedSubject =
        !selectedAppliedSubject ||
        (material.subjectTypeName &&
          material.subjectTypeName === selectedAppliedSubject); // Using subjectTypeName
      const matchesSpecializedSubject =
        !selectedSpecializedSubject ||
        (material.subjectTypeName &&
          material.subjectTypeName === selectedSpecializedSubject); // Using subjectTypeName

      // If any SHS filter is active and doesn't match, return false
      if (
        (selectedCoreSubject && !matchesCoreSubject) ||
        (selectedTrack && !matchesTrack) ||
        (selectedSubTrack && !matchesSubTrack) ||
        (selectedAppliedSubject && !matchesAppliedSubject) ||
        (selectedSpecializedSubject && !matchesSpecializedSubject)
      )
        return false;
    }

    // If all active filters are matched (or no filters were active), return true
    return true;
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
    // This will need to be updated to call a backend API for deletion
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
            {isLoadingFilters && (
              <div className="text-center py-4 text-gray-600 dark:text-gray-300">
                Loading filter options...
              </div>
            )}
            {!isLoadingFilters && (
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
                    {filterOptions.types.map((type) => (
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
                          {filterOptions.learningAreas.map((area) => (
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
                            onChange={(e) =>
                              setSelectedComponent(e.target.value)
                            }
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            <option value="">All Components</option>
                            {filterOptions.components.map((component) => (
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
                        {filterOptions.coreSubjects.map((subject) => (
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
                          {filterOptions.strands
                            .filter(
                              (strand) =>
                                strand.includes("Accountancy") ||
                                strand.includes("Humanities") ||
                                strand.includes("STEM") ||
                                strand.includes("General Academic")
                            )
                            .map((strand) => (
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
                          {filterOptions.strands
                            .filter(
                              (strand) =>
                                strand.includes("Home Economics") ||
                                strand.includes("ICT") ||
                                strand.includes("Agri-Fishery") ||
                                strand.includes("Industrial Arts") ||
                                strand.includes("Maritime")
                            )
                            .map((strand) => (
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
                          {filterOptions.strands
                            .filter((strand) => strand.includes("Sports"))
                            .map((strand) => (
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
                          {filterOptions.strands
                            .filter((strand) => strand.includes("Arts"))
                            .map((strand) => (
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
                        {filterOptions.appliedSubjects.map((subject) => (
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
                        {filterOptions.specializedSubjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Scrollable Container for Materials Grid - Made responsive and scrollbar hidden on desktop */}
        <div className="md:overflow-y-auto md:max-h-[40rem] md:[&::-webkit-scrollbar]:hidden md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden md:[scrollbar-width:none] md:[-ms-overflow-style:none]">
          {isLoading ? (
            <div className="text-center py-8">Loading materials...</div> // Loading indicator
          ) : filteredMaterials.length > 0 ? (
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
                          {material.gradeLevelName || "Not Specified"}
                        </span>
                        <span>|</span>
                        <span>
                          {material.subjectTypeName ||
                            material.trackName ||
                            material.strandName ||
                            material.learningAreaName ||
                            material.componentName ||
                            material.subject ||
                            "N/A"}
                        </span>
                      </div>
                    </div>
                    {/* Add Resource Type here */}
                    <div className="ml-2 sm:ml-4 flex-shrink-0 text-xs text-gray-600 dark:text-gray-300">
                      {material.typeName || "N/A"}
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
