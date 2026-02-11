// Employee List Component
// Displays list of employees with edit and delete functionality
// Includes confirmation dialog for delete operations

import axios from "axios";
import { useState } from "react";

// Get API URL from environment variables
const API = import.meta.env.VITE_API_URL;

// EmployeeList component
// Props:
//   - employees: array of employee data to display
//   - refresh: function to refresh employee list after delete
//   - onEdit: function called when edit button is clicked
//   - showToast: function to display notifications
export default function EmployeeList({ employees, refresh, onEdit, showToast }) {
  // State to track which employee ID is awaiting deletion confirmation
  const [confirming, setConfirming] = useState(null);

  // Delete employee and refresh list
  const confirmDelete = async (emp_id) => {
    try {
      // Send delete request to API
      await axios.delete(`${API}/api/employees/${emp_id}`);
      // Show success message
      showToast?.("Altairian deleted successfully", "success");
      // Clear the confirmation state
      setConfirming(null);
      // Refresh the employee list
      refresh();
    } catch (err) {
      // Log error for debugging
      console.error("Delete error:", err);
      // Show error message
      showToast?.(err?.response?.data?.message || "Delete failed", "error");
    }
  };

  // Show empty state if no employees exist
  if (!employees || employees.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
        No Altairian yet. Add someone using the form.
      </div>
    );
  }

  // Render list of employees
  return (
    <div className="space-y-3">
      {/* Map through employees array and render each employee */}
      {employees.map(emp => (
        <div key={emp.id}>
          {/* Employee Card Container */}
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            {/* Employee Info Section */}
            <div className="flex items-center space-x-4">
              {/* Employee Avatar with initials */}
              <div className="flex items-center justify-center w-12 h-14 rounded-full bg-purple-50 text-purple-600 font-semibold">
                {emp.name ? emp.name.charAt(0).toUpperCase() : "E"}
              </div>

              {/* Employee Details */}
              <div>
                {/* Name and ID */}
                {/* Name and ID */}
                <p className="font-medium text-gray-900">{emp.name} <span className="text-sm text-gray-500">({emp.emp_id})</span></p>
                {/* Email and Department */}
                <p className="text-sm text-gray-500">{emp.email} · {emp.department}</p>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="flex items-center space-x-3">
              {/* Salary Display */}
              <div className="text-sm text-gray-700 font-medium">₹{emp.salary}</div>

              {/* Edit Button */}
              <button
                onClick={() => onEdit(emp)}
                className="text-sm bg-white border border-gray-200 px-3 py-1 rounded-md text-purple-600 hover:bg-purple-50"
              >
                Edit
              </button>

              {/* Delete/Confirm Delete Buttons */}
              {confirming === emp.emp_id ? (
                // Confirmation state - show Delete and Cancel buttons
                <div className="flex items-center space-x-2">
                  {/* Confirm Delete Button */}
                  <button
                    onClick={() => confirmDelete(emp.emp_id)}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                  {/* Cancel Button */}
                  <button
                    onClick={() => setConfirming(null)}
                    className="text-sm bg-gray-100 border border-gray-200 px-3 py-1 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                // Initial delete button - triggers confirmation state
                <button
                  onClick={() => setConfirming(emp.emp_id)}
                  className="text-sm bg-red-50 border border-red-100 px-3 py-1 rounded-md text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
