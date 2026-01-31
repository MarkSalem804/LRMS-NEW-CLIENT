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
  getAllComponents,
  addComponent,
  updateComponent,
  deleteComponent,
} from "../../services/lrms-endpoints";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import ConfirmationDialog from "../../components/modals/ConfirmationDialog";
import { toast } from "sonner";

const ComponentsManagement = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Fetch components
  const fetchComponents = async () => {
    try {
      setLoading(true);
      const response = await getAllComponents();
      if (response.success) {
        setComponents(response.data || []);
      } else {
        setError(response.message || "Failed to fetch components");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching components");
      console.error("Error fetching components:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  // Filter components based on search term
  const filteredComponents = components.filter(
    (component) =>
      component.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredComponents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComponents = filteredComponents.slice(startIndex, endIndex);

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
  const handleEditClick = (component) => {
    setSelectedComponent(component);
    setFormData({
      name: component.name || "",
      description: component.description || "",
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (component) => {
    setSelectedComponent(component);
    setIsDeleteDialogOpen(true);
  };

  // Handle add component
  const handleAddComponent = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Component name is required");
        return;
      }

      const response = await addComponent(formData);
      if (response.success) {
        setIsAddDialogOpen(false);
        resetForm();
        fetchComponents();
        toast.success("Component added successfully!");
      } else {
        toast.error(response.message || "Failed to add component");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while adding component");
      console.error("Error adding component:", err);
    }
  };

  // Handle update component
  const handleUpdateComponent = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Component name is required");
        return;
      }

      const response = await updateComponent(selectedComponent.id, formData);
      if (response.success) {
        setIsEditDialogOpen(false);
        resetForm();
        setSelectedComponent(null);
        fetchComponents();
        toast.success("Component updated successfully!");
      } else {
        toast.error(response.message || "Failed to update component");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while updating component");
      console.error("Error updating component:", err);
    }
  };

  // Handle delete component
  const handleDeleteComponent = async () => {
    try {
      const response = await deleteComponent(selectedComponent.id);
      if (response.success) {
        setIsDeleteDialogOpen(false);
        setSelectedComponent(null);
        fetchComponents();
        toast.success("Component deleted successfully!");
      } else {
        toast.error(response.message || "Failed to delete component");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while deleting component");
      console.error("Error deleting component:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading components...</div>
      </div>
    );
  }

  if (error && components.length === 0) {
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
            Components Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage components and descriptions
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Component
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search components..."
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
          {Math.min(endIndex, filteredComponents.length)} of{" "}
          {filteredComponents.length} component(s)
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
            {currentComponents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  No components found
                </TableCell>
              </TableRow>
            ) : (
              currentComponents.map((component) => (
                <TableRow key={component.id}>
                  <TableCell className="font-medium">{component.id}</TableCell>
                  <TableCell className="font-medium">
                    {component.name}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {component.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(component)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(component)}
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
            <DialogTitle>Add New Component</DialogTitle>
            <DialogDescription>
              Enter the component details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                placeholder="Enter component name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Enter component description (optional)"
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
            <Button onClick={handleAddComponent}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Component</DialogTitle>
            <DialogDescription>
              Update the component details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                placeholder="Enter component name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Enter component description (optional)"
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
            <Button onClick={handleUpdateComponent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedComponent(null);
        }}
        onConfirm={handleDeleteComponent}
        title="Delete Component"
        message={`Are you sure you want to delete "${selectedComponent?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ComponentsManagement;
