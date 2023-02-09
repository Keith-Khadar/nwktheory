package storage

import (
	"context"
	"fmt"
	"server/types"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type MongoStorage struct {
	DatabaseName   string
	CollectionName string
	Client         *mongo.Client
}

func NewMongoStorage(DatabaseName string, CollectionName string) *MongoStorage {
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
		DatabaseName:   DatabaseName,
		CollectionName: CollectionName,
		Client:         client,
	}
}

func (s *MongoStorage) Get(UserID string) (*types.User, error) {
	coll := s.Client.Database(s.DatabaseName).Collection(s.CollectionName)

	// Create var to capture data from db
	var user types.User

	// Filter to find user based on UserID
	filter := bson.D{{Key: "userid", Value: UserID}}

	err := coll.FindOne(context.TODO(), filter).Decode(&user)

	return &user, err
}

func (s *MongoStorage) InsertUser(user types.User) {
	coll := s.Client.Database(s.DatabaseName).Collection(s.CollectionName)

	result, err := coll.InsertOne(context.TODO(), user)

	if err != nil {
		panic(err)
	} else {
		fmt.Printf("Inserted user: [Name: %v, UserID: %v] with _id: %v\n", user.Name, user.UserID, result.InsertedID)
	}
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
	fmt.Println("MongoDB connected successfully")
	return nil
}
