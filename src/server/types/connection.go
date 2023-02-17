package types

type Connection struct {
	SourceUser string `json:"SourceUser" bson:"sourceuser"`
	DestinationUser string `json:"DestinationUser" bson:"destinationuser"`
	Weight float32 `json:"Weight" bson:"weight"`
}

func ValidateConnection(c *Connection) bool { 
	if c.SourceUser != "" && c.DestinationUser != "" && c.Weight >= 0.0 {
		return true
	}
	return false
 }