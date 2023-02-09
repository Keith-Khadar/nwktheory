package types

type Connection struct {
	SourceUser string `json:"SourceUser"`
	DestinationUser string `json:"DestinationUser"`
	Weight float32 `json:"Weight"`
}

func ValidateConnection(c *Connection) bool { return true }