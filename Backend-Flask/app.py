"""
Flask Backend API for Employee Management System
Provides RESTful endpoints for CRUD operations on employees
Connected to Supabase PostgreSQL database
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase_client import get_supabase
import os

# Initialize Flask application
app = Flask(__name__)

# Enable CORS for all /api/* routes to allow frontend requests
CORS(app, resources={r"/api/*": {"origins": "*"}})


# Health check endpoint
@app.route("/", methods=["GET"])
def home():
    """
    Health check endpoint
    Returns a simple status message to verify the backend is running
    """
    return "Flask backend is running! v0.13"



# ========================================
# GET all employees
# ========================================
@app.route("/api/employees", methods=["GET"])
def get_employees():
    """
    Retrieve all employees from the database
    
    Returns:
        JSON: List of employee records
        500: If database query fails
    """
    try:
        supabase = get_supabase()
        # Query the employees table and order by created_at in descending order
        res = supabase.table("employees").select("*").order("created_at", desc=True).execute()
        return jsonify(res.data)
    except Exception as e:
        # Return error details if query fails
        return jsonify({"message": str(e)}), 500




# ========================================
# POST create employee
# ========================================
@app.route("/api/employees", methods=["POST"])
def create_employee():
    """
    Create a new employee record
    Validates required fields and handles duplicate constraint errors
    
    Request body:
        - emp_id (string, required): Unique employee identifier
        - name (string): Employee name
        - email (string, required): Employee email (must be unique)
        - department (string): Department name
        - salary (number): Annual salary
    
    Returns:
        JSON: Created employee record with all fields
        400: If required fields are missing or constraint violation occurs
        500: If database insert fails
    """
    try:
        # Extract and validate request data
        data = request.json

        emp_id = str(data.get("emp_id", "")).strip()
        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip()
        department = str(data.get("department", "")).strip()
        salary = data.get("salary")

        # Validate required fields
        if not emp_id:
            return jsonify({"message": "Employee ID is required"}), 400
        if not email:
            return jsonify({"message": "Email is required"}), 400

        supabase = get_supabase()

        # Insert new employee record into database
        insert_res = supabase.table("employees").insert({
            "emp_id": emp_id,
            "name": name,
            "email": email,
            "department": department,
            "salary": salary
        }).execute()

        # Check if insert was successful
        if not insert_res.data:
            return jsonify({"message": "Insert failed"}), 400

        return jsonify(insert_res.data[0])

    except Exception as e:
        msg = str(e)

        # Handle unique constraint errors with friendly messages
        if "employees_emp_id_key" in msg:
            return jsonify({"message": "Employee ID already exists"}), 400
        if "employees_email_key" in msg:
            return jsonify({"message": "Email already exists"}), 400

        return jsonify({"message": msg}), 500




# ========================================
# PUT update employee by empId
# ========================================
@app.route("/api/employees/<empId>", methods=["PUT"])
def update_employee(empId):
    """
    Update an existing employee record
    Partial updates are allowed - only provided fields are updated
    
    URL parameter:
        - empId (string): The unique employee ID to update
    
    Request body:
        - name (string): Updated employee name
        - email (string): Updated email (must be unique if changed)
        - department (string): Updated department
        - salary (number): Updated salary
    
    Returns:
        JSON: Updated employee record with all fields
        404: If employee with given empId is not found
        400: If email already exists for another employee
        500: If database update fails
    """
    try:
        data = request.json
        supabase = get_supabase()

        # Update employee record where emp_id matches the provided empId
        update_res = supabase.table("employees").update({
            "name": data.get("name"),
            "email": data.get("email"),
            "department": data.get("department"),
            "salary": data.get("salary")
        }).eq("emp_id", empId).execute()

        # Check if employee was found and updated
        if not update_res.data:
            return jsonify({"message": "Employee not found"}), 404

        return jsonify(update_res.data[0])

    except Exception as e:
        msg = str(e)

        # Handle email uniqueness constraint error
        if "employees_email_key" in msg:
            return jsonify({"message": "Email already exists"}), 400

        return jsonify({"message": msg}), 500




# ========================================
# DELETE employee by empId
# ========================================
@app.route("/api/employees/<empId>", methods=["DELETE"])
def delete_employee(empId):
    """
    Delete an employee record from the database
    
    URL parameter:
        - empId (string): The unique employee ID to delete
    
    Returns:
        JSON: Success message upon deletion
        404: If employee with given empId is not found
        500: If database delete fails
    """
    try:
        supabase = get_supabase()

        # Delete employee record where emp_id matches the provided empId
        delete_res = supabase.table("employees").delete().eq("emp_id", empId).execute()

        # Check if employee was found and deleted
        if not delete_res.data:
            return jsonify({"message": "Employee not found"}), 404

        return jsonify({"message": "Employee deleted successfully"})

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# Application entry point
if __name__ == "__main__":
    """
    Start the Flask development server
    Reads PORT from environment variable (default: 5000)
    Listens on all network interfaces (0.0.0.0) for external connections
    """
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
