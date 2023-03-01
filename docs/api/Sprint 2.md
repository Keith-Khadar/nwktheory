# Progress Update

## What we have done:
  - ### Frontend:
    - 
  
  - ### Backend: 
    - Added functionality for users to add and delete their connections
    - Added error checking to handle invalid connections requesting to be added
    - Added CORS policy to allow remote origin requests between clients and the server

# Frontend Unit Tests


# Backend Unit Tests


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
- **Note:** Requested user should exist in the database
- **Responses:**
  - 404 Not Found: Returned when the requested user does not exist.
  - 500 Internal Server Error: Returned for any error not specified above. See backend console log for more details.


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
- - **What it does:** Update a user's information, identified by their email, and all their related information
- **Requirements:**
  - {email} in the URL path should exist in the database
  - Name in the URL path as a query parameter (additional user sections will be added to allow more modification to a user's profile)
- **Note:** The api will return an error if the user specified does not exist and will not change any documents.
- **Responses:**
  - 404 Not Found: Returned when the requested user does not exist.
  - 500 Internal Server Error: Returned for any error not specified above. See backend console log for more details.
