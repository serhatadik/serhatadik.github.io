// countapi.js
var xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.countapi.xyz/hit/tadikserhat.com/visits");
xhr.responseType = "json";
xhr.onload = function() {
    document.getElementById('visits').innerText = `Page views: ${this.response.value}`;
}
xhr.send();
