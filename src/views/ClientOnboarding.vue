<template>
  <div class="onboarding-page">
    <div class="onboarding-container">
      <!-- Left sidebar: 3 steps -->
      <aside class="onboarding-sidebar">
        <div class="brand-logo"><span class="brand-s">S</span>killLink</div>
        <div class="steps">
          <div
            v-for="n in 3"
            :key="n"
            class="step-item"
            :class="{ active: currentStep >= n, current: currentStep === n }"
          >
            <div class="step-circle">
              <i v-if="currentStep > n" class="fas fa-check"></i>
              <span v-else>{{ n }}</span>
            </div>
            <div class="step-label">{{ getStepLabel(n) }}</div>
          </div>
        </div>
      </aside>

      <!-- White form card -->
      <section class="form-card">
        <!-- STEP 1 — Personal Info -->
        <div v-if="currentStep === 1" class="step-pane">
          <h2 class="step-title">Personal Info</h2>
          <p class="step-subtitle">Tell us a little about yourself.</p>

          <div class="photo-wrapper">
            <div class="photo-circle" @click="$refs.fileInput.click()">
              <img v-if="imageUrl" :src="imageUrl" alt="Profile preview" class="photo-img" />
              <i v-else class="fas fa-camera"></i>
            </div>
            <input ref="fileInput" type="file" accept="image/*" hidden @change="handleFileUpload" />
            <span class="photo-hint">Add a photo (optional)</span>
          </div>

          <div class="form-group">
            <label class="form-label">Full name</label>
            <div class="name-row">
              <input v-model="form.firstName" type="text" class="form-input" placeholder="First name" />
              <input v-model="form.lastName" type="text" class="form-input" placeholder="Last name" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Location</label>
            <input v-model="form.location" type="text" class="form-input" placeholder="e.g. Cairo, Egypt" />
          </div>

          <div class="form-group">
            <label class="form-label">Languages</label>
            <input v-model="form.languages" type="text" class="form-input" placeholder="e.g. Arabic, English" />
          </div>

          <div class="form-group">
            <label class="form-label">About</label>
            <textarea v-model="form.about" class="form-input" rows="3" placeholder="Brief about you..."></textarea>
          </div>
        </div>

        <!-- STEP 2 — Company Info -->
        <div v-else-if="currentStep === 2" class="step-pane">
          <h2 class="step-title">Company Info</h2>
          <p class="step-subtitle">Help freelancers understand who they will work with.</p>

          <div class="form-group">
            <label class="form-label">Company Name</label>
            <input v-model="form.companyName" type="text" class="form-input" placeholder="Enter company name" />
          </div>

          <div class="form-group">
            <label class="form-label">Industry</label>
            <select v-model="form.industry" class="form-input">
              <option value="">Select Industry</option>
              <option>Technology &amp; Software</option>
              <option>Marketing &amp; Advertising</option>
              <option>Design &amp; Creative</option>
              <option>Business &amp; Finance</option>
              <option>Individual Client</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Website</label>
            <input v-model="form.website" type="url" class="form-input" placeholder="https://example.com" />
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea v-model="form.description" class="form-input" rows="4" placeholder="Describe your company or projects..."></textarea>
          </div>
        </div>

        <!-- STEP 3 — Verify phone (optional) -->
        <div v-else-if="currentStep === 3" class="step-pane">
          <h2 class="step-title">Verify phone</h2>
          <p class="step-subtitle">
            Verifying your phone helps build trust with freelancers. This step is optional.
          </p>

          <div class="form-group">
            <label class="form-label">Country</label>
            <select v-model="form.countryCode" class="form-input">
              <option value="+20">Egypt (+20)</option>
              <option value="+966">Saudi Arabia (+966)</option>
              <option value="+971">UAE (+971)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Phone number</label>
            <input
              v-model="form.phone"
              type="tel"
              class="form-input"
              placeholder="01XXXXXXXXX"
              @keydown.enter.prevent="sendOtp"
            />
          </div>

          <p class="privacy-note">
            Your phone number stays private and is never shared or used for marketing.
          </p>

          <div class="verify-actions">
            <button class="btn-primary" :disabled="sendingOtp" @click="sendOtp">
              {{ sendingOtp ? 'Sending...' : 'Send code' }}
            </button>
            <button class="btn-skip" :disabled="submitting" @click="skipAndFinish">
              {{ submitting ? 'Finishing...' : 'Skip & finish' }}
            </button>
          </div>
        </div>

        <!-- Footer: Back / Continue -->
        <div class="card-footer">
          <button v-if="currentStep > 1" class="btn-back" @click="prevStep">Back</button>
          <span v-else></span>
          <button v-if="currentStep < 3" class="btn-primary" @click="nextStep">Continue</button>
        </div>
      </section>
    </div>

    <!-- OTP modal -->
    <div v-if="showOtpModal" class="modal-overlay" @click.self="showOtpModal = false">
      <div class="modal-card">
        <button class="close-modal" @click="showOtpModal = false"><i class="fas fa-times"></i></button>
        <h3 class="modal-title">Verify phone number</h3>
        <p class="modal-text">Code sent to <strong>{{ form.countryCode }} {{ form.phone }}</strong></p>
        <input
          v-model="otp"
          type="text"
          maxlength="6"
          class="otp-input"
          placeholder="------"
          @keydown.enter.prevent="confirmOtp"
        />
        <button class="btn-primary modal-btn" :disabled="verifying" @click="confirmOtp">
          {{ verifying ? 'Verifying...' : 'Confirm code' }}
        </button>
        <p class="modal-hint">Didn't get a code? Check the number and try again.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { clientAPI } from '@/api'
import { useToast } from '@/composables/useToast'

export default {
  name: 'ClientOnboarding',
  setup() {
    return { toast: useToast() }
  },
  data() {
    return {
      currentStep: 1,
      imageUrl: null,
      showOtpModal: false,
      sendingOtp: false,
      verifying: false,
      submitting: false,
      otp: '',
      form: {
        firstName: '',
        lastName: '',
        location: '',
        languages: '',
        about: '',
        companyName: '',
        industry: '',
        website: '',
        description: '',
        countryCode: '+20',
        phone: ''
      }
    }
  },
  methods: {
    getStepLabel(n) {
      return ['Personal Info', 'Company Info', 'Verify phone'][n - 1]
    },
    handleFileUpload(event) {
      // Decorative preview only — the photo is not uploaded here.
      const file = event.target.files[0]
      if (file) this.imageUrl = URL.createObjectURL(file)
    },
    nextStep() {
      if (this.currentStep === 1) {
        if (!this.form.firstName.trim() || !this.form.lastName.trim()) {
          this.toast.error('Please enter your first and last name.')
          return
        }
      }
      if (this.currentStep < 3) this.currentStep++
    },
    prevStep() {
      if (this.currentStep > 1) this.currentStep--
    },
    async sendOtp() {
      if (!this.form.phone.trim()) {
        this.toast.error('Please enter your phone number.')
        return
      }
      this.sendingOtp = true
      try {
        await clientAPI.sendPhoneOTP({
          country_code: this.form.countryCode,
          phone_number: this.form.phone.trim()
        })
        this.otp = ''
        this.showOtpModal = true
        this.toast.info('Verification code sent.')
      } catch (err) {
        this.toast.error(err.response?.data?.message || 'Could not send the code.')
      } finally {
        this.sendingOtp = false
      }
    },
    async confirmOtp() {
      if (this.otp.trim().length < 4) {
        this.toast.error('Enter the code you received.')
        return
      }
      this.verifying = true
      try {
        await clientAPI.verifyPhone({
          country_code: this.form.countryCode,
          phone_number: this.form.phone.trim(),
          otp: this.otp.trim()
        })
        this.showOtpModal = false
        this.toast.success('Phone verified!')
        await this.finish()
      } catch (err) {
        this.toast.error(err.response?.data?.message || 'Invalid or expired code.')
      } finally {
        this.verifying = false
      }
    },
    async finish() {
      if (this.submitting) return
      this.submitting = true
      try {
        const payload = {
          first_name: this.form.firstName.trim(),
          last_name: this.form.lastName.trim(),
          location: this.form.location.trim(),
          languages: this.form.languages
            ? this.form.languages.split(',').map((l) => l.trim()).filter(Boolean)
            : [],
          about: this.form.about.trim(),
          company_name: this.form.companyName.trim(),
          industry: this.form.industry,
          website: this.form.website.trim(),
          company_description: this.form.description.trim()
        }
        await clientAPI.updateClientProfile(payload)
        this.toast.success('Profile complete!')
        this.$router.push('/client-home')
      } catch (err) {
        this.toast.error(err.response?.data?.message || 'Could not save your profile.')
      } finally {
        this.submitting = false
      }
    },
    skipAndFinish() {
      this.finish()
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

.onboarding-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #F5F5F5 0%, #E8F5F5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  font-family: 'Lato', sans-serif;
}
.onboarding-container {
  display: flex;
  gap: 40px;
  width: 100%;
  max-width: 1100px;
  align-items: flex-start;
}

/* Sidebar */
.onboarding-sidebar {
  width: 280px;
  flex-shrink: 0;
  padding-top: 20px;
}
.brand-logo {
  font-size: 30px;
  font-weight: 800;
  color: #000000;
  margin-bottom: 60px;
}
.brand-s {
  font-family: 'Dancing Script', cursive;
  color: #0C9892;
  font-size: 38px;
}
.step-item {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 50px;
  position: relative;
}
.step-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 21px;
  top: 46px;
  width: 3px;
  height: 50px;
  background: #DDDDDD;
  transition: background 0.3s;
}
.step-item.active:not(:last-child)::after {
  background: #0C9892;
}
.step-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #DDDDDD;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 17px;
  color: #999999;
  background: #FFFFFF;
  z-index: 2;
  transition: all 0.3s;
}
.step-item.active .step-circle {
  border-color: #0C9892;
  background: linear-gradient(135deg, #0C9892 0%, #14B5A5 100%);
  color: #FFFFFF;
  box-shadow: 2px 2px 8px rgba(12, 152, 146, 0.3);
}
.step-label {
  font-size: 17px;
  font-weight: 600;
  color: #999999;
  transition: color 0.3s;
}
.step-item.active .step-label {
  color: #0C9892;
}

/* Form card */
.form-card {
  flex: 1;
  background: linear-gradient(180deg, #FFFFFF 0%, #FAFEFE 100%);
  border-radius: 25px;
  padding: 45px;
  box-shadow: 4px 4px 16px rgba(12, 152, 146, 0.15);
  border: 2px solid #E0F5F5;
}
.step-title {
  font-size: 26px;
  font-weight: 700;
  color: #0C9892;
  margin: 0 0 6px;
}
.step-subtitle {
  font-size: 15px;
  color: #666666;
  margin: 0 0 30px;
}

/* Photo */
.photo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}
.photo-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px dashed #0C9892;
  background: #F0FAFA;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  color: #0C9892;
  font-size: 30px;
  transition: all 0.3s;
}
.photo-circle:hover {
  background: #E8F5F5;
  transform: scale(1.04);
}
.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.photo-hint {
  margin-top: 10px;
  font-size: 13px;
  color: #888888;
}

/* Form fields */
.form-group {
  margin-bottom: 24px;
}
.form-label {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #0C9892;
  margin-bottom: 10px;
}
.form-input {
  width: 100%;
  padding: 14px 20px;
  border: 2px solid #CCCCCC;
  border-radius: 30px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
  background-color: #FFFFFF;
  font-family: 'Lato', sans-serif;
  box-sizing: border-box;
}
textarea.form-input {
  border-radius: 18px;
  resize: vertical;
}
.form-input:focus {
  border-color: #0C9892;
  box-shadow: 0 0 0 4px rgba(12, 152, 146, 0.15);
}
.name-row {
  display: flex;
  gap: 14px;
}
.name-row .form-input {
  flex: 1;
}

/* Privacy + verify actions */
.privacy-note {
  font-size: 13px;
  color: #6B7280;
  margin: 6px 0 24px;
}
.verify-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
.verify-actions .btn-primary {
  flex: 1;
  min-width: 160px;
}

/* Buttons */
.btn-primary {
  background: linear-gradient(135deg, #0C9892 0%, #14B5A5 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 30px;
  padding: 14px 40px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 3px 3px 8px rgba(12, 152, 146, 0.3);
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 5px 5px 12px rgba(12, 152, 146, 0.4);
}
.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.btn-skip {
  background: #FFFFFF;
  color: #0C9892;
  border: 2px solid #0C9892;
  border-radius: 30px;
  padding: 14px 40px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;
  min-width: 160px;
}
.btn-skip:hover:not(:disabled) {
  background: #E8F5F5;
}
.btn-skip:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.btn-back {
  background: none;
  border: none;
  color: #999999;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s;
}
.btn-back:hover {
  color: #0C9892;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 35px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.25s ease;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.modal-card {
  background: #FFFFFF;
  padding: 40px 35px;
  border-radius: 25px;
  width: 90%;
  max-width: 440px;
  text-align: center;
  position: relative;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.18);
  border: 2px solid #E0F5F5;
  animation: slideUp 0.25s ease;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.close-modal {
  position: absolute;
  top: 16px;
  right: 18px;
  background: none;
  border: none;
  font-size: 20px;
  color: #999999;
  cursor: pointer;
  transition: all 0.2s;
}
.close-modal:hover {
  color: #0C9892;
  transform: rotate(90deg);
}
.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: #0C9892;
  margin: 0 0 10px;
}
.modal-text {
  font-size: 15px;
  color: #555555;
  margin: 0 0 10px;
}
.otp-input {
  width: 80%;
  padding: 14px;
  border-radius: 30px;
  border: 2px solid #CCCCCC;
  text-align: center;
  font-size: 22px;
  letter-spacing: 10px;
  margin: 20px 0;
  outline: none;
  transition: all 0.3s;
}
.otp-input:focus {
  border-color: #0C9892;
  box-shadow: 0 0 0 4px rgba(12, 152, 146, 0.15);
}
.modal-btn {
  width: 100%;
}
.modal-hint {
  font-size: 13px;
  color: #6B7280;
  margin: 20px 0 0;
}

/* Responsive */
@media (max-width: 768px) {
  .onboarding-container {
    flex-direction: column;
    gap: 25px;
  }
  .onboarding-sidebar {
    width: 100%;
    padding-top: 0;
  }
  .brand-logo {
    margin-bottom: 25px;
    text-align: center;
  }
  .steps {
    display: flex;
    justify-content: space-between;
  }
  .step-item {
    flex-direction: column;
    text-align: center;
    gap: 8px;
    margin-bottom: 0;
    flex: 1;
  }
  .step-item:not(:last-child)::after {
    left: auto;
    right: -50%;
    top: 21px;
    width: 100%;
    height: 3px;
  }
  .step-label {
    font-size: 13px;
  }
  .form-card {
    padding: 30px 22px;
  }
  .name-row {
    flex-direction: column;
  }
  .verify-actions {
    flex-direction: column;
  }
}
</style>
