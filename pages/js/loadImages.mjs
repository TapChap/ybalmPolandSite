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

const gallery = document.getElementById('gallery');

async function loadImagesFromFirebase() {
    for (let i = 10; i >= 0; i--) {
        const storageRef = ref(storage, `day${i}`);
        const listResult = await listAll(storageRef);
        const downloadPromises = listResult.items.map(itemRef => getDownloadURL(itemRef));
        const urls = await Promise.all(downloadPromises);

        if (listResult.items.length > 0) {

            const hr = document.createElement("hr");
            const dayNum = document.createElement("h2");
            dayNum.textContent = `${i} יום`;
            gallery.appendChild(hr);
            gallery.appendChild(dayNum);

            const dayBox = document.createElement("div");
            dayBox.className = 'day-box';

            for (const url of urls) {
                const img = document.createElement('img');
                img.src = url;
                img.onclick = ev => {
                    if (ev.button === 0) downloadImage(url);
                }
                dayBox.appendChild(img);
            }

            gallery.appendChild(dayBox);
        }
    }
}

async function downloadImage(url) {
    const image = await fetch(url)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)

    const link = document.createElement('a')
    link.href = imageURL
    link.download = 'polandPicture'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

loadImagesFromFirebase()
    .then(
        (__) => document.getElementById("loading").remove())
    .then(
        (__)=> document.getElementById('gallery').style.visibility = 'visible');