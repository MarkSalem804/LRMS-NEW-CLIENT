import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import ChangePasswordModal from "../../components/modals/ChangePasswordModal";
import { useStateContext } from "../../contexts/ContextProvider";
import userService from "../../services/user-endpoints";
import {
  getAllMaterials,
  getAllTypes,
  getAllGradeLevels,
} from "../../services/lrms-endpoints";
import { StatsCard } from "../../components/shadcn-components/ui/stats-card";
import { Bar, BarChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/shadcn-components/ui/chart";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/shadcn-components/ui/toggle-group";
import { DatePicker } from "@/components/shadcn-components/ui/date-picker";
import { Label } from "@/components/shadcn-components/ui/label";
import {
  Layers,
  FileText,
  FileSpreadsheet,
  BookOpen,
  Award,
  Eye,
  Download,
  Star,
} from "lucide-react";
// Dashboard card icons
import folderIcon from "../../assets/folder.png";
import depedLogo from "../../assets/deped_logo.png";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/shadcn-components/ui/avatar";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { auth, setAuth } = useStateContext();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [userToChangePassword, setUserToChangePassword] = useState(null);
  const [showPasswordChangeSuccess, setShowPasswordChangeSuccess] =
    useState(false);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [typeStats, setTypeStats] = useState({});
  const [allMaterials, setAllMaterials] = useState([]);
  const [gradeLevels, setGradeLevels] = useState([]);

  // Fetch data function
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch material types
      const typesResponse = await getAllTypes();
      const types = typesResponse.data || typesResponse || [];
      setMaterialTypes(types);

      // Fetch grade levels (learner levels)
      const gradeLevelsResponse = await getAllGradeLevels();
      const gradeLevelsData =
        gradeLevelsResponse.data || gradeLevelsResponse || [];
      setGradeLevels(gradeLevelsData);

      // Fetch all materials
      const materialsResponse = await getAllMaterials();
      if (materialsResponse.success && Array.isArray(materialsResponse.data)) {
        setAllMaterials(materialsResponse.data);

        // Calculate stats for each material type
        const stats = {};

        // Initialize stats for each type
        types.forEach((type) => {
          stats[type.id] = {
            typeId: type.id,
            typeName: type.name,
            totalCount: 0,
            withFiles: 0,
            views: 0,
            downloads: 0,
            ratings: [],
          };
        });

        // Aggregate stats by material type
        materialsResponse.data.forEach((mat) => {
          const typeId = mat.typeId;
          if (typeId && stats[typeId]) {
            stats[typeId].totalCount++;
            stats[typeId].views += mat.views || 0;
            stats[typeId].downloads += mat.downloads || 0;
            if (mat.rating !== null && mat.rating !== undefined) {
              stats[typeId].ratings.push(mat.rating);
            }
            // Count materials with files
            if (mat.fileName && mat.fileName.trim() !== "") {
              stats[typeId].withFiles++;
            }
          }
        });

        setTypeStats(stats);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen for material types changes
    const handleMaterialTypesChange = () => {
      fetchData();
    };

    window.addEventListener("materialTypesChanged", handleMaterialTypesChange);

    return () => {
      window.removeEventListener(
        "materialTypesChanged",
        handleMaterialTypesChange
      );
    };
  }, []);

  // Helper function to get Lucide icon component for material type
  const getTypeIconComponent = (typeName) => {
    const name = (typeName || "").toLowerCase();
    if (name.includes("module")) return Layers;
    if (name.includes("manuscript")) return FileText;
    if (name.includes("worksheet") || name.includes("learning activity sheet"))
      return FileSpreadsheet;
    if (name.includes("storybook")) return BookOpen;
    if (name.includes("exemplar")) return Award;
    return Layers; // Default icon
  };

  // Calculate category stats
  const categoryStats = useMemo(() => {
    const stats = {
      "Senior High School": { metadata: 0, files: 0 },
      "High School": { metadata: 0, files: 0 },
      Elementary: { metadata: 0, files: 0 },
      Kindergarten: { metadata: 0, files: 0 },
    };

    // Helper function to categorize material by learner level description
    const getCategoryFromGradeLevel = (gradeLevelName) => {
      if (!gradeLevelName || !gradeLevels.length) return null;

      // Find the grade level that matches the material's gradeLevelName
      const gradeLevel = gradeLevels.find((gl) => gl.name === gradeLevelName);

      if (!gradeLevel || !gradeLevel.description) return null;

      const desc = gradeLevel.description.toLowerCase();

      // Check description for category keywords
      if (desc.includes("senior high school") || desc.includes("senior high")) {
        return "Senior High School";
      } else if (desc.includes("high school") && !desc.includes("senior")) {
        return "High School";
      } else if (desc.includes("elementary")) {
        return "Elementary";
      } else if (desc.includes("kindergarten")) {
        return "Kindergarten";
      }

      return null;
    };

    allMaterials.forEach((mat) => {
      const category = getCategoryFromGradeLevel(mat.gradeLevelName);
      if (category && stats[category]) {
        stats[category].metadata++;
        if (mat.fileName && mat.fileName.trim() !== "") {
          stats[category].files++;
        }
      }
    });

    return stats;
  }, [allMaterials, gradeLevels]);

  const handleChangePassword = async (userId, newPassword) => {
    try {
      await userService.changePassword(userId, { newPassword });
      setShowPasswordChangeSuccess(true);
      setTimeout(() => {
        setShowPasswordChangeSuccess(false);
      }, 3000);

      if (auth && auth.id) {
        const updatedAuth = { ...auth, isChanged: true };
        setAuth(updatedAuth);
        localStorage.setItem("lrms-auth", JSON.stringify(updatedAuth));
      }
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.response && error.response.data) {
        console.error("Server Error Details:", error.response.data);
      }
      alert("Failed to change password.");
    }
  };

  useEffect(() => {
    if (auth && auth.isChanged === false) {
      setUserToChangePassword(auth);
      setIsChangePasswordModalOpen(true);
    } else {
      if (isChangePasswordModalOpen) {
        setIsChangePasswordModalOpen(false);
      }
    }
  }, [auth, isChangePasswordModalOpen]);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 rounded-xl p-6 shadow-md relative overflow-hidden border border-blue-100"
          >
            <div className="flex items-center justify-between gap-4 relative z-10">
              {/* DepEd Logo on the left */}
              <div className="flex-shrink-0">
                <img
                  src={depedLogo}
                  alt="DepEd Logo"
                  className="h-16 w-auto object-contain"
                />
              </div>

              {/* Text Content in the middle */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Welcome back! {auth?.firstName || "User"} 👋
                </h2>
                <p className="text-gray-600 text-sm">{auth?.email || ""}</p>
              </div>

              {/* Profile Picture and Info on the right */}
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {auth?.firstName || ""} {auth?.lastName || ""}
                  </p>
                  <p className="text-xs text-gray-500">
                    {auth?.positionName || ""}
                  </p>
                  <p className="text-xs text-gray-600">
                    {auth?.officeName || auth?.schoolName || ""}
                  </p>
                </div>
                <Avatar className="w-32 h-32 md:w-36 md:h-36 border-2 border-white shadow-md bg-white">
                  {auth?.profile?.[0]?.profilePicture ? (
                    <AvatarImage
                      src={`https://sdoic-ilearn.depedimuscity.com:5005/${auth.profile[0].profilePicture}`}
                      alt={`${auth?.firstName || ""} ${auth?.lastName || ""}`}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-white text-3xl md:text-4xl font-bold text-gray-700">
                      {auth?.firstName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </div>
          </motion.div>

          {/* Learning Materials Overview - Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materialTypes.map((type) => {
              const stats = typeStats[type.id] || {
                totalCount: 0,
                withFiles: 0,
                views: 0,
                downloads: 0,
                ratings: [],
              };
              const IconComponent = getTypeIconComponent(type.name);
              const avgRating =
                stats.ratings.length > 0
                  ? stats.ratings.reduce((a, b) => a + b, 0) /
                    stats.ratings.length
                  : 0;

              // Calculate percentages with better scaling
              const totalCountPercentage =
                stats.totalCount > 0
                  ? Math.min((stats.withFiles / stats.totalCount) * 100, 100)
                  : 0;
              const viewsPercentage = Math.min(
                (stats.views / 10000) * 100,
                100
              );
              const downloadsPercentage = Math.min(
                (stats.downloads / 5000) * 100,
                100
              );
              const ratingPercentage =
                stats.ratings.length > 0 ? (avgRating / 5) * 100 : 0;

              return (
                <StatsCard
                  key={type.id}
                  title={type.name}
                  icon={<IconComponent className="h-5 w-5" />}
                  className=""
                  stats={[
                    {
                      label: "Total Count",
                      value: stats.withFiles,
                      displayValue: `${stats.withFiles}`,
                      percentage: Math.round(totalCountPercentage),
                      color: "#06b6d4", // cyan
                      icon: <Layers className="h-4 w-4" />,
                    },
                    {
                      label: "Avg. Rating",
                      value: avgRating,
                      displayValue:
                        stats.ratings.length > 0
                          ? `${avgRating.toFixed(1)}/5`
                          : "N/A",
                      percentage: Math.round(ratingPercentage),
                      color: "#fbbf24", // yellow/gold
                      icon: <Star className="h-4 w-4" />,
                    },
                    {
                      label: "Total Views",
                      value: stats.views,
                      displayValue:
                        stats.views >= 1000
                          ? `${(stats.views / 1000).toFixed(1)}K`
                          : stats.views.toString(),
                      percentage: Math.round(viewsPercentage),
                      color: "#10b981", // green
                      icon: <Eye className="h-4 w-4" />,
                    },
                    {
                      label: "Downloads",
                      value: stats.downloads,
                      displayValue:
                        stats.downloads >= 1000
                          ? `${(stats.downloads / 1000).toFixed(1)}K`
                          : stats.downloads.toString(),
                      percentage: Math.round(downloadsPercentage),
                      color: "#ef4444", // red/pink
                      icon: <Download className="h-4 w-4" />,
                    },
                  ]}
                />
              );
            })}
          </div>

          {/* Category Overview Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "Senior High School",
              "High School",
              "Elementary",
              "Kindergarten",
            ].map((category, index) => {
              const stats = categoryStats[category] || {
                metadata: 0,
                files: 0,
              };
              const gradients = [
                "bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200",
                "bg-gradient-to-br from-teal-200 via-cyan-200 to-blue-200",
                "bg-gradient-to-br from-green-200 via-emerald-200 to-teal-200",
                "bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200",
              ];
              const progressColors = [
                "bg-blue-600",
                "bg-teal-600",
                "bg-green-600",
                "bg-purple-600",
              ];
              const progressPercentage =
                stats.metadata > 0
                  ? Math.round((stats.files / stats.metadata) * 100)
                  : 0;

              return (
                <div
                  key={category}
                  className={`${gradients[index]} rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 group relative overflow-hidden`}
                >
                  {/* Card Content */}
                  <div className="relative z-10">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                      {category}
                    </h4>
                    <p className="text-3xl font-bold text-gray-800 mb-1">
                      {stats.files} / {stats.metadata}
                    </p>
                    <p className="text-xs text-gray-600 mb-4">
                      Files / Metadata
                    </p>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-white/90 backdrop-blur-sm rounded-full h-2">
                        <motion.div
                          className={`${progressColors[index]} h-2 rounded-full`}
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(progressPercentage, 100)}%`,
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Icon in top-right corner */}
                  <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
                    <img
                      src={folderIcon}
                      alt={category}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Materials Upload Chart */}
          <MaterialsUploadChart
            allMaterials={allMaterials}
            materialTypes={materialTypes}
          />

          {/* Render the ChangePasswordModal */}
          <ChangePasswordModal
            user={userToChangePassword}
            isOpen={isChangePasswordModalOpen}
            onClose={() => setIsChangePasswordModalOpen(false)}
            onSave={handleChangePassword}
          />

          {/* Success Message Pop-up for password change */}
          <AnimatePresence>
            {showPasswordChangeSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-4 right-4 z-50"
              >
                <div className="bg-green-500 bg-opacity-90 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-2">
                  <p className="text-sm">Password successfully changed!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

// Materials Upload Chart Component
const MaterialsUploadChart = ({ allMaterials, materialTypes }) => {
  const [timeFilter, setTimeFilter] = useState("weekly"); // daily, weekly, monthly, yearly, custom
  const [customRange, setCustomRange] = useState({
    start: "",
    end: "",
  });

  // Process materials data to create chart data grouped by date
  const chartData = useMemo(() => {
    if (
      !allMaterials ||
      allMaterials.length === 0 ||
      !materialTypes ||
      materialTypes.length === 0
    ) {
      return [];
    }

    // Determine date range based on selected filter
    const today = new Date();
    let startDate;
    let endDate = today;

    if (timeFilter === "custom" && customRange.start && customRange.end) {
      startDate = new Date(customRange.start);
      endDate = new Date(customRange.end);
    } else {
      const filterToDays = {
        daily: 7, // last 7 days
        weekly: 28, // last 4 weeks
        monthly: 90, // last 3 months
        yearly: 365, // last year
      };
      const days = filterToDays[timeFilter] || 28;
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - (days - 1));
    }

    // Normalize time (avoid DST issues)
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Helper function to get local date string (YYYY-MM-DD) in local timezone
    const getLocalDateString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Build list of dates between start and end (using local dates)
    const dateKeys = [];
    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      dateKeys.push(getLocalDateString(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    // Group materials by date and type
    const dataByDate = {};
    dateKeys.forEach((date) => {
      dataByDate[date] = {};
      materialTypes.forEach((type) => {
        dataByDate[date][type.name] = 0;
      });
    });

    // Count materials by date and type (using local dates)
    allMaterials.forEach((mat) => {
      if (mat.uploadedAt) {
        // Convert uploadedAt to local date string
        const uploadDateObj = new Date(mat.uploadedAt);
        const uploadDate = getLocalDateString(uploadDateObj);
        if (dataByDate[uploadDate]) {
          const typeName = materialTypes.find((t) => t.id === mat.typeId)?.name;
          if (typeName && dataByDate[uploadDate][typeName] !== undefined) {
            dataByDate[uploadDate][typeName]++;
          }
        }
      }
    });

    // Convert to chart data format
    return dateKeys.map((date) => {
      const dataPoint = { date };
      materialTypes.forEach((type) => {
        // Use a safe key name (replace spaces/special chars)
        const key = type.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
        dataPoint[key] = dataByDate[date][type.name] || 0;
      });
      return dataPoint;
    });
  }, [allMaterials, materialTypes, timeFilter, customRange]);

  // Create chart config from material types
  const chartConfig = useMemo(() => {
    const config = {};
    const colors = [
      // Pastel palette
      "#bfdbfe", // light blue
      "#bbf7d0", // light green
      "#f9a8d4", // light pink
      "#fde68a", // light yellow
      "#c4b5fd", // light purple
    ];
    materialTypes.forEach((type, index) => {
      const key = type.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      config[key] = {
        label: type.name,
        color: colors[index % colors.length],
      };
    });
    return config;
  }, [materialTypes]);

  if (
    !allMaterials ||
    allMaterials.length === 0 ||
    !materialTypes ||
    materialTypes.length === 0
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Materials Uploaded</CardTitle>
          <CardDescription>
            Track material uploads over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No materials uploaded yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-4">
          <div className="flex-1">
            <CardTitle>Materials Uploaded</CardTitle>
            <CardDescription>
              Track material uploads over time by material type
            </CardDescription>
          </div>
          <div className="mt-4 md:mt-0 space-y-3 flex-shrink-0">
            <div className="flex flex-wrap items-center gap-2 justify-end">
              <Label className="text-sm text-muted-foreground">
                Time range:
              </Label>
              <ToggleGroup
                type="single"
                value={timeFilter}
                onValueChange={(value) => {
                  if (value) setTimeFilter(value);
                }}
                className="flex flex-wrap gap-2"
              >
                <ToggleGroupItem
                  value="daily"
                  aria-label="Daily (7D)"
                  size="sm"
                  variant="outline"
                >
                  Daily (7D)
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="weekly"
                  aria-label="Weekly (4W)"
                  size="sm"
                  variant="outline"
                >
                  Weekly (4W)
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="monthly"
                  aria-label="Monthly (3M)"
                  size="sm"
                  variant="outline"
                >
                  Monthly (3M)
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="yearly"
                  aria-label="Yearly"
                  size="sm"
                  variant="outline"
                >
                  Yearly
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="custom"
                  aria-label="Custom"
                  size="sm"
                  variant="outline"
                >
                  Custom
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            {timeFilter === "custom" && (
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t justify-end">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="date-start"
                    className="text-sm text-muted-foreground whitespace-nowrap"
                  >
                    From:
                  </Label>
                  <DatePicker
                    id="date-start"
                    name="date-start"
                    value={customRange.start}
                    onChange={(e) =>
                      setCustomRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                    className="w-[140px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="date-end"
                    className="text-sm text-muted-foreground whitespace-nowrap"
                  >
                    To:
                  </Label>
                  <DatePicker
                    id="date-end"
                    name="date-end"
                    value={customRange.end}
                    onChange={(e) =>
                      setCustomRange((prev) => ({
                        ...prev,
                        end: e.target.value,
                      }))
                    }
                    className="w-[140px]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            {materialTypes.map((type, index) => {
              const key = type.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
              return (
                <Bar
                  key={type.id}
                  dataKey={key}
                  stackId="a"
                  fill={`var(--color-${key})`}
                  radius={
                    index === 0
                      ? [0, 0, 4, 4]
                      : index === materialTypes.length - 1
                      ? [4, 4, 0, 0]
                      : [0, 0, 0, 0]
                  }
                />
              );
            })}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  className="w-[180px]"
                  formatter={(value, name, item, index) => {
                    const typeKey = name;
                    const typeConfig = chartConfig[typeKey];
                    const total = Object.keys(chartConfig).reduce(
                      (sum, key) => {
                        return sum + (item.payload[key] || 0);
                      },
                      0
                    );

                    return (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                          style={{
                            "--color-bg": `var(--color-${name})`,
                          }}
                        />
                        {typeConfig?.label || name}
                        <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                          {value}
                          <span className="text-muted-foreground font-normal">
                            {" "}
                            materials
                          </span>
                        </div>
                        {/* Show total on last item */}
                        {index === materialTypes.length - 1 && (
                          <div className="text-foreground mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium">
                            Total
                            <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                              {total}
                              <span className="text-muted-foreground font-normal">
                                {" "}
                                materials
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  }}
                />
              }
              cursor={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

MaterialsUploadChart.propTypes = {
  allMaterials: PropTypes.array.isRequired,
  materialTypes: PropTypes.array.isRequired,
};

const LoadingState = () => {
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-pulse">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64"></div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64"></div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-700 rounded-xl h-24"
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
