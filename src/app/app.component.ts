import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(){
    const firebaseConfig = {
      apiKey: "AIzaSyB_8u4XEL37O9jDmtBOAsFmegXHuS0gTLU",
      authDomain: "books-library-10af4.firebaseapp.com",
      databaseURL: "https://books-library-10af4.firebaseio.com",
      projectId: "books-library-10af4",
      storageBucket: "books-library-10af4.appspot.com",
      messagingSenderId: "1035516602537",
      appId: "1:1035516602537:web:5af2eb468e826a6b53a1b8",
      measurementId: "G-HDLYY9BCN6"
    };
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  }
}
