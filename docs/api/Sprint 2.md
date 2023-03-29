# Progress Update

## What we have done:
  - ### Frontend:
    - Added functionality to send http requests to the backend and receive responses
    - Added automatic profile creation. If the user signs in using Auth0 for the first time we will create a profile for them on our database, otherwise we will get their data from the database
    - Added an undirected graph that will be used for diplaying the connections between users
  
  - ### Backend: 
    - Added functionality for users to add and delete their connections
    - Added error checking to handle invalid connections requesting to be added
    - Added functionality to allow users to modify their profile information (currently only the name is modifiable but will add additioanl demographic information that users can modify)
    - Added CORS policy to allow remote origin requests between clients and the server

# Frontend Unit Tests
   - Chat page: This displays the chat page (this page is empty for now, but we will add functionality for chatting next sprint) 
   - Graph: This displays the graph that we are generating from High Charts
   - Home Page: This displays everything on the home page (the home page includes the graph)
   - Profile Page: This displays the profile page ( Nothing is shown here at the moment because this data is collected of Auth0 when the user is logged in)
   - Tabs: This displays the tabs that will be shown at the bottom of the app
## Frontend Cypress Test
   This is an E2E test that goes through the process of signing up for an account and logging into an account through Auth0. The first test is for signing up. Cypress will go through the sign-up process and if an account already exists on Auth0 it will stop there, otherwise it will confirm through the profile page that it is signed in properly. Similarly, for the log in process it will log in check the information shown in the profile page, confirm that the other pages work, and then log out.

# Backend Unit Tests
## Storage Tests
  - TestGetUser: checks that the GetUser() function properly retrieves the user from the storage implementations.
  - TestInsertUser: checks that the InsertUser() function properly inserts a user into the storage implementations.
  - TestDeleteUser: checks that the DeleteUser() function properly deletes a user from the storage implementations.
## Backend Postman Tests
  - Test get user by email: Test the information of retrieved user is as expected through the GetUserByEmail() function.
  - Test get second user by email: Test the infomration of retrieved second user is as expected through the GetUserByEmail() function.
 
# User Controls

## User Struct:

```json
{ 
    "Name": "User",
    "Email": "user@example.com",
    "Connections":
    [
        {
            "SourceUser": "user@example.com",
            "DestinationUser": "destinationuser@exmaple.com",
            "Weight": "0.0"
        }
    ]

}
```

## Connection Struct:

```json
{
    "SourceUser": "user@example.com",
    "DestinationUser": "destinationuser@exmaple.com",
    "Weight": "0.0"
}
```

## Formating Information:
Path variables will be displayed as {variable} in a path and should be replaced with the desired information.

- Example: Using GET /users/{email} to retrieve a user with email "user@emample.com"
  - In this case {email} would be replaced with "user@example.com"
  - **Final URL:** GET /users/user@example.com


## Retrieve Information:

#### GET /users/{email}
- **What it does:** Return one user and their data identified by email
- **Note:** Requested user should exist in the database. When using paramters only the requested parameters will be returned. If no parameters are specified all the user's data is returned.
- **Parameters:** name, profilepic, email, connections
- **Responses:**
  - 404 Not Found: Returned when the requested user does not exist.
  - 500 Internal Server Error: Returned for any error not specified above. See backend console log for more details.

- **Example:** http://localhost:3000/users/{email}?name=true&email=true

#### Getting Images
- Images are accessible via link at http://{address}:{port}/static/images/{file_name}
- **File Naming Conventions:** {email} is the user's email and {ext} is the file type extension 
  - Profile Photos: {email}_profile.{ext}
    - File Types: png, jpeg 


## Create Information:

#### POST /users
- **What it does:** Create one user
- **Requirements:** Minimum requirement to make a user is a name and an email
- **Note:** User data goes in the body of the HTTP request and follows the user struct format above
- **Responses:**
  - 422 Unprocessable Entity: Returned when the body of the POST request does not meet the minimum data requirements for creating a user (See requirements section above). Or the JSON in POST request body has an error.
  - 500 Internal Server Error: Returned for any error not specified above. See backend console log for more details.

#### POST /users/{email}/connections
- **What it does:** Create a connection for the user identified by email
- **Requirements:** 
  - SourceUser in the HTTP body must exist in the database and not be an empty string
  - DestinationUser in the HTTP body must exist in the database and not be an empty string
  - Weight in the HTTP body must not be empty and must be greater than or equal to 0
  - {email} in the URL path must be equal to SourceUser in the HTTP body
- **Note:** Connection data does in the body of the HTTP request and follows the connection struct format above
- **Responses:**
  - 404 Not Found: Returned when the requested user to add a connection does not exist.
  - 422 Unprocessable Entity: Returned when the body of the POST request does not meet the minimum data requirements for creating a connection (See requirements section above). Or the JSON in POST request body has an error.
  - 500 Internal Server Error: Returned for any error not specified above. See backend console log for more details.


## Delete Information:

#### DELETE /users/{email}
- **What it does:** Delete a user, identified by their email, and all their related information
- **Requirements:**
  - {email} in the URL path should exist in the database
- **Note:** The api will return an error if the user specified does not exist and will not delete any documents.
- **Responses:**
  - 404 Not Found: Returned when the requested user does not exist.
  - 500 Internal Server Error: Returned for any error not specified above. See backend console log for more details.

#### DELETE /users/{email}/connections
- **What it does:** Delete a user connection, identified by their email, and all their related information
- **Requirements:**
  - {email} in the URL path should exist in the database
  - SourceUser in the URL path as a query parameter (must be the same as {email})
  - DestinationUser in the URL path as a query parameter (should exist in the database)
- **Note:** The api will return an error if the user specified does not exist and will not delete any documents.
- **Responses:**
  - 404 Not Found: Returned when the requested user to add a connection does not exist.
  - 500 Internal Server Error: Returned for any error not specified above. See backend console log for more details.


## Modify Information:

#### PUT /users/{email}
- **What it does:** Update a user's information, identified by their email, and all their related information
- **Requirements:**
  - {email} in the URL path should exist in the database
  - Name in the URL path as a query parameter (additional user sections will be added to allow more modification to a user's profile)
- **Note:** The api will return an error if the user specified does not exist and will not change any documents.
- **Responses:**
  - 404 Not Found: Returned when the requested user does not exist.
  - 500 Internal Server Error: Returned for any error not specified above. See backend console log for more details.


#### PUT /users/{email}/image
- **What it does:** Update a user's profile picture, identified by their email.
- **Requirements:**
  - {email} in the URL path should exist in the database
  - Follow the image data format for the body of the PUT request, see below.
  - Image is encoded in base64.
- **Note:** Uploading a profile picture will overwrite the old profile picture automatically.
- **Responses:**
  - 422 Unprocessable Entity: Returned when the data provided does match or can't be processed as a valid image format. (PNG, JPEG)
  - 500 Internal Server Error: Returned when server encounters file creation errors. This is related to interaction with the OS.

**Image Data Format PUT Body**:
- Valid Image Formats: png, jpeg

- **Example:**
  ```json 
  {
    "image": "image/png,iVBORw0KGgoAAAANSUhEUgAAB9..."
  }

  ```
