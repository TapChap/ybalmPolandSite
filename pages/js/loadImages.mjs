import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyD7QpVIw1k-VpaWolML1lDhuzB0umX4kgU",
    authDomain: "poland-bb03d.firebaseapp.com",
    projectId: "poland-bb03d",
    storageBucket: "poland-bb03d.appspot.com",
    messagingSenderId: "294060305061",
    appId: "1:294060305061:web:66f9299fc4516c5a797b4c",
    measurementId: "G-2KXMGB5WQQ"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const gallery = document.getElementById('gallery');

let zoomedImage = document.createElement('img');

async function loadImagesFromFirebase() {
    // Load all titles first
    const titles = await getTitles(); // Assuming getTitles fetches the titles from the titlesString.txt

    for (let i = 10; i > 0; i--) {
        const storageRef = ref(storage, `gallery/day${i}`);
        try {
            const listResult = await listAll(storageRef);
            const downloadPromises = listResult.items.map(itemRef => getDownloadURL(itemRef));
            const urls = await Promise.all(downloadPromises);

            if (listResult.items.length > 0) {
                const hr = document.createElement("hr");
                const dayNum = document.createElement("h2");
                dayNum.textContent = titles[i - 1];
                // dayNum.className = "center";
                // gallery.appendChild(hr);
                gallery.appendChild(dayNum);

                const dayBox = document.createElement("div");
                dayBox.className = 'day-box';

                urls.forEach(url => {
                    const img = document.createElement('img');
                    img.src = url; // Use data-src for lazy loading
                    img.onclick = event => {
                        zoomedImage.style = 'transform: scale(1);';
                        if (event.button === 0) img.style = 'transform: scale(2);'
                        zoomedImage = img;
                    }
                    dayBox.appendChild(img);
                });

                gallery.appendChild(dayBox);
            }
        } catch (error) {
            console.error(`Failed to load images for day ${i}: `, error);
        }
    }
}

window.onscroll = function (e) {  
    zoomedImage.style = 'transform: scale(1);';
    } 

// Function to get titles from the server
async function getTitles() {
    // const titleStringRef = ref(storage, 'titlesString.txt');
    // const titleStringURL = await getDownloadURL(titleStringRef);
    // const titleStringResponse = await fetch(titleStringURL);
    // const titleString = await titleStringResponse.text();
    // return titleString.split('-');

    return ["day 1", "day 2", "day 3", "day 4"];
}

// Function to download an image
async function downloadImage(url) {
    try {
        const image = await fetch(url);
        const imageBlob = await image.blob();
        const imageURL = URL.createObjectURL(imageBlob);

        const link = document.createElement('a');
        link.href = imageURL;
        link.download = 'polandPicture';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading the image: ', error);
    }
}

loadImagesFromFirebase()
    .then((__) => {
        document.getElementById("loading").remove();
        document.getElementById('gallery').style.visibility = 'visible';
    });