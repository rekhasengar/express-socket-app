let userId;
let userEmail;

function _checkToken() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('You are not authenticated. Redirecting to login page.');
    window.location.href = '/login.html';
  }
}

function _decodeTokenAndDisplayEmail(token) {
  try {
    const decodedToken = jwt_decode(token);
    userEmail = decodedToken.email;
    userId = decodedToken.id;

    const emailDisplay = document.getElementById('userEmail');
    if (userEmail) {
      emailDisplay.textContent = `Logged in as: ${userEmail}`;
    } else {
      emailDisplay.textContent = 'Email not found in token.';
    }
  } catch (error) {
    alert('Invalid token. Redirecting to login page.');
    window.location.href = '/login.html';
  }
}

function displayMessage(messageText, type) {
  const messageContainer = document.getElementById('messageContainer');
  const messageWrapper = document.createElement('div');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', type);
  messageElement.textContent = messageText;
  messageWrapper.appendChild(messageElement);
  messageContainer.appendChild(messageWrapper);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

const socket = io('http://localhost:3000', { auth: { token: token } });

socket.on('connected', () => {
  console.log('Connected successfully!');
});

socket.on('receiveMessage', (data) => {
  console.log('Message received:', data.message.message);
  const messageStatusPayload = {
    conversationId: data.conversationId,
    userId: userId,
    messageId: data.message.id,
    status: 'delivered',
    timestamp: new Date().getTime(),
    timezone: 'Asia/Kolkata',
  };
  socket.emit('messageStatus', messageStatusPayload);
  displayMessage(data.message.message, 'received');
});

document.getElementById('sendMessageButton').addEventListener('click', () => {
  const messageInput = document.getElementById('messageInput');
  const messageText = messageInput.value.trim();
  if (messageText === '') {
    alert('Message cannot be empty!');
    return;
  }

  const uuid = crypto.randomUUID();
  const decodedToken = jwt_decode(token);
  const userId = decodedToken.id;
  const payload = {
    eventType: 'sendMessage',
    socketId: socket.id,
    data: {
      conversationId: '7e989195-3742-4f39-adf5-56b5508b4a18',
      senderId: userId,
      message: {
        id: uuid,
        message: messageText,
        timestamp: new Date().getTime(),
      },
    },
  };

  socket.emit('event', payload);
  displayMessage(messageText, 'sent');
  console.log('Message sent successfully!');
  messageInput.value = ''; // Clear the input
});
