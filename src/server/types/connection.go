package types

type Connection struct {
	SourceUser      string  `json:"from" bson:"sourceuser"`
	DestinationUser string  `json:"to" bson:"destinationuser"`
	Weight          float32 `json:"weight" bson:"weight"`
}

func ValidateConnection(c *Connection) bool {
	if c.SourceUser != "" && c.DestinationUser != "" {
		return true
	}
	return false
}
