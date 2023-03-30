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
	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	// Get cert and key path
	certPath := "/home/alex/certs/cert.pem"
	keyPath := "/home/alex/certs/privkey.pem"

	// API Endpoints
	router.HandleFunc("/", homePage)
	router.HandleFunc("/users/{email}", s.handleGetUserByEmail).Methods("GET", "OPTIONS")
	router.HandleFunc("/users", s.handleCreateUser).Methods("POST", "OPTIONS")
	router.HandleFunc("/users/{email}", s.handleDeleteUser).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/users/{email}", s.handleUpdateUser).Methods("PUT", "OPTIONS")
	router.HandleFunc("/users/{email}/image", s.handleSetUserProfilePic).Methods("PUT", "OPTIONS")
	router.HandleFunc("/users/{email}/connections", s.handleCreateUserConnection).Methods("POST", "OPTIONS")
	router.HandleFunc("/users/{email}/connections", s.handleDeleteUserConnection).Methods("DELETE", "OPTIONS")

	// Static routes
	router.PathPrefix("/static/images/").Handler(http.StripPrefix("/static/images/", http.FileServer(http.Dir("data/images"))))

	// Serve web server
	return http.ListenAndServeTLS(s.listenAddr, certPath, keyPath, handlers.CORS(originsOk, headersOk, methodsOk)(router))
}
