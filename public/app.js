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

            const divWhenSignedIn = document.getElementById('whenSignedIn');
            const divWhenSignedOut = document.getElementById('whenSignedOut');
            const signInBtn = document.getElementById('signInBtn');
            const signOutBtn = document.getElementById('signOutBtn');
            const userDetails = document.getElementById('userDetails');

            const provider = new firebase.auth.GoogleAuthProvider();

            signInBtn.onclick = () => auth.signInWithPopup(provider);
            signOutBtn.onclick = () => auth.signOut();
        } catch (e) {
            console.error(e);
            loadEl.textContent = 'Error loading the Firebase SDK, check the console.';
        }
});
