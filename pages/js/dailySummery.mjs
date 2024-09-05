import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {getStorage, ref, listAll, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

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

const summeries = document.getElementById('summeries');
const folder = await listAll(ref(storage, 'dailySummary'));

async function loadSummeries() {
    for (let i = folder.items.length - 1; i >= 0; i--) {
        try {
            const url = await getDownloadURL(folder.items[i]);
            const response = await fetch(url);
            const content = await response.text();

            const daySummery = document.createElement("div");
            daySummery.className = "day-summary";

            const title = document.createElement("h2");
            const paragraph = document.createElement("p");

            title.textContent = folder.items[i].name.substring(1, folder.items[i].name.length - 4);
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
            setTimeout(() => summery.style.opacity = j + '%', (10 * j) + (6 * 100 * i));
        }
    }
}

function sortByLeadingDigit(arr) {
    return arr.sort((a, b) => {
      // Extract the first character and convert it to a number
      const digitA = parseInt(a[0], 10);
      const digitB = parseInt(b[0], 10);
  
      // Compare the two numbers
      return digitA - digitB;
    });
  }

sortByLeadingDigit(folder.items);
loadSummeries().then(fadeSummeries);