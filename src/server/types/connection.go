package types

type Connection struct {
	SourceUser      string  `json:"from" bson:"sourceuser"`
	DestinationUser string  `json:"to" bson:"destinationuser"`
}

func ValidateConnection(c *Connection) bool {
	if c.SourceUser != "" && c.DestinationUser != "" {
		return true
	}
	return false
}
