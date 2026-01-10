package main

import (
	"log"
	"os"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
    "hostelnet/allocation-service/consumer"
	"hostelnet/allocation-service/middleware"
	"hostelnet/allocation-service/models"
    "hostelnet/allocation-service/university"
    "hostelnet/allocation-service/student"
    "hostelnet/allocation-service/hostel"
)

var DB *gorm.DB

func InitDB() *gorm.DB {
	dsn := os.Getenv("DATABASE_URL")
    if dsn == "" {
        log.Println("DATABASE_URL not set. Skipping DB connection.")
        return nil
    }

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

    // Auto Migrate
    err = db.AutoMigrate(
        &models.User{},
        &models.Hostel{},
        &models.Room{},
        &models.Allocation{},
        &models.HostelApplication{},
        &models.University{},
        &models.Student{},
    )
    if err != nil {
        log.Fatal("Failed to migrate database:", err)
    }
    
    log.Println("Database connected and migrated successfully.")
	return db
}

func main() {
    godotenv.Load()

	db := InitDB()
    if db != nil {
        go consumer.StartUserConsumer(db)
    } else {
        log.Println("WARNING: Database not initialized, Kafka consumer NOT started.")
    }

	r := gin.Default()
    r.Use(func(c *gin.Context) {
        c.Set("db", db)
        c.Next()
    })
    
    authGroup := r.Group("/")
    authGroup.Use(middleware.AuthMiddleware())
    
	university.RegisterRoutes(authGroup.Group("/university"))
	student.RegisterRoutes(authGroup.Group("/student"))
	hostel.RegisterRoutes(authGroup.Group("/hostel"))

	publicGroup := r.Group("/student")
	publicGroup.GET("/stress-test", student.StressTest)

	port := ":8012"
	log.Printf("Starting Allocation Service on port %s", port)
	if err := r.Run(port); err != nil {
		log.Fatal("Failed to run server:", err)
	}
}
