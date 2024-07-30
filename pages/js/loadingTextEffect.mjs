// writes at a constant speed

// export function renderLoadingText(text, loadIntoID){
//     let timeout = 100;
//
//     let element = document.getElementById(loadIntoID);
//     element.style = "" +
//         // "direction: rtl;" +
//         "text-align: right;";
//
//     let index = 0;
//     let offset = 0;
//
//     let intervalID = setInterval(() => {
//         element.innerHTML = text.slice(0, index);
//         index ++;
//         offset = randomNum(0, 1000);
//         console.log(timeout + offset);
//     }, timeout + offset)
//
//     setTimeout(() => clearInterval(intervalID), text.length * timeout * 1.1);
// }

// writes at a random speed
export function renderLoadingText(text, loadIntoID) {
    let element = document.getElementById(loadIntoID);
    element.style = "text-align: right;";

    setTimeoutRecursive(0, text, element);
}

function setTimeoutRecursive(index, text, element){
    setTimeout(() => {
        element.innerHTML = text.slice(0, index);
        if (index < text.length) setTimeoutRecursive(index + 1, text, element);
    }, randomNum(50, 150))
}

export function deleteText(id){
    let element = document.getElementById(id);

    let intervalID =  setInterval(()=> {
        element.innerHTML = element.innerHTML.slice(0, element.innerHTML.length - 1);
    }, 20);

    setTimeout(() => {
        clearInterval(intervalID)
    }, 1500);
}

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}