import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import api from '../services/apiClient.js';

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    id: null,
    vehicleNumber: '',
    ownerName: '',
    capacityTon: '',
    ownerPhone: '',
    status: 'available',
    notes: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const VEHICLE_API = '/vehicles';

  const fetchVehicles = async () => {
    try {
      const res = await api.get(VEHICLE_API);
      setVehicles(res.data);
    } catch (err) {
      console.error('Error fetching vehicles:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.vehicleNumber) newErrors.vehicleNumber = 'Vehicle number is required.';
    if (!form.ownerName) newErrors.ownerName = 'Owner name is required.';
    if (!form.capacityTon) newErrors.capacityTon = 'Capacity is required.';
    if (form.capacityTon && form.capacityTon <= 0) newErrors.capacityTon = 'Capacity must be greater than 0.';
    if (!form.ownerPhone) newErrors.ownerPhone = 'Owner phone is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.post(VEHICLE_API, {
        vehicleNumber: form.vehicleNumber,
        ownerName: form.ownerName,
        capacityTon: parseFloat(form.capacityTon),
        ownerPhone: form.ownerPhone,
        status: form.status,
        notes: form.notes,
      });
      fetchVehicles();
      resetForm();
    } catch (err) {
      console.error('Error creating vehicle:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.put(`${VEHICLE_API}/${form.id}`, {
        vehicleNumber: form.vehicleNumber,
        ownerName: form.ownerName,
        capacityTon: parseFloat(form.capacityTon),
        ownerPhone: form.ownerPhone,
        status: form.status,
        notes: form.notes,
      });
      fetchVehicles();
      resetForm();
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating vehicle:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${VEHICLE_API}/${id}`);
      fetchVehicles();
    } catch (err) {
      console.error('Error deleting vehicle:', err.response?.data || err.message);
    }
  };

  const handleEdit = (vehicle) => {
    setForm({
      id: vehicle._id,
      vehicleNumber: vehicle.vehicleNumber,
      ownerName: vehicle.ownerName,
      capacityTon: vehicle.capacityTon,
      ownerPhone: vehicle.ownerPhone,
      status: vehicle.status,
      notes: vehicle.notes || '',
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setForm({
      id: null,
      vehicleNumber: '',
      ownerName: '',
      capacityTon: '',
      ownerPhone: '',
      status: 'available',
      notes: '',
    });
    setErrors({});
  };

  return (
    <div className="p-8 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Vehicle Management</h1>

      <form
        onSubmit={isEditing ? handleUpdate : handleCreate}
        className="bg-white p-6 shadow-lg rounded-lg mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
            <input
              type="text"
              name="vehicleNumber"
              value={form.vehicleNumber}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter vehicle number"
            />
            {errors.vehicleNumber && <span className="text-sm text-red-500">{errors.vehicleNumber}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Owner Name</label>
            <input
              type="text"
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter owner name"
            />
            {errors.ownerName && <span className="text-sm text-red-500">{errors.ownerName}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity (Ton)</label>
            <input
              type="number"
              name="capacityTon"
              value={form.capacityTon}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter capacity in tons"
              min="1"
            />
            {errors.capacityTon && <span className="text-sm text-red-500">{errors.capacityTon}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Owner Phone</label>
            <input
              type="text"
              name="ownerPhone"
              value={form.ownerPhone}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter owner phone"
            />
            {errors.ownerPhone && <span className="text-sm text-red-500">{errors.ownerPhone}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
            >
              <option value="available">Available</option>
              <option value="in-use">In-use</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="3"
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
              placeholder="Additional notes"
            ></textarea>
          </div>
        </div>

        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? 'Processing...' : isEditing ? 'Update Vehicle' : 'Add Vehicle'}
        </Button>
      </form>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-gray-700">Vehicle Number</th>
              <th className="py-3 px-4 text-left text-gray-700">Owner</th>
              <th className="py-3 px-4 text-left text-gray-700">Capacity (Ton)</th>
              <th className="py-3 px-4 text-left text-gray-700">Phone</th>
              <th className="py-3 px-4 text-left text-gray-700">Status</th>
              <th className="py-3 px-4 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle._id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{vehicle.vehicleNumber}</td>
                <td className="py-3 px-4">{vehicle.ownerName}</td>
                <td className="py-3 px-4">{vehicle.capacityTon}</td>
                <td className="py-3 px-4">{vehicle.ownerPhone}</td>
                <td className="py-3 px-4 capitalize">{vehicle.status}</td>
                <td className="py-3 px-4 flex gap-4">
                  <button onClick={() => handleEdit(vehicle)} className="text-blue-600 hover:text-blue-800">
                    <Pencil size={20} />
                  </button>
                  <button onClick={() => handleDelete(vehicle._id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No vehicles available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
