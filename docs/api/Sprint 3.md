# Progress Update

## Github Link: https://github.com/Keith-Khadar/nwktheory

## What we have done:
  - ### Frontend:
    - Added a skeleton for the chat page
    - Added zoom and panning for highcharts (the library used to display your connections)
    - Added functionality for adding connections through the frontend.
    - Added a logo and changed the theme of the Auth0 Login page.
    - Created a profile page that shows your profile picture, username, and email. There is some added HTML and CSS to format it nicely.
    - Added functionality to take and upload pictures using any device
    - Added functionality to send images to the backend and retrieve images. 
  
  - ### Backend: 
    - Added functionality to upload images to the backend via a PUT request.
    - Added file server for serving uploaded images to the backend
    - Added compatability with PNG and JPEG image formats
    - Added paramater requests for GET users request allowing for partial data requests. 
    - Added more options for the update user request allowing for name, email, and profile picture path updates.

# Frontend Unit Tests
   - Chat page: This displays the chat page. This now shows the skeleton of what the chat page will look like (this will be exapnded upon next sprint). 
   - Graph: This displays the graph that we are generating from High Charts with the data coming from the backend.
   - Home Page: This displays everything on the home page (the home page includes the graph). Also shows the button to add connections aswell as the model that shows up when you click this button.
   - Profile Page: This displays the profile page ( Nothing is shown here at because this data is collected of Auth0 when the user is logged in)
   - Tabs: This displays the tabs that will be shown at the bottom of the app
   - User-profile: This displays the user's profile card (nothing is shown here because this data is collected from the backend)
## Frontend Cypress Test
   This is an E2E test that goes through the process of signing up for an account and logging into an account through Auth0. The test goes through the process of signing up for an account first. If there is already an account, the test will end, otherwise it will display the home page then end. The second E2E test goes through the process of logging in. It will log in through Auth0 then check that all the tabs work. Then it will add a connection. Lastly it will log out.

# Backend Unit Tests
## Storage Tests
  - Added test for the expanded update user function
  - Added a test for deleting user connections for the database
  - Added a test for creating user connections in the database
## Backend Postman Tests
  - Test get user by email: Test the information of retrieved user is as expected through the GetUserByEmail() function.
  - Test get second user by email: Test the infomration of retrieved second user is as expected through the GetUserByEmail() function.
  - Test get user by email: Test the information of retrieved user is as expected through the GetUserByEmail() function after a new profile pic is added.
  - Test get second user by email: Test the infomration of retrieved second user is as expected through the GetUserByEmail() function after a new profile pic is added.
 
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
