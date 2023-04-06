package types

type Message struct {
	User    string `json:"User"`
	Channel string `json:"Channel"`
	Message string `json:"Message"`
}

func ValidateMessage(m *Message) bool {
	if m.User != "" && m.Channel != "" && m.Message != "" {
		return true
	}
	return false
}
