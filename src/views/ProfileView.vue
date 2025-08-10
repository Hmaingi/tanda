<template>
  <div class="profile-container">
    <!-- Back Button - Smaller and aligned top-left -->
    <button @click="goBack" class="back-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
    </button>

    <div class="profile-card">
      <!-- Profile Header -->
      <div class="profile-header">
        <h1>Welcome, {{ user.name }}!</h1>
        <div class="flex gap-2">
          <button @click="editMode = !editMode" class="edit-btn">
            {{ editMode ? 'Cancel' : 'Edit Profile' }}
          </button>
          <button @click="logout" class="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <!-- Avatar Section -->
      <div class="avatar-section">
        <img :src="user.avatar || defaultAvatar" class="profile-avatar" alt="Profile">
        <input 
          type="file" 
          id="avatar-upload" 
          accept="image/*" 
          @change="handleAvatarUpload"
          style="display: none;"
        >
        <label for="avatar-upload" class="upload-btn">Change Photo</label>
      </div>

      <!-- Profile Form -->
      <div class="profile-form">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" v-model="user.name" :disabled="!editMode">
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="user.email" disabled>
        </div>

        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" v-model="user.phone" :disabled="!editMode">
        </div>

        <div class="form-group">
          <label>Agent ID</label>
          <input type="text" v-model="user.agentId" disabled>
        </div>

        <button 
          @click="updateProfile" 
          class="save-btn"
          v-if="editMode"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import defaultAvatar from '@/assets/default-avatar.png';

const router = useRouter();
const editMode = ref(false);

const user = ref({
  id: 1,
  name: 'Agent Smith',
  email: 'agent@tanda.africa',
  phone: '+254712345678',
  agentId: 'TND-AG-001',
  avatar: ''
});

const goBack = () => router.go(-1);

const handleAvatarUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      user.value.avatar = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const updateProfile = () => {
  console.log('Profile updated:', user.value);
  editMode.value = false;
};

const logout = () => {
  localStorage.removeItem('authToken'); // Adjust if you use another method
  router.push('/login'); // Redirect to login page
};
</script>

<style scoped>
.profile-container {
  background-color: #f0f8ff;
  min-height: 100vh;
  padding: 1rem;
  position: relative;
}

.back-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.back-btn svg {
  width: 24px;
  height: 24px;
  color: #2E5D9E;
}

.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-header h1 {
  color: #2E5D9E;
  font-size: 1.5rem;
  margin: 0;
}

.edit-btn {
  background: #2E5D9E;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.logout-btn {
  background: #e53935;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background: #d32f2f;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #a8d1ff;
  margin-bottom: 1rem;
}

.upload-btn {
  background: #e1f0ff;
  color: #2E5D9E;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  border: none;
  transition: background-color 0.2s;
}

.upload-btn:hover {
  background: #d0e5ff;
}

.profile-form {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #555;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: #f9f9f9;
}

.form-group input:disabled {
  background: #f0f0f0;
  color: #666;
}

.save-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.save-btn:hover {
  background: #43a047;
}
</style>
