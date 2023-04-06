package types

type Channel struct {
	ID string `json:"ID" bson:"id"`
	Users []string `json:"Users" bson:"users"`
}