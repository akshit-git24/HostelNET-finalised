package models

import (
	"time"
)


type User struct {
	UserID   int    `gorm:"primaryKey;autoIncrement:false" json:"user_id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Role     string `json:"role"`
}

type University struct {
	ID            int       `gorm:"primaryKey" json:"id"`
	UserID        int       `json:"user_id"`
	Name          string    `json:"name"`
	ContactNumber string    `json:"contact_number"`
	Location      string    `json:"location"`
	Documents     string    `json:"documents"`
	IsVerified    bool      `json:"is_verified"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type Student struct {
	ID            int       `gorm:"primaryKey" json:"id"`
	UserID        int       `json:"student_uni_id"`
	UniversityID  int       `json:"university_id"`
	Name          string    `json:"name"`
	ContactNumber string    `json:"contact_number"`
	IsDisabled    bool      `json:"is_disabled"`
	HostelID      uint      `json:"hostel_id"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type Hostel struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	UserID        int       `json:"hostel_id"`
	Name          string    `json:"name"`
	ContactNumber string    `json:"contact_number"`
	Capacity      int       `json:"capacity"`
	Location      string    `json:"location"`
	OwnerName     string    `json:"owner_name"`
	UniversityID  int       `json:"university_id"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type Room struct {
	ID                uint      `gorm:"primaryKey" json:"id"`
	HostelID          uint      `json:"hostel_id"`
	RoomNumber        string    `json:"room_number"`
	RoomType          string    `json:"room_type"` 
	Capacity          int       `json:"capacity"`
	AvailableCapacity int       `json:"available_capacity"`
	Floor             int       `json:"floor"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

type Allocation struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	StudentID  int       `json:"student_id"`
	HostelID   uint      `json:"hostel_id"`
	RoomNumber string    `json:"room_number"`
	Status     string    `json:"status"` 
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type HostelApplication struct {
	ID                 uint      `gorm:"primaryKey" json:"id"`
	StudentID          int       `json:"student_id"`
	HostelID           uint      `json:"hostel_id"`
	StudentName        string    `json:"student_name"`
	Documents          string    `json:"documents"` 
	Remarks            string    `json:"remarks"`
	RoommatePreference string    `json:"roommate_preference"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}
