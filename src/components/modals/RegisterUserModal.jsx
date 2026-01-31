import PropTypes from "prop-types";
import { useState, useEffect } from "react";
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
import { ChevronDown, X, Camera, Eye, EyeOff } from "lucide-react";
import { DatePicker } from "@/components/shadcn-components/ui/date-picker";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-components/ui/dropdown-menu";
import {
  getAllOffices,
  getAllSchools,
  getAllPositions,
} from "../../services/lrms-endpoints";
import userService from "../../services/user-endpoints"; // Import the user-endpoints service
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/shadcn-components/ui/toggle-group";

const RegisterUserModal = ({
  open,
  onOpenChange,
  onUserRegistered,
  onRegistrationSuccess,
  adminUserId,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    middleName: "",
    lastName: "",
    role: "Teacher", // Default role
    birthdate: "",
    officeId: "",
    schoolId: "",
    positionId: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [officesAndSchools, setOfficesAndSchools] = useState([]);
  const [positions, setPositions] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [toggleValue, setToggleValue] = useState("");

  // Fetch offices, schools, and positions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [officesResponse, schoolsResponse, positionsResponse] =
          await Promise.all([
            getAllOffices(),
            getAllSchools(),
            getAllPositions(),
          ]);

        const offices = officesResponse.success
          ? officesResponse.data || []
          : [];
        const schools = schoolsResponse.success
          ? schoolsResponse.data || []
          : [];
        const positionsData = positionsResponse.success
          ? positionsResponse.data || []
          : [];

        // Combine offices and schools with type indicator
        const combined = [
          ...offices.map((office) => ({ ...office, type: "office" })),
          ...schools.map((school) => ({ ...school, type: "school" })),
        ];

        setOfficesAndSchools(combined);
        setPositions(positionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  // Filter offices and schools based on toggle
  const filteredOptions = officesAndSchools.filter((item) => {
    const isSchool = item.description?.startsWith("Schools -");
    const isDivision = item.description?.startsWith("SDO -");

    if (toggleValue === "schools") {
      return isSchool; // Only schools
    } else if (toggleValue === "division") {
      return isDivision; // Only divisions
    }
    return false; // No toggle selected
  });

  // Handle toggle group change
  const handleToggleChange = (value) => {
    setToggleValue(value);
    // Clear office/school selection when toggle changes
    setFormData({
      ...formData,
      officeId: "",
      schoolId: "",
    });
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
    return age;
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
      setFormData({
        ...formData,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let prismaBirthdate = null;
    if (formData.birthdate) {
      const dateObject = new Date(formData.birthdate);
      prismaBirthdate = dateObject.toISOString();
    }

    try {
      let response;

      // If profile picture is present, use FormData
      if (profilePicture) {
        const formDataToSend = new FormData();

        // Append all user data as individual fields
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("firstName", formData.firstName);
        formDataToSend.append("lastName", formData.lastName);
        if (formData.middleName) {
          formDataToSend.append("middleName", formData.middleName);
        }
        formDataToSend.append("role", formData.role);
        if (prismaBirthdate) {
          formDataToSend.append("birthdate", prismaBirthdate);
        }
        if (formData.age) {
          formDataToSend.append("age", parseInt(formData.age, 10));
        }
        if (adminUserId) {
          formDataToSend.append("adminUserId", adminUserId);
        }

        // Append office/school and position IDs
        if (formData.officeId) {
          formDataToSend.append("officeId", formData.officeId);
        }
        if (formData.schoolId) {
          formDataToSend.append("schoolId", formData.schoolId);
        }
        if (formData.positionId) {
          formDataToSend.append("positionId", formData.positionId);
        }

        // Append profile picture
        formDataToSend.append("profilePicture", profilePicture);

        response = await userService.registerUserWithPicture(formDataToSend);
      } else {
        // Prepare user data for JSON request
        const userDataToRegister = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName || null,
          role: formData.role,
          birthdate: prismaBirthdate,
          age: parseInt(formData.age, 10) || null,
          adminUserId: adminUserId || null, // Pass the admin user ID for activity logging
          officeId: formData.officeId || null,
          schoolId: formData.schoolId || null,
          positionId: formData.positionId || null,
        };

        // Call the registerUser service function
        response = await userService.registerUser(userDataToRegister);
      }

      console.log("User registered successfully:", response);

      // Reset form
      setFormData({
        email: "",
        password: "",
        firstName: "",
        middleName: "",
        lastName: "",
        role: "TEACHER",
        birthdate: "",
        officeId: "",
        schoolId: "",
        positionId: "",
      });
      setProfilePicture(null);
      setProfilePicturePreview(null);
      setToggleValue("");
      setShowPassword(false);

      // Close modal
      onOpenChange(false);

      // Notify parent on successful registration
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }

      // Refresh user list in UsersManagement
      if (onUserRegistered) {
        onUserRegistered();
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Failed to register user", {
        description:
          error.response?.data?.message ||
          error.message ||
          "An error occurred while registering the user.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
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
                        src={profilePicturePreview}
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
                    <div className="w-32 h-32 rounded-full border-4 border-dashed border-teal-500 bg-gray-50 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
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
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Last Name</FieldLabel>
                  <FieldContent>
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Middle Name</FieldLabel>
                  <FieldContent>
                    <Input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                    />
                  </FieldContent>
                </Field>
              </div>
            </div>

            {/* Form Fields in rows */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Row 1: Email Address and Password */}
              <Field>
                <FieldLabel>Email Address</FieldLabel>
                <FieldContent>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FieldContent>
              </Field>

              {/* Row 2: Birthdate, Role, and Age in one row */}
              <Field>
                <FieldLabel>Birthdate</FieldLabel>
                <FieldContent>
                  <DatePicker
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    required
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
                        {formData.role || "Select role"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[8rem]">
                      <DropdownMenuRadioGroup
                        value={formData.role}
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
                  <input
                    type="hidden"
                    name="role"
                    value={formData.role}
                    required
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Age</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    name="age"
                    value={formData.age}
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
                            {formData.officeId || formData.schoolId
                              ? filteredOptions.find(
                                  (item) =>
                                    item.id === parseInt(formData.officeId) ||
                                    item.id === parseInt(formData.schoolId)
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
                              formData.officeId
                                ? `office-${formData.officeId}`
                                : formData.schoolId
                                ? `school-${formData.schoolId}`
                                : ""
                            }
                            onValueChange={(value) => {
                              if (value) {
                                const [type, id] = value.split("-");
                                if (type === "office") {
                                  setFormData({
                                    ...formData,
                                    officeId: id,
                                    schoolId: "",
                                  });
                                } else if (type === "school") {
                                  setFormData({
                                    ...formData,
                                    schoolId: id,
                                    officeId: "",
                                  });
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
                      <input
                        type="hidden"
                        name="officeId"
                        value={formData.officeId}
                      />
                      <input
                        type="hidden"
                        name="schoolId"
                        value={formData.schoolId}
                      />
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
                        {formData.positionId
                          ? positions.find(
                              (pos) => pos.id === parseInt(formData.positionId)
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
                        value={formData.positionId || ""}
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
                  <input
                    type="hidden"
                    name="positionId"
                    value={formData.positionId}
                  />
                </FieldContent>
              </Field>
            </div>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Register User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

RegisterUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onUserRegistered: PropTypes.func,
  onRegistrationSuccess: PropTypes.func,
  adminUserId: PropTypes.number,
};

export default RegisterUserModal;
