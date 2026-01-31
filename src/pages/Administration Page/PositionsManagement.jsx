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
  getAllPositions,
  addPosition,
  updatePosition,
  deletePosition,
} from "../../services/lrms-endpoints";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import ConfirmationDialog from "../../components/modals/ConfirmationDialog";

const PositionsManagement = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Fetch positions
  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await getAllPositions();
      if (response.success) {
        setPositions(response.data || []);
      } else {
        setError(response.message || "Failed to fetch positions");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching positions");
      console.error("Error fetching positions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  // Filter positions based on search term
  const filteredPositions = positions.filter(
    (position) =>
      position.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredPositions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPositions = filteredPositions.slice(startIndex, endIndex);

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
  const handleEditClick = (position) => {
    setSelectedPosition(position);
    setFormData({
      name: position.name || "",
      description: position.description || "",
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (position) => {
    setSelectedPosition(position);
    setIsDeleteDialogOpen(true);
  };

  // Handle add position
  const handleAddPosition = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Position name is required");
        return;
      }

      const response = await addPosition(formData);
      if (response.success) {
        setIsAddDialogOpen(false);
        resetForm();
        fetchPositions(); // Refresh the list
        alert("Position added successfully!");
      } else {
        alert(response.message || "Failed to add position");
      }
    } catch (err) {
      alert(err.message || "An error occurred while adding position");
      console.error("Error adding position:", err);
    }
  };

  // Handle update position
  const handleUpdatePosition = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Position name is required");
        return;
      }

      const response = await updatePosition(selectedPosition.id, formData);
      if (response.success) {
        setIsEditDialogOpen(false);
        resetForm();
        setSelectedPosition(null);
        fetchPositions(); // Refresh the list
        alert("Position updated successfully!");
      } else {
        alert(response.message || "Failed to update position");
      }
    } catch (err) {
      alert(err.message || "An error occurred while updating position");
      console.error("Error updating position:", err);
    }
  };

  // Handle delete position
  const handleDeletePosition = async () => {
    try {
      // Debug: Check token before making request
      const token = localStorage.getItem("lrms-token");
      console.log(
        "🔍 [Delete Position Handler] Token check:",
        token ? "Token exists" : "No token found"
      );
      console.log(
        "🔍 [Delete Position Handler] Token value:",
        token ? token.substring(0, 20) + "..." : "N/A"
      );
      console.log(
        "🔍 [Delete Position Handler] All localStorage keys:",
        Object.keys(localStorage)
      );

      if (!token) {
        alert("No authentication token found. Please log in again.");
        return;
      }

      const response = await deletePosition(selectedPosition.id);
      if (response.success) {
        setIsDeleteDialogOpen(false);
        setSelectedPosition(null);
        fetchPositions(); // Refresh the list
        alert("Position deleted successfully!");
      } else {
        alert(response.message || "Failed to delete position");
      }
    } catch (err) {
      console.error("❌ [Delete Position Handler] Error details:", err);
      console.error(
        "❌ [Delete Position Handler] Error response:",
        err.response?.data
      );
      alert(err.message || "An error occurred while deleting position");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading positions...</div>
      </div>
    );
  }

  if (error && positions.length === 0) {
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
            Positions Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage position titles and descriptions
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Position
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search positions..."
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
          {Math.min(endIndex, filteredPositions.length)} of{" "}
          {filteredPositions.length} position(s)
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
            {currentPositions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  No positions found
                </TableCell>
              </TableRow>
            ) : (
              currentPositions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell className="font-medium">{position.id}</TableCell>
                  <TableCell className="font-medium">{position.name}</TableCell>
                  <TableCell className="text-gray-600">
                    {position.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(position)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(position)}
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
            <DialogTitle>Add New Position</DialogTitle>
            <DialogDescription>
              Enter the position details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Position Name *</label>
              <Input
                placeholder="e.g., Principal"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="e.g., School Principal"
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
            <Button onClick={handleAddPosition}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Position</DialogTitle>
            <DialogDescription>
              Update the position details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Position Name *</label>
              <Input
                placeholder="e.g., Principal"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="e.g., School Principal"
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
            <Button onClick={handleUpdatePosition}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        message={`Are you sure you want to delete the position "${selectedPosition?.name}"? This action cannot be undone.`}
        onConfirm={handleDeletePosition}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedPosition(null);
        }}
      />
    </div>
  );
};

export default PositionsManagement;
