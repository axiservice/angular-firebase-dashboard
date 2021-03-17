import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    user: Observable<any>;
    cats: Observable<any[]>;

    test: Observable<any>;

    constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
        this.user = null;
        this.cats = null;
        this.test = null;
    }

    ngOnInit(): void {
        this.afAuth.authState.subscribe(user => {
            console.log('Dashboard: user', user);



            if (user) {
                let emailLower = user.email.toLowerCase();
                this.user = this.firestore.collection('users').doc(emailLower).valueChanges();

                this.test = this.firestore.collection('cats').doc(emailLower).valueChanges();
            }
        });

        this.cats = this.firestore.collection('cats').valueChanges();
    }

    tester(): void {
        // console.log('user', this.user);
        // console.log('user email', this.user.email);
    }
}
