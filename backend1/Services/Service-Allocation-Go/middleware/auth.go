package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Missing token"})
			return
		}

		tokenString := authHeader
		if strings.HasPrefix(tokenString, "Bearer ") {
			tokenString = strings.TrimPrefix(tokenString, "Bearer ")
		}

		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Invalid token format"})
			return
		}

		secretKey := []byte(os.Getenv("SECRET_KEY"))
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return secretKey, nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Invalid token"})
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			if userID, ok := claims["user_id"].(float64); ok {
				c.Set("user_id", int(userID))
			} else if _, ok := claims["user_id"].(string); ok {
			}
            
            if role, ok := claims["role"].(string); ok {
                c.Set("role", role)
            }
            if username, ok := claims["username"].(string); ok {
                c.Set("username", username)
            }

			c.Next()
		} else {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Invalid token claims"})
		}
	}
}
