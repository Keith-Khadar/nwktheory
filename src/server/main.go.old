package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
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

	// Create mux router
	myRouter := mux.NewRouter().StrictSlash(true)

	myRouter.HandleFunc("/", homePage)

	// returnAllUsers
	myRouter.HandleFunc("/users", returnAllUsers)

	log.Fatal(http.ListenAndServe(":10000", myRouter))
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
