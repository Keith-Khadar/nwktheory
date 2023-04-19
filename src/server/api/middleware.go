package api

import (
	"math/rand"
	"time"
)

func randomChannelID() string {
	rand.Seed(time.Now().UnixNano())

	const charset = "0123456789"
	const length = 10
	b := make([]byte, length)

	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}

	return string(b)
}
