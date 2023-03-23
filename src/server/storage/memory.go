package storage

import (
	"errors"
	"fmt"
	"server/types"
)

type MemoryStorage struct {
	Users []*types.User
}

func NewMemoryStorage() *MemoryStorage {
	return &MemoryStorage{}
}

func (s *MemoryStorage) GetUser(Email string) (*types.User, error) {
	var err error 

	for _, user := range s.Users {
		if (user.Email == Email) {
			return user, err
		}
	}

	// Error is no documents for compatability 
	err = errors.New("no documents")
	return nil, err
}

func (s *MemoryStorage) InsertUser(User *types.User) error {

	if types.ValidateUser(User) {
		User.Connections = make([]types.Connection, 0)
		s.Users = append(s.Users, User)
		fmt.Printf("Inserted user: [Name: %v, Email: %v]\n", User.Name, User.Email)
	} else {
		return errors.New("invalid user")
	}

	return nil
}

func (s *MemoryStorage) UpdateUser(Email string, Name string) error {
	
	for _, user := range(s.Users) {
		if user.Email == Email {
			user.Name = Name
		}
	}

	return nil
}

func (s *MemoryStorage) DeleteUser(Email string) error {

	newUsers := []*types.User {}

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

func (s *MemoryStorage) InsertConnection(Email string, Connection *types.Connection) error {
	user, err := s.GetUser(Email)

	// Check if connection format is valid
	if !types.ValidateConnection(Connection) {
		return errors.New("invalid connection")
	}

	// Returns error if User with Email does not exist
	if err != nil {
		return err
	}


	// Check to see if the connection being inserted is a duplicate if not return error
	for _, currConnection := range(user.Connections) {
		if currConnection.SourceUser == Connection.SourceUser &&
			currConnection.DestinationUser == Connection.DestinationUser {
				return errors.New("connection already exists")
			}
	}

	// Check if destination user exists in the database
	_, err = s.GetUser(Connection.DestinationUser)
	if err != nil {
		return errors.New("destination user does not exist")
	}

	// Add connection to list for the user
	user.Connections = append(user.Connections, *Connection)

	return err

}

func (s *MemoryStorage) DeleteConnection(UserEmail string, SourceUser string, DestinationUser string) error {
	user, err := s.GetUser(UserEmail)

	if err != nil {
		return err
	}

	// Create new array for connections
	newConnections := []types.Connection {}

	// Add all connections except the one that is to be deleted
	for _, connection := range user.Connections {
		if connection.SourceUser == SourceUser && connection.DestinationUser == DestinationUser {
			continue
		}
		newConnections = append(newConnections, connection)
	}

	user.Connections = newConnections

	return err
}