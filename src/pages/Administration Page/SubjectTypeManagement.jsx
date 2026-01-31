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
  getAllSubjectTypes,
  addSubjectType,
  updateSubjectType,
  deleteSubjectType,
} from "../../services/lrms-endpoints";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import ConfirmationDialog from "../../components/modals/ConfirmationDialog";

const SubjectTypeManagement = () => {
  const [subjectTypes, setSubjectTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubjectType, setSelectedSubjectType] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
  });

  // Fetch subject types
  const fetchSubjectTypes = async () => {
    try {
      setLoading(true);
      const response = await getAllSubjectTypes();
      if (response.success) {
        setSubjectTypes(response.data || []);
      } else {
        setError(response.message || "Failed to fetch subject types");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching subject types");
      console.error("Error fetching subject types:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjectTypes();
  }, []);

  // Filter subject types based on search term
  const filteredSubjectTypes = subjectTypes.filter((subjectType) =>
    subjectType.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredSubjectTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubjectTypes = filteredSubjectTypes.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
    });
  };

  // Open add dialog
  const handleAddClick = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  // Open edit dialog
  const handleEditClick = (subjectType) => {
    setSelectedSubjectType(subjectType);
    setFormData({
      name: subjectType.name || "",
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (subjectType) => {
    setSelectedSubjectType(subjectType);
    setIsDeleteDialogOpen(true);
  };

  // Handle add subject type
  const handleAddSubjectType = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Subject type name is required");
        return;
      }

      const response = await addSubjectType(formData);
      if (response.success) {
        setIsAddDialogOpen(false);
        resetForm();
        fetchSubjectTypes();
        alert("Subject type added successfully!");
      } else {
        alert(response.message || "Failed to add subject type");
      }
    } catch (err) {
      alert(err.message || "An error occurred while adding subject type");
      console.error("Error adding subject type:", err);
    }
  };

  // Handle update subject type
  const handleUpdateSubjectType = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Subject type name is required");
        return;
      }

      const response = await updateSubjectType(
        selectedSubjectType.id,
        formData
      );
      if (response.success) {
        setIsEditDialogOpen(false);
        resetForm();
        setSelectedSubjectType(null);
        fetchSubjectTypes();
        alert("Subject type updated successfully!");
      } else {
        alert(response.message || "Failed to update subject type");
      }
    } catch (err) {
      alert(err.message || "An error occurred while updating subject type");
      console.error("Error updating subject type:", err);
    }
  };

  // Handle delete subject type
  const handleDeleteSubjectType = async () => {
    try {
      const response = await deleteSubjectType(selectedSubjectType.id);
      if (response.success) {
        setIsDeleteDialogOpen(false);
        setSelectedSubjectType(null);
        fetchSubjectTypes();
        alert("Subject type deleted successfully!");
      } else {
        alert(response.message || "Failed to delete subject type");
      }
    } catch (err) {
      alert(err.message || "An error occurred while deleting subject type");
      console.error("Error deleting subject type:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading subject types...</div>
      </div>
    );
  }

  if (error && subjectTypes.length === 0) {
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
            Subject Types Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">Manage subject types</p>
        </div>
        <Button onClick={handleAddClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Subject Type
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search subject types..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-
          {Math.min(endIndex, filteredSubjectTypes.length)} of{" "}
          {filteredSubjectTypes.length} subject type(s)
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSubjectTypes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-gray-500"
                >
                  No subject types found
                </TableCell>
              </TableRow>
            ) : (
              currentSubjectTypes.map((subjectType) => (
                <TableRow key={subjectType.id}>
                  <TableCell className="font-medium">
                    {subjectType.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {subjectType.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(subjectType)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(subjectType)}
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
            <DialogTitle>Add New Subject Type</DialogTitle>
            <DialogDescription>
              Enter the subject type name below. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                placeholder="Enter subject type name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubjectType}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject Type</DialogTitle>
            <DialogDescription>
              Update the subject type name below. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                placeholder="Enter subject type name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
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
            <Button onClick={handleUpdateSubjectType}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedSubjectType(null);
        }}
        onConfirm={handleDeleteSubjectType}
        title="Delete Subject Type"
        message={`Are you sure you want to delete "${selectedSubjectType?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default SubjectTypeManagement;
