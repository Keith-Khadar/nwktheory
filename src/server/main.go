package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

// Structs
type User struct {
	Name string `json:"Name"`
}

// Temporary global for simulated database
var TestUserDatabase []User

func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the HomePage!")
	fmt.Println("Endpoint Hit: homePage")
}

func returnAllUsers(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: returnAllUsers")
	json.NewEncoder(w).Encode(TestUserDatabase)
}

func handleRequests() {
	http.HandleFunc("/", homePage)

	// returnAllUsers
	http.HandleFunc("/users", returnAllUsers)

	log.Fatal(http.ListenAndServe(":10000", nil))
}

func main() {
	TestUserDatabase = []User{
		User{Name: "Keith"},
		User{Name: "Alex"},
		User{Name: "Naresh"},
		User{Name: "Eric"},
	}

	handleRequests()
}
