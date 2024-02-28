document.addEventListener("DOMContentLoaded", function() {
  countapi.visits('tadikserhat.com', 'visits').then((result) => {
    console.log(`Page views: ${result.value}`);
    const visitElement = document.getElementById('visitCount');
    if (visitElement) {
      visitElement.textContent = result.value;
    }
  });
});
