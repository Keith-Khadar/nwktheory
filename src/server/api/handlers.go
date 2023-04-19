package api

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"image/jpeg"
	"image/png"
	"io/ioutil"
	"net/http"
	"os"
	"server/types"
	"strings"

	"github.com/gorilla/mux"
)

func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the HomePage! from %v\n", r.RemoteAddr)
	LogTime()
	fmt.Println("Endpoint Hit: homePage")
}

func (s *Server) handleGetUserByEmail(w http.ResponseWriter, r *http.Request) {
	LogTime()
	fmt.Printf("Endpoint Hit: handleGetUserByEmail from %v\n", r.RemoteAddr)
	// Retrieve mux variables from URL
	vars := mux.Vars(r)

	// Get id from URL path
	email := vars["email"]

	// Get user from db
	user, err := s.store.GetUser(email)

	// Create new user to save requested info
	var newUser types.User

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

	nameParam := r.URL.Query().Get("name")
	if nameParam == "true" {
		newUser.Name = user.Name
	}

	emailParam := r.URL.Query().Get("email")
	if emailParam == "true" {
		newUser.Email = user.Email
	}

	profilePicParam := r.URL.Query().Get("profilepic")
	if profilePicParam == "true" {
		newUser.ProfilePic = user.ProfilePic
	}

	connectionParam := r.URL.Query().Get("connections")
	if connectionParam == "true" {
		newUser.Connections = user.Connections
	}

	channelParam := r.URL.Query().Get("channels")
	if channelParam == "true" {
		newUser.Channels = user.Channels
	}

	// No parameters given return full user struct with all data
	if nameParam == "" && emailParam == "" && profilePicParam == "" &&
		connectionParam == "" {
		json.NewEncoder(w).Encode(user)
		return
	}

	// Return partial data based on params
	json.NewEncoder(w).Encode(newUser)
}

func (s *Server) handleCreateUser(w http.ResponseWriter, r *http.Request) {
	LogTime()
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
	LogTime()
	fmt.Printf("Endpoint Hit: handleDeleteUser from %v\n", r.RemoteAddr)
	// Retrieve mux variables from URL
	vars := mux.Vars(r)

	// Get id from URL path
	email := vars["email"]

	err := s.store.DeleteUser(email)

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
}

func (s *Server) handleUpdateUser(w http.ResponseWriter, r *http.Request) {
	LogTime()
	fmt.Printf("Endpoint Hit: handleUpdateUser from %v\n", r.RemoteAddr)

	// Retrieve mux variables from URL
	vars := mux.Vars(r)

	// Get id from URL path
	email := vars["email"]

	// Parameters from URL
	queriedUpdateName := r.URL.Query().Get("name")

	err := s.store.UpdateUser(email, queriedUpdateName, "", "")

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
}

func (s *Server) handleSetUserProfilePic(w http.ResponseWriter, r *http.Request) {
	LogTime()
	fmt.Printf("Endpoint Hit: handleSetUserProfilePicture from %v\n", r.RemoteAddr)

	// Retrieve mux variables from URL
	vars := mux.Vars(r)

	// Get Email from URL path
	reqUserEmail := vars["email"]
	user, err := s.store.GetUser(reqUserEmail)

	// Check if user exists in data base
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

	// Store Image
	var fieldMapForBody map[string]*json.RawMessage
	// var file *os.File

	// Save json image data
	data, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(data, &fieldMapForBody)

	// Parse data string to retrieve image data
	image, _ := json.Marshal(fieldMapForBody["image"])
	imageIndex := strings.Index(string(image), ",")
	rawImage := string(image)[imageIndex+1 : len(string(image))-1] // Remove the trailing "

	// Determine image type
	dataTypeStartIndex := strings.Index(string(image), ":")
	dataTypeEndIndex := strings.Index(string(image), ";")
	imageType := string(image[dataTypeStartIndex+1 : dataTypeEndIndex])

	// Check if data string is properly formated
	// Size 7 is for "image/x" with x being a 1 character file extension
	if imageIndex < 7 {
		err = errors.New("invalid image data string")
		ApiHttpError(w, err, http.StatusUnprocessableEntity, "Invalid image data string")
		return
	}

	// Encodede Image DataUrl
	unbased, _ := base64.StdEncoding.DecodeString(string(rawImage))

	res := bytes.NewReader(unbased)

	// Add path to store in file system; default if src/server
	// Next append image storage directory
	path, _ := os.Getwd()
	imagePath := path + "/data/images/"

	// Create base image name
	imageName := user.Email + "_profile."

	// Decode the images based on format
	// Starts at index 1 to remove starting "
	switch imageType {
	case "image/png":
		// decode png
		pngI, err := png.Decode(res)

		// Add extension to name
		imageName = imageName + "png"
		finalImgPath := imagePath + imageName

		// Check if user has existing profile picture
		if user.ProfilePic != "" {
			os.Remove(user.ProfilePic)
		}

		// Check for errors decoding PNG data
		// Report and exit if there is an error
		if err != nil {
			ApiHttpError(w, err, http.StatusUnprocessableEntity, "Could not decode PNG data!")
			return
		}

		// Create file
		f, err := os.Create(finalImgPath)

		// Check for errors in file creation
		// Report and exit if true
		if err != nil {
			ApiHttpError(w, err, http.StatusInternalServerError, "")
			return
		}

		// If error creating PNG report and exit
		if err = png.Encode(f, pngI); err != nil {
			ApiHttpError(w, err, http.StatusUnprocessableEntity, "Could not encode PNG!")
			return
		}

		// Update user object with new profile picture path
		s.store.UpdateUser(user.Email, "", finalImgPath, "")

		// Print successful update to console
		fmt.Printf("Profile picture update for %v || Type: PNG\n", user.Email)

	case "image/jpeg":
		// decode jpeg
		jpegI, err := jpeg.Decode(res)

		// Add extension to name
		imageName = imageName + "jpeg"
		finalImgPath := imagePath + imageName

		// Check if user has existing profile picture
		if user.ProfilePic != "" {
			os.Remove(user.ProfilePic)
		}

		// Check for errors decoding JPEG data
		// Report and exit if there is an error
		if err != nil {
			ApiHttpError(w, err, http.StatusUnprocessableEntity, "Could not decode JPEG data!")
			return
		}

		// Create file
		f, err := os.Create(finalImgPath)

		// Check for errors in file creation
		// Report and exit if true
		if err != nil {
			ApiHttpError(w, err, http.StatusInternalServerError, "")
			return
		}

		// If error creating JPEG report and exit
		if err = jpeg.Encode(f, jpegI, nil); err != nil {
			ApiHttpError(w, err, http.StatusUnprocessableEntity, "Could not encode JPEG!")
			return
		}

		// Update user object with new profile picture path
		s.store.UpdateUser(user.Email, "", finalImgPath, "")

		// Print successful update to console
		fmt.Printf("Profile picture update for %v || Type: JPEG\n", user.Email)

	default:
		err := errors.New("invalid image format")
		ApiHttpError(w, err, http.StatusUnprocessableEntity, "Invalid image format!")
	}
}

func (s *Server) handleCreateUserConnection(w http.ResponseWriter, r *http.Request) {
	LogTime()
	fmt.Printf("Endpoint Hit: handleCreateUserConnection from %v\n", r.RemoteAddr)

	// Retrieve mux variables from URL
	vars := mux.Vars(r)

	// Get Email from URL path
	reqUserEmail := vars["email"]

	// Get the body of our POST request
	var connection types.Connection
	json.NewDecoder(r.Body).Decode(&connection)

	user, err := s.store.GetUser(reqUserEmail)

	// Handle preliminary error
	if err != nil {
		if strings.Contains(fmt.Sprint(err), "no documents") {
			// Return HTTP 404 if user does not exist in db
			ApiHttpError(w, err, http.StatusNotFound, "User does not exist!")

		} else { // Catch all
			ApiHttpError(w, err, http.StatusInternalServerError, "")

		}

		return
	}

	if strings.Compare(reqUserEmail, connection.SourceUser) != 0 {
		// Return HTTP 422 if requested user by email in /users/{email}/connections does not match soureUser in connection

		ApiHttpError(w, err, http.StatusUnprocessableEntity, "Requested user does not match SourceUser in connection!")
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
		_ = s.store.InsertConnection(connection.DestinationUser, &newConnection)
	}
}

func (s *Server) handleDeleteUserConnection(w http.ResponseWriter, r *http.Request) {
	LogTime()
	fmt.Printf("Endpoint Hit: handleDeleteUserConnection from %v\n", r.RemoteAddr)
	// Retrieve mux variables from URL
	vars := mux.Vars(r)

	// Get Email from URL path
	reqUserEmail := vars["email"]

	// Check if user exists in db
	_, err := s.store.GetUser(reqUserEmail)

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

	// If SourceUser not specificied in a query parameter get it from url path variable
	queriedSourceUser := r.URL.Query().Get("sourceuser")
	if queriedSourceUser == "" {
		queriedSourceUser = reqUserEmail
	}

	queriedDestinationUser := r.URL.Query().Get("destinationuser")

	err = s.store.DeleteConnection(reqUserEmail, queriedSourceUser, queriedDestinationUser)

	if err != nil {
		ApiHttpError(w, err, http.StatusInternalServerError, "")
	} else {
		s.store.DeleteConnection(queriedDestinationUser, queriedDestinationUser, queriedSourceUser)
	}
}

func (s *Server) handleSendMessage(w http.ResponseWriter, r *http.Request) {
	LogTime()
	fmt.Printf("Endpoint Hit: handleSendMessage from %v\n", r.RemoteAddr)

	// Create message object
	var message types.Message

	// Get POST body
	json.NewDecoder(r.Body).Decode(&message)

	// Check source user exists
	user, err := s.store.GetUser(message.User)

	if err != nil {
		// Return HTTP 404 if user does not exist in db
		if strings.Contains(fmt.Sprint(err), "no documents") {
			ApiHttpError(w, err, http.StatusNotFound, "Source user does not exist!")

		} else { // Catch all
			ApiHttpError(w, err, http.StatusInternalServerError, "")
		}
		// Exit here if error
		return
	}

	// Check if user is in the channel
	for _, currChannel := range user.Channels {

		if currChannel == message.Channel {
			break
		}
	}

	// Send message
	s.pusherClient.Trigger(message.Channel, "new-message", message.Message)
}

func (s *Server) handleCreateChannel(w http.ResponseWriter, r *http.Request) {
	LogTime()
	fmt.Printf("Endpoint Hit: handleCreateChannel from %v\n", r.RemoteAddr)

	// Create channel object
	var reqChannel types.Channel

	// Get POST body
	json.NewDecoder(r.Body).Decode(&reqChannel)

	// Check if chanel exists
	err := s.store.InsertChannel(&reqChannel)

	if err != nil {
		// Invalid channel submission
		if strings.Contains(fmt.Sprint(err), "invalid channel") {
			ApiHttpError(w, err, http.StatusUnprocessableEntity, "")

		} else { // Catch all
			ApiHttpError(w, err, http.StatusInternalServerError, "")

		}
	}

	for _, queriedUserEmail := range reqChannel.Users {
		user, err := s.store.GetUser(queriedUserEmail)

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

		s.store.UpdateUser(user.Email, "", "", reqChannel.ID)
	}
}

func (s *Server) handleGetChannel(w http.ResponseWriter, r *http.Request) {
	LogTime()
	fmt.Printf("Endpoint Hit: handleGetChannel from %v\n", r.RemoteAddr)

	var err error
	idParam := r.URL.Query().Get("id")
	if idParam != "" {
		_, err = s.store.GetChannel(idParam)
	}

	if err != nil {
		json.NewEncoder(w).Encode(true)
	} else {
		json.NewEncoder(w).Encode(false)
	}
}
