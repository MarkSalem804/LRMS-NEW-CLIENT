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
  getAllLearningAreas,
  addLearningArea,
  updateLearningArea,
  deleteLearningArea,
} from "../../services/lrms-endpoints";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import ConfirmationDialog from "../../components/modals/ConfirmationDialog";

const LearningAreasManagement = () => {
  const [learningAreas, setLearningAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLearningArea, setSelectedLearningArea] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Fetch learning areas
  const fetchLearningAreas = async () => {
    try {
      setLoading(true);
      const response = await getAllLearningAreas();
      if (response.success) {
        setLearningAreas(response.data || []);
      } else {
        setError(response.message || "Failed to fetch learning areas");
      }
    } catch (err) {
      setError(
        err.message || "An error occurred while fetching learning areas"
      );
      console.error("Error fetching learning areas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningAreas();
  }, []);

  // Filter learning areas based on search term
  const filteredLearningAreas = learningAreas.filter(
    (learningArea) =>
      learningArea.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learningArea.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredLearningAreas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLearningAreas = filteredLearningAreas.slice(
    startIndex,
    endIndex
  );

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
  const handleEditClick = (learningArea) => {
    setSelectedLearningArea(learningArea);
    setFormData({
      name: learningArea.name || "",
      description: learningArea.description || "",
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (learningArea) => {
    setSelectedLearningArea(learningArea);
    setIsDeleteDialogOpen(true);
  };

  // Handle add learning area
  const handleAddLearningArea = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Learning area name is required");
        return;
      }

      const response = await addLearningArea(formData);
      if (response.success) {
        setIsAddDialogOpen(false);
        resetForm();
        fetchLearningAreas(); // Refresh the list
        alert("Learning area added successfully!");
      } else {
        alert(response.message || "Failed to add learning area");
      }
    } catch (err) {
      alert(err.message || "An error occurred while adding learning area");
      console.error("Error adding learning area:", err);
    }
  };

  // Handle update learning area
  const handleUpdateLearningArea = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Learning area name is required");
        return;
      }

      const response = await updateLearningArea(
        selectedLearningArea.id,
        formData
      );
      if (response.success) {
        setIsEditDialogOpen(false);
        resetForm();
        setSelectedLearningArea(null);
        fetchLearningAreas(); // Refresh the list
        alert("Learning area updated successfully!");
      } else {
        alert(response.message || "Failed to update learning area");
      }
    } catch (err) {
      alert(err.message || "An error occurred while updating learning area");
      console.error("Error updating learning area:", err);
    }
  };

  // Handle delete learning area
  const handleDeleteLearningArea = async () => {
    try {
      // Debug: Check token before making request
      const token = localStorage.getItem("lrms-token");
      console.log(
        "🔍 [Delete Handler] Token check:",
        token ? "Token exists" : "No token found"
      );
      console.log(
        "🔍 [Delete Handler] Token value:",
        token ? token.substring(0, 20) + "..." : "N/A"
      );
      console.log(
        "🔍 [Delete Handler] All localStorage keys:",
        Object.keys(localStorage)
      );

      const response = await deleteLearningArea(selectedLearningArea.id);
      if (response.success) {
        setIsDeleteDialogOpen(false);
        setSelectedLearningArea(null);
        fetchLearningAreas(); // Refresh the list
        alert("Learning area deleted successfully!");
      } else {
        alert(response.message || "Failed to delete learning area");
      }
    } catch (err) {
      console.error("❌ [Delete Handler] Error details:", err);
      console.error("❌ [Delete Handler] Error response:", err.response?.data);
      alert(err.message || "An error occurred while deleting learning area");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading learning areas...</div>
      </div>
    );
  }

  if (error && learningAreas.length === 0) {
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
            Learning Areas Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage learning areas and descriptions
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Learning Area
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search learning areas..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-
          {Math.min(endIndex, filteredLearningAreas.length)} of{" "}
          {filteredLearningAreas.length} learning area(s)
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
            {currentLearningAreas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  No learning areas found
                </TableCell>
              </TableRow>
            ) : (
              currentLearningAreas.map((learningArea) => (
                <TableRow key={learningArea.id}>
                  <TableCell className="font-medium">
                    {learningArea.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {learningArea.name}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {learningArea.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(learningArea)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(learningArea)}
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
            <DialogTitle>Add New Learning Area</DialogTitle>
            <DialogDescription>
              Enter the learning area details below. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Learning Area Name *
              </label>
              <Input
                placeholder="e.g., Mathematics"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="e.g., Mathematics learning area"
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
            <Button onClick={handleAddLearningArea}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Learning Area</DialogTitle>
            <DialogDescription>
              Update the learning area details below. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Learning Area Name *
              </label>
              <Input
                placeholder="e.g., Mathematics"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="e.g., Mathematics learning area"
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
            <Button onClick={handleUpdateLearningArea}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        message={`Are you sure you want to delete the learning area "${selectedLearningArea?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteLearningArea}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedLearningArea(null);
        }}
      />
    </div>
  );
};

export default LearningAreasManagement;
