<template>
  <div class="page-container">
    <!-- Top-left branding -->
    <div class="brand-header">
      <span class="tanda">Tanda</span><span class="pay">Pay</span>
    </div>

    <!-- Login container -->
    <div class="login-container">
      <div class="login-box">
        <div class="logo">
          <h1>TANDA AGENT INVENTORY SYSTEM</h1>
        </div>
        
        <!-- Login Form -->
        <form v-if="!showSignUp" @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">Agent ID</label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              placeholder="Enter your agent ID"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" class="login-btn">LOGIN</button>
          
          <div class="signup-toggle">
            <span>New Agent? </span>
            <button type="button" @click="showSignUp = true" class="toggle-btn">
              SIGN UP HERE
            </button>
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>

        <!-- Sign Up Form -->
        <form v-else @submit.prevent="handleSignUp" class="login-form">
          <!-- Back Arrow Only -->
          <div class="back-button">
            <button @click="showSignUp = false" aria-label="Back to login">←<</button> 
          </div>

          <div class="form-group">
            <label for="newAgentId">Agent ID</label>
            <input 
              type="text" 
              id="newAgentId" 
              v-model="newAgent.agentId" 
              placeholder="Enter your unique agent ID"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="workEmail">Work Email</label>
            <input 
              type="email" 
              id="workEmail" 
              v-model="newAgent.workEmail" 
              placeholder="Enter your work email"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="newPassword">Password</label>
            <input 
              type="password" 
              id="newPassword" 
              v-model="newAgent.password" 
              placeholder="Create a password"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="newAgent.confirmPassword" 
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <button type="submit" class="login-btn">SIGN UP</button>
          
          <div class="signup-toggle">
            <span>Already have an account? </span>
            <button type="button" @click="showSignUp = false" class="toggle-btn">
              Login here
            </button>
          </div>
          
          <div v-if="signUpError" class="error-message">
            {{ signUpError }}
          </div>
        </form>
      </div>
    </div>

    <!-- Bottom-right footer -->
    <div class="powered-by">
      Powered by <span class="tanda">Tanda</span><span class="pay">Pay</span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Mock agent database
const mockAgents = [
  { agentId: 'agent1', workEmail: 'agent1@tanda.com', password: 'password1' },
  { agentId: 'agent2', workEmail: 'agent2@tanda.com', password: 'password2' }
];

export default {
  name: 'AgentLogin',
  setup() {
    const router = useRouter();
    
    // Login state
    const username = ref('');
    const password = ref('');
    const error = ref('');
    const showSignUp = ref(false);
    
    // Sign up state
    const newAgent = ref({
      agentId: '',
      workEmail: '',
      password: '',
      confirmPassword: ''
    });
    const signUpError = ref('');

    const handleLogin = () => {
      error.value = '';
      
      // Mock authentication
      const agent = mockAgents.find(
        a => a.agentId === username.value && a.password === password.value
      );
      
      if (agent) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('agentId', agent.agentId);
        router.push('/dashboard');
      } else {
        error.value = 'Invalid Agent ID or Password';
      }
    };

    const handleSignUp = () => {
      signUpError.value = '';
      
      // Validate passwords match
      if (newAgent.value.password !== newAgent.value.confirmPassword) {
        signUpError.value = 'Passwords do not match';
        return;
      }
      
      // Check if agent ID exists
      if (mockAgents.some(a => a.agentId === newAgent.value.agentId)) {
        signUpError.value = 'Agent ID already exists';
        return;
      }
      
      // Check if email exists
      if (mockAgents.some(a => a.workEmail === newAgent.value.workEmail)) {
        signUpError.value = 'Work email already registered';
        return;
      }
      
      // Add to mock database (replace with API call in production)
      mockAgents.push({
        agentId: newAgent.value.agentId,
        workEmail: newAgent.value.workEmail,
        password: newAgent.value.password
      });
      
      // Auto-login after signup
      username.value = newAgent.value.agentId;
      password.value = newAgent.value.password;
      showSignUp.value = false;
      handleLogin();
    };

    return {
      username,
      password,
      error,
      showSignUp,
      newAgent,
      signUpError,
      handleLogin,
      handleSignUp
    };
  }
}
</script>

<style scoped>
/* ===== Layout Styles ===== */
.page-container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
}

/* ===== Brand Header ===== */
.brand-header {
  position: fixed;
  top: 2rem;
  left: 2rem;
  line-height: 1;
  z-index: 10;
}

.tanda {
  font-family: 'Bell MT',Century Gothic ;
  font-size: 4.5rem;
  font-weight: 400;
  color: #0e3a8a;
}

.pay {
  font-family: 'Century Gothic';
  font-size: 4.5rem;
  font-weight: 400;
  color: #ea580c; /* Vibrant orange */
  margin-left: -2px;
}

/* ===== Login Container ===== */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-box {
  background: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.logo h1 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 400;
  color: #2c3e50;
}

.form-group input {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.login-btn {
  background-color: #1e3a8a;
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #1a3278;
}

.signup-toggle {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #2c3e50;
  text-align: center;
}

.toggle-btn {
  background: none;
  border: none;
  color: #1e3a8a;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
}

.toggle-btn:hover {
  color: #1a3278;
}

.back-button {
  text-align: left;
  margin-bottom: 1rem;
}

.back-button button {
  background: none;
  border: none;
  color: #1e3a8a;
  font-size: 1.2rem;
  padding: 0
  line-height 1;
}

.back-button button:hover {
  color: #1a3278;
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

/* ===== Powered By Footer ===== */
.powered-by {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  font-family: 'Century Gothic';
  font-size: 1.0rem;
  color: #64748b;
}

.powered-by .tanda {
  color: #1e3a8a;
  font-weight: 400;
  font-size: 2rem;
}

.powered-by .pay {
  color: #ea580c;
  font-weight: 400;
  margin-left: -1px;
  font-size: 2rem;
}
</style>
