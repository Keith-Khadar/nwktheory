package storage

import "server/types"

type Storage interface {
	Get(int) *types.User
}
