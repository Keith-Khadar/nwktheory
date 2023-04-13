package storage

import (
	"reflect"
	"server/types"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetUser(t *testing.T) {

	// Create new test store
	s := NewMongoStorage("testing", "users", "channels")

	// Delete old testing store
	s.DropDB("testing")

	// Remove user
	s.DeleteUser("test@test.com")

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
	assert.Equal(t, true, reflect.DeepEqual(returnedUser, testUser))

	// Delete testing store
	s.DropDB("testing")
}

func TestInsertUser(t *testing.T) {

	// Create new test store
	s := NewMongoStorage("testing", "users", "channels")

	// Delete old testing store
	s.DropDB("testing")

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

	// Delete testing store
	s.DropDB("testing")
}

func TestDeleteUser(t *testing.T) {

	// Create new test store
	s := NewMongoStorage("testing", "users", "channels")

	// Delete old testing store
	s.DropDB("testing")

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

	// Delete testing store
	s.DropDB("testing")
}

func TestUpdateUser(t *testing.T) {

	// Create storage
	s := NewMongoStorage("testing", "users", "channels")

	// Delete old testing store
	s.DropDB("testing")

	// Create test user
	var testUser *types.User = &types.User{
		Name: "TestUser",
		Email: "test@test.com",
		ProfilePic: "/test/image.png",
	}

	// Insert user into the store
	s.InsertUser(testUser)

	// Check if name can be changed
	// Change name
	s.UpdateUser(testUser.Email, "ChangedName", "")

	// Get user from store
	returnedUser, _ := s.GetUser("test@test.com")

	// Check if name was changed
	assert.Equal(t, "ChangedName", returnedUser.Name) // Changed
	assert.Equal(t, "/test/image.png", returnedUser.ProfilePic) // NOT changed


	// Check if ProfilePic path can be changed
	// Change ProfilePic path
	s.UpdateUser(testUser.Email, "", "/changed/image.png")

	// Get user from store
	returnedUser, _ = s.GetUser("test@test.com")

	// Check if ProfilePic path was changed
	assert.Equal(t, "ChangedName", returnedUser.Name) // NOT changed
	assert.Equal(t, "/changed/image.png", returnedUser.ProfilePic) // Changed


	// Check if UpdateUser works when all parameters are used at once
	// Change name and ProfilePic path
	s.UpdateUser(testUser.Email, "FinalName", "/final/path")

	// Get user from store
	returnedUser, _ = s.GetUser("test@test.com")

	// Check if name and ProfilePic path were changed
	assert.Equal(t, "FinalName", returnedUser.Name)
	assert.Equal(t, "/final/path", returnedUser.ProfilePic)

	// Delete testing store
	s.DropDB("testing")
}

func TestInsertConnection(t *testing.T) {

	// Create storage
	s := NewMongoStorage("testing", "users", "channels")

	// Delete old testing store
	s.DropDB("testing")
	
	// Create test users
	var userJim *types.User = &types.User{
		Name: "Jim",
		Email: "jim@test.com",
		ProfilePic: "/test/jim.png",
		Connections: []types.Connection{},
	}

	var userMartha *types.User = &types.User{
		Name: "Martha",
		Email: "martha@test.com",
		ProfilePic: "/test/martha.png",
		Connections: []types.Connection{},
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

	// Insert connections
	s.InsertConnection(userJim.Email, jimToMarthaConn)
	s.InsertConnection(userMartha.Email, mirrorConn)

	// Returned users
	returnedJim, _ := s.GetUser("jim@test.com")
	returnedMartha, _ := s.GetUser("martha@test.com")

	// Check connection was added to Jim's user object
	assert.Equal(t, jimToMarthaConn.DestinationUser, returnedJim.Connections[0].DestinationUser)
	assert.Equal(t, mirrorConn.DestinationUser, returnedMartha.Connections[0].DestinationUser)

	// Delete testing store
	s.DropDB("testing")
}

func TestDeleteConnection(t *testing.T) {

	// Create storage
	s := NewMongoStorage("testing", "users", "channels")

	// Delete old testing store
	s.DropDB("testing")

	// Create test users
	var userJim *types.User = &types.User{
		Name: "Jim",
		Email: "jim@test.com",
		ProfilePic: "/test/jim.png",
		Connections: []types.Connection{},
	}

	var userMartha *types.User = &types.User{
		Name: "Martha",
		Email: "martha@test.com",
		ProfilePic: "/test/martha.png",
		Connections: []types.Connection{},
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

	// Insert connections
	s.InsertConnection(userJim.Email, jimToMarthaConn)
	s.InsertConnection(userMartha.Email, mirrorConn)

	// Get users from db
	returnedJim, _ := s.GetUser("jim@test.com")
	returnedMartha, _ := s.GetUser("martha@test.com")

	// Check connection was added to Jim and Martha user object
	assert.Equal(t, jimToMarthaConn.DestinationUser, returnedJim.Connections[0].DestinationUser)
	assert.Equal(t, mirrorConn.DestinationUser, returnedMartha.Connections[0].DestinationUser)

	// Delete the connection for both users
	s.DeleteConnection(userJim.Email, jimToMarthaConn.SourceUser, jimToMarthaConn.DestinationUser)
	s.DeleteConnection(userMartha.Email, mirrorConn.SourceUser, mirrorConn.DestinationUser)

	// Get users from db
	returnedJim, _ = s.GetUser("jim@test.com")
	returnedMartha, _ = s.GetUser("martha@test.com")

	// Check the connection was deleted for jim and the change was mirrored for Martha
	assert.Equal(t, 0, len(returnedJim.Connections))
	assert.Equal(t, 0, len(returnedMartha.Connections))

	// Delete testing store
	s.DropDB("testing")
}

func TestGetChannel(t *testing.T) {

	// Create storage
	s := NewMongoStorage("testing", "users", "channels")

	// Delete old testing store
	s.DropDB("testing")

	// Create test channel
	var testChannel *types.Channel = &types.Channel{
		ID: "123456789",
		Users: []string{"jim@test.com", "martha@test.com"},
	}

	// Insert channel to db
	s.InsertChannel(testChannel)

	// Get channel from db
	returnedChannel, _ := s.GetChannel("123456789")

	// Check if channel was returned
	assert.Equal(t, testChannel.ID, returnedChannel.ID)
	assert.ElementsMatch(t, testChannel.Users, returnedChannel.Users)
}