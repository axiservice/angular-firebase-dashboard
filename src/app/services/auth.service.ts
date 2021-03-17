import { AnimationDriver } from '@angular/animations/browser';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    userLoggedIn: boolean;      // other components can check on this variable for the login status of the user

    constructor(private router: Router, private afAuth: AngularFireAuth, private afs: AngularFirestore) {
        this.userLoggedIn = false;

        this.afAuth.onAuthStateChanged((user) => {              // set up a subscription to always know the login status of the user
            if (user) {
                this.userLoggedIn = true;
            } else {
                this.userLoggedIn = false;
            }
        });
    }

    loginUser(email: string, password: string): Promise<any> {
        return this.afAuth.signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('Auth Service: loginUser: success');
                // this.router.navigate(['/uploadData']);
            })
            .catch(error => {
                console.log('Auth Service: login error...');
                console.log('error code', error.code);
                console.log('error', error);
                if (error.code)
                    return { isValid: false, message: error.message };
            });
    }

    signupUser(user: any): Promise<any> {
        console.log("auth service");
        console.log(user);

        return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
            .then((newUserCredential /*: firebase.auth.UserCredential*/) => {
                let emailLower = user.email.toLowerCase();

                this.afs.doc('/users/' + emailLower)
                    .set({
                        accountStatus: 'unverified',
                        accountType: 'endUser',
                        displayName: user.displayName,
                        displayName_lower: user.displayName.toLowerCase(),
                        email: user.email,
                        email_lower: emailLower
                    });
            })
            .catch(error => {
                console.log('auth signup error...');
                if (error.code)
                    return { isValid: false, message: error.message };
            });
    }

    resetPassword(email: string): Promise<any> {
        return this.afAuth.sendPasswordResetEmail(email)
            .then(() => {
                // this.router.navigate(['/amount']);
            })
            .catch(error => {
                console.log('error.code...');
                console.log(error.code);
                console.log(error)
                if (error.code)
                    return error;
            });
    }

    logoutUser(): Promise<void> {
        return this.afAuth.signOut()
            .then(() => {
                this.router.navigate(['/home']);
            })
            .catch(error => {
                console.log('Auth Service: logout error...');
                console.log('error code', error.code);
                console.log('error', error);
                // if (error.code)
                //     return error;
            });
    }

    setUserInfo(payload: object) {
        console.log('Auth Service: saving user info...');
        this.afs.collection('users')
            .add(payload).then(function (res) {
                console.log("Auth Service: setUserInfo response...")
                console.log(res);
            })
    }

    getCurrentUser() {
        return this.afAuth.currentUser;     // returns user object for logged-in users, otherwise returns null 
    }
}
