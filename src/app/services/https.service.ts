import { Observable, of } from 'rxjs';
import { AccountService } from './account.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { backend_url, User, UserData, ProfilePic, ConnectionData, ProfilePicData} from './info';

@Injectable({
  providedIn: 'root'
})
export class HttpsService {

  constructor(private http: HttpClient, private account: AccountService) { }

  // Retrieve Information //

  getUser(createUser: boolean): Observable<User>{
    // Create an object to store the response in.
    let user = new UserData;

    // Get the account info from the account service
    this.account.getUserData().subscribe((userData) => {
      // Save the user data from Auth0, incase the data-base doesnt return a user return this one
      user = userData;

      // Create the URL for the get request
      const url = backend_url + '/' + userData.Email;

      // The HTTP get request
      this.http.get<User>(url).subscribe({
        next: (response) => {
          // handle the response
          user = response;
        },
        error: (error) => {
          // handle error
          if (error.status === 404) {
            console.log('User not found');
            // Create a user if one is not found
            if(createUser){
              this.addUser();
            }
          } else {
            console.log('An error occurred:', error.error.message);
          }
        }
      });
    })
    // Return the user
    return of (user);
  }

  getImage(): Observable<string>{
    // Create a string to store the image url
    let imageUrl = ''

    //Get the account info from the account service
    this.account.getUserData().subscribe((userData) => {

      let imageExt = '';
      // Create the URL for the get request to get the image extension
      const url = backend_url + 'users/' + userData.Email + '?profilepic=true'; 
      this.http.get<ProfilePic>(url).subscribe((image) => {
        // Get the image ext
        imageExt = image.ProfilePic.substring(image.ProfilePic.lastIndexOf('.'));

        // Create the url for the static image
        imageUrl = backend_url + 'static/images/' + userData.Email + '_profile' + imageExt;
      });
    })
    return of (imageUrl);
  }


  // Create Information //

  addUser(){
    // Get the account info from the account service
    this.account.getUserData().subscribe((userData) => {
      // Create the URL for the post request
      const url = backend_url + '/users';

      // The HTTP post request
      this.http.post(url,userData).subscribe({
        error:(error) =>{
          console.log('An error occurred:', error.error.message);
        }
      });
    })
  }

  addConnection(destinationEmail: string){
    // Get the account info from the account service
    this.account.getUserData().subscribe((userData) => {
      // Create the URL for the post request
      const url = backend_url + '/users/' + userData.Email + '/connections';
      
      // Create the connection
      let newConnection = new ConnectionData();
      newConnection.from = userData.Email;
      newConnection.to = destinationEmail;


      // The HTTP post request
      this.http.post(url, newConnection).subscribe({
        error:(error) =>{
          console.log('An error occurred:', error.error.message);
        }
      });
    })
  }

  // Delete Information //

  deleteUser(){
    // Get the account info from the account service
    this.account.getUserData().subscribe((userData) => {
      // Create the URL for the delete request
      const url = backend_url + '/users/' + userData.Email;

      // The HTTP delete request
      this.http.delete(url).subscribe({
        error:(error) =>{
          console.log('An error occurred:', error.error.message);
        }
      });
    })
  }

  deleteConnections(destinationEmail: string){
    // Get the account info from the account service
    this.account.getUserData().subscribe((userData) => {
      // Create the URL for the delete request
      const url = backend_url + '/users/' + userData.Email + '/connections';
      
      // Create the connection param
      let params = new HttpParams();
      params = params.append('from', userData.Email);
      params = params.append('to', destinationEmail);

      // The HTTP delete request
      this.http.delete(url, {params: params}).subscribe({
        error:(error) =>{
          console.log('An error occurred:', error.error.message);
        }
      });
    })
  }

  // Modify Information  //

  updateUser(name: string){
    // Get the account info from the account service
    this.account.getUserData().subscribe((userData) => {
      // Create the URL for the put request
      const url = backend_url + '/users/' + userData.Email;
      
      // Create the params
      let params = new HttpParams();
      params = params.append('name', name);

      // The HTTP put request
      this.http.delete(url, {params: params}).subscribe({
        error:(error) =>{
          console.log('An error occurred:', error.error.message);
        }
      });
    })
  }

  updateProfilePic(base64Data: string){
    // Get the account info from the account service
    this.account.getUserData().subscribe((userData) => {
      // Create the URL for the put request
      const url = backend_url + '/users/' + userData.Email + '/image';
      
      let updatedImage = new ProfilePicData();
      updatedImage.ProfilePic = base64Data;

      // The HTTP put request
      this.http.put(url, {body: updatedImage}).subscribe({
        error:(error) =>{
          console.log('An error occurred:', error.error.message);
        }
      });
    })
  }

}
