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
func TestUpdateUser(t *testing.T) {

	// Create storage
	s:= NewMemoryStorage()

	// Create test user
	var testUser *types.User = &types.User{
		Name: "TestUser",
		Email: "test@test.com",
		ProfilePic: "/test/image.png",
	}

	// Insert user into the store
	s.InsertUser(testUser)

	// Check if names can be changed
	s.UpdateUser(testUser.Email, "ChangedName", "")
	assert.Equal(t, "ChangedName", testUser.Name) // Changed
	assert.Equal(t, "/test/image.png", testUser.ProfilePic) // NOT changed

	// Check if ProfilePic path can be changed
	s.UpdateUser(testUser.Email, "", "/changed/image.png")
	assert.Equal(t, "ChangedName", testUser.Name) // NOT changed
	assert.Equal(t, "/changed/image.png", testUser.ProfilePic) // Changed

	// Check if UpdateUser works when all parameters are used at once
	s.UpdateUser(testUser.Email, "FinalName", "/final/path")
	assert.Equal(t, "FinalName", testUser.Name)
	assert.Equal(t, "/final/path", testUser.ProfilePic)
}

func TestInsertConnection(t *testing.T) {
	// Create storage
	s:= NewMemoryStorage()

	// Create test users
	var userJim *types.User = &types.User{
		Name: "Jim",
		Email: "jim@test.com",
		ProfilePic: "/test/jim.png",
	}

	var userMartha *types.User = &types.User{
		Name: "Martha",
		Email: "martha@test.com",
		ProfilePic: "/test/martha.png",
	}

	// Create connection object
	var jimToMarthaConn *types.Connection = &types.Connection{
		SourceUser: "jim@test.com",
		DestinationUser: "martha@test.com",
	}

	var mirrorConn *types.Connection = &types.Connection{
		SourceUser: "martha@test.com",
		DestinationUser: "jim@test.com",
	}

	// Insert users to db
	s.InsertUser(userJim)
	s.InsertUser(userMartha)

	// Insert connection
	s.InsertConnection(userJim.Email, jimToMarthaConn)

	// Check connection was added to Jim's user object
	assert.Equal(t, jimToMarthaConn.DestinationUser, userJim.Connections[0].DestinationUser)
	assert.Equal(t, mirrorConn.DestinationUser, userMartha.Connections[0].DestinationUser)
}

func TestDeleteConnection(t *testing.T) {
	// Create storage
	s:= NewMemoryStorage()

	// Create test users
	var userJim *types.User = &types.User{
		Name: "Jim",
		Email: "jim@test.com",
		ProfilePic: "/test/jim.png",
	}

	var userMartha *types.User = &types.User{
		Name: "Martha",
		Email: "martha@test.com",
		ProfilePic: "/test/martha.png",
	}

	// Create connection object
	var jimToMarthaConn *types.Connection = &types.Connection{
		SourceUser: "jim@test.com",
		DestinationUser: "martha@test.com",
	}

	var mirrorConn *types.Connection = &types.Connection{
		SourceUser: "martha@test.com",
		DestinationUser: "jim@test.com",
	}

	// Insert users to db
	s.InsertUser(userJim)
	s.InsertUser(userMartha)

	// Insert connection
	s.InsertConnection(userJim.Email, jimToMarthaConn)

	// Check connection was added to Jim and Martha user object
	assert.Equal(t, jimToMarthaConn.DestinationUser, userJim.Connections[0].DestinationUser)
	assert.Equal(t, mirrorConn.DestinationUser, userMartha.Connections[0].DestinationUser)

	// Delete the connection for Jim
	s.DeleteConnection(userJim.Email, jimToMarthaConn.SourceUser, jimToMarthaConn.DestinationUser)

	// Check the connection was deleted for jim and the change was mirrored for Martha
	assert.Equal(t, 0, len(userJim.Connections))
	assert.Equal(t, 0, len(userMartha.Connections))
}