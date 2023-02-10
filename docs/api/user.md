# User Controls

## User Struct:

```json
{ 
    "Name": "User",
    "Email": "user@example.com",
    "Connections":
    {
        {
            "SourceUser": "user@example.com",
            "DestinationUser": "destinationuser@exmaple.com",
            "Weight": "0.0"
        }
    }

}
```

## Formating Information:
Path variables will be displayed as {variable} in a path and should be replaced with the desired information.
- Example: Using GET /users/{email} to retrieve a user with email "user@emample.com"
  - In this case {email} would be replaced with "user@example.com"
  - **Final URL:** GET /users/user@example.com


## Retrieve Information:

#### GET /users
- Returns all users and their all there data in the user struct

#### GET /users/{email}