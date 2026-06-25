<template>
  <div class="page-container">
    <div class="logo-header" @click="$router.push('/login')">
      <span class="logo-s">S</span><span class="logo-killlink">killLink</span>
    </div>
    
    <div class="card">
      <h1 class="title">Forgot password?</h1>
      <p class="description">
        Please enter your email or phone number below.<br>
        We'll help you recover your account
      </p>
      
      <div class="role-toggle">
        <button type="button" :class="{ active: type === 'user' }" @click="type = 'user'">Freelancer</button>
        <button type="button" :class="{ active: type === 'client' }" @click="type = 'client'">Client</button>
      </div>

      <div class="input-group">
        <input type="email" v-model="email" placeholder="Email" class="input-field">
      </div>

      <p v-if="error" class="form-error">{{ error }}</p>

      <button class="btn-next" @click="handleNext" :disabled="loading">
        {{ loading ? 'Sending...' : 'Next' }}
      </button>
      
      <div class="back-link" @click="$router.push('/login')">
        ‹ Back to Login
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '@/api'

export default {
  name: 'ForgotPassword',
  data() {
    return { email: '', type: 'user', loading: false, error: '' }
  },
  methods: {
    async handleNext() {
      this.error = ''
      if (!this.email) {
        this.error = 'Please enter your email.'
        return
      }

      this.loading = true
      try {
        await authAPI.forgetPassword({ email: this.email, type: this.type })
        // Carry the email/type to the next steps of the reset flow.
        sessionStorage.setItem('reset', JSON.stringify({ email: this.email, type: this.type }))
        this.$router.push('/verify-code')
      } catch (err) {
        this.error = err.response?.data?.message || 'Could not send the reset code. Please try again.'
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
  margin-bottom: 20px;
}

.description {
  color: #333;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 30px;
}

.input-group { margin-bottom: 25px; }

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

.btn-next {
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
  margin-bottom: 20px;
}

.btn-next:hover { background: #0a827d; transform: translateY(-2px); }
.btn-next:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.role-toggle { display: flex; gap: 10px; margin-bottom: 20px; }
.role-toggle button { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 30px; background: #fff; font-weight: 600; color: #666; cursor: pointer; transition: all 0.3s; }
.role-toggle button.active { background: #0C9892; color: #fff; border-color: #0C9892; }

.back-link {
  color: #0C9892;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
}

.back-link:hover { text-decoration: underline; }
</style>