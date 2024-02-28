document.addEventListener("DOMContentLoaded", function() {
  const namespace = 'tadikserhat.com'; // Replace with your namespace
  const key = 'visits'; // Replace with your key
  fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
    .then(response => response.json())
    .then(data => {
      console.log(`Page views: ${data.value}`);
      const visitElement = document.getElementById('visitCount');
      if (visitElement) {
        visitElement.textContent = data.value;
      }
    })
    .catch(error => console.error('Error fetching CountAPI data:', error));
});
