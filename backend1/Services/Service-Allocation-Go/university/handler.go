package university

import (
    "net/http"
    "hostelnet/allocation-service/models"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

func getDB(c *gin.Context) *gorm.DB {
    db, exists := c.Get("db")
    if !exists {
        return nil 
    }
    return db.(*gorm.DB)
}

func getUserID(c *gin.Context) int {
    id, exists := c.Get("user_id")
    if !exists { 
        return 0 
    }
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
    uni := r.Group("/")
    {
        uni.POST("/register", Register)
        uni.GET("/profile", Profile)
    }
}

func Register(c *gin.Context) {
    db := getDB(c)
    userID := getUserID(c)

    var req struct {
        ContactNumber string `form:"contact_number" binding:"required"`
        UniversityName string `form:"university_name" binding:"required"`
		Location       string `form:"location" binding:"required"`
	}
    if err := c.ShouldBind(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return 
    }

	
	docURL := ""
    university := models.University{
        UserID: userID,
        Name: req.UniversityName,
        ContactNumber: req.ContactNumber,
        Location: req.Location,
		Documents:     docURL,
		IsVerified:    false,
	}

    if err := db.Create(&university).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to register university"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "uni_id": university.UserID,
        "university_id": university.ID,
        "document_url": university.Documents,
        "message": "University registered successfully",
    })
}

func Profile(c *gin.Context) {
    db := getDB(c)
    userID := getUserID(c)
    username, email, role := getUserDetails(c)

    var university models.University
    if err := db.Where("user_id = ?", userID).First(&university).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"message": "University profile not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "university": university,
        "is_verified": university.IsVerified,
        "uni_username": username,
        "uni_email": email,
        "uni_role": role,
    })
}
