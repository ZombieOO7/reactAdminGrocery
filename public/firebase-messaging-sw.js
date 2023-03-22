importScripts("https://www.gstatic.com/firebasejs/8.9.0/firebase-app.js");

importScripts("https://www.gstatic.com/firebasejs/8.9.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyB-O5XQQdu9kr4QZm6SBknO6GFBASvkf34",
  authDomain: "fir-chat-21d49.firebaseapp.com",
  databaseURL: "https://fir-chat-21d49-default-rtdb.firebaseio.com/",
  projectId: "fir-chat-21d49",
  storageBucket: "fir-chat-21d49.appspot.com",
  messagingSenderId: "785234835518",
  appId: "1:785234835518:web:41a2fffcb349223dfb396f",
  measurementId: "G-CNW7DQBS1S",
};

firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

if (firebase.messaging.isSupported()) {
  var messaging = firebase.messaging();
}

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png",
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./firebase-messaging-sw.js")
    .then(function(registration) {})
    .catch(function(err) {});
}
