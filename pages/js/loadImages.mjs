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
    // Load all titles first
    const titles = await getTitles(); // Assuming getTitles fetches the titles from the titlesString.txt

    // Create an IntersectionObserver for lazy loading
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '0px 0px 50px 0px',
        threshold: 0.1
    });

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
                gallery.appendChild(hr);
                gallery.appendChild(dayNum);

                const dayBox = document.createElement("div");
                dayBox.className = 'day-box';

                urls.forEach(url => {
                    const img = document.createElement('img');
                    img.dataset.src = url; // Use data-src for lazy loading
                    img.onclick = ev => {
                        if (ev.button === 0) downloadImage(url);
                    }
                    observer.observe(img); // Observe the image
                    dayBox.appendChild(img);
                });

                gallery.appendChild(dayBox);
            }
        } catch (error) {
            console.error(`Failed to load images for day ${i}: `, error);
        }
    }
}

// Function to get titles from the server
async function getTitles() {
    const titleStringRef = ref(storage, 'titlesString.txt');
    const titleStringURL = await getDownloadURL(titleStringRef);
    const titleStringResponse = await fetch(titleStringURL);
    const titleString = await titleStringResponse.text();
    return titleString.split('-');
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

setTimeout(()=> {
    loadImagesFromFirebase()
        .then((__) => {
                document.getElementById("loading").remove();
                document.getElementById('gallery').style.visibility = 'visible';
            }
        );
}, 2500);