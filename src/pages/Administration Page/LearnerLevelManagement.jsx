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
  getAllGradeLevels,
  addGradeLevel,
  updateGradeLevel,
  deleteGradeLevel,
} from "../../services/lrms-endpoints";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import ConfirmationDialog from "../../components/modals/ConfirmationDialog";

const LearnerLevelManagement = () => {
  const [gradeLevels, setGradeLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Fetch grade levels
  const fetchGradeLevels = async () => {
    try {
      setLoading(true);
      const response = await getAllGradeLevels();
      if (response.success) {
        setGradeLevels(response.data || []);
      } else {
        setError(response.message || "Failed to fetch grade levels");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching grade levels");
      console.error("Error fetching grade levels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGradeLevels();
  }, []);

  // Filter grade levels based on search term
  const filteredGradeLevels = gradeLevels.filter(
    (gradeLevel) =>
      gradeLevel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gradeLevel.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredGradeLevels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGradeLevels = filteredGradeLevels.slice(startIndex, endIndex);

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
  const handleEditClick = (gradeLevel) => {
    setSelectedGradeLevel(gradeLevel);
    setFormData({
      name: gradeLevel.name || "",
      description: gradeLevel.description || "",
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (gradeLevel) => {
    setSelectedGradeLevel(gradeLevel);
    setIsDeleteDialogOpen(true);
  };

  // Handle add grade level
  const handleAddGradeLevel = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Grade level name is required");
        return;
      }

      const response = await addGradeLevel(formData);
      if (response.success) {
        setIsAddDialogOpen(false);
        resetForm();
        fetchGradeLevels(); // Refresh the list
        alert("Grade level added successfully!");
      } else {
        alert(response.message || "Failed to add grade level");
      }
    } catch (err) {
      alert(err.message || "An error occurred while adding grade level");
      console.error("Error adding grade level:", err);
    }
  };

  // Handle update grade level
  const handleUpdateGradeLevel = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Grade level name is required");
        return;
      }

      const response = await updateGradeLevel(selectedGradeLevel.id, formData);
      if (response.success) {
        setIsEditDialogOpen(false);
        resetForm();
        setSelectedGradeLevel(null);
        fetchGradeLevels(); // Refresh the list
        alert("Grade level updated successfully!");
      } else {
        alert(response.message || "Failed to update grade level");
      }
    } catch (err) {
      alert(err.message || "An error occurred while updating grade level");
      console.error("Error updating grade level:", err);
    }
  };

  // Handle delete grade level
  const handleDeleteGradeLevel = async () => {
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

      const response = await deleteGradeLevel(selectedGradeLevel.id);
      if (response.success) {
        setIsDeleteDialogOpen(false);
        setSelectedGradeLevel(null);
        fetchGradeLevels(); // Refresh the list
        alert("Grade level deleted successfully!");
      } else {
        alert(response.message || "Failed to delete grade level");
      }
    } catch (err) {
      console.error("❌ [Delete Handler] Error details:", err);
      console.error("❌ [Delete Handler] Error response:", err.response?.data);
      alert(err.message || "An error occurred while deleting grade level");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading grade levels...</div>
      </div>
    );
  }

  if (error && gradeLevels.length === 0) {
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
            Learner Level Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage learner levels and descriptions
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Learner Level
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search learner levels..."
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
          {Math.min(endIndex, filteredGradeLevels.length)} of{" "}
          {filteredGradeLevels.length} level(s)
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
            {currentGradeLevels.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  No learner levels found
                </TableCell>
              </TableRow>
            ) : (
              currentGradeLevels.map((gradeLevel) => (
                <TableRow key={gradeLevel.id}>
                  <TableCell className="font-medium">{gradeLevel.id}</TableCell>
                  <TableCell className="font-medium">
                    {gradeLevel.name || "-"}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {gradeLevel.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(gradeLevel)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(gradeLevel)}
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
            <DialogTitle>Add New Learner Level</DialogTitle>
            <DialogDescription>
              Enter the learner level details below. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Learner Level Name *
              </label>
              <Input
                placeholder="e.g., Grade 1"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="e.g., First grade level"
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
            <Button onClick={handleAddGradeLevel}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Learner Level</DialogTitle>
            <DialogDescription>
              Update the learner level details below. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Learner Level Name *
              </label>
              <Input
                placeholder="e.g., Grade 1"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="e.g., First grade level"
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
            <Button onClick={handleUpdateGradeLevel}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        message={`Are you sure you want to delete the learner level "${
          selectedGradeLevel?.name || "this item"
        }"? This action cannot be undone.`}
        onConfirm={handleDeleteGradeLevel}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedGradeLevel(null);
        }}
      />
    </div>
  );
};

export default LearnerLevelManagement;
