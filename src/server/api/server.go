package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"server/storage"
	"server/util"

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
	router.HandleFunc("/user", s.handleGetUserByID)
	router.HandleFunc("/user/id", s.handleDeleteUserByID)
	return http.ListenAndServe(s.listenAddr, router)
}

func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the HomePage!")
	fmt.Println("Endpoint Hit: homePage")
}

func (s *Server) handleGetUserByID(w http.ResponseWriter, r *http.Request) {
	user := s.store.Get(10)

	json.NewEncoder(w).Encode(user)
}

func (s *Server) handleDeleteUserByID(w http.ResponseWriter, r *http.Request) {
	user := s.store.Get(10)

	_ = util.Round2Dec(10.34434)

	json.NewEncoder(w).Encode(user)
}
