<template>
  <!-- Reusable "update & verify phone number" card. Works for both account
       types — pass account-type="user" or "client". Wired to the real OTP
       endpoints (dev OTP is 123456). -->
  <div class="phone-card">
    <div class="phone-head">
      <h3 class="phone-title">Phone number</h3>
      <span v-if="verified" class="verified-badge"><i class="fas fa-circle-check"></i> Verified</span>
    </div>

    <div class="phone-row">
      <select v-model="countryCode" class="phone-select">
        <option value="+20">Egypt (+20)</option>
        <option value="+966">Saudi Arabia (+966)</option>
        <option value="+971">UAE (+971)</option>
      </select>
      <input v-model="phoneNumber" type="tel" class="phone-input" placeholder="01XXXXXXXXX">
      <button class="phone-btn" type="button" :disabled="sending" @click="sendCode">
        {{ sending ? 'Sending…' : 'Send code' }}
      </button>
    </div>

    <div v-if="codeSent" class="phone-row otp-row">
      <input v-model="otp" type="text" maxlength="6" class="phone-input otp" placeholder="------">
      <button class="phone-btn" type="button" :disabled="verifying" @click="verify">
        {{ verifying ? 'Verifying…' : 'Verify' }}
      </button>
      <span class="otp-hint">Dev code: 123456</span>
    </div>
  </div>
</template>

<script>
import { userAPI, clientAPI } from '@/api'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

export default {
  name: 'PhoneNumberCard',
  props: {
    accountType: { type: String, default: 'user' } // 'user' | 'client'
  },
  setup() {
    return { auth: useAuth(), toast: useToast() }
  },
  data() {
    const user = useAuth().state.user || {}
    return {
      countryCode: user.country_code || '+20',
      phoneNumber: user.phone_number || '',
      otp: '',
      codeSent: false,
      sending: false,
      verifying: false,
      verified: Boolean(user.phone_verified_at)
    }
  },
  methods: {
    api() {
      return this.accountType === 'client' ? clientAPI : userAPI
    },
    async sendCode() {
      if (!this.phoneNumber.trim()) {
        this.toast.error('Enter your phone number first.')
        return
      }
      this.sending = true
      try {
        await this.api().sendPhoneOTP({ country_code: this.countryCode, phone_number: this.phoneNumber.trim() })
        this.codeSent = true
        this.toast.success('Verification code sent.')
      } catch (err) {
        this.toast.error(err.response?.data?.message || 'Could not send the code.')
      } finally {
        this.sending = false
      }
    },
    async verify() {
      if (this.otp.trim().length < 6) {
        this.toast.error('Enter the 6-digit code.')
        return
      }
      this.verifying = true
      try {
        const { data } = await this.api().verifyPhone({
          country_code: this.countryCode,
          phone_number: this.phoneNumber.trim(),
          otp: this.otp.trim()
        })
        // Sync the cached user so the new (verified) number shows everywhere.
        if (data?.data) {
          this.auth.state.user = { ...this.auth.state.user, ...data.data }
          localStorage.setItem('user', JSON.stringify(this.auth.state.user))
        }
        this.verified = true
        this.codeSent = false
        this.otp = ''
        this.toast.success('Phone number updated.')
      } catch (err) {
        this.toast.error(err.response?.data?.message || 'Verification failed.')
      } finally {
        this.verifying = false
      }
    }
  }
}
</script>

<style scoped>
.phone-card { border: 2px solid #E0F5F5; border-radius: 18px; padding: 24px; background: linear-gradient(180deg, #FFFFFF 0%, #FAFEFE 100%); }
.phone-head { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
.phone-title { font-size: 20px; font-weight: 700; color: #0C9892; margin: 0; }
.verified-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: #15803d; background: #dcfce7; padding: 4px 12px; border-radius: 20px; }
.phone-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.otp-row { margin-top: 14px; }
.phone-select, .phone-input { padding: 12px 16px; border: 2px solid #CCCCCC; border-radius: 30px; font-size: 15px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; background: #fff; font-family: 'Lato', sans-serif; }
.phone-select { flex: 0 0 170px; }
.phone-input { flex: 1; min-width: 160px; }
.phone-input.otp { letter-spacing: 6px; text-align: center; flex: 0 0 160px; }
.phone-select:focus, .phone-input:focus { border-color: #0C9892; box-shadow: 0 0 0 3px rgba(12,152,146,0.15); }
.phone-btn { background: linear-gradient(135deg, #0C9892 0%, #14B5A5 100%); color: #fff; border: none; border-radius: 30px; padding: 12px 24px; font-weight: 700; cursor: pointer; transition: transform 0.15s; white-space: nowrap; }
.phone-btn:hover:not(:disabled) { transform: translateY(-2px); }
.phone-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.otp-hint { font-size: 13px; color: #888; }
@media (max-width: 600px) { .phone-select, .phone-input.otp { flex: 1 1 100%; } }
</style>
