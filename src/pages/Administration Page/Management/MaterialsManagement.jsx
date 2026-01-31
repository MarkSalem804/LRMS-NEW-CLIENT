/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Upload,
  FileSpreadsheet,
  Database,
  Eye,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/shadcn-components/ui/button";
import { Input } from "@/components/shadcn-components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/shadcn-components/ui/dialog";
import { toast } from "sonner";
import {
  getAllMaterials,
  uploadMaterialFile,
  uploadMaterialsMetadata,
  viewMaterialFile,
  getMaterialDetails,
  getAllTypes,
  getAllLearningAreas,
  getAllGradeLevels,
} from "../../../services/lrms-endpoints";
import { Link, useLocation } from "react-router-dom";

const MaterialsManagement = () => {
  const location = useLocation();
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [selectedResourceType, setSelectedResourceType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Fixed number of items per page

  // Filter options
  const [resourceTypes, setResourceTypes] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
  const [gradeLevels, setGradeLevels] = useState([]);

  // Filter states for SHS
  const [selectedCoreSubject, setSelectedCoreSubject] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("");
  const [selectedSubTrack, setSelectedSubTrack] = useState("");
  const [selectedAppliedSubject, setSelectedAppliedSubject] = useState("");
  const [selectedSpecializedSubject, setSelectedSpecializedSubject] =
    useState("");

  // Add new state for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Add new state for metadata upload modal
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [metadataFile, setMetadataFile] = useState(null);
  const [isMetadataUploading, setIsMetadataUploading] = useState(false);
  const [metadataError, setMetadataError] = useState(null);

  // Add new state for view modal
  const [viewMaterialUrl, setViewMaterialUrl] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewMaterialTitle, setViewMaterialTitle] = useState("");

  // State for filters dialog
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  // Sync selected resource type from sidebar deep-link: /materials/management?type=<TypeName>
  useEffect(() => {
    const typeFromQuery =
      new URLSearchParams(location.search).get("type") || "";
    if (typeFromQuery !== selectedResourceType) {
      setSelectedResourceType(typeFromQuery);
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Fetch materials and filter options on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch materials
        const materialsResponse = await getAllMaterials();
        if (materialsResponse.success) {
          setMaterials(materialsResponse.data);
        } else {
          console.error(
            "Failed to fetch materials:",
            materialsResponse.message
          );
        }

        // Fetch filter options
        const [typesResponse, areasResponse, gradesResponse] =
          await Promise.all([
            getAllTypes(),
            getAllLearningAreas(),
            getAllGradeLevels(),
          ]);

        setResourceTypes(typesResponse.data || typesResponse || []);
        setLearningAreas(areasResponse.data || areasResponse || []);
        setGradeLevels(gradesResponse.data || gradesResponse || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter materials based on search term and filters
  const filteredMaterials = materials.filter((material) => {
    if (!material) return false;

    const matchesSearch =
      !searchTerm ||
      (material.title &&
        material.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (material.description &&
        material.description.toLowerCase().includes(searchTerm.toLowerCase()));

    if (searchTerm && !matchesSearch) return false;

    const matchesResourceType =
      !selectedResourceType ||
      (material.typeName && material.typeName === selectedResourceType);
    if (!matchesResourceType) return false;

    // Grade filtering
    if (selectedGrade) {
      if (material.gradeLevelName !== selectedGrade) return false;
    }

    // Learning Area filtering
    if (selectedArea && material.learningAreaName !== selectedArea)
      return false;

    // Component filtering
    if (selectedComponent && material.componentName !== selectedComponent)
      return false;

    // SHS specific filters
    if (selectedCoreSubject && material.subjectTypeName !== selectedCoreSubject)
      return false;
    if (selectedTrack && material.trackName !== selectedTrack) return false;
    if (selectedSubTrack && material.strandName !== selectedSubTrack)
      return false;
    if (
      selectedAppliedSubject &&
      material.subjectTypeName !== selectedAppliedSubject
    )
      return false;
    if (
      selectedSpecializedSubject &&
      material.subjectTypeName !== selectedSpecializedSubject
    )
      return false;

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // const handleDelete = async (id) => {
  //   // TODO: Implement delete functionality
  //   // console.log("Delete material with ID:", id);
  // };

  const handleUploadFile = (material) => {
    // console.log("Opening upload modal for material:", material);
    setSelectedMaterial(material);
    setIsUploadModalOpen(true);
    setUploadFile(null);
    setUploadError(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // console.log("File selected:", file?.name, "Size:", file?.size, "bytes");
    setUploadFile(file);
    setUploadError(null);
  };

  const handleMetadataFileChange = (event) => {
    const file = event.target.files[0];
    // console.log(
    //   "Metadata file selected:",
    //   file?.name,
    //   "Size:",
    //   file?.size,
    //   "bytes"
    // );
    setMetadataFile(file);
    setMetadataError(null);
  };

  const handleMetadataUpload = async () => {
    if (!metadataFile) {
      // console.log("[Metadata Upload] Upload attempted without file selection");
      setMetadataError("Please select an Excel file to upload");
      return;
    }

    // console.log("[Metadata Upload] Starting upload process");
    // console.log("[Metadata Upload] File details:", {
    //   name: metadataFile.name,
    //   size: metadataFile.size,
    //   type: metadataFile.type,
    //   lastModified: new Date(metadataFile.lastModified).toISOString(),
    // });

    setIsMetadataUploading(true);
    setMetadataError(null);

    try {
      // console.log("[Metadata Upload] Preparing FormData...");
      // console.log("[Metadata Upload] Calling uploadMaterialsMetadata API...");
      const response = await uploadMaterialsMetadata(metadataFile);
      // console.log("[Metadata Upload] API Response:", {
      //   success: response.success,
      //   message: response.message,
      //   totalUploaded: response.totalUploaded,
      //   totalDuplicates: response.totalDuplicates,
      //   duplicates: response.duplicates,
      // });

      if (response.success) {
        // console.log("[Metadata Upload] Upload successful");
        // Close modal and refresh materials list
        setIsMetadataModalOpen(false);
        setMetadataFile(null);

        // Refresh the materials list
        // console.log("[Metadata Upload] Refreshing materials list...");
        const updatedResponse = await getAllMaterials();
        // console.log("[Metadata Upload] Materials list refresh response:", {
        //   success: updatedResponse.success,
        //   count: updatedResponse.data?.length,
        // });

        if (updatedResponse.success) {
          // console.log(
          //   "[Metadata Upload] Materials list refreshed successfully"
          // );
          setMaterials(updatedResponse.data);

          // Show success notification with duplicate info if any
          if (response.duplicates && response.duplicates.length > 0) {
            toast.warning("Upload Complete", {
              description: `Successfully uploaded ${response.totalUploaded} materials. ${response.totalDuplicates} duplicates were skipped.`,
            });
          } else {
            toast.success("Upload Successful", {
              description: `Successfully uploaded ${response.totalUploaded} materials!`,
            });
          }
        } else {
          console.error(
            "[Metadata Upload] Failed to refresh materials list:",
            updatedResponse.message
          );
        }
      } else {
        console.error("[Metadata Upload] Upload failed:", response.message);
        setMetadataError(response.message || "Failed to upload metadata");
        toast.error("Upload Failed", {
          description: response.message || "Failed to upload metadata",
        });
      }
    } catch (error) {
      console.error("[Metadata Upload] Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setMetadataError(
        error.message || "An error occurred while uploading the metadata"
      );
      toast.error("Upload Failed", {
        description:
          error.message || "An error occurred while uploading the metadata",
      });
    } finally {
      setIsMetadataUploading(false);
      // console.log("[Metadata Upload] Upload process completed");
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile) {
      // console.log("[File Upload] Upload attempted without file selection");
      setUploadError("Please select a file to upload");
      return;
    }

    // console.log(
    //   "[File Upload] Starting upload process for material:",
    //   selectedMaterial.id
    // );
    // console.log("[File Upload] Material details:", {
    //   id: selectedMaterial.id,
    //   title: selectedMaterial.title,
    //   gradeLevel: selectedMaterial.gradeLevelName,
    //   type: selectedMaterial.typeName,
    // });
    // console.log("[File Upload] File details:", {
    //   name: uploadFile.name,
    //   size: uploadFile.size,
    //   type: uploadFile.type,
    //   lastModified: new Date(uploadFile.lastModified).toISOString(),
    // });

    setIsUploading(true);
    setUploadError(null);

    try {
      // console.log("[File Upload] Preparing FormData...");
      // console.log("[File Upload] Calling uploadMaterialFile API...");
      const response = await uploadMaterialFile(
        selectedMaterial.id,
        uploadFile
      );
      // console.log("[File Upload] API Response:", {
      //   success: response.success,
      //   message: response.message,
      //   data: response.data,
      // });

      if (response.success) {
        // console.log("[File Upload] File upload successful");
        // Close modal and refresh materials list
        setIsUploadModalOpen(false);
        // Refresh the materials list
        // console.log("[File Upload] Refreshing materials list...");
        const updatedResponse = await getAllMaterials();
        // console.log("[File Upload] Materials list refresh response:", {
        //   success: updatedResponse.success,
        //   count: updatedResponse.data?.length,
        // });

        if (updatedResponse.success) {
          // console.log("[File Upload] Materials list refreshed successfully");
          setMaterials(updatedResponse.data);
          toast.success("File Uploaded", {
            description: "File uploaded successfully!",
          });
        } else {
          console.error(
            "[File Upload] Failed to refresh materials list:",
            updatedResponse.message
          );
        }
      } else {
        console.error("[File Upload] Upload failed:", response.message);
        setUploadError(response.message || "Failed to upload file");
        toast.error("Upload Failed", {
          description: response.message || "Failed to upload file",
        });
      }
    } catch (error) {
      console.error("[File Upload] Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setUploadError(
        error.message || "An error occurred while uploading the file"
      );
      toast.error("Upload Failed", {
        description:
          error.message || "An error occurred while uploading the file",
      });
    } finally {
      setIsUploading(false);
      // console.log("[File Upload] Upload process completed");
    }
  };

  const handleViewMaterial = async (materialId) => {
    try {
      // Get material details first
      const materialDetails = await getMaterialDetails(materialId);
      const title = materialDetails.material.title;
      setViewMaterialTitle(title);

      // Set the view URL with title
      const url = viewMaterialFile(materialId, title);
      setViewMaterialUrl(url);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error getting material details:", error);
      toast.error("Error", {
        description: "Failed to get material details",
      });
    }
  };

  // Add cleanup function for blob URL
  useEffect(() => {
    return () => {
      if (viewMaterialUrl) {
        window.URL.revokeObjectURL(viewMaterialUrl);
      }
    };
  }, [viewMaterialUrl]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Materials Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage learning materials and resources
          </p>
        </div>
        <Button onClick={() => setIsMetadataModalOpen(true)} className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Upload Metadata
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Materials Card */}
        <div className="bg-gradient-to-r from-blue-200 to-purple-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 relative overflow-hidden group cursor-pointer">
          <div className="relative z-10">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Total Materials
            </h3>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {materials.length}
            </p>
          </div>
          <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
            <Database className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xs text-gray-600 mt-1.5 relative z-10">
            All materials
          </p>
        </div>

        {/* With Files Card */}
        <div className="bg-gradient-to-r from-green-200 to-blue-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 relative overflow-hidden group cursor-pointer">
          <div className="relative z-10">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              With Files
            </h3>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {materials.filter((m) => m.fileName).length}
            </p>
          </div>
          <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
            <Upload className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-xs text-gray-600 mt-1.5 relative z-10">
            Materials with files
          </p>
        </div>

        {/* Without Files Card */}
        <div className="bg-gradient-to-r from-orange-200 to-yellow-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 relative overflow-hidden group cursor-pointer">
          <div className="relative z-10">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Without Files
            </h3>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {materials.filter((m) => !m.fileName).length}
            </p>
          </div>
          <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
            <Database className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-xs text-gray-600 mt-1.5 relative z-10">
            Materials without files
          </p>
        </div>
      </div>

      {/* Search Bar and Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search materials by title or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-600">
            Showing{" "}
            {filteredMaterials.length === 0
              ? 0
              : (currentPage - 1) * itemsPerPage + 1}
            -{Math.min(currentPage * itemsPerPage, filteredMaterials.length)} of{" "}
            {filteredMaterials.length} material(s)
          </div>
        </div>

        {/* Filters Trigger */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {/* <Filter className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-700">Filters</span> */}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsFilterDialogOpen(true)}
          >
            <Filter className="h-4 w-4" />
            Open filters
          </Button>
        </div>
      </div>

      {/* Materials Table */}
      <div className="border rounded-lg bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">Loading materials...</div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Grade Level</TableHead>
                <TableHead>Resource Type</TableHead>
                <TableHead>Learning Area / Subject</TableHead>
                <TableHead>File Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMaterials.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Database className="h-12 w-12 text-gray-300" />
                      <p className="text-lg font-medium">No materials found</p>
                      <p className="text-sm text-gray-400">
                        {searchTerm ||
                        selectedGrade ||
                        selectedArea ||
                        selectedResourceType
                          ? "Try adjusting your search or filters"
                          : "Upload metadata to get started"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium max-w-[200px]">
                      <div className="truncate" title={material.title}>
                        {material.title || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[250px]">
                      <div className="truncate" title={material.description}>
                        {material.description || "No description"}
                      </div>
                    </TableCell>
                    <TableCell>{material.gradeLevelName || "N/A"}</TableCell>
                    <TableCell>{material.typeName || "N/A"}</TableCell>
                    <TableCell>
                      {material.learningAreaName ||
                        material.subjectTypeName ||
                        "N/A"}
                    </TableCell>
                    <TableCell>
                      {material.fileName ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Has File
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          No File
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewMaterial(material.id)}
                          className="h-8 w-8"
                          title="View Material"
                          disabled={!material.fileName}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8"
                          title="Edit"
                        >
                          <Link to={`/materials/edit/${material.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUploadFile(material)}
                          className="h-8 w-8"
                          title="Upload File"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete"
                          disabled
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Filters Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Filter materials</DialogTitle>
            <DialogDescription>
              Refine the list by resource type, learning area, and grade level.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Resource Type Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">
                Resource Type
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 w-full justify-between"
                  >
                    {selectedResourceType || "All Resource Types"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full max-w-sm">
                  <DropdownMenuRadioGroup
                    value={selectedResourceType}
                    onValueChange={(value) => {
                      setSelectedResourceType(value);
                      setCurrentPage(1);
                    }}
                  >
                    <DropdownMenuRadioItem value="">
                      All Resource Types
                    </DropdownMenuRadioItem>
                    {resourceTypes.map((type) => (
                      <DropdownMenuRadioItem key={type.id} value={type.name}>
                        {type.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Learning Area Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">
                Learning Area
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 w-full justify-between"
                  >
                    {selectedArea || "All Learning Areas"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full max-w-sm">
                  <DropdownMenuRadioGroup
                    value={selectedArea}
                    onValueChange={(value) => {
                      setSelectedArea(value);
                      setCurrentPage(1);
                    }}
                  >
                    <DropdownMenuRadioItem value="">
                      All Learning Areas
                    </DropdownMenuRadioItem>
                    {learningAreas.map((area) => (
                      <DropdownMenuRadioItem key={area.id} value={area.name}>
                        {area.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Grade Level Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">
                Grade Level
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 w-full justify-between"
                  >
                    {selectedGrade || "All Grade Levels"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full max-w-sm">
                  <DropdownMenuRadioGroup
                    value={selectedGrade}
                    onValueChange={(value) => {
                      setSelectedGrade(value);
                      setCurrentPage(1);
                    }}
                  >
                    <DropdownMenuRadioItem value="">
                      All Grade Levels
                    </DropdownMenuRadioItem>
                    {gradeLevels.map((grade) => (
                      <DropdownMenuRadioItem key={grade.id} value={grade.name}>
                        {grade.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Clear Filters Button */}
            {(selectedResourceType || selectedArea || selectedGrade) && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedResourceType("");
                    setSelectedArea("");
                    setSelectedGrade("");
                    setCurrentPage(1);
                  }}
                  className="w-full justify-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFilterDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="min-w-[40px]"
              >
                {page}
              </Button>
            ))}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Metadata Upload Modal */}
      <Dialog
        open={isMetadataModalOpen}
        onOpenChange={(open) => {
          setIsMetadataModalOpen(open);
          if (!open) {
            setMetadataFile(null);
            setMetadataError(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Materials Metadata</DialogTitle>
            <DialogDescription>
              Select an Excel file to upload materials metadata
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Excel File</label>
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleMetadataFileChange}
                disabled={isMetadataUploading}
              />
              <p className="text-sm text-gray-500">
                Only Excel files (.xlsx, .xls) are accepted
              </p>
            </div>

            {metadataError && (
              <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                {metadataError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsMetadataModalOpen(false);
                setMetadataFile(null);
                setMetadataError(null);
              }}
              disabled={isMetadataUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMetadataUpload}
              disabled={isMetadataUploading}
            >
              {isMetadataUploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Upload Modal */}
      <Dialog
        open={isUploadModalOpen}
        onOpenChange={(open) => {
          setIsUploadModalOpen(open);
          if (!open) {
            setUploadFile(null);
            setUploadError(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File for {selectedMaterial?.title}</DialogTitle>
            <DialogDescription>
              Select a file to upload for this material
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select File</label>
              <Input
                type="file"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>

            {uploadError && (
              <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                {uploadError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadModalOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button onClick={handleUploadSubmit} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Material Modal */}
      <Dialog
        open={isViewModalOpen}
        onOpenChange={(open) => {
          setIsViewModalOpen(open);
          if (!open) {
            setViewMaterialUrl(null);
            setViewMaterialTitle("");
          }
        }}
      >
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0 flex flex-col [&>button]:text-white [&>button]:hover:text-blue-100 [&>button]:right-4 [&>button]:top-4">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 pt-6 pb-4 rounded-t-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white mb-1">
                {viewMaterialTitle || "View Material"}
              </DialogTitle>
              <DialogDescription className="text-sm text-blue-100">
                Learning Resource Material
              </DialogDescription>
            </DialogHeader>
          </div>
          {/* Content Section */}
          <div className="flex-1 bg-white rounded-b-lg p-6 overflow-hidden">
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaterialsManagement;
