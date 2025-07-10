import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaBook,
  FaListOl,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaChild,
  FaPuzzlePiece,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAllMaterials } from "../services/lrms-endpoints";
import PropTypes from "prop-types";
import { useTheme } from "../context/ThemeContext";

const CustomXAxisTick = ({ x, y, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <text
      x={0}
      y={0}
      dy={16}
      textAnchor="middle"
      fill="var(--chart-text-color)"
      fontSize={14}
      fontWeight={600}
    >
      {payload.value}
    </text>
  </g>
);

const CustomYAxisTick = ({ x, y, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <text
      x={0}
      y={0}
      dy={4}
      textAnchor="end"
      fill="var(--chart-text-color)"
      fontSize={14}
    >
      {payload.value}
    </text>
  </g>
);

const groupGrades = {
  Elementary: [
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
  ],
  "Junior High School": ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
  "Senior High School": ["Grade 11", "Grade 12"],
};

function CustomPieTooltip({ active, payload, materials }) {
  if (active && payload && payload.length) {
    const group = payload[0].name;
    const grades = groupGrades[group];
    if (!grades) return null;
    // Count per grade in this group
    const counts = {};
    grades.forEach((g) => {
      counts[g] = 0;
    });
    materials.forEach((mat) => {
      if (grades.includes(mat.gradeLevelName)) counts[mat.gradeLevelName]++;
    });
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded shadow text-xs">
        <div className="font-semibold mb-1">{group}</div>
        {grades.map((g) => (
          <div key={g} className="flex justify-between">
            <span>{g}:</span>
            <span>{counts[g]}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

const DashboardStats = () => {
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [materials, setMaterials] = useState([]);
  useTheme();

  const handleTimeFilter = (period) => {
    setTimeFilter(period);
    const now = new Date();
    let newStart;
    if (period === "monthly") {
      newStart = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else if (period === "quarterly") {
      newStart = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    } else if (period === "annually") {
      newStart = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    }
    setStartDate(newStart);
    setEndDate(now);
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await getAllMaterials();
        if (response.success && Array.isArray(response.data)) {
          setMaterials(response.data);
        }
      } catch (error) {
        // Optionally log or handle the error
        console.error(error);
      }
    };
    fetchMaterials();
  }, []);

  // Filter materials by uploadedAt date range
  const filteredMaterials = materials.filter((mat) => {
    if (!mat.uploadedAt) return false;
    const uploaded = new Date(mat.uploadedAt);
    return uploaded >= startDate && uploaded <= endDate;
  });

  // Calculate total materials per subject for pie chart
  const materialsPerSchoolLevel = getMaterialsPerSchoolLevel(filteredMaterials);

  // Calculate stats for cards
  const totalMaterials = filteredMaterials.length;
  const uniqueGradeLevels = [
    ...new Set(filteredMaterials.map((mat) => mat.gradeLevelName)),
  ].filter(Boolean);
  const availableGradeLevels = uniqueGradeLevels.length;
  const shsCount =
    materialsPerSchoolLevel.find((g) => g.name === "Senior High School")
      ?.value || 0;
  const jhsCount =
    materialsPerSchoolLevel.find((g) => g.name === "Junior High School")
      ?.value || 0;
  const elemCount =
    materialsPerSchoolLevel.find((g) => g.name === "Elementary")?.value || 0;

  return (
    <div className="mb-8">
      {/* Two-column layout: left = chart, right = stats cards */}
      <div className="w-full flex flex-col lg:flex-row">
        {/* Left: Pie Chart, Filters, Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 rounded-xl shadow-card p-6 border-2 border-primary-200 dark:border-primary-700"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-primary-800 dark:text-primary-100">
                Materials Uploaded
              </h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-white/50 dark:bg-gray-800/50 rounded-lg p-1">
                  {["monthly", "quarterly", "annually"].map((period) => (
                    <button
                      key={period}
                      onClick={() => handleTimeFilter(period)}
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${
                        timeFilter === period
                          ? "bg-primary-100 dark:bg-primary-800 shadow-sm text-primary-600 dark:text-primary-300"
                          : "text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900"
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-primary-600 dark:text-primary-300" />
                <span className="text-sm text-primary-700 dark:text-primary-200">
                  Date Range:
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={endDate}
                  className="px-3 py-1 text-sm border border-primary-200 dark:border-primary-700 rounded-md bg-white/50 dark:bg-gray-800/50 text-primary-800 dark:text-primary-100"
                  dateFormat="MMM d, yyyy"
                />
                <span className="text-primary-600 dark:text-primary-300">
                  to
                </span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  maxDate={new Date()}
                  className="px-3 py-1 text-sm border border-primary-200 dark:border-primary-700 rounded-md bg-white/50 dark:bg-gray-800/50 text-primary-800 dark:text-primary-100"
                  dateFormat="MMM d, yyyy"
                />
              </div>
            </div>
          </div>

          <div className="h-96 mt-4 flex items-center justify-center">
            {materialsPerSchoolLevel.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full w-full text-gray-500 dark:text-gray-400">
                <FaBook size={64} className="mb-4" />
                <span className="text-lg font-medium">
                  No Uploads for this time period
                </span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={materialsPerSchoolLevel}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  barCategoryGap={40}
                >
                  <XAxis
                    dataKey="name"
                    tick={<CustomXAxisTick />}
                    axisLine={{ stroke: "var(--chart-text-color)" }}
                    tickLine={{ stroke: "var(--chart-text-color)" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={<CustomYAxisTick />}
                    axisLine={{ stroke: "var(--chart-text-color)" }}
                    tickLine={{ stroke: "var(--chart-text-color)" }}
                  />
                  <Tooltip
                    content={<CustomPieTooltip materials={filteredMaterials} />}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: "0.75rem",
                      color: "var(--chart-text-color)",
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {materialsPerSchoolLevel.map((entry, index) => (
                      <Cell key={`cell-bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
        {/* Right: Stats Cards */}
        <div className="w-full lg:w-72 flex flex-row lg:flex-col gap-4 mt-8 lg:mt-0 lg:ml-8">
          {/* Card: Total Materials */}
          <div className="bg-pink-100 dark:bg-pink-200 rounded-lg shadow p-4 border border-pink-200 dark:border-pink-300 flex flex-row items-center">
            <FaBook
              className="text-pink-500 dark:text-pink-700 mr-4"
              size={36}
            />
            <div className="flex flex-col flex-1">
              <span className="text-xs text-pink-700 dark:text-pink-900 font-semibold">
                Total Materials
              </span>
              <span className="text-2xl font-bold text-pink-700 dark:text-pink-900">
                {totalMaterials}
              </span>
            </div>
          </div>
          {/* Card: Available Grade Levels */}
          <div className="bg-blue-100 dark:bg-blue-200 rounded-lg shadow p-4 border border-blue-200 dark:border-blue-300 flex flex-row items-center">
            <FaListOl
              className="text-blue-500 dark:text-blue-700 mr-4"
              size={36}
            />
            <div className="flex flex-col flex-1">
              <span className="text-xs text-blue-700 dark:text-blue-900 font-semibold">
                Available Grade Levels
              </span>
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-900">
                {availableGradeLevels}
              </span>
            </div>
          </div>
          {/* Card: SHS Materials */}
          <div className="bg-green-100 dark:bg-green-200 rounded-lg shadow p-4 border border-green-200 dark:border-green-300 flex flex-row items-center">
            <FaUserGraduate
              className="text-green-500 dark:text-green-700 mr-4"
              size={36}
            />
            <div className="flex flex-col flex-1">
              <span className="text-xs text-green-700 dark:text-green-900 font-semibold">
                SHS Materials
              </span>
              <span className="text-2xl font-bold text-green-700 dark:text-green-900">
                {shsCount}
              </span>
            </div>
          </div>
          {/* Card: JHS Materials */}
          <div className="bg-yellow-100 dark:bg-yellow-200 rounded-lg shadow p-4 border border-yellow-200 dark:border-yellow-300 flex flex-row items-center">
            <FaChalkboardTeacher
              className="text-yellow-500 dark:text-yellow-700 mr-4"
              size={36}
            />
            <div className="flex flex-col flex-1">
              <span className="text-xs text-yellow-700 dark:text-yellow-900 font-semibold">
                JHS Materials
              </span>
              <span className="text-2xl font-bold text-yellow-700 dark:text-yellow-900">
                {jhsCount}
              </span>
            </div>
          </div>
          {/* Card: Elementary Materials */}
          <div className="bg-purple-100 dark:bg-purple-200 rounded-lg shadow p-4 border border-purple-200 dark:border-purple-300 flex flex-row items-center">
            <FaChild
              className="text-purple-500 dark:text-purple-700 mr-4"
              size={36}
            />
            <div className="flex flex-col flex-1">
              <span className="text-xs text-purple-700 dark:text-purple-900 font-semibold">
                Elementary Materials
              </span>
              <span className="text-2xl font-bold text-purple-700 dark:text-purple-900">
                {elemCount}
              </span>
            </div>
          </div>
          {/* Card: Kindergarten Materials */}
          <div className="bg-pink-100 dark:bg-pink-200 rounded-lg shadow p-4 border border-pink-200 dark:border-pink-300 flex flex-row items-center">
            <FaPuzzlePiece
              className="text-pink-500 dark:text-pink-700 mr-4"
              size={36}
            />
            <div className="flex flex-col flex-1">
              <span className="text-xs text-pink-700 dark:text-pink-900 font-semibold">
                Kindergarten Materials
              </span>
              <span className="text-2xl font-bold text-pink-700 dark:text-pink-900">
                {
                  filteredMaterials.filter(
                    (mat) => mat.gradeLevelName === "Kindergarten"
                  ).length
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getMaterialsPerSchoolLevel(materials) {
  const levels = {
    Elementary: [
      "Grade 1",
      "Grade 2",
      "Grade 3",
      "Grade 4",
      "Grade 5",
      "Grade 6",
    ],
    "Junior High School": ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
    "Senior High School": ["Grade 11", "Grade 12"],
  };
  const counts = {
    Elementary: 0,
    "Junior High School": 0,
    "Senior High School": 0,
  };
  materials.forEach((mat) => {
    const grade = mat.gradeLevelName;
    if (levels["Elementary"].includes(grade)) counts["Elementary"]++;
    else if (levels["Junior High School"].includes(grade))
      counts["Junior High School"]++;
    else if (levels["Senior High School"].includes(grade))
      counts["Senior High School"]++;
  });
  const palette = ["#3B82F6", "#F59E0B", "#22C55E"];
  return Object.keys(counts)
    .map((level, idx) => ({
      name: level,
      value: counts[level],
      color: palette[idx],
    }))
    .filter((item) => item.value > 0);
}

CustomPieTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  materials: PropTypes.array.isRequired,
};

CustomXAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
};

CustomYAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
};

export default DashboardStats;
