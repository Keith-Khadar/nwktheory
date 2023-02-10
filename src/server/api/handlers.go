package api

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"server/types"
	"strings"

	"github.com/gorilla/mux"
)

func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the HomePage!")
	fmt.Println("Endpoint Hit: homePage")
}

func (s *Server) handleGetUserByEmail(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: handleGetUserByID")
	// Retrieve mux variables from URL
	vars := mux.Vars(r)

	// Get id from URL path
	email := vars["email"]

	user, err := s.store.Get(email)

	if err != nil {

		// Return HTTP 404 if user does not exist in db
		if strings.Contains(fmt.Sprint(err), "no documents") {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("User does not exist!"))

		} else { // Catch all
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal error see error log!"))
			fmt.Printf("Error: %v in handleGetUserByEmail for [Email: %v]", err, email)
		}
		// Exit here if error
		return
	}

	// No error encode user data
	json.NewEncoder(w).Encode(user)
}

func (s *Server) handleCreateUser(w http.ResponseWriter, r *http.Request) {
    fmt.Println("Endpoint Hit: handleCreateUser")
    // Get the body of our POST request
    reqBody, _ := ioutil.ReadAll(r.Body)

    // Unmarshal body of POST request into new User struct
    var user types.User
    json.Unmarshal(reqBody, &user)

    err := s.store.InsertUser(user)

    if err != nil {

        // Invalid user submission
        if strings.Contains(fmt.Sprint(err), "invalid user") {
            w.WriteHeader(http.StatusUnprocessableEntity)
            w.Write([]byte("Invalid user format!"))
			fmt.Printf("Error: Invalid user format in handleCreateUser")

        } else { // Catch all
            w.WriteHeader(http.StatusInternalServerError)
            w.Write([]byte("Internal error see error log!"))
            fmt.Printf("Error: %v in handleCreateUser for [Name: %v, Email: %v] ", err, user.Name, user.Email)

        }
    }
}

func (s *Server) handleCreateUserConnection(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: handleCreateUserConnection")

	// Retrieve mux variables from URL
	vars := mux.Vars(r)

	// Get Email from URL path
	reqUserEmail := vars["email"]

	// Get the body of our POST request
	var connection types.Connection
	json.NewDecoder(r.Body).Decode(&connection)

	user, err := s.store.Get(reqUserEmail)

	// Handle preliminary errors
	if err != nil {
		if strings.Contains(fmt.Sprint(err), "no documents") {
			// Return HTTP 404 if user does not exist in db
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("User does not exist!"))
			fmt.Printf("Error: Invalid user [Email: %v] in handleCreateUserConnection", reqUserEmail)

		} else if strings.Compare(reqUserEmail, connection.SourceUser) != 0 { 
			// Return HTTP 422 if requested user by email in /users/{email}/connections does not match soureUser in connection
			w.WriteHeader(http.StatusUnprocessableEntity)
			w.Write([]byte("Requested user does not match SourceUser in connection!"))
			fmt.Printf("Error: Requested user [Email: %v] does not match SourceUser [Email: %v] in handleCreateUserConnection", user.Email, connection.SourceUser)

		} else { // Catch all
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal error see error log!"))
			fmt.Printf("Error: %v in handleCreateUserConnection for [Email: %v]", err, user.Email)
		}

		return
	}

	err = s.store.InsertConnection(user.Email, connection)

	// Return error if mongo returns error when inserting a connection
	if err != nil {
		if  strings.Contains(fmt.Sprint(err), "invalid connection") {
			// Return HTTP 422 if requested connection to add is invalid
			w.WriteHeader(http.StatusUnprocessableEntity)
			w.Write([]byte("Invalid connection format!"))
			fmt.Printf("Error: Invalid connection format in handleCreateUserConnection")
		} else { // Catch all
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal error see error log!"))
			fmt.Printf("Error: %v in handleCreateUserConnection from InsertConnection for [Email: %v]", err, user.Email)
		}
	}
}