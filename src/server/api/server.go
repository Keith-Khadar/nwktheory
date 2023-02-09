package api

import (
	"net/http"
	"server/storage"

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
	router.HandleFunc("/users/{email}/connections", s.handleCreateUserConnection).Methods("POST")
	return http.ListenAndServe(s.listenAddr, router)
}
