package types

type User struct {
	Name   string `json:"Name"`
	Email  string `json:"Email"`
	Connections []Connection `json:"Connections"`
}

func ValidateUser(u *User) bool { 
	if  u.Name != "" && u.Email != "" {
		return true
	}
	return false
}
