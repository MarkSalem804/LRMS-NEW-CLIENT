import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-components/ui/table";
import { Button } from "@/components/shadcn-components/ui/button";
import { Input } from "@/components/shadcn-components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-components/ui/dialog";
import {
  getAllSchools,
  addSchool,
  updateSchool,
  deleteSchool,
} from "../../services/lrms-endpoints";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import ConfirmationDialog from "../../components/modals/ConfirmationDialog";

const SchoolsManagement = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Fetch schools
  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await getAllSchools();
      if (response.success) {
        setSchools(response.data || []);
      } else {
        setError(response.message || "Failed to fetch schools");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching schools");
      console.error("Error fetching schools:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // Filter schools based on search term
  const filteredSchools = schools.filter(
    (school) =>
      school.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSchools = filteredSchools.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
  };

  // Open add dialog
  const handleAddClick = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  // Open edit dialog
  const handleEditClick = (school) => {
    setSelectedSchool(school);
    setFormData({
      name: school.name || "",
      description: school.description || "",
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (school) => {
    setSelectedSchool(school);
    setIsDeleteDialogOpen(true);
  };

  // Handle add school
  const handleAddSchool = async () => {
    try {
      if (!formData.name.trim()) {
        alert("School name is required");
        return;
      }

      const response = await addSchool(formData);
      if (response.success) {
        setIsAddDialogOpen(false);
        resetForm();
        fetchSchools(); // Refresh the list
        alert("School added successfully!");
      } else {
        alert(response.message || "Failed to add school");
      }
    } catch (err) {
      alert(err.message || "An error occurred while adding school");
      console.error("Error adding school:", err);
    }
  };

  // Handle update school
  const handleUpdateSchool = async () => {
    try {
      if (!formData.name.trim()) {
        alert("School name is required");
        return;
      }

      const response = await updateSchool(selectedSchool.id, formData);
      if (response.success) {
        setIsEditDialogOpen(false);
        resetForm();
        setSelectedSchool(null);
        fetchSchools(); // Refresh the list
        alert("School updated successfully!");
      } else {
        alert(response.message || "Failed to update school");
      }
    } catch (err) {
      alert(err.message || "An error occurred while updating school");
      console.error("Error updating school:", err);
    }
  };

  // Handle delete school
  const handleDeleteSchool = async () => {
    try {
      // Debug: Check token before making request
      const token = localStorage.getItem("lrms-token");
      console.log(
        "🔍 [Delete School Handler] Token check:",
        token ? "Token exists" : "No token found"
      );
      console.log(
        "🔍 [Delete School Handler] Token value:",
        token ? token.substring(0, 20) + "..." : "N/A"
      );
      console.log(
        "🔍 [Delete School Handler] All localStorage keys:",
        Object.keys(localStorage)
      );

      if (!token) {
        alert("No authentication token found. Please log in again.");
        return;
      }

      const response = await deleteSchool(selectedSchool.id);
      if (response.success) {
        setIsDeleteDialogOpen(false);
        setSelectedSchool(null);
        fetchSchools(); // Refresh the list
        alert("School deleted successfully!");
      } else {
        alert(response.message || "Failed to delete school");
      }
    } catch (err) {
      console.error("❌ [Delete School Handler] Error details:", err);
      console.error(
        "❌ [Delete School Handler] Error response:",
        err.response?.data
      );
      alert(err.message || "An error occurred while deleting school");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading schools...</div>
      </div>
    );
  }

  if (error && schools.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Schools Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage schools and descriptions
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Add School
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredSchools.length)}{" "}
          of {filteredSchools.length} school(s)
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSchools.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  No schools found
                </TableCell>
              </TableRow>
            ) : (
              currentSchools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{school.id}</TableCell>
                  <TableCell className="font-medium">{school.name}</TableCell>
                  <TableCell className="text-gray-600">
                    {school.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(school)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(school)}
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
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

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New School</DialogTitle>
            <DialogDescription>
              Enter the school details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">School Name *</label>
              <Input
                placeholder="e.g., Imus National High School"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="e.g., Public high school in Imus City"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSchool}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
            <DialogDescription>
              Update the school details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">School Name *</label>
              <Input
                placeholder="e.g., Imus National High School"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="e.g., Public high school in Imus City"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateSchool}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        message={`Are you sure you want to delete the school "${selectedSchool?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteSchool}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedSchool(null);
        }}
      />
    </div>
  );
};

export default SchoolsManagement;
