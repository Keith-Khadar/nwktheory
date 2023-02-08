package storage

import "server/types"

type Storage interface {
	Get(string) *types.User
	InsertUser(types.User)
}
