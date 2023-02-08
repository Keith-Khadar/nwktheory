package storage

import "server/types"

type MemoryStorage struct{}

func NewMemoryStorage() *MemoryStorage {
	return &MemoryStorage{}
}

func (s *MemoryStorage) Get(id int) *types.User {
	return &types.User{
		UserID: "123",
		Name:   "Foo",
		Email:  "default@example.com",
	}
}
