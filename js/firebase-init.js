const firebaseConfig = {
  apiKey: "AIzaSyAtaQ0n8whwASU0vYAHuVI7aHT4vODleQU",
  authDomain: "vanhoctrungdai.firebaseapp.com",
  projectId: "vanhoctrungdai",
  storageBucket: "vanhoctrungdai.firebasestorage.app",
  messagingSenderId: "159314955859",
  appId: "1:159314955859:web:22c915bbf4af2f1faac0a6"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

window.FirestoreSync = {
  // Listen for real-time changes from the cloud
  listen: function(docId, callback) {
    db.collection("appData").doc(docId).onSnapshot((docSnap) => {
      if (docSnap.exists) {
        callback(docSnap.data().items || []);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error("Firebase listen error on " + docId + ":", error);
    });
  },
  
  // Save changes to the cloud
  save: function(docId, dataArray) {
    return db.collection("appData").doc(docId).set({ items: dataArray })
      .catch(error => console.error("Firebase save error on " + docId + ":", error));
  }
};
