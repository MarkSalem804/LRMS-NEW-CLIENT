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
  getAllStrands,
  addStrand,
  updateStrand,
  deleteStrand,
  getAllTracks,
} from "../../services/lrms-endpoints";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import ConfirmationDialog from "../../components/modals/ConfirmationDialog";

const StrandsManagement = () => {
  const [strands, setStrands] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStrand, setSelectedStrand] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    trackId: "",
  });

  // Fetch strands and tracks
  const fetchStrands = async () => {
    try {
      setLoading(true);
      const response = await getAllStrands();
      if (response.success) {
        setStrands(response.data || []);
      } else {
        setError(response.message || "Failed to fetch strands");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching strands");
      console.error("Error fetching strands:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTracks = async () => {
    try {
      const response = await getAllTracks();
      if (response.success) {
        setTracks(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching tracks:", err);
    }
  };

  useEffect(() => {
    fetchStrands();
    fetchTracks();
  }, []);

  // Filter strands based on search term
  const filteredStrands = strands.filter(
    (strand) =>
      strand.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strand.track?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredStrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStrands = filteredStrands.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      trackId: "",
    });
  };

  // Open add dialog
  const handleAddClick = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  // Open edit dialog
  const handleEditClick = (strand) => {
    setSelectedStrand(strand);
    setFormData({
      name: strand.name || "",
      trackId: strand.trackId || "",
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (strand) => {
    setSelectedStrand(strand);
    setIsDeleteDialogOpen(true);
  };

  // Handle add strand
  const handleAddStrand = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Strand name is required");
        return;
      }

      const dataToSend = {
        name: formData.name,
        trackId: formData.trackId ? parseInt(formData.trackId) : null,
      };

      const response = await addStrand(dataToSend);
      if (response.success) {
        setIsAddDialogOpen(false);
        resetForm();
        fetchStrands();
        alert("Strand added successfully!");
      } else {
        alert(response.message || "Failed to add strand");
      }
    } catch (err) {
      alert(err.message || "An error occurred while adding strand");
      console.error("Error adding strand:", err);
    }
  };

  // Handle update strand
  const handleUpdateStrand = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Strand name is required");
        return;
      }

      const dataToSend = {
        name: formData.name,
        trackId: formData.trackId ? parseInt(formData.trackId) : null,
      };

      const response = await updateStrand(selectedStrand.id, dataToSend);
      if (response.success) {
        setIsEditDialogOpen(false);
        resetForm();
        setSelectedStrand(null);
        fetchStrands();
        alert("Strand updated successfully!");
      } else {
        alert(response.message || "Failed to update strand");
      }
    } catch (err) {
      alert(err.message || "An error occurred while updating strand");
      console.error("Error updating strand:", err);
    }
  };

  // Handle delete strand
  const handleDeleteStrand = async () => {
    try {
      const response = await deleteStrand(selectedStrand.id);
      if (response.success) {
        setIsDeleteDialogOpen(false);
        setSelectedStrand(null);
        fetchStrands();
        alert("Strand deleted successfully!");
      } else {
        alert(response.message || "Failed to delete strand");
      }
    } catch (err) {
      alert(err.message || "An error occurred while deleting strand");
      console.error("Error deleting strand:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading strands...</div>
      </div>
    );
  }

  if (error && strands.length === 0) {
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
            Strands Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage strands and their associated tracks
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Strand
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search strands..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredStrands.length)}{" "}
          of {filteredStrands.length} strand(s)
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Track</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentStrands.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  No strands found
                </TableCell>
              </TableRow>
            ) : (
              currentStrands.map((strand) => (
                <TableRow key={strand.id}>
                  <TableCell className="font-medium">{strand.id}</TableCell>
                  <TableCell className="font-medium">{strand.name}</TableCell>
                  <TableCell className="text-gray-600">
                    {strand.track?.name || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(strand)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(strand)}
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
            <DialogTitle>Add New Strand</DialogTitle>
            <DialogDescription>
              Enter the strand details below. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                placeholder="Enter strand name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Track</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.trackId}
                onChange={(e) =>
                  setFormData({ ...formData, trackId: e.target.value })
                }
              >
                <option value="">Select a track (optional)</option>
                {tracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStrand}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Strand</DialogTitle>
            <DialogDescription>
              Update the strand details below. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                placeholder="Enter strand name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Track</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.trackId}
                onChange={(e) =>
                  setFormData({ ...formData, trackId: e.target.value })
                }
              >
                <option value="">Select a track (optional)</option>
                {tracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStrand}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedStrand(null);
        }}
        onConfirm={handleDeleteStrand}
        title="Delete Strand"
        message={`Are you sure you want to delete "${selectedStrand?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default StrandsManagement;
