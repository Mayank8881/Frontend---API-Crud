"""
Flask Backend API for Employee Management System
Provides RESTful endpoints for CRUD operations on employees
Connected to Supabase PostgreSQL database
"""

from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from supabase_client import get_supabase
import os
import logging
from logging.handlers import RotatingFileHandler
import time
import traceback
import csv
from io import StringIO
from datetime import datetime

# Initialize Flask application
app = Flask(__name__)

# Enable CORS for all /api/* routes to allow frontend requests
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configure logging for the Flask app: 
log_level = os.environ.get("LOG_LEVEL", "INFO").upper()
logger = logging.getLogger("backend-flask")
logger.setLevel(getattr(logging, log_level, logging.INFO))
formatter = logging.Formatter("%(asctime)s %(levelname)s %(name)s %(message)s")

# Ensure logs directory exists
logs_dir = os.environ.get("LOG_DIR", "logs")
os.makedirs(logs_dir, exist_ok=True)
log_file = os.path.join(logs_dir, "backend-flask.log")

# Rotating file handler to keep logs manageable
file_handler = RotatingFileHandler(log_file, maxBytes=5 * 1024 * 1024, backupCount=5)
file_handler.setFormatter(formatter)

# Replace any existing handlers with the file handler to avoid terminal output
if logger.handlers:
    for h in list(logger.handlers):
        logger.removeHandler(h)
logger.addHandler(file_handler)

app.logger = logger


# Request timing and logging
@app.before_request
def _start_timer():
    request._start_time = time.time()
    app.logger.info("Incoming request: %s %s from %s", request.method, request.path, request.remote_addr)
    if request.method in ("POST", "PUT", "PATCH"):
        try:
            app.logger.debug("Request JSON: %s", request.get_json(silent=True))
        except Exception:
            app.logger.debug("Request body could not be parsed as JSON")


@app.after_request
def _log_request(response):
    now = time.time()
    duration = round(now - getattr(request, "_start_time", now), 4)
    app.logger.info("%s %s -> %s (%.4fs) from %s", request.method, request.path, response.status_code, duration, request.remote_addr)
    return response


# Global exception handler to ensure exceptions are logged server-side
@app.errorhandler(Exception)
def _handle_exception(e):
    app.logger.error("Unhandled exception: %s", str(e))
    app.logger.debug(traceback.format_exc())
    return jsonify({"message": "Internal server error"}), 500


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
# GET employees as CSV export
# ========================================
@app.route("/api/employees/export/csv", methods=["GET"])
def export_employees_csv():
    """
    Export all employees as a CSV file
    Returns a downloadable CSV file containing all employee records
    
    Returns:
        CSV file: Downloaded file with employee data
        500: If database query or CSV generation fails
    """
    try:
        supabase = get_supabase()
        # Fetch all employees from database
        res = supabase.table("employees").select("*").order("created_at", desc=True).execute()
        employees = res.data
        
        if not employees:
            return jsonify({"message": "No employees found"}), 404
        
        # Create CSV in memory
        output = StringIO()
        # Define CSV column headers - these are the field names from the database
        fieldnames = ["emp_id", "name", "email", "department", "salary", "created_at"]
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        
        # Write header row
        writer.writeheader()
        
        # Write employee data rows
        for employee in employees:
            # Only include specified fields in CSV
            row = {field: employee.get(field, "") for field in fieldnames}
            writer.writerow(row)
        
        # Prepare response with CSV data
        csv_data = output.getvalue()
        output.close()
        
        # Create response with CSV file attachment
        response = make_response(csv_data)
        # Generate filename with current timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"employees_{timestamp}.csv"
        
        # Set response headers for file download
        response.headers["Content-Disposition"] = f"attachment; filename={filename}"
        response.headers["Content-Type"] = "text/csv"
        
        return response
        
    except Exception as e:
        return jsonify({"message": str(e)}), 500


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
    app.logger.info("Starting Flask backend on %s:%s", "0.0.0.0", port)
    app.run(host="0.0.0.0", port=port)
