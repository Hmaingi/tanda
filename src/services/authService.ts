export async function loginUser(username: string, password: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username === 'admin' && password === 'password') {
          resolve({ success: true, token: 'fake-jwt-token' });
        } else {
          resolve({ success: false, message: 'Invalid username or password' });
        }
      }, 1000); // Simulating API delay
    });
  }
  