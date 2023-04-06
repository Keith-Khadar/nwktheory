package types

type User struct {
	Name        string       `json:"Name,omitempty" bson:"name"`
	Email       string       `json:"Email,omitempty" bson:"email"`
	ProfilePic  string       `json:"ProfilePic,omitempty"`
	Connections []Connection `json:"Connections,omitempty" bson:"connections"`
	Channels    []string     `json:"Channels,omitempty" bson:"channels"`
}

func ValidateUser(u *User) bool {
	if u.Name != "" && u.Email != "" {
		return true
	}
	return false
}
