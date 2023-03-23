package storage

import "server/types"

type Storage interface {
	GetUser(Email string) (*types.User, error)
	InsertUser(User *types.User) error
	UpdateUser(Email string, Name string, ProfilePic string) error
	InsertConnection(Email string, Connection *types.Connection) error
	DeleteUser(Email string) error
	DeleteConnection(UserEmail string, SourceUser string, DestinationUser string) error
}