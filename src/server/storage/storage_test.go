package storage

import (
	"reflect"
	"server/types"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetUser(t *testing.T) {

	// Create new test store
	s := NewMemoryStorage()

	// Create test user
	var testUser *types.User = &types.User{
		Name: "TestUser",
		Email: "test@test.com",
	}

	// Insert test user
	s.InsertUser(testUser)

	returnedUser, err := s.GetUser("test@test.com")

	// // Check no errors are returned
	assert.Nil(t, err)

	// Check returned user is the same as the inserted user
	assert.Equal(t, reflect.DeepEqual(returnedUser, testUser), true)
}

func TestInsertUser(t *testing.T) {

	// Create new test store
	s :=  NewMemoryStorage()

	// Create test user
	var testUser *types.User = &types.User{
		Name: "TestUser",
		Email: "test@test.com",
	}

	// User does not exist in store yet, should return error "no documents"
	_, err := s.GetUser("test@test.com")

	// Check if GetUser throws no documents error
	assert.NotNil(t, err)

	// Insert test user
	s.InsertUser(testUser)

	// Get user from store
	returnedUser, err := s.GetUser("test@test.com")

	// Check no errors are returned
	assert.Nil(t, err)

	// Check returned user is the same as the inserted user
	assert.Equal(t, reflect.DeepEqual(returnedUser, testUser), true)
}

func TestDeleteUser(t *testing.T) {

	s := NewMemoryStorage()

	// Create test user
	var testUser *types.User = &types.User{
		Name: "TestUser",
		Email: "test@test.com",
	}

	// Insert test user
	err := s.InsertUser(testUser)

	// Check no errors are returned
	assert.Nil(t, err)

	// Delete user
	err = s.DeleteUser("test@test.com")

	// Check no errors are returned
	assert.Nil(t, err)

	// Try to get user
	_, err = s.GetUser("test@test.com")

	// Make sure no user can be retrieved after deleting
	assert.NotNil(t, err)
}