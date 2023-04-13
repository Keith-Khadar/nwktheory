import { Observable, Subject, lastValueFrom, of } from 'rxjs';
import { AccountService } from './account.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { backend_url, User, UserData, ProfilePic, ConnectionData, ImageData} from './info';


@Injectable({
  providedIn: 'root'
})
export class HttpsService {

  constructor(private http: HttpClient, private account: AccountService) { }

  // Retrieve Information //

  getUser(createUser: boolean): Observable<User>{
    // Create an object to store the response in.
    let userSubject = new Subject<UserData>();

    // Get the account info from the account service
    this.account.getUserData().subscribe((userData) => {

      // Create the URL for the get request
      const url = backend_url + 'users/' + userData.Email;
      // The HTTP get request
      this.http.get<User>(url).subscribe({
        next: (response) => {
          // handle the response
          userSubject.next(response);
        },
        error: (error) => {
          // handle error
          if (error.status === 404) {
            console.log('User not found');
            // Create a user if one is not found
            if(createUser){
              console.log('Adding user');
              this.addUser();
            }
          } else {
            console.log('An error occurred:', error.error.message);
          }
        }
      });
    })
    // Return the user
    return userSubject.asObservable();
  }

  getImage(): Observable<string>{
    // Create a string to store the image url
    let imageUrl = ''
    let imageSubject = new Subject<string>();
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

        // emit the image
        imageSubject.next(imageUrl);
      });
    })
    return imageSubject.asObservable();
  }

  async getImageFromUser(userEmail: string): Promise<string>{
    // Create a string to store the image url
    let imageUrl = ''

    //Get the account info from the account service
    let imageExt = '';
    // Create the URL for the get request to get the image extension
    const url = backend_url + 'users/' + userEmail + '?profilepic=true'; 
    const res: Response = await fetch(url)
    const data: ProfilePic = await res.json()

    // Get the image ext
    imageExt = data.ProfilePic.substring(data.ProfilePic.lastIndexOf('.'));

    // Create the url for the static image
    imageUrl = backend_url + 'static/images/' + userEmail + '_profile' + imageExt;

    return imageUrl;
  }

  // Create Information //

  addUser(){
    // Get the account info from the account service
    this.account.getUserData().subscribe((userData) => {
      // Create the URL for the post request
      const url = backend_url + 'users';

      console.log(userData);
      // The HTTP post request
      this.http.post(url,userData).subscribe({
        error:(error) =>{
          console.log('An error occurred when adding a user:', error.error.message);
        }
      });
    })
  }

  addConnection(destinationEmail: string): Observable<boolean>{
    // Create a subject to return if this was successful or not
    let responseSubject = new Subject<boolean>();
    // Get the account info from the account service
    this.account.getUserData().subscribe((userData) => {
      // Create the URL for the post request
      const url = backend_url + 'users/' + userData.Email + '/connections';
      
      // Create the connection
      let newConnection = new ConnectionData();
      newConnection.from = userData.Email;
      newConnection.to = destinationEmail;

      // The HTTP post request
      this.http.post(url, newConnection).subscribe({
        next:() =>{
          return responseSubject.next(true);
        },
        error:(error) =>{
          console.log('An error occurred:', error.error.message);
          return responseSubject.next(false);
        }
      });
    })
    return responseSubject.asObservable();
  }

  // Delete Information //

  deleteUser(){
    // Get the account info from the account service
    this.account.getUserData().subscribe((userData) => {
      // Create the URL for the delete request
      const url = backend_url + 'users/' + userData.Email;

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
      const url = backend_url + 'users/' + userData.Email + '/connections';
      
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
      const url = backend_url + 'users/' + userData.Email;
      
      // Create the params
      let params = new HttpParams();
      params = params.append('name', name);

      // The HTTP put request
      this.http.put(url, {params: params}).subscribe({
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
      const url = backend_url + 'users/' + userData.Email + '/image';
      
      let updatedImage = new ImageData();
      updatedImage.image = base64Data;

      // The HTTP put request
      this.http.put(url, updatedImage).subscribe({
        error:(error) =>{ 
          console.log('An error occurred:', error.error.message);
        }
      });
    })
  }

}