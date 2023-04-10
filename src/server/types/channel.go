package types

type Channel struct {
	ID    string   `json:"ID" bson:"id"`
	Users []string `json:"Users" bson:"users"`
}

func ValidateChannel(c *Channel) bool {
	if c.ID != "" && len(c.Users) > 0 {
		return true
	}
	return false
}
