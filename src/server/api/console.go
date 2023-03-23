package api

import (
	"fmt"
	"time"
)

func LogTime() {
	fmt.Printf("%v-%v-%v %v:%v:%v | ", time.Now().Year(), time.Now().Month(), time.Now().Day(), time.Now().Hour(), time.Now().Minute(), time.Now().Second())
}
