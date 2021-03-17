import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    // user: Observable<any>;
    user: any;
    cats: Observable<any[]>;

    constructor(public afAuth: AngularFireAuth, private firestore: AngularFirestore) {
        this.user = null;
        this.cats = null;
    }

    ngOnInit(): void {
        this.afAuth.authState.subscribe(user => {
            console.log('user', user);
            this.user = user;

            // if (user) {
            //     let emailLower = user.email.toLowerCase();
            //     this.user = this.firestore.collection('users').doc(emailLower).valueChanges();
            // }

            this.cats = this.firestore.collection('cats').valueChanges();
        });


    }

    logout(): void {
        this.afAuth.signOut();
    }

    test(): void {
        // console.log('current user', this.afAuth.currentUser);
        console.log('user', this.user);
        if (this.user && this.user.email)
            console.log('user email', this.user.email);
    }

}
