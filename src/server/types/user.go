package types

type User struct {
	UserID string `json:"UserId"`
	Name   string `json:"Name"`
	Email  string `json:"Email"`
}

func ValidateUser(u *User) bool { return true }
