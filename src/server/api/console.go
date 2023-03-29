package api

import (
	"fmt"
	"time"
)

func LogTime() {
	current_time := time.Now()
	fmt.Printf(current_time.Format("2006-01-02 15:04:05"))
	fmt.Printf(" | ")
}
