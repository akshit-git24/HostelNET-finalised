package hostel

import (
	"errors"
	"net/http"   
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

func RegisterRoutes(r *gin.RouterGroup) {
	h := r.Group("/")
	{
		h.POST("/register", RegisterHostel)
		h.POST("/apply", ApplyHostel)
		h.GET("/profile", GetProfile)
		h.POST("/room/create", CreateRoom)
		h.GET("/rooms", ListRooms)
		h.GET("/students/pending", ListPendingStudents)
		h.POST("/allocate_room", AllocateRoom)
		h.POST("/reallocate", ReallocateStudent)
		h.POST("/deallocate", DeallocateStudent)
		h.GET("/list", ListHostels)
		h.GET("/rooms/allotments", GetRoomAllotments)
	}
}


func RegisterHostel(c *gin.Context) {
	db := getDB(c)
	userID := getUserID(c) 

	var req struct {
		Name          string `form:"name" binding:"required"`
		ContactNumber string `form:"contact_number" binding:"required"`
		Capacity      int    `form:"capacity" binding:"required"`
		Location      string `form:"location" binding:"required"`
		UserID        int    `form:"user_id" binding:"required"` 
		OwnerName     string `form:"owner_name" binding:"required"`
	}

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hostel := models.Hostel{
		UniversityID:  userID,
		Name:          req.Name,
		ContactNumber: req.ContactNumber,
		Capacity:      req.Capacity,
		Location:      req.Location,
		UserID:        req.UserID,
		OwnerName:     req.OwnerName,
	}

	if err := db.Create(&hostel).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create hostel"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"hostel_id": hostel.UserID,
		"id":        hostel.ID,
		"message":   "Hostel registered successfully",
	})
}

func GetProfile(c *gin.Context) {
    db := getDB(c)
    userID := getUserID(c) 

    var hostel models.Hostel
    if err := db.Where("user_id = ?", userID).First(&hostel).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"message": "Hostel not found"})
        return
    }

    
    var user models.User
    if err := db.Where("user_id = ?", hostel.UserID).First(&user).Error; err != nil {
        user.Username = "Unknown"
    }

    var allocations []models.Allocation
    db.Where("hostel_id = ? AND status = ?", hostel.ID, "APPROVED").Find(&allocations)
    
	studentIDs := make([]int, 0)
    for _, a := range allocations {
        studentIDs = append(studentIDs, a.StudentID)
    }
    
    var students []models.Student
    if len(studentIDs) > 0 {
        db.Where("user_id IN ?", studentIDs).Find(&students)
    }
    
    studentList := make([]gin.H, 0)
    for _, s := range students {
        studentList = append(studentList, gin.H{
            "name": s.Name,
            "student_uni_id": s.UserID, 
            "email": "", .
            "contact_number": s.ContactNumber,
        })
    }

	c.JSON(http.StatusOK, gin.H{
		"name":            hostel.Name,
		"hostel_id":       user.Username,
		"location":        hostel.Location,
		"capacity":        hostel.Capacity,
		"contact_number":  hostel.ContactNumber,
		"university":      "University Name Placeholder", 
		"assigned_students": studentList,
	})
}

func ListHostels(c *gin.Context) {
    db := getDB(c)
    userID := getUserID(c) 
    
    var hostels []models.Hostel
    db.Where("university_id = ?", userID).Find(&hostels)
    
    
    hostelUserIDs := make([]int, 0)
    for _, h := range hostels {
        hostelUserIDs = append(hostelUserIDs, h.UserID)
    }
    
    var users []models.User
    if len(hostelUserIDs) > 0 {
         db.Where("user_id IN ?", hostelUserIDs).Find(&users)
    }
    userMap := make(map[int]models.User)
    for _, u := range users {
        userMap[u.UserID] = u
    }
    
    result := make([]gin.H, 0)
    for _, h := range hostels {
        u, _ := userMap[h.UserID]
        result = append(result, gin.H{
            "id": h.ID,
            "hostel_id": u.Username, 
            "name": h.Name,
            "contact_number": h.ContactNumber,
            "capacity": h.Capacity,
            "location": h.Location,
            "email": u.Email,
        })
    }
    
    c.JSON(http.StatusOK, result)
}

func CreateRoom(c *gin.Context) {
	db := getDB(c)
	userID := getUserID(c)

	var req struct {
		RoomNumber string `form:"room_number" binding:"required"`
		RoomType   string `form:"room_type" binding:"required"`
		Capacity   int    `form:"capacity" binding:"required"`
		Floor      int    `form:"floor" binding:"required"`
	}

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

    var hostel models.Hostel
    if err := db.Where("user_id = ?", userID).First(&hostel).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"message": "Hostel not found for this user"})
        return
    }

	room := models.Room{
		HostelID:          hostel.ID,
		RoomNumber:        req.RoomNumber,
		RoomType:          req.RoomType,
		Capacity:          req.Capacity,
		AvailableCapacity: req.Capacity,
		Floor:             req.Floor,
	}

    if err := db.Create(&room).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
        return
    }

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Room created successfully", "room_id": room.ID})
}

func ListRooms(c *gin.Context) {
    db := getDB(c)
    userID := getUserID(c)
    
    var hostel models.Hostel
    if err := db.Where("user_id = ?", userID).First(&hostel).Error; err != nil {
        c.JSON(http.StatusOK, []interface{}{})
        return
    }
    
    var rooms []models.Room
    db.Where("hostel_id = ?", hostel.ID).Find(&rooms)
    
    c.JSON(http.StatusOK, rooms)
}

func GetRoomAllotments(c *gin.Context) {
    db := getDB(c)
    userID := getUserID(c)
    
    var hostel models.Hostel
    if err := db.Where("user_id = ?", userID).First(&hostel).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"message": "Hostel not found"})
        return
    }
    
    var rooms []models.Room
    db.Where("hostel_id = ?", hostel.ID).Find(&rooms)
    
    var allocations []models.Allocation
    db.Where("hostel_id = ? AND status = ?", hostel.ID, "APPROVED").Find(&allocations)
    
    
    studentIDs := make([]int, 0)
    for _, a := range allocations {
        studentIDs = append(studentIDs, a.StudentID)
    }
    var students []models.Student
    if len(studentIDs) > 0 {
        db.Where("user_id IN ?", studentIDs).Find(&students)
    }
    studentMap := make(map[int]models.Student)
    for _, s := range students {
        studentMap[s.UserID] = s
    }
    
    allocMap := make(map[string][]gin.H)
    for _, a := range allocations {
        s := studentMap[a.StudentID]
        allocMap[a.RoomNumber] = append(allocMap[a.RoomNumber], gin.H{
            "allocation_id": a.ID,
            "student_id": a.StudentID,
            "name": s.Name, 
            "contact_number": s.ContactNumber,
        })
    }
    
    result := make([]gin.H, 0)
    for _, r := range rooms {
        result = append(result, gin.H{
            "id": r.ID,
            "room_number": r.RoomNumber,
            "type": r.RoomType,
            "capacity": r.Capacity,
            "available_capacity": r.AvailableCapacity,
            "floor": r.Floor,
            "students": allocMap[r.RoomNumber],
        })
    }
    
    c.JSON(http.StatusOK, result)
}


func ApplyHostel(c *gin.Context) {
    db := getDB(c)
    userID := getUserID(c)
    
    studentName := c.PostForm("student_name")
    remarks := c.PostForm("remarks")
    roommatePref := c.PostForm("roommate_preference")
    
	var student models.Student
    if err := db.Where("user_id = ?", userID).First(&student).Error; err != nil {
         c.JSON(http.StatusNotFound, gin.H{"message": "Student not found."})
         return
    }
    
    if student.HostelID == 0 {
         c.JSON(http.StatusBadRequest, gin.H{"message": "No hostel assigned to this student."})
         return
    }
    
    hostelID := student.HostelID
    

    docPath := c.PostForm("documents")
    if file, err := c.FormFile("documents"); err == nil {
        docPath = file.Filename 
    }

    application := models.HostelApplication{
        StudentID: userID,
        HostelID: hostelID,
        StudentName: studentName,
        Documents: docPath,
        Remarks: remarks,
        RoommatePreference: roommatePref,
    }
    
    if err := db.Create(&application).Error; err != nil {
         c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to submit application"})
         return
    }
    
	c.JSON(http.StatusOK, gin.H{
		"success":        true,
		"application_id": application.ID,
		"message":        "Application submitted successfully",
	})
}

func ListPendingStudents(c *gin.Context) {
    db := getDB(c)
    userID := getUserID(c)
    
    var hostel models.Hostel
    if err := db.Where("user_id = ?", userID).First(&hostel).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"message": "Hostel not found"})
        return
    }
    
    var apps []models.HostelApplication
    db.Where("hostel_id = ?", hostel.ID).Find(&apps)
    
    var allocations []models.Allocation
    db.Where("hostel_id = ? AND status = ?", hostel.ID, "APPROVED").Find(&allocations)
    
    allocatedIDs := make(map[int]bool)
    for _, a := range allocations {
        allocatedIDs[a.StudentID] = true
    }
    
    pendingList := make([]gin.H, 0)
    for _, app := range apps {
        if allocatedIDs[app.StudentID] {
            continue
        }
        
        pendingList = append(pendingList, gin.H{
            "application_id": app.ID,
            "student_id": app.StudentID,
            "name": app.StudentName,
            "contact_number": "N/A",
            "is_disabled": false,
            "remarks": app.Remarks,
            "roommate_preference": app.RoommatePreference,
             "documents": app.Documents,
             "uni_id": "N/A",
        })
    }
    
    c.JSON(http.StatusOK, pendingList)
}

func AllocateRoom(c *gin.Context) {
    db := getDB(c)
    var req struct {
        StudentID int `form:"student_id" binding:"required"`
        RoomID    int `form:"room_id" binding:"required"`
    }
    if err := c.ShouldBind(&req); err != nil {
         c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
         return
    }

    
    err := db.Transaction(func(tx *gorm.DB) error {
        var room models.Room
        if err := tx.First(&room, req.RoomID).Error; err != nil {
            return errors.New("Room not found")
        }
        
        if room.AvailableCapacity <= 0 {
             return errors.New("Room is full")
        }
        
        var existingAlloc models.Allocation
        if err := tx.Where("student_id = ? AND status = ?", req.StudentID, "APPROVED").First(&existingAlloc).Error; err == nil {
             return errors.New("Student already has a room allocated")
        }
        
    
        alloc := models.Allocation{
            StudentID: req.StudentID,
            HostelID: room.HostelID,
            RoomNumber: room.RoomNumber,
            Status: "APPROVED",
        }
        if err := tx.Create(&alloc).Error; err != nil {
            return err
        }
        
        
        room.AvailableCapacity -= 1
        if err := tx.Save(&room).Error; err != nil {
            return err
        }
        
        return nil
    })
    
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"success": true, "message": "Room allocated successfully"})
}

func ReallocateStudent(c *gin.Context) {
    db := getDB(c)
    userID := getUserID(c)
    
    var req struct {
        StudentID int `form:"student_id" binding:"required"`
        NewRoomID int `form:"new_room_id" binding:"required"`
    }
    if err := c.ShouldBind(&req); err != nil {
         c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
         return
    }
    
    err := db.Transaction(func(tx *gorm.DB) error {
        var hostel models.Hostel
        if err := tx.Where("user_id = ?", userID).First(&hostel).Error; err != nil {
             return errors.New("Hostel not found")
        }
        
        var alloc models.Allocation
        if err := tx.Where("student_id = ? AND hostel_id = ? AND status = ?", req.StudentID, hostel.ID, "APPROVED").First(&alloc).Error; err != nil {
             return errors.New("Active allocation not found")
        }
        
        var oldRoom models.Room
        if err := tx.Where("hostel_id = ? AND room_number = ?", hostel.ID, alloc.RoomNumber).First(&oldRoom).Error; err != nil {
            return errors.New("Current room not found")
        }
        
        var newRoom models.Room
        if err := tx.Where("id = ? AND hostel_id = ?", req.NewRoomID, hostel.ID).First(&newRoom).Error; err != nil {
            return errors.New("New room not found")
        }
        
        if newRoom.ID == oldRoom.ID {
             return errors.New("Student is already in this room")
        }
        
        if newRoom.AvailableCapacity <= 0 {
             return errors.New("New room is full")
        }
        
       
        oldRoom.AvailableCapacity += 1
        if err := tx.Save(&oldRoom).Error; err != nil { return err }
        
        newRoom.AvailableCapacity -= 1
        if err := tx.Save(&newRoom).Error; err != nil { return err }
        
        alloc.RoomNumber = newRoom.RoomNumber
        if err := tx.Save(&alloc).Error; err != nil { return err }
        
        return nil
    })
    
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"success": true, "message": "Student reallocated successfully"})
}


func DeallocateStudent(c *gin.Context) {
    db := getDB(c)
    userID := getUserID(c)
    
     var req struct {
        StudentID int `form:"student_id" binding:"required"`
    }
    if err := c.ShouldBind(&req); err != nil {
         c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
         return
    }

    err := db.Transaction(func(tx *gorm.DB) error {
        var hostel models.Hostel
        if err := tx.Where("user_id = ?", userID).First(&hostel).Error; err != nil {
             return errors.New("Hostel not found")
        }
        
        var alloc models.Allocation
        if err := tx.Where("student_id = ? AND hostel_id = ? AND status = ?", req.StudentID, hostel.ID, "APPROVED").First(&alloc).Error; err != nil {
             return errors.New("Active allocation not found")
        }
        
         var room models.Room
        
        if err := tx.Where("hostel_id = ? AND room_number = ?", hostel.ID, alloc.RoomNumber).First(&room).Error; err == nil {
            room.AvailableCapacity += 1
            tx.Save(&room)
        }
        
        if err := tx.Delete(&alloc).Error; err != nil { return err }
        
        return nil
    })
    
     if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"success": true, "message": "Student deallocated successfully"})
}
