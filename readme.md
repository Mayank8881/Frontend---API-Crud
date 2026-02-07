
---

# Employee CRUD Application (React + Express + Vercel)

A simple Employee CRUD (Create, Read, Update, Delete) application built using:

* **Frontend:** React (Vite) + Tailwind CSS
* **Backend:** Express.js (in-memory storage) deployed as **Vercel Serverless Function**
* **API Testing:** Postman

This project supports:

* Add Employee
* View Employee List
* Update Employee (by `empId`)
* Delete Employee (by `empId`)
* Prevent duplicate `empId`
* Prevent duplicate email
* Cleanup delete by internal `id`

---

## Live Demo

Frontend + Backend deployed on Vercel:

* **App URL:** `https://frontend-api-crud.vercel.app`
* **API Base URL:** `https://frontend-api-crud.vercel.app/api/employees`

---

## Folder Structure

```
Frontend---API-Crud/
├── api/
│   └── employees.js                 # Vercel Serverless API entry
│
├── Backend/
│   ├── data/
│   │   └── employee.js              # In-memory employee array + create function
│   ├── routes/
│   │   └── Routes.js                # CRUD routes
│   ├── server.js                    # For local backend run (optional)
│   └── package.json                 # Backend dependencies (local use)
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmployeeForm.jsx
│   │   │   └── EmployeeList.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
├── vercel.json                      # Vercel routing config
├── package.json                     # Root deps for serverless function
└── README.md
```

---

## Features

### Frontend

* Clean UI with Tailwind CSS
* Toast notifications using `react-hot-toast`
* Edit mode disables `empId` to keep it as a primary key
* Axios integration with backend API

### Backend

* Express REST API
* Uses in-memory array to store employees
* Unique `empId` validation
* Unique email validation
* Update and delete based on `empId`
* Extra cleanup delete route by internal `id`

---

## API Endpoints

Base URL:

```
/api/employees
```

### 1. Get All Employees

**GET**

```
/api/employees
```

Response:

```json
[]
```

---

### 2. Add Employee

**POST**

```
/api/employees
```

Body (JSON):

```json
{
  "empId": "EMP001",
  "name": "Mayank",
  "email": "mayank@gmail.com",
  "department": "DAD",
  "salary": 50000
}
```

---

### 3. Update Employee (by empId)

**PUT**

```
/api/employees/EMP-1001
```

Body (JSON):

```json
{
  "name": "Mayank M",
  "email": "mayank@gmail.com",
  "department": "APIM",
  "salary": 60000
}
```

---

### 4. Delete Employee (by empId)

**DELETE**

```
/api/employees/EMP001
```

---

### 5. Delete Employee (Cleanup by internal id)

This route is useful if a wrong record is created without `empId`.

**DELETE**

```
/api/employees/by-id/<employee_id>
```

Example:

```
/api/employees/by-id/88a972a8-946a-4cc9-9f04-e1920250ad56
```

---

## Postman Testing

### Example: Add Employee

* Method: **POST**
* URL:

```
https://frontend-api-crud.vercel.app/api/employees
```

* Body: raw JSON

---

### Example: Update Employee

* Method: **PUT**
* URL:

```
https://frontend-api-crud.vercel.app/api/employees/EMP001
```

---

### Example: Delete Employee

* Method: **DELETE**
* URL:

```
https://frontend-api-crud.vercel.app/api/employees/EMP001
```

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

Frontend runs at:

```
http://localhost:5173
```

---

### 3. Run Backend Locally (Optional)

```bash
cd Backend
npm install
node server.js
```

Backend runs at:

```
http://localhost:5000
```

---

## Deployment (Vercel)

This project is deployed on Vercel using:

* React frontend inside `Frontend/`
* Express API as Vercel Serverless Function in `/api/employees.js`
* API calls from frontend use relative path:

```js
axios.get("/api/employees")
```

---

## Important Notes

### In-Memory Storage

This backend uses an in-memory array, so:

✅ CRUD works normally
❌ Data resets when Vercel redeploys or serverless function restarts

This is expected for a basic CRUD demo.

---

## Tech Stack

* React (Vite)
* Tailwind CSS
* Express.js
* Axios
* Postman
* Vercel

---

## Author

**Mayank Mokhere**

---

