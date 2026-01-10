# HostelNET Integration Test Guide

## 🚀 Testing the Complete System

### Prerequisites
1. Backend server running on `http://localhost:8010`
2. Frontend server running on `http://localhost:3000`
3. PostgreSQL database running
4. Redis server running

### Test Flow

#### 1. University Registration & Login
1. Navigate to `http://localhost:3000/university/register`
2. Fill out university registration form
3. Submit and note the university ID
4. Navigate to `http://localhost:3000/university/login`
5. Login with university credentials
6. Verify access to university dashboard

#### 2. Hostel Creation (University)
1. From university dashboard, click "Create Hostel"
2. Fill out hostel registration form:
   - Hostel Name: "Test Hostel"
   - Username: "hostel_admin"
   - Email: "hostel@test.com"
   - Password: "password123"
3. Submit and note the hostel ID
4. Verify success message

#### 3. Hostel Login
1. Navigate to `http://localhost:3000/hostel/login`
2. Login with hostel credentials:
   - Username: "hostel_admin"
   - Hostel ID: (from step 2)
   - Password: "password123"
3. Verify access to hostel dashboard

#### 4. Student Registration (University)
1. From university dashboard, click "Register Student"
2. Fill out student registration form:
   - Username: "student1"
   - Email: "student1@test.com"
   - Password: "password123"
   - Phone Number: "1234567890"
   - Full Name: "Test Student"
3. Submit and note the student ID
4. Verify success message

#### 5. Student Login
1. Navigate to `http://localhost:3000/student/login`
2. Login with student credentials:
   - Username: "student1"
   - Student ID: (from step 4)
   - Email: "student1@test.com"
   - Password: "password123"
3. Verify access to student dashboard

### Expected Results

#### University Dashboard
- ✅ Authentication protection
- ✅ Student registration form
- ✅ Hostel creation link
- ✅ University information display

#### Hostel Dashboard
- ✅ Authentication protection
- ✅ Hostel information display
- ✅ Quick action buttons
- ✅ Statistics display

#### Student Dashboard
- ✅ Authentication protection
- ✅ Student information display
- ✅ Application status tracking
- ✅ Room selection interface

### API Endpoints Tested

#### Backend Endpoints
- `POST /university/register` - University registration
- `POST /university/login` - University login
- `POST /university/create-hostel` - Hostel creation
- `POST /university/register-student` - Student registration
- `POST /hostel/login` - Hostel login
- `GET /hostel/dashboard` - Hostel dashboard
- `POST /auth/login` - Student login

#### Frontend Routes
- `/university/register` - University registration page
- `/university/login` - University login page
- `/university/dashboard` - University dashboard
- `/university/register/hostel` - Hostel registration page
- `/hostel/login` - Hostel login page
- `/hostel/dashboard` - Hostel dashboard
- `/student/login` - Student login page
- `/student/dashboard` - Student dashboard

### Security Features
- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Automatic redirects for unauthorized access
- ✅ Token validation

### Error Handling
- ✅ Network error handling
- ✅ Authentication error handling
- ✅ Form validation
- ✅ User feedback messages

## 🎯 Success Criteria
All authentication flows work correctly, users can register and login, and dashboards display appropriate information based on user roles.

