// Employee Form Component
// Handles adding new employees and updating existing employee information
// Includes form validation and error handling

import { useEffect, useState } from "react";
import axios from "axios";

// Get API URL from environment variables
const API = import.meta.env.VITE_API_URL;

// EmployeeForm component
// Props:
//   - refresh: function to refresh employee list after submit
//   - selected: current selected employee for editing
//   - clearSelected: function to clear the selected employee
//   - showToast: function to display notifications
export default function EmployeeForm({
  refresh,
  selected,
  clearSelected,
  showToast
}) {
  // Initial form template
  const initialForm = {
    emp_id: "",
    name: "",
    email: "",
    department: "",
    salary: ""
  };

  // Form state - stores all input field values
  const [form, setForm] = useState(initialForm);
  // Validation errors state - stores field-specific error messages
  const [errors, setErrors] = useState({});
  // Loading state - indicates if form submission is in progress
  const [loading, setLoading] = useState(false);


  // Effect to populate form when an employee is selected for editing
  useEffect(() => {
    if (selected) {
      // Fill form with selected employee's data
      setForm({
        emp_id: selected.emp_id,
        name: selected.name,
        email: selected.email,
        department: selected.department,
        salary: selected.salary
      });
    } else {
      // Reset form to empty when no employee is selected
      setForm(initialForm);
    }
  }, [selected]);


  // Handle form input changes with live validation
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Email field: live validation
    if (name === "email") {
      const emailVal = value.trim();
      // Email regex pattern for validation
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailVal === "") {
        // Clear error if field is empty
        setErrors((prev) => ({ ...prev, email: undefined }));
      } else if (!emailRe.test(emailVal)) {
        // Set error if email format is invalid
        setErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
      } else {
        // Clear error if email is valid
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
      setForm((prev) => ({ ...prev, email: value }));
      return;
    }

    // Salary field: numeric validation
    if (name === "salary") {
      // Keep empty string while typing, otherwise clamp to 0 for negatives
      if (value === "") {
        setForm((prev) => ({ ...prev, salary: "" }));
        return;
      }
      const num = Number(value);
      if (isNaN(num)) return;
      // Ensure salary is not negative
      setForm((prev) => ({ ...prev, salary: String(Math.max(0, num)) }));
    } else {
      // Default handling for other fields
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };


  // Handle form submission - create or update employee
  const submit = async (e) => {
    e.preventDefault();

    // Final email validation before submit
    const emailVal = (form.email || "").trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(emailVal)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
      return;
    }

    setLoading(true);

    try {
      // Validate salary is not negative
      if (form.salary !== "" && Number(form.salary) < 0) {
        showToast?.("Salary cannot be negative", "error");
        setLoading(false);
        return;
      }

      // If editing an existing employee, send PUT request
      if (selected) {
        await axios.put(`${API}/api/employees/${form.emp_id}`,
          {
            name: form.name,
            email: form.email,
            department: form.department,
            salary: Number(form.salary || 0)
          }
        );
      } else {
        // If creating new employee, send POST request
        // await axios.post(
        //   "http://localhost:5000/api/employees",
        //   form
        // );
        await axios.post(`${API}/api/employees`, { ...form, salary: Number(form.salary || 0) });
      }

      // Reset form to initial state after successful submission
      setForm(initialForm);
      setErrors({});
      clearSelected?.();

      // Show success message
      const message = `Altairian ${selected ? "updated" : "added"} successfully`;
      showToast?.(message, "success");

      // Refresh employee list
      try {
        await refresh?.();
      } catch {
        console.warn("Refresh failed, but data saved");
      }

    } catch (err) {
      // Handle and display errors
      console.error("Submit error:", err);
      showToast?.(
        err?.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      // Clear loading state regardless of success or failure
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-6 shadow-lg rounded-lg mb-6">
      {/* Form Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {selected ? "Update Altairian" : "Add Altairian"}
        </h2>
        {/* Clear button shown only when editing */}
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

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Employee ID Field - disabled when editing */}
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

        {/* Name Field */}
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

        {/* Email Field - includes validation error display */}
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
          {/* Display email validation error if present */}
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Department Dropdown Field */}
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
            {/* Department options */}
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

        {/* Salary Field - spans full width */}
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

      {/* Form Action Buttons */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Submit Button - shows loading state while submitting */}
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md w-full disabled:opacity-60"
        >
          {loading ? "Saving..." : selected ? "Update Altairian" : "Add Altairian"}
        </button>

        {/* Reset Button - clears form and selected employee */}
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
