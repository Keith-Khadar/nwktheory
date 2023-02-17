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

	// Error is no documents for compatability 
	err = errors.New("no documents")
	return nil, err
}

func (s *MemoryStorage) InsertUser(User *types.User) error {
	s.Users = append(s.Users, *User)
	return nil
}

func (s *MemoryStorage) UpdateUser(Email string, Name string) error {
	user, err := s.GetUser(Email)

	if err != nil {
		return err
	}

	user.Name = Name
	return err
}

func (s *MemoryStorage) InsertConnection(Email string, Connection *types.Connection) error {
	user, err := s.GetUser(Email)

	if err != nil {
		return err
	}

	user.Connections = append(user.Connections, *Connection)
	return err
}

func (s *MemoryStorage) DeleteUser(Email string) error {

	newUsers := []types.User {}

	// Add every user except for the user to be deleted
	for _, user := range s.Users {
		if (user.Email == Email) {
			continue
		}
		newUsers = append(newUsers, user)
	}

	s.Users = newUsers
	return nil
}

func (s *MemoryStorage) DeleteConnection(UserEmail string, SourceUser string, DestinationUser string) error {
	user, err := s.GetUser(UserEmail)

	if err != nil {
		return err
	}

	// Create new array for connections
	newConnections := []types.Connection {}

	for _, connection := range user.Connections {
		if connection.SourceUser == SourceUser && connection.DestinationUser == DestinationUser {
			continue
		}
		newConnections = append(newConnections, connection)
	}

	return err
}