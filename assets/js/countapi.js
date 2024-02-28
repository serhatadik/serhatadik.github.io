document.addEventListener("DOMContentLoaded", function() {
    var namespace = "tadikserhat.com"; // Replace "your_namespace" with your site's domain or any unique namespace you prefer.
    var key = "visits"; // This can be any key you like. If you want to track different pages, use different keys.
    fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('visits').innerText = `Page views: ${data.value}`;
        })
        .catch(error => console.error('Error accessing CountAPI:', error));
});
