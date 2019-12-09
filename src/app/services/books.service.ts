import {Injectable} from '@angular/core';
import Book from '../models/book.model';
import {Subject} from 'rxjs';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;

@Injectable({
    providedIn: 'root'
})
export class BooksService {

    books: Book[] = [];
    booksSubject = new Subject<Book[]>();

    constructor() {
        this.getBooks();
    }

    emitBooks() {
        this.booksSubject.next(this.books);
    }

    saveBooks() {
        firebase.database().ref('/books').set(this.books);
    }

    getBooks() {
        firebase.database().ref('/books')
            .on('value', (data: DataSnapshot) => {
                this.books = data.val() ? data.val() : [];
                this.emitBooks();
            });
    }

    getSingleBook(id: number) {
        return new Promise((resolve, reject) => {
                firebase.database().ref('/books/' + id).once('value').then(
                    (data: DataSnapshot) => {
                        resolve(data.val());
                    }, (error) => {
                        reject(error);
                    }
                );
            }
        );
    }

    createNewBook(newBook: Book) {
        this.books.push(newBook);
        this.saveBooks();
        this.emitBooks();
    }

    removeBook(bookToRemove: Book) {
        if (bookToRemove.photo) {
            const storageRef = firebase.storage().refFromURL(bookToRemove.photo);
            storageRef.delete()
                .then(() => console.log("photo removed"))
                .catch((error) => console.log("Could not remove photo: "+error));
        }
        this.books = this.books.filter((book: Book) => book !== bookToRemove);
        this.saveBooks();
        this.emitBooks();
    }

    uploadImage(file: File) {
        return new Promise((resolve, reject) => {
            const almostUniqueFileName = Date.now().toString();
            const upload  = firebase.storage().ref().child('images/'+almostUniqueFileName+file.name).put(file);

            upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
                () => {
                    console.log('Chargement...');
                },
                (error) => {
                    reject(error);
                },
                () => {
                    resolve(upload.snapshot.ref.getDownloadURL());
                });
        });
    }
}
