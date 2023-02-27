package api

import (
	"net/http"
	"server/storage"

	"github.com/gorilla/handlers"
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

	// Mux options allow CORS **INSECURE**
	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	router.HandleFunc("/", homePage)
	router.HandleFunc("/users/{email}", s.handleGetUserByEmail).Methods("GET")
	router.HandleFunc("/users", s.handleCreateUser).Methods("POST")
	router.HandleFunc("/users/{email}", s.handleDeleteUser).Methods("DELETE")
	router.HandleFunc("/users/{email}", s.handleUpdateUser).Methods("PUT")
	router.HandleFunc("/users/{email}/connections", s.handleCreateUserConnection).Methods("POST")
	router.HandleFunc("/users/{email}/connections", s.handleDeleteUserConnection).Methods("DELETE")

	// Serve server
	return http.ListenAndServe(s.listenAddr, handlers.CORS(originsOk, headersOk, methodsOk)(router))
}
