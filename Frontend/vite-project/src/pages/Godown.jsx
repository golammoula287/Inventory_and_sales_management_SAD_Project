import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Button from "../components/Button";
import api from "../services/apiClient.js";

export default function GodownPage() {
  const [godowns, setGodowns] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [form, setForm] = useState({
    id: null,
    godownId: "",
    location: "",
    capacity: "",
    availableSpace: "",
    managerName: "",
    managerPhone: "",
    notes: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const GODOWN_API = "/godowns";

  /** Fetch Godowns */
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const res = await api.get(GODOWN_API);
      setGodowns(res.data || []);
    } catch (err) {
      console.error("Error fetching godowns:", err.response?.data || err.message);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /** Handle input change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /** Validate form */
  const validateForm = () => {
    const newErrors = {};
    if (!form.godownId) newErrors.godownId = "Godown ID is required.";
    if (!form.location) newErrors.location = "Location is required.";
    if (!form.capacity) newErrors.capacity = "Capacity is required.";
    if (!form.availableSpace) newErrors.availableSpace = "Available space is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Create Godown */
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.post(GODOWN_API, {
        godownId: form.godownId,
        location: form.location,
        capacity: parseFloat(form.capacity),
        availableSpace: parseFloat(form.availableSpace),
        managerName: form.managerName,
        managerPhone: form.managerPhone,
        notes: form.notes,
      });
      fetchData();
      resetForm();
    } catch (err) {
      console.error("Error creating godown:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Update Godown */
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.put(`${GODOWN_API}/${form.id}`, {
        godownId: form.godownId,
        location: form.location,
        capacity: parseFloat(form.capacity),
        availableSpace: parseFloat(form.availableSpace),
        managerName: form.managerName,
        managerPhone: form.managerPhone,
        notes: form.notes,
      });
      fetchData();
      resetForm();
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating godown:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Delete Godown */
  const handleDelete = async (id) => {
    try {
      await api.delete(`${GODOWN_API}/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting godown:", err.response?.data || err.message);
    }
  };

  /** Edit Godown */
  const handleEdit = (godown) => {
    setForm({
      id: godown._id,
      godownId: godown.godownId,
      location: godown.location,
      capacity: godown.capacity,
      availableSpace: godown.availableSpace,
      managerName: godown.managerName || "",
      managerPhone: godown.managerPhone || "",
      notes: godown.notes || "",
    });
    setIsEditing(true);
  };

  /** Reset Form */
  const resetForm = () => {
    setForm({
      id: null,
      godownId: "",
      location: "",
      capacity: "",
      availableSpace: "",
      managerName: "",
      managerPhone: "",
      notes: "",
    });
    setErrors({});
  };

  return (
    <div className="p-8 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Godown Management</h1>

      {loadingData ? (
        <div className="text-center text-gray-500 py-6">Loading data...</div>
      ) : (
        <>
          <form
            onSubmit={isEditing ? handleUpdate : handleCreate}
            className="bg-white p-6 shadow-lg rounded-lg mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Godown ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Godown ID</label>
                <input
                  type="text"
                  name="godownId"
                  value={form.godownId}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Enter Godown Code"
                />
                {errors.godownId && <span className="text-sm text-red-500">{errors.godownId}</span>}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Enter location"
                />
                {errors.location && <span className="text-sm text-red-500">{errors.location}</span>}
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Enter total capacity"
                />
                {errors.capacity && <span className="text-sm text-red-500">{errors.capacity}</span>}
              </div>

              {/* Available Space */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Available Space</label>
                <input
                  type="number"
                  name="availableSpace"
                  value={form.availableSpace}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Enter available space"
                />
                {errors.availableSpace && <span className="text-sm text-red-500">{errors.availableSpace}</span>}
              </div>

              {/* Manager Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Manager Name</label>
                <input
                  type="text"
                  name="managerName"
                  value={form.managerName}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Enter manager name"
                />
              </div>

              {/* Manager Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Manager Phone</label>
                <input
                  type="text"
                  name="managerPhone"
                  value={form.managerPhone}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Enter manager phone"
                />
              </div>

              {/* Notes */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                  placeholder="Additional notes"
                  rows={3}
                ></textarea>
              </div>
            </div>

            <Button type="submit" className="mt-6 w-full" disabled={loading}>
              {loading ? "Processing..." : isEditing ? "Update Godown" : "Add Godown"}
            </Button>
          </form>

          {/* Table */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4">Godown ID</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Available</th>
                  <th className="py-3 px-4">Manager</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {godowns.map((godown) => (
                  <tr key={godown._id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{godown.godownId}</td>
                    <td className="py-3 px-4">{godown.location}</td>
                    <td className="py-3 px-4">{godown.capacity}</td>
                    <td className="py-3 px-4">{godown.availableSpace}</td>
                    <td className="py-3 px-4">{godown.managerName || "—"}</td>
                    <td className="py-3 px-4">{godown.managerPhone || "—"}</td>
                    <td className="py-3 px-4 flex gap-4">
                      <button onClick={() => handleEdit(godown)} className="text-blue-600 hover:text-blue-800">
                        <Pencil size={20} />
                      </button>
                      <button onClick={() => handleDelete(godown._id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
                {godowns.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No godowns available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
