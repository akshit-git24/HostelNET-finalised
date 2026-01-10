package student

import (
	"net/http"
    "strconv"
	"hostelnet/allocation-service/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func getDB(c *gin.Context) *gorm.DB {
	db, exists := c.Get("db")
	if !exists { return nil }
	return db.(*gorm.DB)
}
func getUserID(c *gin.Context) int {
	id, exists := c.Get("user_id")
	if !exists { return 0 }
	return id.(int)
}
func getUserDetails(c *gin.Context) (string, string, string) {
    username := "" 
    if val, ok := c.Get("username"); ok { username = val.(string) }
    email := ""
    if val, ok := c.Get("email"); ok { email = val.(string) }
    role := ""
    if val, ok := c.Get("role"); ok { role = val.(string) }
    return username, email, role
}

func RegisterRoutes(r *gin.RouterGroup) {
	st := r.Group("/")
	{
		st.POST("/register", Register)
		st.GET("/list", ListStudents)
		st.GET("/profile", Profile)
		st.PATCH("/:student_id/assign_hostel", AssignHostel)
	}
}

func Register(c *gin.Context) {
    db := getDB(c)
    userID := getUserID(c)

    var req struct {
        Name string `form:"name" binding:"required"`
		ContactNumber string `form:"contact_number" binding:"required"`
		UserID        int    `form:"user_id" binding:"required"`
		IsDisabled    bool   `form:"is_disabled"`
    }
    if err := c.ShouldBind(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    student := models.Student{
        UserID: req.UserID,
        UniversityID: userID,
        Name: req.Name,
        ContactNumber: req.ContactNumber,
        IsDisabled: req.IsDisabled,
    }

    if err := db.Create(&student).Error; err != nil {
         c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to register student"})
         return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "student_id": student.UserID,
        "id": student.ID,
        "message": "Student registered successfully",
    })
}

func ListStudents(c *gin.Context) {
    db := getDB(c)
    userID := getUserID(c) 
    
    var students []models.Student
    db.Where("university_id = ?", userID).Find(&students)
    
    userIDs := []int{}
    for _, s := range students {
        userIDs = append(userIDs, s.UserID)
    }
    var users []models.User
    if len(userIDs) > 0 {
        db.Where("user_id IN ?", userIDs).Find(&users)
    }
    userMap := make(map[int]models.User)
    for _, u := range users {
        userMap[u.UserID] = u
    }
    
    result := []gin.H{}
    for _, s := range students {
        u, _ := userMap[s.UserID]
        result = append(result, gin.H{
            "id": s.ID,
            "student_uni_id": u.Username, 
            "name": s.Name,
            "contact_number": s.ContactNumber,
            "email": u.Email,
            "hostel_id": s.HostelID,
        })
    }
    c.JSON(http.StatusOK, result)
}

func Profile(c *gin.Context) {
	db := getDB(c)
	userID := getUserID(c)
	username, email, _ := getUserDetails(c)
    
    var student models.Student
    if err := db.Where("user_id = ?", userID).First(&student).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Student profile not found"})
        return
    }
    
    uniName := "Unknown"
    var uni models.University
    if err := db.Where("user_id = ?", student.UniversityID).First(&uni).Error; err == nil {
        uniName = uni.Name
    }
    
    var hostel models.Hostel
    hostelFound := false

	if student.HostelID != 0 {
		if err := db.First(&hostel, student.HostelID).Error; err == nil {
			hostelFound = true
		}
	}
    
    var allocation models.Allocation
    if !hostelFound {
        if err := db.Where("student_id = ? AND status = ?", student.UserID, "APPROVED").First(&allocation).Error; err == nil {
             if err := db.First(&hostel, allocation.HostelID).Error; err == nil {
                 hostelFound = true
    }
        }
    }
    
    var hostelData interface{}
    var roomDetails interface{}
    
    if hostelFound {
        hostelData = gin.H{
            "name": hostel.Name,
            "hostel_id": hostel.UserID,
            "location": hostel.Location,
            "contact_number": hostel.ContactNumber,
        }
        
        if allocation.RoomNumber == "" {
             db.Where("student_id = ? AND status = ?", student.UserID, "APPROVED").First(&allocation)
        }
        
        if allocation.RoomNumber != "" {
             var roommates []models.Allocation
             db.Where("hostel_id = ? AND room_number = ? AND status = ?", hostel.ID, allocation.RoomNumber, "APPROVED").
                Not("student_id = ?", student.UserID).
                Find(&roommates)
                
             mateIDs := []int{}
             for _, r := range roommates { mateIDs = append(mateIDs, r.StudentID) }
             
             mateNames := []string{}
             if len(mateIDs) > 0 {
                 var mates []models.Student
                 db.Where("user_id IN ?", mateIDs).Find(&mates)
                 for _, m := range mates { mateNames = append(mateNames, m.Name) }
             }
             
             roomDetails = gin.H{
                 "room_number": allocation.RoomNumber,
                 "roommates": mateNames,
             }
        }
    }
    
    c.JSON(http.StatusOK, gin.H{
        "name": student.Name,
        "student_uni_id": username,
        "email": email,
        "contact_number": student.ContactNumber,
        "university": uniName,
        "hostel": hostelData,
        "room": roomDetails,
    })
}

func StressTest(c *gin.Context) {
    db := getDB(c)
    
    var hostel models.Hostel
    db.First(&hostel)
    
    hostelData := gin.H{}
    if hostel.ID != 0 {
        hostelData = gin.H{
            "name": hostel.Name,
            "location": hostel.Location,
            "capacity": hostel.Capacity,
        }
    }
    
    var students []models.Student
    db.Limit(20).Find(&students)
    
    studentList := []gin.H{}
    for _, s := range students {
        studentList = append(studentList, gin.H{"id": s.ID, "name": s.Name})
    }
    
    c.JSON(http.StatusOK, gin.H{
        "status": "success",
        "hostel": hostelData,
        "students_count": len(studentList),
        "data": studentList,
    })
}

func AssignHostel(c *gin.Context) {
    db := getDB(c)
    
    studentIDParam := c.Param("student_id")
    studentID, err := strconv.Atoi(studentIDParam)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid student ID"})
        return
    }
    
    var body struct {
        HostelID interface{} `json:"hostel_id"`
    }
    if err := c.BindJSON(&body); err != nil {
         c.JSON(http.StatusUnprocessableEntity, gin.H{"message": "Invalid JSON body"})
         return
    }
    
    var hostelID int
    switch v := body.HostelID.(type) {
    case float64:
        hostelID = int(v)
    case string:
        hostelID, _ = strconv.Atoi(v)
    case int:
        hostelID = v
    default:
        c.JSON(http.StatusUnprocessableEntity, gin.H{"message": "hostel_id missing or invalid"})
        return
    }
   
    var student models.Student
    if err := db.First(&student, studentID).Error; err != nil {
         c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
         return
    }
    
    // Verify Hostel
    var hostel models.Hostel
    if err := db.First(&hostel, hostelID).Error; err != nil {
         c.JSON(http.StatusNotFound, gin.H{"error": "Hostel not found"})
         return
    }
    
    // Update
    student.HostelID = hostel.ID
    db.Save(&student)
    
    c.JSON(http.StatusOK, gin.H{"success": true, "message": "Hostel assigned successfully"})
}
