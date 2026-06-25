<template>
  <div class="page-container">
    <div class="logo-header" @click="$router.push('/login')">
      <span class="logo-s">S</span><span class="logo-killlink">killLink</span>
    </div>
    
    <div class="card">
      <h1 class="title">Create a new password</h1>
      
      <div class="input-group">
        <input 
          :type="showNewPassword ? 'text' : 'password'" 
          v-model="newPassword" 
          placeholder="New password" 
          class="input-field"
        >
        <button type="button" class="toggle-password" @click="showNewPassword = !showNewPassword">
          <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
      
      <div class="input-group">
        <input 
          :type="showConfirmPassword ? 'text' : 'password'" 
          v-model="confirmPassword" 
          placeholder="Confirm password" 
          class="input-field"
        >
        <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
          <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
      
      <p v-if="error" class="form-error">{{ error }}</p>

      <button class="btn-reset" @click="handleReset" :disabled="loading">
        {{ loading ? 'Resetting...' : 'Reset password' }}
      </button>
    </div>
  </div>
</template>

<script>
import { authAPI } from '@/api'

export default {
  name: 'ResetPassword',
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      showNewPassword: false,
      showConfirmPassword: false,
      loading: false,
      error: ''
    }
  },
  created() {
    const reset = JSON.parse(sessionStorage.getItem('reset') || '{}')
    if (!reset.email || !reset.code) {
      this.$router.replace('/forgot-password')
    }
  },
  methods: {
    async handleReset() {
      this.error = ''
      if (!this.newPassword || !this.confirmPassword) {
        this.error = 'Please fill in both fields.'
        return
      }
      if (this.newPassword !== this.confirmPassword) {
        this.error = 'Passwords do not match.'
        return
      }

      const reset = JSON.parse(sessionStorage.getItem('reset') || '{}')
      this.loading = true
      try {
        await authAPI.resetPassword({
          email: reset.email,
          type: reset.type,
          code: reset.code,
          password: this.newPassword
        })
        sessionStorage.removeItem('reset')
        this.$router.push('/password-success')
      } catch (err) {
        this.error = err.response?.data?.message || 'Could not reset your password. Check the code and try again.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.logo-header {
  position: absolute;
  top: 30px;
  left: 50px;
  font-size: 32px;
  font-weight: 700;
  cursor: pointer;
}

.logo-s { color: #0C9892; font-family: 'Dancing Script', cursive; }
.logo-killlink { color: #000; }

.card {
  background: white;
  border-radius: 30px;
  padding: 50px 60px;
  box-shadow: 0 15px 50px rgba(0,0,0,0.15);
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.title {
  color: #0C9892;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 30px;
}

.input-group { position: relative; margin-bottom: 20px; }

.input-field {
  width: 100%;
  padding: 15px 20px;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
}

.input-field:focus { border-color: #0C9892; box-shadow: 0 0 0 3px rgba(12, 152, 146, 0.1); }

.toggle-password {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 18px;
}

.btn-reset {
  width: 100%;
  padding: 16px;
  background: #0C9892;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(12, 152, 146, 0.3);
  margin-top: 10px;
}

.btn-reset:hover { background: #0a827d; transform: translateY(-2px); }
.btn-reset:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
</style>