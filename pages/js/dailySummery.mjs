import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {getStorage, ref, listAll, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBtFxfJfWYzTkjCMrhySoPofAS5zAbmqKM",
    authDomain: "ybalmpolandsite.firebaseapp.com",
    projectId: "ybalmpolandsite",
    storageBucket: "ybalmpolandsite.appspot.com",
    messagingSenderId: "581656278199",
    appId: "1:581656278199:web:d43566dcc3a87093c50932",
    measurementId: "G-Z8HQTJMV7V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const summeries = document.getElementById('summeries');

async function loadSummeries() {
    const folder = await listAll(ref(storage, 'dailySummary'));

    for (let i = folder.items.length - 1; i >= 0; i--) {
        try {
            const url = await getDownloadURL(folder.items[i]);
            const response = await fetch(url);
            const content = await response.text();

            const daySummery = document.createElement("div");
            daySummery.className = "day-summary";

            const title = document.createElement("h2");
            const paragraph = document.createElement("p");

            title.textContent = `יום ${i + 1}`;
            paragraph.textContent = content;

            daySummery.append(title);
            daySummery.append(paragraph);

            summeries.append(daySummery);

        } catch (error) {
            console.log('Error listing images:', error);
        }
    }
}

function fadeSummeries() {
    const summeries = document.getElementsByClassName('day-summary');

    for (let i = summeries.length - 1; i >= 0; i--) {
        let summery = summeries.item(i);
        for (let j = 0; j <= 100; j++) {
            setTimeout(() => {
                summery.style.opacity = j + '%'
                console.log(summery.style.opacity.toString());
            }, (10 * j) + (6 * 100 * i));
        }
    }
}

loadSummeries().then(fadeSummeries);