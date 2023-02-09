package api

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"server/storage"
	"server/types"
	"strings"

	"github.com/gorilla/mux"
)

type Server struct {
	listenAddr string
	store      storage.Storage
}

func NewServer(listenAddr string, store storage.Storage) *Server {
	return &Server{
		listenAddr: listenAddr,
		store:      store,
	}
}

func (s *Server) Start() error {
	//Create mux router
	router := mux.NewRouter()

	router.HandleFunc("/", homePage)
	router.HandleFunc("/users/{id}", s.handleGetUserByID).Methods("GET")
	router.HandleFunc("/users", s.handleCreateUser).Methods("POST")
	return http.ListenAndServe(s.listenAddr, router)
}

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
			fmt.Println(err)
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

	s.store.InsertUser(user)
}
