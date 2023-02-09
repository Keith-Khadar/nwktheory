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

func (s *Server) handleGetUserByID(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: handleGetUserByID")
	// Retrieve mux variables from URL
	vars := mux.Vars(r)

	// Get id from URL path
	id := vars["id"]

	user, err := s.store.Get(id)

	if err != nil {

		// Return HTTP 404 if user does not exist in db
		if strings.Contains(fmt.Sprint(err), "no documents") {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("User does not exist!"))

		} else { // Catch all
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal error see error log!"))
			fmt.Printf("Error: %v in handleGetUserByID for [ID: %v]", err, id)
		}
		// Exit here if error
		return
	}

	// No error encode user data
	json.NewEncoder(w).Encode(user)
}

func (s Server) handleCreateUser(w http.ResponseWriter, r *http.Request) {
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
