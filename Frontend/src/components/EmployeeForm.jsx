import { useEffect, useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export default function EmployeeForm({
  refresh,
  selected,
  clearSelected,
  showToast
}) {
  const initialForm = {
    emp_id: "",
    name: "",
    email: "",
    department: "",
    salary: ""
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* Populate form when editing */
  useEffect(() => {
    if (selected) {
      setForm({
        emp_id: selected.emp_id,
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
    // live-validate email
    if (name === "email") {
      const emailVal = value.trim();
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailVal === "") {
        setErrors((prev) => ({ ...prev, email: undefined }));
      } else if (!emailRe.test(emailVal)) {
        setErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
      } else {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
      setForm((prev) => ({ ...prev, email: value }));
      return;
    }

    if (name === "salary") {
      // keep empty string while typing, otherwise clamp to 0 for negatives
      if (value === "") {
        setForm((prev) => ({ ...prev, salary: "" }));
        return;
      }
      const num = Number(value);
      if (isNaN(num)) return;
      setForm((prev) => ({ ...prev, salary: String(Math.max(0, num)) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    // final email validation before submit
    const emailVal = (form.email || "").trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(emailVal)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
      return;
    }

    setLoading(true);

    try {
      // final validation: prevent negative salary
      if (form.salary !== "" && Number(form.salary) < 0) {
        showToast?.("Salary cannot be negative", "error");
        setLoading(false);
        return;
      }
      if (selected) {
        // await axios.put(
        //   `http://localhost:5000/api/employees/${form.emp_id}`,
        await axios.put(`${API}/api/employees/${form.emp_id}`,
          {
            name: form.name,
            email: form.email,
            department: form.department,
            salary: Number(form.salary || 0)
          }
        );
      } else {
        // CREATE
        // await axios.post(
        //   "http://localhost:5000/api/employees",
        //   form
        // );
        await axios.post(`${API}/api/employees`, { ...form, salary: Number(form.salary || 0) });
      }

      setForm(initialForm);
      setErrors({});
      clearSelected?.();
      const message = `Altairian ${selected ? "updated" : "added"} successfully`;
      showToast?.(message, "success");

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
    <form onSubmit={submit} className="bg-white p-6 shadow-lg rounded-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {selected ? "Update Altairian" : "Add Altairian"}
        </h2>
        {selected && (
          <button
            type="button"
            onClick={() => clearSelected?.()}
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="emp_id" className="block text-sm font-medium text-gray-700 mb-1">Altairian ID</label>
          <input
            id="emp_id"
            name="emp_id"
            placeholder="Altairian ID"
            value={form.emp_id}
            onChange={handleChange}
            disabled={!!selected}
            className={`border border-gray-200 rounded-md p-3 w-full ${selected ? "bg-gray-50 cursor-not-allowed" : ""}`}
            required
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            id="name"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-200 rounded-md p-3 w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`rounded-md p-3 w-full border ${errors.email ? 'border-red-500 focus:border-red-600' : 'border-gray-200'}`}
            required
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            id="department"
            name="department"
            value={form.department}
            onChange={handleChange}
            className="rounded-md p-3 w-full border border-gray-200 bg-white"
            required
          >
            <option value="" disabled>
              Select department
            </option>
            <option>APIM</option>
            <option>CS</option>
            <option>DAD</option>
            <option>DM</option>
            <option>AI</option>
            <option>Other</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
          <input
            id="salary"
            name="salary"
            placeholder="Salary"
            type="number"
            min="0"
            step="1"
            value={form.salary}
            onChange={handleChange}
            className="border border-gray-200 rounded-md p-3 w-full"
            required
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md w-full disabled:opacity-60"
        >
          {loading ? "Saving..." : selected ? "Update Altairian" : "Add Altairian"}
        </button>

        <button
          type="button"
          onClick={() => { setForm(initialForm); clearSelected?.(); }}
          className="bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-md w-full"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
