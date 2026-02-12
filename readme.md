
---

# Employee CRUD Application (React + Flask + Supabase)

A comprehensive Employee CRUD (Create, Read, Update, Delete) application with persistent database storage and CSV export functionality:

* **Frontend:** React (Vite) + Tailwind CSS
* **Backend:** Flask REST API
* **Database:** Supabase PostgreSQL (persistent storage)
* **Additional Features:** CSV Export, Dashboard with statistics, Real-time notifications
* **API Testing:** Postman
* **Log File:** Logger

This project supports:

* ✅ Add Employee
* ✅ View Employee List
* ✅ Update Employee (by `empId`)
* ✅ Delete Employee (by `empId`)
* ✅ Download Employee Records as CSV
* ✅ Logging / Log Manitanence
* ✅ Dashboard with Statistics (Total Employees, Average Salary, Department Count)
* ✅ Prevent duplicate `empId`
* ✅ Prevent duplicate email
* ✅ Real-time Toast Notifications
* ✅ Persistent Data Storage

---

## Live Demo & Hosted URLs

### Frontend (Deployed)
* **Frontend URL:** `https://frontend-api-crud.vercel.app` 
* **Features:** Dashboard, Employee Management, CSV Export

### Backend (Flask + Supabase)
* **Backend API URL:** `https://frontend-api-crud.onrender.com`
* **Database:** Supabase PostgreSQL
* **Features:** REST API, Persistent data, CSV Export endpoint

---

## Folder Structure

```
Frontend---API-Crud/
├── Backend-Flask/
│   ├── app.py                       # Flask application with REST API endpoints
│   ├── supabase_client.py           # Supabase database configuration
│   ├── requirements.txt             # Python dependencies
│   └── __pycache__/                 # Python cache directory
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmployeeForm.jsx     # Employee form component (add/edit)
│   │   │   └── EmployeeList.jsx     # Employee list display component
│   │   ├── App.jsx                  # Main app component with dashboard
│   │   ├── main.jsx                 # React entry point
│   │   ├── App.css                  # App styles
│   │   └── index.css                # Global styles
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── postcss.config.js            # PostCSS configuration
│   ├── vite.config.js               # Vite build configuration
│   ├── eslint.config.js             # ESLint configuration
│   ├── index.html                   # HTML template
│   └── package.json                 # Frontend dependencies
│
├── package.json                     # Root package configuration
└── README.md                        # Project documentation
```

---

## Features

### Frontend

* **Clean UI** with Tailwind CSS and gradient backgrounds
* **Toast notifications** using `react-hot-toast` for user feedback
* **Dashboard** with statistics (total employees, average salary, department count)
* **Edit mode** disables `empId` to maintain it as a primary key
* **CSV Export** functionality to download employee records
* **Axios** integration with backend API
* **Form Validation** with real-time email and salary validation
* **Responsive Design** with mobile-friendly layout

### Backend (Flask + Supabase)

* **Flask REST API** with comprehensive error handling
* **Supabase PostgreSQL** database for persistent data storage
* CRUD endpoints (Create, Read, Update, Delete employees)
* **CSV Export** endpoint to download all employees as CSV file
* Unique `empId` and email constraints at database level
* Environment variable configuration via `.env`
* Complete error handling with user-friendly messages
* Comprehensive code documentation and comments
* CORS enabled for frontend integration

---

## API Endpoints

Base URL: `https://frontend-api-crud.onrender.com/api/employees` 

**1. Get All Employees**
```
GET /api/employees
```

Response:
```json
[
  {
    "emp_id": "EMP001",
    "name": "Mayank",
    "email": "mayank@example.com",
    "department": "DAD",
    "salary": 50000,
    "created_at": "2026-02-11T10:30:00Z"
  }
]
```

**2. Add Employee**
```
POST /api/employees
```

Request Body:
```json
{
  "emp_id": "EMP001",
  "name": "Mayank",
  "email": "mayank@example.com",
  "department": "DAD",
  "salary": 50000
}
```

**3. Update Employee (by empId)**
```
PUT /api/employees/<empId>
```

Request Body:
```json
{
  "name": "Mayank M",
  "email": "mayank.m@example.com",
  "department": "APIM",
  "salary": 60000
}
```

**4. Delete Employee (by empId)**
```
DELETE /api/employees/<empId>
```

Response:
```json
{
  "message": "Employee deleted successfully"
}
```

**5. Export Employees as CSV** ⭐
```
GET /api/employees/export/csv
```

Downloads a CSV file with all employee records containing columns:
- emp_id
- name
- email
- department
- salary
- created_at

File naming: `employees_YYYYMMDD_HHMMSS.csv`

---

## Postman Testing

**Example: Add Employee**
* Method: `POST`
* URL: `https://frontend-api-crud.onrender.com/api/employees`
* Body: raw JSON

**Example: Update Employee**
* Method: `PUT`
* URL: `https://frontend-api-crud.onrender.com/api/employees/EMP001`

**Example: Delete Employee**
* Method: `DELETE`
* URL: `https://frontend-api-crud.onrender.com/api/employees/EMP001`

**Example: Export CSV**
* Method: `GET`
* URL: `https://frontend-api-crud.onrender.com/api/employees/export/csv`
* Action: File will be automatically downloaded

---

## Local Setup (Optional)

### 1. Clone Repository

```bash
git clone https://github.com/Mayank8881/Frontend---API-Crud.git
cd Frontend---API-Crud
```

---

### 2. Run Frontend Locally (optional)

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

Update Frontend `.env` file with Flask backend URL:
```
VITE_API_URL=http://localhost:5000
```

---

### 3. Run Flask Backend Locally (Recommended)

#### Prerequisites
* Python 3.8+
* Supabase account with PostgreSQL database

#### Setup Steps

1. **Install Python dependencies:**
```bash
cd Backend-Flask
pip install -r requirements.txt
```

2. **Create `.env` file in Backend-Flask folder:**
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5000
```

3. **Get Supabase credentials:**
   - Go to [Supabase Dashboard](https://supabase.com)
   - Create a new project
   - Navigate to Project Settings > API
   - Copy the `Project URL` and `Anon (public)` key

4. **Create Database Table:**
   - In Supabase SQL Editor, run:
   ```sql
   CREATE TABLE employees (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     emp_id VARCHAR(50) UNIQUE NOT NULL,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     department VARCHAR(100),
     salary NUMERIC(10, 2),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. **Run Flask server:**
```bash
python app.py
```

Flask backend runs at: `http://localhost:5000`

---

## Tech Stack

### Frontend
* React 19 (Vite)
* Tailwind CSS
* Axios
* React Hot Toast

### Backend
* Flask
* Flask-CORS
* Supabase (PostgreSQL)
* Python
* Gunicorn

### Database
* **Supabase PostgreSQL** - Persistent relational database for employee records

### Additional Tools
* Postman (API Testing)
* Git (Version Control)
* Python pip (Package Manager)

---

## New Feature: CSV Export 📊

The Flask backend includes a CSV export feature that allows users to download all employee records as a CSV file.

### How to Use

1. Click the **"Download CSV"** button in the dashboard header (top-right)
2. The browser will automatically download a file named `employees_YYYYMMDD_HHMMSS.csv`
3. Open the file in Excel, Google Sheets, or any spreadsheet application

### CSV File Contents

The exported CSV includes the following columns:
* `emp_id` - Employee ID
* `name` - Employee Name
* `email` - Employee Email
* `department` - Department
* `salary` - Annual Salary
* `created_at` - Record Creation Timestamp

### Backend API

```
GET /api/employees/export/csv
```

**Response:** Binary file with MIME type `text/csv`

### Frontend Implementation

The frontend uses `axios` with `responseType: "blob"` to handle the binary file response and triggers a browser download automatically.

---

## Author

**Mayank Mokhere**

---

