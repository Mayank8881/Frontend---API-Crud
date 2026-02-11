from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase_client import get_supabase
import os

app = Flask(__name__)

# Allow Vercel frontend
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/", methods=["GET"])
def home():
    return "Flask backend is running!"

# -------------------------------
# GET all employees
# -------------------------------
@app.route("/api/employees", methods=["GET"])
def get_employees():
    try:
        supabase = get_supabase()
        res = supabase.table("employees").select("*").order("created_at", desc=True).execute()
        return jsonify(res.data)
    except Exception as e:
        return jsonify({"message": str(e)}), 500


# -------------------------------
# POST create employee
# -------------------------------
@app.route("/api/employees", methods=["POST"])
def create_employee():
    try:
        data = request.json

        emp_id = str(data.get("empId", "")).strip()
        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip()
        department = str(data.get("department", "")).strip()
        salary = data.get("salary")

        if not emp_id:
            return jsonify({"message": "Employee ID is required"}), 400
        if not email:
            return jsonify({"message": "Email is required"}), 400

        supabase = get_supabase()

        insert_res = supabase.table("employees").insert({
            "emp_id": emp_id,
            "name": name,
            "email": email,
            "department": department,
            "salary": salary
        }).execute()

        if not insert_res.data:
            return jsonify({"message": "Insert failed"}), 400

        return jsonify(insert_res.data[0])

    except Exception as e:
        msg = str(e)

        # Friendly unique constraint errors
        if "employees_emp_id_key" in msg:
            return jsonify({"message": "Employee ID already exists"}), 400
        if "employees_email_key" in msg:
            return jsonify({"message": "Email already exists"}), 400

        return jsonify({"message": msg}), 500


# -------------------------------
# PUT update employee by empId
# -------------------------------
@app.route("/api/employees/<empId>", methods=["PUT"])
def update_employee(empId):
    try:
        data = request.json
        supabase = get_supabase()

        update_res = supabase.table("employees").update({
            "name": data.get("name"),
            "email": data.get("email"),
            "department": data.get("department"),
            "salary": data.get("salary")
        }).eq("emp_id", empId).execute()

        if not update_res.data:
            return jsonify({"message": "Employee not found"}), 404

        return jsonify(update_res.data[0])

    except Exception as e:
        msg = str(e)

        if "employees_email_key" in msg:
            return jsonify({"message": "Email already exists"}), 400

        return jsonify({"message": msg}), 500


# -------------------------------
# DELETE employee by empId
# -------------------------------
@app.route("/api/employees/<empId>", methods=["DELETE"])
def delete_employee(empId):
    try:
        supabase = get_supabase()

        delete_res = supabase.table("employees").delete().eq("emp_id", empId).execute()

        if not delete_res.data:
            return jsonify({"message": "Employee not found"}), 404

        return jsonify({"message": "Employee deleted successfully"})

    except Exception as e:
        return jsonify({"message": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
