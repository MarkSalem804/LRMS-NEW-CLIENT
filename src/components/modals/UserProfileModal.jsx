import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-components/ui/dialog";
import { Button } from "@/components/shadcn-components/ui/button";
import { Input } from "@/components/shadcn-components/ui/input";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldGroup,
} from "@/components/shadcn-components/ui/field";
import {
  User,
  X,
  Mail,
  Calendar,
  Briefcase,
  Camera,
  ChevronDown,
} from "lucide-react";
import { DatePicker } from "@/components/shadcn-components/ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-components/ui/dropdown-menu";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/shadcn-components/ui/toggle-group";
import {
  getAllOffices,
  getAllSchools,
  getAllPositions,
} from "../../services/lrms-endpoints";
import { formatRoleDisplay } from "../../utils/roleFormatter";

// Helper function to format date to YYYY-MM-DD
const formatDateToYYYYMMDD = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // Return empty string for invalid dates
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to format date to "Joined January 2023"
const formatJoinedDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `Joined ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const UserProfileModal = ({ user, open, onOpenChange, isEditing, onSave }) => {
  const [editableUserData, setEditableUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [officesAndSchools, setOfficesAndSchools] = useState([]);
  const [positions, setPositions] = useState([]);
  const [toggleValue, setToggleValue] = useState("");

  useEffect(() => {
    if (user) {
      console.log(
        "[UserProfileModal] Initializing with birthdate:",
        user.profile && user.profile.length > 0
          ? user.profile[0].birthdate
          : "N/A"
      );
      // Initialize editable data from the user prop
      setEditableUserData({
        firstName:
          user.profile && user.profile.length > 0
            ? user.profile[0].firstName
            : "",
        middleName:
          user.profile && user.profile.length > 0
            ? user.profile[0].middleName
            : "",
        lastName:
          user.profile && user.profile.length > 0
            ? user.profile[0].lastName
            : "",
        emailAddress:
          user.profile && user.profile.length > 0
            ? user.profile[0].emailAddress
            : "",
        role: user.role || "", // Assuming role is directly on the user object
        birthdate:
          user.profile && user.profile.length > 0
            ? formatDateToYYYYMMDD(user.profile[0].birthdate)
            : "",
        age: user.profile && user.profile.length > 0 ? user.profile[0].age : "",
        employeeId:
          user.profile && user.profile.length > 0
            ? user.profile[0].employeeId
            : "",
        phoneNumber:
          user.profile && user.profile.length > 0
            ? user.profile[0].phoneNumber
            : "",
        address:
          user.profile && user.profile.length > 0
            ? user.profile[0].address
            : "",
        officeId:
          user.profile && user.profile.length > 0
            ? user.profile[0].officeId?.toString() || ""
            : "",
        schoolId:
          user.profile && user.profile.length > 0
            ? user.profile[0].schoolId?.toString() || ""
            : "",
        positionId:
          user.profile && user.profile.length > 0
            ? user.profile[0].positionId?.toString() || ""
            : "",
        // Include the user ID to be used for updating
        userId: user.id || null,
      });

      // Initialize profile picture preview if exists
      if (
        user.profile &&
        user.profile.length > 0 &&
        user.profile[0].profilePicture
      ) {
        const picturePath = user.profile[0].profilePicture;
        // Construct the full URL if it's a relative path
        const fullPath =
          picturePath.startsWith("https") || picturePath.startsWith("data:")
            ? picturePath
            : `https://sdoic-ilearn.depedimuscity.com:5005/${picturePath}`;
        setProfilePicturePreview(fullPath);
      } else {
        setProfilePicturePreview(null);
      }
      setProfilePicture(null);

      // Initialize toggle value based on existing office/school
      const profile =
        user.profile && user.profile.length > 0 ? user.profile[0] : null;
      if (profile?.schoolId) {
        setToggleValue("schools");
      } else if (profile?.officeId) {
        setToggleValue("division");
      }
    }
  }, [user]); // Re-initialize when the user prop changes

  // Fetch offices, schools, and positions
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Always fetch positions so view-mode can display position name
        const positionsResponse = await getAllPositions();
        const positionsData = positionsResponse.success
          ? positionsResponse.data || []
          : [];
        setPositions(positionsData);

        // Only fetch offices/schools when editing (used by dropdowns)
        if (isEditing) {
          const [officesResponse, schoolsResponse] = await Promise.all([
            getAllOffices(),
            getAllSchools(),
          ]);

          const offices = officesResponse.success
            ? officesResponse.data || []
            : [];
          const schools = schoolsResponse.success
            ? schoolsResponse.data || []
            : [];

          // Combine offices and schools with type indicator
          const combined = [
            ...offices.map((office) => ({ ...office, type: "office" })),
            ...schools.map((school) => ({ ...school, type: "school" })),
          ];

          setOfficesAndSchools(combined);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, isEditing]);

  // Filter offices and schools based on toggle
  const filteredOptions = officesAndSchools.filter((item) => {
    const isSchool = item.description?.startsWith("Schools -");
    const isDivision = item.description?.startsWith("SDO -");

    if (toggleValue === "schools") {
      return isSchool;
    } else if (toggleValue === "division") {
      return isDivision;
    }
    return false;
  });

  // Handle toggle group change
  const handleToggleChange = (value) => {
    setToggleValue(value);
    // Clear office/school selection when toggle changes
    setEditableUserData((prev) => ({
      ...prev,
      officeId: "",
      schoolId: "",
    }));
  };

  // Function to calculate age from birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return "";
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age.toString();
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture" && files && files[0]) {
      const file = files[0];
      setProfilePicture(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setEditableUserData({
        ...editableUserData,
        [name]: value,
        // Calculate age if birthdate changes
        ...(name === "birthdate" && { age: calculateAge(value) }),
      });
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
  };

  const handleSave = () => {
    if (onSave && editableUserData) {
      console.log(
        "[UserProfileModal] Saving birthdate:",
        editableUserData.birthdate
      );

      // Convert birthdate back to ISO-8601 format before saving
      const dataToSave = { ...editableUserData };
      if (dataToSave.birthdate) {
        try {
          const dateObject = new Date(dataToSave.birthdate);
          if (!isNaN(dateObject.getTime())) {
            // Check if the date is valid
            dataToSave.birthdate = dateObject.toISOString();
          } else {
            console.error(
              "[UserProfileModal] Invalid birthdate format before saving:",
              dataToSave.birthdate
            );
            // Optionally alert user or handle this error
            return; // Stop the save process if date is invalid
          }
        } catch (e) {
          console.error(
            "[UserProfileModal] Error converting birthdate before saving:",
            dataToSave.birthdate,
            e
          );
          // Optionally alert user or handle this error
          return; // Stop the save process on error
        }
      }

      // Convert empty strings to null for officeId, schoolId, positionId
      if (dataToSave.officeId === "") {
        dataToSave.officeId = null;
      }
      if (dataToSave.schoolId === "") {
        dataToSave.schoolId = null;
      }
      if (dataToSave.positionId === "") {
        dataToSave.positionId = null;
      }

      console.log(
        "[UserProfileModal] Sending birthdate (after conversion):",
        dataToSave.birthdate
      );
      console.log("[UserProfileModal] Sending data:", dataToSave);

      // Pass profile picture along with the data
      onSave(dataToSave, profilePicture);
      onOpenChange(false);
    }
  };

  if (!user) return null;

  const profile =
    user.profile && user.profile.length > 0 ? user.profile[0] : null;
  const fullName = profile
    ? `${profile.firstName || ""} ${profile.middleName || ""} ${
        profile.lastName || ""
      }`.trim()
    : "N/A";
  const email = profile?.emailAddress || user.email || "N/A";
  const positionIdNumber = profile?.positionId
    ? parseInt(profile.positionId, 10)
    : null;
  const positionName =
    positionIdNumber && Array.isArray(positions) && positions.length > 0
      ? positions.find((pos) => pos.id === positionIdNumber)?.name || "N/A"
      : "N/A";
  const roleDisplay = formatRoleDisplay(user.role);
  const joinedDate = user.createdAt || user.created_at || null;

  const getProfileThemeByRole = (role) => {
    switch (role) {
      // Administrators - midnight blue (3-color gradient)
      case "Administrative":
        return {
          bg: "bg-gradient-to-br from-[#0a1628] via-[#0d2b5a] to-[#1a3d6b]",
          text: "text-white",
          mutedText: "text-white/80",
          icon: "text-white/80",
          badge: "bg-white/15 text-white border border-white/20",
          border: "border-white/20",
        };
      // LR Coordinators - mint green (3-color gradient)
      case "LR_coor":
        return {
          bg: "bg-gradient-to-br from-[#a8e6cf] via-[#7dd3a0] to-[#5cb88d]",
          text: "text-gray-900",
          mutedText: "text-gray-800/80",
          icon: "text-gray-800/70",
          badge: "bg-black/15 text-gray-900 border border-black/10",
          border: "border-black/10",
        };
      // Teachers - sunrise yellow (3-color gradient)
      case "Teacher":
        return {
          bg: "bg-gradient-to-br from-[#ffe066] via-[#ffcc33] to-[#ffb300]",
          text: "text-gray-900",
          mutedText: "text-gray-800/80",
          icon: "text-gray-800/70",
          badge: "bg-black/15 text-gray-900 border border-black/10",
          border: "border-black/10",
        };
      // EPS - dark red (3-color gradient)
      case "EPS":
        return {
          bg: "bg-gradient-to-br from-[#3d0a0a] via-[#6b1414] to-[#9a1e1e]",
          text: "text-white",
          mutedText: "text-white/80",
          icon: "text-white/80",
          badge: "bg-white/15 text-white border border-white/20",
          border: "border-white/20",
        };
      // Non-teaching - black (3-color gradient)
      case "Non_teaching":
        return {
          bg: "bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2d2d2d]",
          text: "text-white",
          mutedText: "text-white/80",
          icon: "text-white/80",
          badge: "bg-white/15 text-white border border-white/20",
          border: "border-white/20",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-slate-100 via-slate-50 to-white",
          text: "text-gray-900",
          mutedText: "text-gray-700",
          icon: "text-gray-500",
          badge: "bg-gray-900 text-white",
          border: "border-gray-200",
        };
    }
  };

  const profileTheme = getProfileThemeByRole(user.role);

  // View Mode - Redesigned layout
  if (!isEditing) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="hidden">
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col">
            {/* Profile Header (Role-based gradient) - Full width section */}
            <div
              className={`w-full ${profileTheme.bg} px-6 py-10 flex flex-col items-center rounded-t-lg`}
            >
              {/* Profile Picture */}
              <div className="relative mb-4">
                {profilePicturePreview ? (
                  <img
                    src={profilePicturePreview}
                    alt={fullName}
                    className={`w-32 h-32 rounded-full object-cover border-4 ${profileTheme.border}`}
                  />
                ) : (
                  <div
                    className={`w-32 h-32 rounded-full bg-white border-4 ${profileTheme.border} flex items-center justify-center`}
                  >
                    <User className={`h-16 w-16 ${profileTheme.icon}`} />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              {/* Name */}
              <h2 className={`text-2xl font-bold mb-2 ${profileTheme.text}`}>
                {fullName}
              </h2>

              {/* Role Badge */}
              <div className={`px-4 py-1 rounded-full ${profileTheme.badge}`}>
                <span className="text-sm font-medium">{roleDisplay}</span>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="flex flex-col items-center py-6">
              {/* Contact Information */}
              <div className="w-full space-y-3 mb-6">
                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-foreground">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">{email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-foreground">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">{positionName}</span>
                    </div>
                    {joinedDate && (
                      <div className="flex items-center gap-3 text-foreground">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-sm">
                          {formatJoinedDate(joinedDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Edit Mode - Match RegisterUserModal design
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
          <DialogDescription>Update user information below</DialogDescription>
        </DialogHeader>

        <FieldGroup className="py-4">
          {/* Profile Picture Upload with Name Fields on the right */}
          <div className="flex items-start gap-6">
            {/* Profile Picture Upload - Left side */}
            <div className="flex flex-col items-center">
              <label className="cursor-pointer">
                <input
                  type="file"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
                {profilePicturePreview ? (
                  <div className="relative">
                    <img
                      src={
                        profilePicturePreview.startsWith("data:") ||
                        profilePicturePreview.startsWith("http")
                          ? profilePicturePreview
                          : `http://localhost:5001/${profilePicturePreview}`
                      }
                      alt="Profile preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-teal-500"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveProfilePicture();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-dashed border-teal-500 bg-white flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
                    <Camera className="h-10 w-10 text-teal-500 mb-2" />
                  </div>
                )}
              </label>
              <p className="text-sm text-gray-500 mt-3">
                Click to upload profile picture
              </p>
            </div>

            {/* Name Fields - Right side */}
            <div className="flex-1 space-y-4">
              <Field>
                <FieldLabel>First Name</FieldLabel>
                <FieldContent>
                  <Input
                    type="text"
                    name="firstName"
                    value={editableUserData?.firstName || ""}
                    onChange={handleInputChange}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Last Name</FieldLabel>
                <FieldContent>
                  <Input
                    type="text"
                    name="lastName"
                    value={editableUserData?.lastName || ""}
                    onChange={handleInputChange}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Middle Name</FieldLabel>
                <FieldContent>
                  <Input
                    type="text"
                    name="middleName"
                    value={editableUserData?.middleName || ""}
                    onChange={handleInputChange}
                  />
                </FieldContent>
              </Field>
            </div>
          </div>

          {/* Form Fields in rows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Row 1: Email Address */}
            <Field>
              <FieldLabel>Email Address</FieldLabel>
              <FieldContent>
                <Input
                  type="email"
                  name="emailAddress"
                  value={editableUserData?.emailAddress || ""}
                  onChange={handleInputChange}
                />
              </FieldContent>
            </Field>

            {/* Row 2: Birthdate, Role, and Age in one row */}
            <Field>
              <FieldLabel>Birthdate</FieldLabel>
              <FieldContent>
                <DatePicker
                  name="birthdate"
                  value={editableUserData?.birthdate || ""}
                  onChange={handleInputChange}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Role</FieldLabel>
              <FieldContent>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {editableUserData?.role || "Select role"}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[8rem]">
                    <DropdownMenuRadioGroup
                      value={editableUserData?.role || ""}
                      onValueChange={(value) => {
                        handleInputChange({
                          target: { name: "role", value },
                        });
                      }}
                    >
                      <DropdownMenuRadioItem value="Administrative">
                        Administrative
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Teacher">
                        Teacher
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="EPS">
                        EPS
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="LR_coor">
                        LR Coordinator
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Non_teaching">
                        Non-teaching
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Age</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  name="age"
                  value={editableUserData?.age || ""}
                  readOnly
                  disabled
                  className="bg-gray-50"
                />
              </FieldContent>
            </Field>

            {/* Row 3: Office/School toggle and dropdown side by side */}
            <Field className="md:col-span-3">
              <FieldLabel>Office/School</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-4">
                  {/* Toggle Group on the left */}
                  <div className="flex-shrink-0">
                    <ToggleGroup
                      type="single"
                      value={toggleValue}
                      onValueChange={handleToggleChange}
                      className="justify-start gap-2"
                    >
                      <ToggleGroupItem
                        value="schools"
                        aria-label="Toggle schools"
                        className="bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 data-[state=on]:bg-white data-[state=on]:border-teal-500 data-[state=on]:text-teal-600 px-4 py-2 h-auto"
                      >
                        Schools
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="division"
                        aria-label="Toggle division"
                        className="bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 data-[state=on]:bg-white data-[state=on]:border-teal-500 data-[state=on]:text-teal-600 px-4 py-2 h-auto"
                      >
                        Division
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  {/* Dropdown on the right */}
                  <div className="flex-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {editableUserData?.officeId ||
                          editableUserData?.schoolId
                            ? officesAndSchools.find(
                                (item) =>
                                  item.id ===
                                    parseInt(editableUserData.officeId) ||
                                  item.id ===
                                    parseInt(editableUserData.schoolId)
                              )?.name || "Select office/school"
                            : "Select office/school"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="min-w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto"
                      >
                        <DropdownMenuRadioGroup
                          value={
                            editableUserData?.officeId
                              ? `office-${editableUserData.officeId}`
                              : editableUserData?.schoolId
                              ? `school-${editableUserData.schoolId}`
                              : ""
                          }
                          onValueChange={(value) => {
                            if (value) {
                              const [type, id] = value.split("-");
                              if (type === "office") {
                                setEditableUserData((prev) => ({
                                  ...prev,
                                  officeId: id,
                                  schoolId: "",
                                }));
                              } else if (type === "school") {
                                setEditableUserData((prev) => ({
                                  ...prev,
                                  schoolId: id,
                                  officeId: "",
                                }));
                              }
                            }
                          }}
                        >
                          {filteredOptions.length > 0 ? (
                            filteredOptions.map((item) => (
                              <DropdownMenuRadioItem
                                key={`${item.type}-${item.id}`}
                                value={`${item.type}-${item.id}`}
                              >
                                {item.name}
                              </DropdownMenuRadioItem>
                            ))
                          ) : (
                            <div className="px-2 py-1.5 text-sm text-gray-500">
                              No options available
                            </div>
                          )}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </FieldContent>
            </Field>

            {/* Row 4: Position Title */}
            <Field className="md:col-span-3">
              <FieldLabel>Position Title</FieldLabel>
              <FieldContent>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {editableUserData?.positionId
                        ? positions.find(
                            (pos) =>
                              pos.id === parseInt(editableUserData.positionId)
                          )?.name || "Select position"
                        : "Select position"}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="min-w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto"
                  >
                    <DropdownMenuRadioGroup
                      value={editableUserData?.positionId || ""}
                      onValueChange={(value) => {
                        handleInputChange({
                          target: { name: "positionId", value },
                        });
                      }}
                    >
                      {positions.length > 0 ? (
                        positions.map((position) => (
                          <DropdownMenuRadioItem
                            key={position.id}
                            value={String(position.id)}
                          >
                            {position.name}
                          </DropdownMenuRadioItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-gray-500">
                          No positions available
                        </div>
                      )}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FieldContent>
            </Field>
          </div>
        </FieldGroup>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

UserProfileModal.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    role: PropTypes.string,
    email: PropTypes.string,
    createdAt: PropTypes.string,
    created_at: PropTypes.string,
    profile: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        emailAddress: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        middleName: PropTypes.string,
        birthdate: PropTypes.string,
        age: PropTypes.number,
        employeeId: PropTypes.string,
        phoneNumber: PropTypes.string,
        address: PropTypes.string,
        profilePicture: PropTypes.string,
        position: PropTypes.shape({
          name: PropTypes.string,
        }),
        officeId: PropTypes.number,
        schoolId: PropTypes.number,
        positionId: PropTypes.number,
      })
    ),
  }),
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  onSave: PropTypes.func,
};

export default UserProfileModal;
