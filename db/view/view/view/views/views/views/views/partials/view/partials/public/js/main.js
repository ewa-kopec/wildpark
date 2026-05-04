document.querySelector('form')?.addEventListener('submit', (e) => {
  const name = document.querySelector('[name="name"]').value;
  if (name.length < 2) {
    e.preventDefault();
    alert('Name too short');
  }
});