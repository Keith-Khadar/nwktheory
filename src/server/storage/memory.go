package storage

import (
	"errors"
	"server/types"
)

type MemoryStorage struct {
	Users []types.User
}

func NewMemoryStorage() *MemoryStorage {
	return &MemoryStorage{}
}

func (s *MemoryStorage) GetUser(Email string) (*types.User, error) {
	var err error 

	for _, user := range s.Users {
		if (user.Email == Email) {
			return &user, err
		}
	}

	err = errors.New("no documents")
	return nil, err
}