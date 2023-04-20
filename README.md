# NWKTheory

## Project Description
NWKTheory is based on the theory, six degrees of separation. This theory states that any person on the planet can be connected to any other person through a chain of no more than five friends and acquaintances. 

This project aims to test this theory by providing users an easy way to connect with others by creating a visualization of their personal network.

A user’s connections will be displayed in the form of an undirected graph that can be modified to allow users to see certain connections (ex. Work connections, personal connections). These connections will also be categorized by being given colors to help user’s identify specific connections. Users will also have the ability to use a chat system on the applications to directly interact with each other to help facilitate connections.

The home page will be the graph visualization of your network. Here on the home page you can search your network and apply different filters to view your network in different ways. For example, switching between a work network and a family/friends network. The pages to the left and right will be used for viewing and editing your profile and chatting with people you are connected to. 

### Features
* Oauth Federated Account access (lets users log in using other online accounts, ex. LinkedIn, Facebook)
* Real-time chat
* Custom profile pictures
* Interactive graph of friends

## Details and requirements for running application
### Visit live server
Go to https://nwk.tehe.xyz/

Create an account with Auth0

Begin adding your friends with their emails

Customize your profile by navigating to the profile tab

Chat with your friends in the chat tab

### Installation
Clone from github
```bash
git clone https://github.com/Keith-Khadar/nwktheory
```

Install node packages
```bash
cd nwktheory
npm install
```

Start Mongo Instance

Spin up Golang server
```bash
cd src/server
go run main.go
```

Start server
```bash
cd ../../
ng serve
```

In a browser, go to http://locahost:4200/


## Members
### Front-end Engineers
* Keith Khadar
* Eric Zhou
### Back-end Engineers
* Naresh Panchal
* Alex Christy
