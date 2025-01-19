document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent the default form submission
  console.log('Login form submitted'); // Debugging log

  // Get input values
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  console.log('Email:', email, 'Password:', password); // Debugging log

  // API endpoint
  const apiUrl = 'http://localhost:3000/api/v2/auth/login';

  try {
    // Make the API call
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const parsedResponse = await response.json();

    if (parsedResponse.status === 200 && parsedResponse.body.token) {
      localStorage.setItem('authToken', parsedResponse.body.token);
      console.log(parsedResponse.body.message);
      window.location.href = 'index.html'; // Redirect to chat page
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message || 'Login failed'}`);
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('An error occurred. Please try again.');
  }
});
