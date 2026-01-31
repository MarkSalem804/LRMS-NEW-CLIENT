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
  getAllOffices,
  addOffice,
  updateOffice,
  deleteOffice,
} from "../../services/lrms-endpoints";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import ConfirmationDialog from "../../components/modals/ConfirmationDialog";
import { toast } from "sonner";

const OfficesManagement = () => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Fetch offices
  const fetchOffices = async () => {
    try {
      setLoading(true);
      const response = await getAllOffices();
      if (response.success) {
        setOffices(response.data || []);
      } else {
        setError(response.message || "Failed to fetch offices");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching offices");
      console.error("Error fetching offices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  // Filter offices based on search term
  const filteredOffices = offices.filter(
    (office) =>
      office.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      office.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredOffices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOffices = filteredOffices.slice(startIndex, endIndex);

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
  const handleEditClick = (office) => {
    setSelectedOffice(office);
    setFormData({
      name: office.name || "",
      description: office.description || "",
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (office) => {
    setSelectedOffice(office);
    setIsDeleteDialogOpen(true);
  };

  // Handle add office
  const handleAddOffice = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Office name is required");
        return;
      }

      const response = await addOffice(formData);
      if (response.success) {
        setIsAddDialogOpen(false);
        resetForm();
        fetchOffices(); // Refresh the list
        toast.success("Office added successfully!");
      } else {
        toast.error(response.message || "Failed to add office");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while adding office");
      console.error("Error adding office:", err);
    }
  };

  // Handle update office
  const handleUpdateOffice = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Office name is required");
        return;
      }

      const response = await updateOffice(selectedOffice.id, formData);
      if (response.success) {
        setIsEditDialogOpen(false);
        resetForm();
        setSelectedOffice(null);
        fetchOffices(); // Refresh the list
        toast.success("Office updated successfully!");
      } else {
        toast.error(response.message || "Failed to update office");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while updating office");
      console.error("Error updating office:", err);
    }
  };

  // Handle delete office
  const handleDeleteOffice = async () => {
    try {
      // Debug: Check token before making request
      const token = localStorage.getItem("lrms-token");
      console.log(
        "🔍 [Delete Office Handler] Token check:",
        token ? "Token exists" : "No token found"
      );
      console.log(
        "🔍 [Delete Office Handler] Token value:",
        token ? token.substring(0, 20) + "..." : "N/A"
      );
      console.log(
        "🔍 [Delete Office Handler] All localStorage keys:",
        Object.keys(localStorage)
      );

      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        return;
      }

      const response = await deleteOffice(selectedOffice.id);
      if (response.success) {
        setIsDeleteDialogOpen(false);
        setSelectedOffice(null);
        fetchOffices(); // Refresh the list
        toast.success("Office deleted successfully!");
      } else {
        toast.error(response.message || "Failed to delete office");
      }
    } catch (err) {
      console.error("❌ [Delete Office Handler] Error details:", err);
      console.error(
        "❌ [Delete Office Handler] Error response:",
        err.response?.data
      );
      toast.error(err.message || "An error occurred while deleting office");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading offices...</div>
      </div>
    );
  }

  if (error && offices.length === 0) {
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
            Offices Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage offices and descriptions
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Office
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search offices..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredOffices.length)}{" "}
          of {filteredOffices.length} office(s)
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
            {currentOffices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  No offices found
                </TableCell>
              </TableRow>
            ) : (
              currentOffices.map((office) => (
                <TableRow key={office.id}>
                  <TableCell className="font-medium">{office.id}</TableCell>
                  <TableCell className="font-medium">{office.name}</TableCell>
                  <TableCell className="text-gray-600">
                    {office.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(office)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(office)}
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
            <DialogTitle>Add New Office</DialogTitle>
            <DialogDescription>
              Enter the office details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Office Name *</label>
              <Input
                placeholder="e.g., Curriculum and Instruction"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="e.g., Office for Curriculum and Instruction"
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
            <Button onClick={handleAddOffice}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Office</DialogTitle>
            <DialogDescription>
              Update the office details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Office Name *</label>
              <Input
                placeholder="e.g., Curriculum and Instruction"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="e.g., Office for Curriculum and Instruction"
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
            <Button onClick={handleUpdateOffice}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        message={`Are you sure you want to delete the office "${selectedOffice?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteOffice}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedOffice(null);
        }}
      />
    </div>
  );
};

export default OfficesManagement;
