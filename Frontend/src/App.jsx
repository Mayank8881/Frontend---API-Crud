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

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Employee CRUD Application
      </h1>

      <div className="max-w-xl mx-auto">
        <EmployeeForm
          refresh={fetchEmployees}
          selected={selected}
          clearSelected={() => setSelected(null)}
          showToast={showToast}
        />
        <EmployeeList
          employees={employees}
          refresh={fetchEmployees}
          onEdit={(emp) => setSelected(emp)}
          showToast={showToast}
        />
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default App;
