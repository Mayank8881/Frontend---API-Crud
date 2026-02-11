import axios from "axios";
import { toast } from "react-hot-toast";
const API = import.meta.env.VITE_API_URL;

export default function EmployeeList({ employees, refresh, onEdit, showToast }) {

  const remove = (emp_id) => {
    toast((t) => (
      <div className="bg-white p-3 rounded shadow flex items-center space-x-4">
        <div className="flex-1">Are you sure you want to delete this employee?</div>
        <div className="flex-shrink-0 flex space-x-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                // await axios.delete(`http://localhost:5000/api/employees/${empId}`);
                await axios.delete(`${API}/api/employees/${emp_id}`);
                showToast?.("Employee deleted successfully", "success");
                refresh();
              } catch (err) {
                console.error("Delete error:", err);
                showToast?.(err?.response?.data?.message || "Delete failed", "error");
              }
            }}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 8000 });
  };

  return (
    <div>
      {employees.map(emp => (
        <div
          key={emp.id}
          className="flex justify-between items-center bg-white p-3 mb-2 rounded shadow"
        >
          <div>
            <p className="font-bold">
              {emp.name} ({emp.emp_id})
            </p>
            <p className="text-sm text-gray-600">
              {emp.email} | {emp.department} | ₹{emp.salary}
            </p>
          </div>

          <div className="space-x-2">
            <button
              onClick={() => onEdit(emp)}
              className="text-blue-600 font-semibold"
            >
              Edit
            </button>

            <button
              onClick={() => remove(emp.emp_id)}
              className="text-red-600 font-semibold"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
