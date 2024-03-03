function copyToClipboard(element) {
  var codeBlock = element.parentElement.querySelector('code');
  navigator.clipboard.writeText(codeBlock.textContent)
    .then(() => {
      // Optionally, display a message confirming the copy
      alert('Code copied to clipboard!');
    })
    .catch(err => {
      console.error('Error in copying text: ', err);
    });
}
