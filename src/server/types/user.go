package types

type User struct {
	Name   string `json:"Name" bson:"name"`
	Email  string `json:"Email" bson:"email"`
	Connections []Connection `json:"Connections" bson:"connections"`
}

func ValidateUser(u *User) bool { 
	if  u.Name != "" && u.Email != "" {
		return true
	}
	return false
}
