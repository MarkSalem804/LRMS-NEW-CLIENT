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
  getAllTracks,
  addTrack,
  updateTrack,
  deleteTrack,
} from "../../services/lrms-endpoints";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import ConfirmationDialog from "../../components/modals/ConfirmationDialog";

const TrackManagement = () => {
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
  const [selectedTrack, setSelectedTrack] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Fetch tracks
  const fetchTracks = async () => {
    try {
      setLoading(true);
      const response = await getAllTracks();
      if (response.success) {
        setTracks(response.data || []);
      } else {
        setError(response.message || "Failed to fetch tracks");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching tracks");
      console.error("Error fetching tracks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  // Filter tracks based on search term
  const filteredTracks = tracks.filter(
    (track) =>
      track.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredTracks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTracks = filteredTracks.slice(startIndex, endIndex);

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
  const handleEditClick = (track) => {
    setSelectedTrack(track);
    setFormData({
      name: track.name || "",
      description: track.description || "",
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (track) => {
    setSelectedTrack(track);
    setIsDeleteDialogOpen(true);
  };

  // Handle add track
  const handleAddTrack = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Track name is required");
        return;
      }

      const response = await addTrack(formData);
      if (response.success) {
        setIsAddDialogOpen(false);
        resetForm();
        fetchTracks();
        alert("Track added successfully!");
      } else {
        alert(response.message || "Failed to add track");
      }
    } catch (err) {
      alert(err.message || "An error occurred while adding track");
      console.error("Error adding track:", err);
    }
  };

  // Handle update track
  const handleUpdateTrack = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Track name is required");
        return;
      }

      const response = await updateTrack(selectedTrack.id, formData);
      if (response.success) {
        setIsEditDialogOpen(false);
        resetForm();
        setSelectedTrack(null);
        fetchTracks();
        alert("Track updated successfully!");
      } else {
        alert(response.message || "Failed to update track");
      }
    } catch (err) {
      alert(err.message || "An error occurred while updating track");
      console.error("Error updating track:", err);
    }
  };

  // Handle delete track
  const handleDeleteTrack = async () => {
    try {
      const response = await deleteTrack(selectedTrack.id);
      if (response.success) {
        setIsDeleteDialogOpen(false);
        setSelectedTrack(null);
        fetchTracks();
        alert("Track deleted successfully!");
      } else {
        alert(response.message || "Failed to delete track");
      }
    } catch (err) {
      alert(err.message || "An error occurred while deleting track");
      console.error("Error deleting track:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading tracks...</div>
      </div>
    );
  }

  if (error && tracks.length === 0) {
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
            Tracks Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage tracks and descriptions
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Track
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tracks..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredTracks.length)}{" "}
          of {filteredTracks.length} track(s)
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
            {currentTracks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  No tracks found
                </TableCell>
              </TableRow>
            ) : (
              currentTracks.map((track) => (
                <TableRow key={track.id}>
                  <TableCell className="font-medium">{track.id}</TableCell>
                  <TableCell className="font-medium">{track.name}</TableCell>
                  <TableCell className="text-gray-600">
                    {track.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(track)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(track)}
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
            <DialogTitle>Add New Track</DialogTitle>
            <DialogDescription>
              Enter the track details below. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                placeholder="Enter track name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Enter track description (optional)"
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
            <Button onClick={handleAddTrack}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Track</DialogTitle>
            <DialogDescription>
              Update the track details below. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                placeholder="Enter track name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Enter track description (optional)"
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
            <Button onClick={handleUpdateTrack}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedTrack(null);
        }}
        onConfirm={handleDeleteTrack}
        title="Delete Track"
        message={`Are you sure you want to delete "${selectedTrack?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default TrackManagement;
