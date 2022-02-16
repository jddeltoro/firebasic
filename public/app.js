document.addEventListener('DOMContentLoaded', function () {
    try {
            let app = firebase.app();
            let features = [
                'auth',
                'database',
                'firestore',
                'functions',
                'messaging',
                'storage',
                'analytics',
                'remoteConfig',
                'performance',
            ].filter((feature) => typeof app[feature] === 'function');
            console.log(`Firebase SDK loaded with ${features.join(', ')}`);

            const auth = firebase.auth();

            const divWhenSignedIn = document.getElementById('whenSignIn');
            const divWhenSignedOut = document.getElementById('whenSignOut');
            const signInBtn = document.getElementById('signInBtn');
            const signOutBtn = document.getElementById('signOutBtn');
            const userDetails = document.getElementById('userDetails');

            const provider = new firebase.auth.GoogleAuthProvider();

            signInBtn.onclick = () => auth.signInWithPopup(provider);
            signOutBtn.onclick = () => auth.signOut();

            auth.onAuthStateChanged(user =>{
                if (user) {
                    divWhenSignedIn.hidden = false;
                    divWhenSignedOut.hidden = true;
                    userDetails.innerHTML = `
                        <p>
                            <img class="img-thumbnail" src="${user.photoURL}" alt="${user.displayName}" />
                        </p>
                        <p>
                            <strong>User ID:</strong> ${user.uid}
                        </p>
                        <p>
                            <strong>Email:</strong> ${user.email}
                        </p>
                        <p>
                            <strong>Display Name:</strong> ${user.displayName}
                        </p>
                        <p>
                            <strong>Provider Id:</strong> ${user.providerId}
                        </p>
                    `;

                    const db = firebase.firestore();
                    const createThingBtn = document.getElementById('createThing');
                    const thingsList = document.getElementById('thingsList');

                    let thignsRef = db.collection('things');
                    let unsubscribe;

                    createThingBtn.onclick = () => {
                        const name = prompt('Enter a name for the thing:');
                        if (name) {
                            thignsRef.add({
                                name: name,
                                owner: user.uid,
                                createdAt: firebase.firestore.FieldValue.serverTimestamp()
                            });
                        }
                    };

                    unsubscribe = thignsRef.where('owner', '==', user.uid).onSnapshot(snapshot => {
                        thingsList.innerHTML = '';
                        snapshot.forEach(thing => {
                            thingsList.innerHTML += `
                                <li class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                        ${thing.data().name}
                                    </div>
                                    <span class="badge bg-primary rounded-pill">
                                        ${thing.data().createdAt.toDate().toLocaleString()}
                                    </span>
                                </li>`;
                        });
                    });

                    
                } else {
                    divWhenSignedIn.hidden = true;
                    divWhenSignedOut.hidden = false;
                    userDetails.innerHTML = '';
                }
            });

            
        } catch (e) {
            console.error(e);
            loadEl.textContent = 'Error loading the Firebase SDK, check the console.';
        }
});
