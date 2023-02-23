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
	fmt.Fprintf(w, "Welcome to the HomePage! from %v\n", r.RemoteAddr)
	fmt.Println("Endpoint Hit: homePage")
}

func (s *Server) handleGetUserByEmail(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("Endpoint Hit: handleGetUserByEmail from %v\n", r.RemoteAddr)
	// Retrieve mux variables from URL
	vars := mux.Vars(r)

	// Get id from URL path
	email := vars["email"]

	user, err := s.store.GetUser(email)

	if err != nil {

		// Return HTTP 404 if user does not exist in db
		if strings.Contains(fmt.Sprint(err), "no documents") {
			ApiHttpError(w, err, http.StatusNotFound, "User does not exist!")

		} else { // Catch all
			ApiHttpError(w, err, http.StatusInternalServerError, "")
		}
		// Exit here if error
		return
	}

	// No error encode user data
	json.NewEncoder(w).Encode(user)
}

func (s *Server) handleCreateUser(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("Endpoint Hit: handleCreateUser from %v\n", r.RemoteAddr)
	// Get the body of our POST request
	reqBody, _ := ioutil.ReadAll(r.Body)

	// Unmarshal body of POST request into new User struct
	var user types.User
	json.Unmarshal(reqBody, &user)

	err := s.store.InsertUser(&user)

	if err != nil {

		// Invalid user submission
		if strings.Contains(fmt.Sprint(err), "invalid user") {
			ApiHttpError(w, err, http.StatusUnprocessableEntity, "")

		} else { // Catch all
			ApiHttpError(w, err, http.StatusInternalServerError, "")

		}
	}
}

func (s *Server) handleDeleteUser(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("Endpoint Hit: handleDeleteUser from %v\n", r.RemoteAddr)
	// Retrieve mux variables from URL
	vars := mux.Vars(r)

	// Get id from URL path
	email := vars["email"]

	err := s.store.DeleteUser(email)

	if err != nil {

		ApiHttpError(w, err, http.StatusInternalServerError, "")
	}
}

func (s *Server) handleUpdateUser(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("Endpoint Hit: handleUpdateUser from %v", r.RemoteAddr)

	// Retrieve mux variables from URL
	vars := mux.Vars(r)

	// Get id from URL path
	email := vars["email"]
	queriedUpdateName := r.URL.Query().Get("name")

	err := s.store.UpdateUser(email, queriedUpdateName)

	if err != nil {
		ApiHttpError(w, err, http.StatusInternalServerError, "")

	}
}

func (s *Server) handleCreateUserConnection(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("Endpoint Hit: handleCreateUserConnection from %v\n", r.RemoteAddr)

	// Retrieve mux variables from URL
	vars := mux.Vars(r)

	// Get Email from URL path
	reqUserEmail := vars["email"]

	// Get the body of our POST request
	var connection types.Connection
	json.NewDecoder(r.Body).Decode(&connection)

	user, err := s.store.GetUser(reqUserEmail)

	// Handle preliminary errors
	if err != nil {
		if strings.Contains(fmt.Sprint(err), "no documents") {
			// Return HTTP 404 if user does not exist in db
			ApiHttpError(w, err, http.StatusNotFound, "User does not exist!")

		} else if strings.Compare(reqUserEmail, connection.SourceUser) != 0 {
			// Return HTTP 422 if requested user by email in /users/{email}/connections does not match soureUser in connection
			ApiHttpError(w, err, http.StatusUnprocessableEntity, "Requested user does not match SourceUser in connection!")

		} else { // Catch all
			ApiHttpError(w, err, http.StatusInternalServerError, "")

		}

		return
	}

	err = s.store.InsertConnection(user.Email, &connection)

	// Return error if mongo returns error when inserting a connection
	if err != nil {
		if strings.Contains(fmt.Sprint(err), "invalid connection") {
			// Return HTTP 422 if requested connection to add is invalid
			ApiHttpError(w, err, http.StatusUnprocessableEntity, "Invalid connection format!")
		} else { // Catch all
			ApiHttpError(w, err, http.StatusInternalServerError, "")
		}
	} else {
		//Adding mirror conneciton for desitnation user
		var newConnection = connection
		newConnection.SourceUser = connection.DestinationUser
		newConnection.DestinationUser = connection.SourceUser
		err = s.store.InsertConnection(connection.DestinationUser, &newConnection)
	}
}

func (s *Server) handleDeleteUserConnection(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("Endpoint Hit: handleDeleteUserConnection from %v\n", r.RemoteAddr)
	// Retrieve mux variables from URL
	vars := mux.Vars(r)

	// Get Email from URL path
	reqUserEmail := vars["email"]

	// If SourceUser not specificied in a query parameter get it from url path variable
	queriedSourceUser := r.URL.Query().Get("sourceuser")
	if queriedSourceUser == "" {
		queriedSourceUser = reqUserEmail
	}

	queriedDestinationUser := r.URL.Query().Get("destinationuser")

	err := s.store.DeleteConnection(reqUserEmail, queriedSourceUser, queriedDestinationUser)

	if err != nil {
		ApiHttpError(w, err, http.StatusInternalServerError, "")
	}
	// s.store.DeleteConnection(queriedDestinationUser, queriedDestinationUser, queriedSourceUser)
}
