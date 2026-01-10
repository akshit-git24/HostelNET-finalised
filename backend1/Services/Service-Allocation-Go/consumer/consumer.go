package consumer

import (
	"context"
	"encoding/json"
	"log"
	"os"
    "hostelnet/allocation-service/models"
	"github.com/segmentio/kafka-go"
	"gorm.io/gorm"
)

type UserEvent struct {
	Event    string `json:"event"`
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Role     string `json:"role"`
}

func StartUserConsumer(db *gorm.DB) {
	brokerUrl := os.Getenv("KAFKA_BROKER_URL")
    if brokerUrl == "" {
        log.Println("KAFKA_BROKER_URL not set, default to localhost:9092")
        brokerUrl = "localhost:9092"
    }
    
	topic := "user-events"
	groupID := "allocation_service_go_group"

	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  []string{brokerUrl},
		Topic:    topic,
		GroupID:  groupID,
		MinBytes:  10e3, 
		MaxBytes:  10e6, 
		StartOffset: kafka.FirstOffset,
	})

	log.Println("Starting Kafka Consumer for topic:", topic)

	for {
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			log.Printf("could not read message: %v", err)
			break
		}
    
		var event UserEvent
		if err := json.Unmarshal(m.Value, &event); err != nil {
			log.Printf("failed to unmarshal message: %v", err)
			continue
		}

		ProcessMessage(db, event)
	}

	if err := r.Close(); err != nil {
		log.Fatal("failed to close reader:", err)
	}
}

func ProcessMessage(db *gorm.DB, event UserEvent) {
	log.Printf("Processing event %s for user_id %d", event.Event, event.UserID)

	if event.UserID == 0 {
        return
    }

	switch event.Event {
	case "UserCreated", "UserUpdated":
		user := models.User{
			UserID:   event.UserID,
			Username: event.Username,
			Email:    event.Email,
			Role:     event.Role,
		}

		result := db.Save(&user)
        if result.Error != nil {
            log.Printf("Error saving user: %v", result.Error)
        } else {
             log.Printf("Successfully saved/updated user %s", user.Username)
        }

	case "UserDeleted":
		result := db.Delete(&models.User{}, "user_id = ?", event.UserID)
        if result.Error != nil {
             log.Printf("Error deleting user: %v", result.Error)
        } else {
             log.Printf("Successfully deleted user %d", event.UserID)
        }

	default:
		log.Printf("Unknown event type: %s", event.Event)
	}
}
