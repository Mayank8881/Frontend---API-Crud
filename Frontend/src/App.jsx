// App Component
// Main dashboard component for employee management system
// Displays dashboard statistics and manages employee CRUD operations

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import { Toaster, toast } from "react-hot-toast";

// Get API URL from environment variables
const API = import.meta.env.VITE_API_URL;

function App() {
  // State for storing all employees data
  const [employees, setEmployees] = useState([]);
  // State for tracking the currently selected employee for editing
  const [selected, setSelected] = useState(null);

  // Memoized function to show toast notifications
  const showToast = useCallback((message, type = "success") => {
    if (type === "error") toast.error(message);
    else toast.success(message);
  }, []);


  // Fetch all employees from the API
  const fetchEmployees = async () => {
    // Call the backend API to get the list of employees
    const res = await axios.get(`${API}/api/employees`);
    // Update state with the fetched employees data
    setEmployees(res.data);
  };


  // Calculate dashboard statistics from employees data
  // Total number of employees
  const totalEmployees = employees.length;
  // Average salary across all employees
  const avgSalary = employees.length ? Math.round(employees.reduce((s, e) => s + Number(e.salary || 0), 0) / employees.length) : 0;
  // Count of unique departments
  const departmentsCount = new Set(employees.map((e) => e.department)).size;


  // Fetch employees data when component mounts
  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section - Title and Welcome */}
        <header className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-purple-800">Altairian Dashboard</h1>
              <p className="text-sm text-purple-600">Overview and management</p>
            </div>

            <div className="hidden sm:flex items-center space-x-4">
              <div className="text-sm text-purple-600">Welcome</div>
            </div>
          </div>

          {/* Dashboard Statistics Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Employees Card */}
            <div className="bg-white p-4 rounded-lg shadow flex flex-col">
              <div className="text-sm text-purple-600">Total Altairian</div>
              <div className="mt-2 text-2xl font-bold text-gray-900">{totalEmployees}</div>
            </div>

            {/* Average Salary Card */}
            <div className="bg-white p-4 rounded-lg shadow flex flex-col">
              <div className="text-sm text-purple-600">Average Salary</div>
              <div className="mt-2 text-2xl font-bold text-gray-900">₹{avgSalary}</div>
            </div>

            {/* Departments Count Card */}
            <div className="bg-white p-4 rounded-lg shadow flex flex-col">
              <div className="text-sm text-purple-600">Departments</div>
              <div className="mt-2 text-2xl font-bold text-gray-900">{departmentsCount}</div>
            </div>
          </div>
        </header>

        {/* Main Content - Form and Employee List */}
        <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Employee Form */}
          <div className="lg:col-span-2">
            <EmployeeForm
              refresh={fetchEmployees}
              selected={selected}
              clearSelected={() => setSelected(null)}
              showToast={showToast}
            />
          </div>

          {/* Right Column - Employee List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-4">
              {/* List Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Altairian</h3>
                <div className="text-sm text-purple-600">{employees.length} results</div>
              </div>

              {/* Scrollable Employee List */}
              <div className="overflow-y-auto max-h-64 pr-2">
                <EmployeeList
                  employees={employees}
                  refresh={fetchEmployees}
                  onEdit={(emp) => setSelected(emp)}
                  showToast={showToast}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Toast Notifications Container */}
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
}

// Export the App component as default
export default App;
