package api

import (
	"net/http"
	"server/storage"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	pusher "github.com/pusher/pusher-http-go/v5"
)

type Server struct {
	listenAddr string
	store      storage.Storage
	pusherClient pusher.Client
}


func NewServer(listenAddr string, store storage.Storage) *Server {
	return &Server{
		listenAddr: listenAddr,
		store:      store,

		// Include the pusher client object into the server object
		pusherClient: pusher.Client{
			AppID:   "1578492",
			Key:     "37edea490ece53aa7ed1",
			Secret:  "6b8fec13abbfb0175590",
			Cluster: "mt1",
			Secure:  true,
		},
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
	// certPath := "/home/alex/certs/cert.pem"
	// keyPath := "/home/alex/certs/privkey.pem"

	//Set up chat server

	// API Endpoints
	router.HandleFunc("/", homePage)
	router.HandleFunc("/users/{email}", s.handleGetUserByEmail).Methods("GET", "OPTIONS")
	router.HandleFunc("/users", s.handleCreateUser).Methods("POST", "OPTIONS")
	router.HandleFunc("/users/{email}", s.handleDeleteUser).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/users/{email}", s.handleUpdateUser).Methods("PUT", "OPTIONS")
	router.HandleFunc("/users/{email}/image", s.handleSetUserProfilePic).Methods("PUT", "OPTIONS")
	router.HandleFunc("/users/{email}/connections", s.handleCreateUserConnection).Methods("POST", "OPTIONS")
	router.HandleFunc("/users/{email}/connections", s.handleDeleteUserConnection).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/chat", s.handleSendMessage).Methods("POST", "OPTIONS")

	// Static routes
	router.PathPrefix("/static/images/").Handler(http.StripPrefix("/static/images/", http.FileServer(http.Dir("data/images"))))

	// Serve web server
	return http.ListenAndServe(s.listenAddr, handlers.CORS(originsOk, headersOk, methodsOk)(router))
}
