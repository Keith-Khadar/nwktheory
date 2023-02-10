package types

type Connection struct {
	SourceUser string `json:"SourceUser"`
	DestinationUser string `json:"DestinationUser"`
	Weight float32 `json:"Weight"`
}

func ValidateConnection(c *Connection) bool { 
	if c.SourceUser != "" && c.DestinationUser != "" && c.Weight >= 0.0 {
		return true
	}
	return false
 }