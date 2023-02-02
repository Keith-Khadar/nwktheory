package types

type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func ValidateUser(u *User) bool { return true }
