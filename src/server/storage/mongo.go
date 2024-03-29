package storage

import (
	"context"
	"errors"
	"fmt"
	"server/types"
	"time"

	"github.com/fatih/color"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type MongoStorage struct {
	DatabaseName          string
	UserCollectionName    string
	ChannelCollectionName string
	Client                *mongo.Client
}

func NewMongoStorage(DatabaseName string, UserCollectionName string, ChannelCollectionName string) *MongoStorage {
	// Get client, ctx, cancel, and err from connect method
	client, ctx, cancel, err := connect("mongodb://localhost:27017")
	if err != nil {
		panic(err)
	}

	// Used to temporarily get rid of unused variable error for cancel
	_ = cancel

	// "defer" will excecute right before returning
	// Commented out to prevent closing the database before inserting values
	// defer close(client, ctx, cancel)

	ping(client, ctx)

	// Return MongoStorage object with client pointer
	return &MongoStorage{
		DatabaseName:          DatabaseName,
		UserCollectionName:    UserCollectionName,
		ChannelCollectionName: ChannelCollectionName,
		Client:                client,
	}
}

func (s *MongoStorage) GetUser(Email string) (*types.User, error) {
	coll := s.Client.Database(s.DatabaseName).Collection(s.UserCollectionName)

	// Create var to capture data from db
	var user types.User

	// Filter to find user based on UserID
	filter := bson.D{{Key: "email", Value: Email}}

	err := coll.FindOne(context.TODO(), filter).Decode(&user)

	return &user, err
}

func (s *MongoStorage) InsertUser(user *types.User) error {
	coll := s.Client.Database(s.DatabaseName).Collection(s.UserCollectionName)

	_, err := s.GetUser(user.Email)
	if err == nil {
		return errors.New("user already exists")
	} else {
		if types.ValidateUser(user) {
			result, _ := coll.InsertOne(context.TODO(), user)
			fmt.Printf("Inserted user: [Name: %v, Email: %v] with _id: %v\n", user.Name, user.Email, result.InsertedID)
			return nil
		} else {
			return errors.New("invalid user")
		}
	}
}

func (s *MongoStorage) DeleteUser(Email string) error {
	coll := s.Client.Database(s.DatabaseName).Collection(s.UserCollectionName)

	user, err := s.GetUser(Email)

	if err != nil {
		return err
	}

	for _, removeConnection := range user.Connections {
		// Create paramters for db query
		filter := bson.M{"email": removeConnection.DestinationUser}
		changes := bson.M{"$pull": bson.M{"connections": bson.M{"sourceuser": removeConnection.DestinationUser, "destinationuser": removeConnection.SourceUser}}}

		// Delete connection
		_, err = coll.UpdateOne(context.TODO(), filter, changes)

	}

	// Find correct user
	filter := bson.M{"email": Email}

	// Delete the intended user
	_, err = coll.DeleteOne(context.TODO(), filter)

	// Will return error if it exists
	return err
}

func (s *MongoStorage) UpdateUser(Email string, Name string, ProfilePic string, Channel string) error {
	coll := s.Client.Database(s.DatabaseName).Collection(s.UserCollectionName)

	// Select document with Email from function parameter
	filter := bson.M{"email": Email}

	// Check if user already exists
	_, err := s.GetUser(Email)

	if err != nil {
		return err
	}

	// Update the name
	if Name != "" {
		change := bson.M{"$set": bson.M{"name": Name}}

		_, err = coll.UpdateOne(context.TODO(), filter, change)

		// Check for errors
		if err != nil {
			return err
		}
	}

	// Update the profile pic
	if ProfilePic != "" {
		change := bson.M{"$set": bson.M{"profilepic": ProfilePic}}

		_, err = coll.UpdateOne(context.TODO(), filter, change)

		// Check for errors
		if err != nil {
			return err
		}
	}

	// Update the user channels
	if Channel != "" {
		change := bson.M{"$push": bson.M{"channels": Channel}}

		_, err = coll.UpdateOne(context.TODO(), filter, change)

		// Check for errors
		if err != nil {
			return err
		}
	}

	return nil
}

func (s *MongoStorage) InsertConnection(Email string, connection *types.Connection) error {
	coll := s.Client.Database(s.DatabaseName).Collection(s.UserCollectionName)

	// Select document with Email from function parameter
	filter := bson.M{"email": Email}

	if types.ValidateConnection(connection) {
		// Check if connection already exists
		user, err := s.GetUser(Email)

		// Check for matching connection
		for _, queriedConnection := range user.Connections {

			// Return an error if SourceUser and DestinationUser are the same
			if connection.SourceUser == queriedConnection.SourceUser &&
				connection.DestinationUser == queriedConnection.DestinationUser {
				return errors.New("connection already exists")
			}
		}

		// Check if destination user exists in the database
		_, _desterr := s.GetUser(connection.DestinationUser)

		if _desterr != nil {
			return errors.New("destination user does not exist")
		}

		// Append a connection object to the connections array for user selected by the filter above
		change := bson.M{"$push": bson.M{"connections": connection}}

		_, err = coll.UpdateOne(context.TODO(), filter, change)

		fmt.Printf("Inserted connection: [SourceUser: %v, DestinationUser: %v]\n", connection.SourceUser,
			connection.DestinationUser)

		// Returns nill if coll.UpdateOne returns an error from db
		return err
	} else {
		return errors.New("invalid connection")
	}
}

func (s *MongoStorage) DeleteConnection(UserEmail string, SourceUser string, DestinationUser string) error {
	coll := s.Client.Database(s.DatabaseName).Collection(s.UserCollectionName)

	user, err := s.GetUser(UserEmail)

	if err != nil {
		return errors.New("user does not exist")
	}

	// Check for matching connection
	for _, queriedConnection := range user.Connections {
		if DestinationUser != queriedConnection.DestinationUser {
			continue
		} else {
			// Create paramters for db query
			filter := bson.M{"email": UserEmail}
			changes := bson.M{"$pull": bson.M{"connections": bson.M{"sourceuser": SourceUser, "destinationuser": DestinationUser}}}

			// Delete connection
			_, err = coll.UpdateOne(context.TODO(), filter, changes)

			return err
		}
	}

	return errors.New("connection does not exist")
}

func (s *MongoStorage) GetChannel(ID string) (*types.Channel, error) {
	coll := s.Client.Database(s.DatabaseName).Collection(s.ChannelCollectionName)

	var channel types.Channel

	filter := bson.D{{Key: "id", Value: ID}}

	err := coll.FindOne(context.TODO(), filter).Decode(&channel)

	return &channel, err
}

func (s *MongoStorage) InsertChannel(Channel *types.Channel) error {
	coll := s.Client.Database(s.DatabaseName).Collection(s.ChannelCollectionName)

	_, err := s.GetChannel(Channel.ID)
	if err == nil {
		return errors.New("channel already exists")
	} else {
		if types.ValidateChannel(Channel) {
			result, _ := coll.InsertOne(context.TODO(), Channel)
			fmt.Printf("Inserted channel: [ID: %v] with _id: %v", Channel.ID, result)
			return nil
		} else {
			return errors.New("invalid channel")
		}
	}

}

func (s *MongoStorage) DropDB(Name string) error {

	err := s.Client.Database(Name).Drop(context.Background())

	return err
}

// Taken from GeeksForGeeks
// URL: https://www.geeksforgeeks.org/how-to-use-go-with-mongodb/
// ======================================
// User defined method to close reources.
// Closes mongoDB connection and cancel context
func close(client *mongo.Client, ctx context.Context, cancel context.CancelFunc) {

	// CancelFunc to cancel context
	defer cancel()

	// Clieant provides a method to close a mongoDB connection
	defer func() {

		// Return error if client.Diconnect method does not finish in time
		if err := client.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()
}

// Taken from GeeksForGeeks
// URL: https://www.geeksforgeeks.org/how-to-use-go-with-mongodb/
// ============
// Returns:
// 1) mongo.Client used for database operation
// 2) context.Context used for setting deadlines for process
// 3) context.CancelFunc will be used to cancel context
// and any resources that are associated with it.
func connect(uri string) (*mongo.Client, context.Context, context.CancelFunc, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))

	return client, ctx, cancel, err
}

// Taken from GeeksForGeeks
// URL: https://www.geeksforgeeks.org/how-to-use-go-with-mongodb/
// ======================================
func ping(client *mongo.Client, ctx context.Context) error {

	// mongo.Client has Ping to ping mongoDB, deadline of
	// the Ping method will be determined by cxt
	// Ping method return error if any occurred, then
	// the error can be handled.
	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		return err
	}
	greenText := color.New(color.FgHiGreen).SprintFunc()
	fmt.Printf("%v\n", greenText("MongoDB connected successfully"))
	return nil
}
