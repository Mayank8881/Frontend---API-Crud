import axios from "axios";
import { useState } from "react";
const API = import.meta.env.VITE_API_URL;

export default function EmployeeList({ employees, refresh, onEdit, showToast }) {
  const [confirming, setConfirming] = useState(null);

  const confirmDelete = async (emp_id) => {
    try {
      await axios.delete(`${API}/api/employees/${emp_id}`);
      showToast?.("Altairian deleted successfully", "success");
      setConfirming(null);
      refresh();
    } catch (err) {
      console.error("Delete error:", err);
      showToast?.(err?.response?.data?.message || "Delete failed", "error");
    }
  };

  if (!employees || employees.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
        No Altairian yet. Add someone using the form.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {employees.map(emp => (
        <div key={emp.id}>
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            < div className="flex items-center space-x-4" >
              <div className="flex items-center justify-center w-12 h-14 rounded-full bg-purple-50 text-purple-600 font-semibold">
                {emp.name ? emp.name.charAt(0).toUpperCase() : "E"}
              </div>

              <div>
                <p className="font-medium text-gray-900">{emp.name} <span className="text-sm text-gray-500">({emp.emp_id})</span></p>
                <p className="text-sm text-gray-500">{emp.email} · {emp.department}</p>
              </div>
            </div >

            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-700 font-medium">₹{emp.salary}</div>

              <button
                onClick={() => onEdit(emp)}
                className="text-sm bg-white border border-gray-200 px-3 py-1 rounded-md text-purple-600 hover:bg-purple-50"
              >
                Edit
              </button>

              {confirming === emp.emp_id ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => confirmDelete(emp.emp_id)}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setConfirming(null)}
                    className="text-sm bg-gray-100 border border-gray-200 px-3 py-1 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirming(emp.emp_id)}
                  className="text-sm bg-red-50 border border-red-100 px-3 py-1 rounded-md text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>
              )}
            </div>
          </div >
        </div >
      ))
      }
    </div >
  );
}
