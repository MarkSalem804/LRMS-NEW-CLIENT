/* eslint-disable no-unused-vars */
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import {
  getAllMaterials,
  viewMaterialFile,
  getMaterialDetails,
} from "../../services/lrms-endpoints";
import ClientHeader from "../../components/ClientHeader";
import { FaThLarge, FaList, FaEye, FaDownload, FaTable } from "react-icons/fa";
import Modal from "react-modal";
import whiteBg from "../../assets/withPencil.jpg";

const JHSMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [learningArea, setLearningArea] = useState("");
  const [component, setComponent] = useState("");

  // Options
  const [gradeLevels, setGradeLevels] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
  const [components, setComponents] = useState([]);

  const [view, setView] = useState("card");

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewMaterialUrl, setViewMaterialUrl] = useState("");
  const [viewMaterialTitle, setViewMaterialTitle] = useState("");

  const [page, setPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  const paginatedMaterials = filteredMaterials.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      try {
        const response = await getAllMaterials();
        if (response.success) {
          // Only JHS
          const jhs = response.data.filter((m) =>
            ["Grade 7", "Grade 8", "Grade 9", "Grade 10"].includes(
              m.gradeLevelName
            )
          );
          setMaterials(jhs);
          setFilteredMaterials(jhs);
          // Extract unique filter options
          setGradeLevels([
            ...new Set(jhs.map((m) => m.gradeLevelName).filter(Boolean)),
          ]);
          setLearningAreas([
            ...new Set(jhs.map((m) => m.learningAreaName).filter(Boolean)),
          ]);
          setComponents([
            ...new Set(jhs.map((m) => m.componentName).filter(Boolean)),
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  useEffect(() => {
    let filtered = materials;
    if (search) {
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          (m.description &&
            m.description.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (gradeLevel)
      filtered = filtered.filter((m) => m.gradeLevelName === gradeLevel);
    if (learningArea)
      filtered = filtered.filter((m) => m.learningAreaName === learningArea);
    if (component)
      filtered = filtered.filter((m) => m.componentName === component);
    setFilteredMaterials(filtered);
  }, [search, gradeLevel, learningArea, component, materials]);

  const handleView = async (material) => {
    try {
      const details = await getMaterialDetails(material.id);
      const title = details.material.title;
      setViewMaterialTitle(title);
      const url = viewMaterialFile(material.id, title);
      setViewMaterialUrl(url);
      setIsViewModalOpen(true);
    } catch {
      setViewMaterialTitle("");
      setViewMaterialUrl("");
      setIsViewModalOpen(false);
      alert("Failed to load material.");
    }
  };

  const handleDownload = (material) => {
    const url = viewMaterialFile(material.id, material.title);
    const link = document.createElement("a");
    link.href = url;
    link.download = material.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Set the app element for accessibility (only once)
  Modal.setAppElement("#root");

  return (
    <div className="relative flex flex-col min-h-screen font-poppins">
      {/* Background Layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${whiteBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <ClientHeader />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-10 gap-4">
            <button
              onClick={() => (window.location.href = "/materials-directory")}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition-colors font-medium"
            >
              <span className="mr-2">&#8592;</span> Back
            </button>
            <div className="flex-1 flex justify-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center">
                JUNIOR HIGH SCHOOL LEARNING RESOURCES
              </h2>
            </div>
            <div style={{ width: "96px" }}></div>{" "}
            {/* Spacer to balance layout */}
          </div>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8 bg-black border border-black rounded-lg shadow p-4">
            <input
              type="text"
              placeholder="Search materials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/3 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300"
            >
              <option value="">All Grade Levels</option>
              {gradeLevels.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <select
              value={learningArea}
              onChange={(e) => setLearningArea(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300"
            >
              <option value="">All Learning Areas</option>
              {learningAreas.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <select
              value={component}
              onChange={(e) => setComponent(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300"
            >
              <option value="">All Components</option>
              {components.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="min-h-[600px]">
              {/* View Toggle */}
              <div className="flex justify-end mb-4 gap-2">
                <button
                  className={`p-2 rounded ${
                    view === "card"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setView("card")}
                  title="Card View"
                >
                  <FaThLarge />
                </button>
                <button
                  className={`p-2 rounded ${
                    view === "list"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setView("list")}
                  title="List View"
                >
                  <FaList />
                </button>
                <button
                  className={`p-2 rounded ${
                    view === "table"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setView("table")}
                  title="Table View"
                >
                  <FaTable />
                </button>
              </div>
              {view === "table" ? (
                <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white/80">
                  <div style={{ maxHeight: 480, overflowY: "auto" }}>
                    <table className="min-w-full text-sm">
                      <thead className="bg-gradient-to-r from-green-500 to-green-400">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-black dark:text-white">
                            Title
                          </th>
                          <th className="px-4 py-2 text-left font-medium text-black dark:text-white">
                            Grade Level
                          </th>
                          <th className="px-4 py-2 text-left font-medium text-black dark:text-white">
                            Learning Area
                          </th>
                          <th className="px-4 py-2 text-left font-medium text-black dark:text-white">
                            Component
                          </th>
                          <th className="px-4 py-2 text-center font-medium text-black dark:text-white">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedMaterials.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="text-center text-gray-500 py-8"
                            >
                              No materials found.
                            </td>
                          </tr>
                        ) : (
                          paginatedMaterials.map((material) => (
                            <tr
                              key={material.id}
                              className="hover:bg-green-50 transition"
                            >
                              <td
                                className="px-4 py-2 truncate align-top"
                                style={{ maxWidth: 200 }}
                              >
                                {material.title}
                              </td>
                              <td
                                className="px-4 py-2 truncate align-top"
                                style={{ maxWidth: 120 }}
                              >
                                {material.gradeLevelName}
                              </td>
                              <td
                                className="px-4 py-2 truncate align-top"
                                style={{ maxWidth: 160 }}
                              >
                                {material.learningAreaName}
                              </td>
                              <td
                                className="px-4 py-2 truncate align-top"
                                style={{ maxWidth: 160 }}
                              >
                                {material.componentName}
                              </td>
                              <td className="px-4 py-2 text-center align-top">
                                <button
                                  title="View"
                                  onClick={() => handleView(material)}
                                  className="p-2 rounded-full bg-white hover:bg-green-100 text-green-700 shadow"
                                >
                                  <FaEye />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination */}
                  <div className="flex justify-between items-center p-4">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 rounded bg-green-500 text-white disabled:bg-gray-300"
                    >
                      Previous
                    </button>
                    <span>
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="px-3 py-1 rounded bg-green-500 text-white disabled:bg-gray-300"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={
                    view === "card"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                      : "flex flex-col gap-4"
                  }
                >
                  {filteredMaterials.map((material) =>
                    view === "card" ? (
                      <div
                        key={material.id}
                        className="bg-gradient-to-br from-green-100 to-green-300 rounded-lg shadow-md p-6 transition-transform duration-200 hover:-translate-y-2 hover:shadow-xl"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-semibold text-green-700">
                            {material.title}
                          </h3>
                          <div className="flex gap-2">
                            <button
                              title="View"
                              onClick={() => handleView(material)}
                              className="p-2 rounded-full bg-white hover:bg-green-100 text-green-700 shadow"
                            >
                              <FaEye />
                            </button>
                            {/* <button
                              title="Download"
                              onClick={() => handleDownload(material)}
                              className="p-2 rounded-full bg-white hover:bg-green-100 text-green-700 shadow"
                            >
                              <FaDownload />
                            </button> */}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-1">
                          {material.gradeLevelName}
                        </p>
                        <p className="text-gray-600">{material.description}</p>
                      </div>
                    ) : (
                      <div
                        key={material.id}
                        className="flex flex-col md:flex-row items-start bg-gradient-to-br from-green-100 to-green-300 rounded-lg shadow-md p-4 gap-4 hover:shadow-xl"
                      >
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="text-lg font-semibold text-green-700">
                              {material.title}
                            </h3>
                            <div className="flex gap-2">
                              <button
                                title="View"
                                onClick={() => handleView(material)}
                                className="p-2 rounded-full bg-white hover:bg-green-100 text-green-700 shadow"
                              >
                                <FaEye />
                              </button>
                              {/* <button
                                title="Download"
                                onClick={() => handleDownload(material)}
                                className="p-2 rounded-full bg-white hover:bg-green-100 text-green-700 shadow"
                              >
                                <FaDownload />
                              </button> */}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-1">
                            {material.gradeLevelName}
                          </p>
                          <p className="text-gray-600">
                            {material.description}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                  {filteredMaterials.length === 0 && (
                    <p className="col-span-full text-center text-gray-500">
                      No materials found.
                    </p>
                  )}
                </div>
              )}
              {/* View Material Modal */}
              <Modal
                isOpen={isViewModalOpen}
                onRequestClose={() => {
                  setIsViewModalOpen(false);
                  setViewMaterialUrl("");
                  setViewMaterialTitle("");
                }}
                contentLabel="View Material"
                className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 z-[9999]"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
              >
                <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl relative z-[9999] p-0">
                  {/* Modal Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 pt-6 pb-4 rounded-t-xl flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {viewMaterialTitle || "View Material"}
                      </h2>
                      <p className="text-sm text-blue-100">
                        Learning Resource Material
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsViewModalOpen(false);
                        setViewMaterialUrl("");
                        setViewMaterialTitle("");
                      }}
                      className="text-white hover:text-blue-100 transition-colors duration-200 p-2 rounded-full hover:bg-blue-500"
                      aria-label="Close"
                    >
                      <span className="text-3xl leading-none">&times;</span>
                    </button>
                  </div>
                  <div className="flex-1 bg-white rounded-b-xl p-6 overflow-hidden">
                    {viewMaterialUrl ? (
                      <iframe
                        src={viewMaterialUrl}
                        title={viewMaterialTitle}
                        className="w-full h-full border-0 rounded-lg"
                        aria-label={viewMaterialTitle}
                      />
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <p className="text-lg mb-2">No material to display</p>
                          <p className="text-sm text-gray-400">
                            Please select a material to view
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Modal>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default JHSMaterials;
