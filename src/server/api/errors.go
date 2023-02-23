package api

import (
	"fmt"
	"net/http"
)

func ApiHttpError (w http.ResponseWriter, err error, httpStatusCode uint, httpResponseBody string) {

	if err == nil {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK!"))
		return
	}

	// No status code provided
	if httpStatusCode == 0 {
		httpStatusCode = http.StatusInternalServerError
	}

	// No httpResponseBody provided
	if httpResponseBody == "" {
		httpResponseBody = "Internal server error see error log!\n"
	}

	w.WriteHeader(int(httpStatusCode))
	w.Write([]byte(httpResponseBody))
	fmt.Printf("Error: %v || HTTP Response Body: %v\n", err, httpResponseBody)
}