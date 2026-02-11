import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import { Toaster, toast } from "react-hot-toast";
const API = import.meta.env.VITE_API_URL;

function App() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const showToast = useCallback((message, type = "success") => {
    if (type === "error") toast.error(message);
    else toast.success(message);
  }, []);

  const fetchEmployees = async () => {
    // const res = await axios.get("http://localhost:5000/api/employees");
    const res = await axios.get(`${API}/api/employees`);

    setEmployees(res.data);
  };

  // derived dashboard stats
  const totalEmployees = employees.length;
  const avgSalary = employees.length ? Math.round(employees.reduce((s, e) => s + Number(e.salary || 0), 0) / employees.length) : 0;
  const departmentsCount = new Set(employees.map((e) => e.department)).size;

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-10">
      <div className="max-w-6xl mx-auto px-4">
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

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow flex flex-col">
              <div className="text-sm text-purple-600">Total Altairian</div>
              <div className="mt-2 text-2xl font-bold text-gray-900">{totalEmployees}</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow flex flex-col">
              <div className="text-sm text-purple-600">Average Salary</div>
              <div className="mt-2 text-2xl font-bold text-gray-900">₹{avgSalary}</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow flex flex-col">
              <div className="text-sm text-purple-600">Departments</div>
              <div className="mt-2 text-2xl font-bold text-gray-900">{departmentsCount}</div>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <EmployeeForm
              refresh={fetchEmployees}
              selected={selected}
              clearSelected={() => setSelected(null)}
              showToast={showToast}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Altairian</h3>
                <div className="text-sm text-purple-600">{employees.length} results</div>
              </div>

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

        <Toaster position="bottom-right" />
      </div>
    </div>
  );
}

export default App;
