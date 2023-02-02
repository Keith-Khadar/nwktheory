package main

import (
	"flag"
	"fmt"
	"log"
	"server/api"
	"server/storage"
)

func main() {
	listenAddr := flag.String("listenaddr", ":3000", "the server address")
	flag.Parse()

	store := storage.NewMongoStorage("test", "users")

	server := api.NewServer(*listenAddr, store)
	fmt.Println("server running on port:", *listenAddr)
	log.Fatal(server.Start())
}
