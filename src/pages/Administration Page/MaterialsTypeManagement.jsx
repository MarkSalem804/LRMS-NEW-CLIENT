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
  getAllTypes,
  addType,
  updateType,
  deleteType,
} from "../../services/lrms-endpoints";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import ConfirmationDialog from "../../components/modals/ConfirmationDialog";

const MaterialsTypeManagement = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Fetch types
  const fetchTypes = async () => {
    try {
      setLoading(true);
      const response = await getAllTypes();
      if (response.success) {
        setTypes(response.data || []);
      } else {
        setError(response.message || "Failed to fetch material types");
      }
    } catch (err) {
      setError(
        err.message || "An error occurred while fetching material types"
      );
      console.error("Error fetching material types:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // Filter types based on search term
  const filteredTypes = types.filter(
    (type) =>
      type.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTypes = filteredTypes.slice(startIndex, endIndex);

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
  const handleEditClick = (type) => {
    setSelectedType(type);
    setFormData({
      name: type.name || "",
      description: type.description || "",
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (type) => {
    setSelectedType(type);
    setIsDeleteDialogOpen(true);
  };

  // Handle add type
  const handleAddType = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Material type name is required");
        return;
      }

      const response = await addType(formData);
      if (response.success) {
        setIsAddDialogOpen(false);
        resetForm();
        fetchTypes();
        // Dispatch custom event to notify sidebar
        window.dispatchEvent(new CustomEvent("materialTypesChanged"));
        alert("Material type added successfully!");
      } else {
        alert(response.message || "Failed to add material type");
      }
    } catch (err) {
      alert(err.message || "An error occurred while adding material type");
      console.error("Error adding material type:", err);
    }
  };

  // Handle update type
  const handleUpdateType = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Material type name is required");
        return;
      }

      const response = await updateType(selectedType.id, formData);
      if (response.success) {
        setIsEditDialogOpen(false);
        resetForm();
        setSelectedType(null);
        fetchTypes();
        // Dispatch custom event to notify sidebar
        window.dispatchEvent(new CustomEvent("materialTypesChanged"));
        alert("Material type updated successfully!");
      } else {
        alert(response.message || "Failed to update material type");
      }
    } catch (err) {
      alert(err.message || "An error occurred while updating material type");
      console.error("Error updating material type:", err);
    }
  };

  // Handle delete type
  const handleDeleteType = async () => {
    try {
      const response = await deleteType(selectedType.id);
      if (response.success) {
        setIsDeleteDialogOpen(false);
        setSelectedType(null);
        fetchTypes();
        // Dispatch custom event to notify sidebar
        window.dispatchEvent(new CustomEvent("materialTypesChanged"));
        alert("Material type deleted successfully!");
      } else {
        alert(response.message || "Failed to delete material type");
      }
    } catch (err) {
      alert(err.message || "An error occurred while deleting material type");
      console.error("Error deleting material type:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading material types...</div>
      </div>
    );
  }

  if (error && types.length === 0) {
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
            Materials Type Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage material types and descriptions
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Material Type
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search material types..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredTypes.length)} of{" "}
          {filteredTypes.length} material type(s)
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
            {currentTypes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  No material types found
                </TableCell>
              </TableRow>
            ) : (
              currentTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.id}</TableCell>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell className="text-gray-600">
                    {type.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(type)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(type)}
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
            <DialogTitle>Add New Material Type</DialogTitle>
            <DialogDescription>
              Enter the material type details below. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                placeholder="Enter material type name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Enter material type description (optional)"
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
            <Button onClick={handleAddType}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Material Type</DialogTitle>
            <DialogDescription>
              Update the material type details below. Click save when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                placeholder="Enter material type name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Enter material type description (optional)"
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
            <Button onClick={handleUpdateType}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedType(null);
        }}
        onConfirm={handleDeleteType}
        title="Delete Material Type"
        message={`Are you sure you want to delete "${selectedType?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default MaterialsTypeManagement;
