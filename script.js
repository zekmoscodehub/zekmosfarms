const form = document.querySelector('form');

//attach an event listener to the form submit event
form.addEventListener('submit', (event) => {
  //prevent the default form submission
  event.preventDefault();

  //get the form data
  const formData = new FormData(form);

  //create a new XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  //set the request method and URL
  xhr.open('POST', 'https://zekmoscodehub.org/send-contact-form');

  //set the request headers
  xhr.setRequestHeader('Content-Type', 'application/json');

  //convert the form data to a JSON string
  const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));

  //send the request
  xhr.send(jsonData);
  
  //reset the form
  form.reset();
});




  //get the form element

