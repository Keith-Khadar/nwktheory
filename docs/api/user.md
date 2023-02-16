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


## Create Information:

#### POST /users
- **What it does:** Create one user
- **Requirements:** Minimum requirement to make a user is a name and an email
- **Note:** User data goes in the body of the HTTP request and follows the user struct format above

#### POST /users/{email}/connections
- **What it does:** Create a connection for the user identified by email
- **Requirements:** 
  - SourceUser in the HTTP body must exist in the database and not be an empty string
  - DestinationUser in the HTTP body must exist in the database and not be an empty string
  - Weight in the HTTP body must not be empty and must be greater than or equal to 0
  - {email} in the URL path must be equal to SourceUser in the HTTP body
- **Note:** Connection data does in the body of the HTTP request and follows the connection struct format above


## Delete Information:

#### DELETE /users/{email}
- **What id does:** Delete a user, identified by their email, and all their related information
- **Requirements:**
  - {email} in the URL path should exist in the database
- **Note:** The api will not return an error if the user specified does not exist and will not delete any documents.
