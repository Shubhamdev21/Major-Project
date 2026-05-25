import axios from 'axios';

async function testLogin() {
  try {
    console.log('Attempting login with test@example.com...');
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123' // I'm guessing here, but usually users use simple passwords for testing
    });
    console.log('Login successful!', res.data);
  } catch (err: any) {
    console.error('Login failed:', err.response?.data || err.message);
  }
}

testLogin();
