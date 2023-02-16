package storage

import "server/types"

type Storage interface {
	Get(string) (*types.User, error)
	InsertUser(types.User) error
	InsertConnection(string, types.Connection) error
	DeleteUser(Email string) error
	DeleteConnection(UserEmail string, SourceUser string, DestinationUser string) error
}