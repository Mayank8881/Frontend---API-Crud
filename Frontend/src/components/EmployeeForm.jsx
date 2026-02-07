import { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeeForm({
  refresh,
  selected,
  clearSelected,
  showToast
}) {
  const initialForm = {
    empId: "",
    name: "",
    email: "",
    department: "",
    salary: ""
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  /* Populate form when editing */
  useEffect(() => {
    if (selected) {
      setForm({
        empId: selected.empId,
        name: selected.name,
        email: selected.email,
        department: selected.department,
        salary: selected.salary
      });
    } else {
      setForm(initialForm);
    }
  }, [selected]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selected) {
        // await axios.put(
        //   `http://localhost:5000/api/employees/${form.empId}`,
        await axios.put(`/api/employees/${form.empId}`,
          {
            name: form.name,
            email: form.email,
            department: form.department,
            salary: form.salary
          }
        );
      } else {
        // CREATE
        // await axios.post(
        //   "http://localhost:5000/api/employees",
        //   form
        // );
        await axios.post("/api/employees", form);
      }

      setForm(initialForm);
      clearSelected?.();
      showToast?.(
        `Employee ${selected ? "updated" : "added"} successfully`,
        "success"
      );

      // Refresh safely
      try {
        await refresh?.();
      } catch {
        console.warn("Refresh failed, but data saved");
      }

    } catch (err) {
      console.error("Submit error:", err);
      showToast?.(
        err?.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 shadow rounded mb-6">
      <h2 className="text-xl font-semibold mb-3">
        {selected ? "Update Employee" : "Add Employee"}
      </h2>
      <input
        name="empId"
        placeholder="Employee ID (EMP-1001)"
        value={form.empId}
        onChange={handleChange}
        disabled={!!selected}
        className={`border p-2 w-full mb-2 ${
          selected ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
        required
      />
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        required
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        required
      />

      <input
        name="department"
        placeholder="Department"
        value={form.department}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        required
      />

      <input
        name="salary"
        placeholder="Salary"
        type="number"
        value={form.salary}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-60"
      >
        {loading
          ? "Saving..."
          : selected
          ? "Update Employee"
          : "Add Employee"}
      </button>
    </form>
  );
}
