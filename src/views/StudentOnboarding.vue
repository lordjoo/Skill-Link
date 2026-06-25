<template>
  <div class="onboarding-page">
    <div class="onboarding-container">

      <!-- Sidebar: 3 numbered steps -->
      <aside class="onboarding-sidebar">
        <div class="brand-logo">S<span>killLink</span></div>
        <div class="steps">
          <div
            v-for="n in 3"
            :key="n"
            class="step-item"
            :class="{ active: currentStep >= n, current: currentStep === n }"
            @click="jumpToStep(n)"
          >
            <div class="step-circle">{{ n }}</div>
            <div class="step-label">{{ stepLabel(n) }}</div>
          </div>
        </div>
      </aside>

      <!-- Form card -->
      <section class="form-card">

        <!-- STEP 1: Personal Info -->
        <div v-if="currentStep === 1" class="step-panel">
          <h2 class="step-title">Personal Info</h2>

          <div class="photo-section">
            <div class="photo-placeholder"><i class="fas fa-camera"></i></div>
          </div>

          <div class="form-group">
            <label class="form-label">Full name</label>
            <div class="name-row">
              <input v-model="form.firstName" type="text" class="form-input" placeholder="First name">
              <input v-model="form.lastName" type="text" class="form-input" placeholder="Last name">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Address</label>
            <input v-model="form.address" type="text" class="form-input" placeholder="e.g. Cairo, Egypt">
          </div>

          <div class="form-group">
            <label class="form-label">Date of birth</label>
            <input v-model="form.dob" type="date" class="form-input">
          </div>

          <div class="form-group">
            <label class="form-label">Languages</label>
            <input v-model="form.languages" type="text" class="form-input" placeholder="e.g. Arabic, English">
            <p class="field-hint">Separate multiple languages with commas.</p>
          </div>

          <div class="form-group">
            <label class="form-label">About</label>
            <textarea v-model="form.about" class="form-input" rows="3" placeholder="Brief about you..."></textarea>
          </div>
        </div>

        <!-- STEP 2: Professional Info -->
        <div v-else-if="currentStep === 2" class="step-panel">
          <h2 class="step-title">Professional Info</h2>

          <div class="form-group">
            <label class="form-label">Speciality</label>
            <input v-model="form.speciality" type="text" class="form-input" placeholder="e.g. frontend">
            <p class="field-hint">Used to match you with jobs — it must match a client's job speciality.</p>
          </div>

          <div class="form-group">
            <label class="form-label">Skills</label>
            <input v-model="form.skills" type="text" class="form-input" placeholder="e.g. HTML, CSS, JavaScript">
            <p class="field-hint">Separate multiple skills with commas.</p>
          </div>

          <div class="form-group">
            <label class="form-label">Education</label>
            <input v-model="form.university" type="text" class="form-input stacked" placeholder="University / Institute">
            <input v-model="form.college" type="text" class="form-input stacked" placeholder="College">
            <input v-model="form.studyYears" type="text" class="form-input" placeholder="Years of study e.g. 2021-2024">
          </div>

          <div class="form-group">
            <label class="form-label">Social links</label>
            <div class="social-field"><i class="fab fa-linkedin-in"></i><input v-model="form.linkedin" type="url" placeholder="LinkedIn URL"></div>
            <div class="social-field"><i class="fab fa-github"></i><input v-model="form.github" type="url" placeholder="GitHub URL"></div>
            <div class="social-field"><i class="fab fa-behance"></i><input v-model="form.behance" type="url" placeholder="Behance URL"></div>
          </div>
        </div>

        <!-- STEP 3: Verify phone (optional) -->
        <div v-else-if="currentStep === 3" class="step-panel">
          <h2 class="step-title">Verify phone</h2>
          <p class="step-intro">Verifying your phone is optional — you can skip it and finish setting up your profile.</p>

          <div class="form-group">
            <label class="form-label">Country</label>
            <select v-model="phone.country_code" class="form-input">
              <option value="+20">Egypt (+20)</option>
              <option value="+966">Saudi Arabia (+966)</option>
              <option value="+971">UAE (+971)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Phone number</label>
            <div class="phone-row">
              <input v-model="phone.phone_number" type="tel" class="form-input" placeholder="01XXXXXXXXX">
              <button class="btn-secondary" type="button" :disabled="sendingCode" @click="sendCode">
                {{ sendingCode ? 'Sending...' : 'Send code' }}
              </button>
            </div>
          </div>

          <div v-if="codeSent" class="form-group">
            <label class="form-label">Verification code</label>
            <div class="phone-row">
              <input v-model="phone.otp" type="text" maxlength="6" class="form-input code-input" placeholder="------">
              <button class="btn-secondary" type="button" :disabled="verifying" @click="verifyPhone">
                {{ verifying ? 'Verifying...' : 'Verify' }}
              </button>
            </div>
            <p class="field-hint">Dev OTP: 123456</p>
            <p v-if="phoneVerified" class="verified-note"><i class="fas fa-check-circle"></i> Phone verified</p>
          </div>

          <button class="btn-skip" type="button" @click="finish">Skip &amp; finish</button>
        </div>

        <!-- Navigation -->
        <div class="form-nav">
          <button v-if="currentStep > 1" class="btn-back" type="button" @click="goBack">Back</button>
          <span v-else></span>
          <button v-if="currentStep < 3" class="btn-primary" type="button" @click="goContinue">Continue</button>
          <button v-else class="btn-primary" type="button" :disabled="submitting" @click="finish">
            {{ submitting ? 'Saving...' : 'Finish' }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { userAPI } from '@/api'
import { useToast } from '@/composables/useToast'

export default {
  name: 'StudentOnboarding',
  setup() {
    return { toast: useToast() }
  },
  data() {
    return {
      currentStep: 1,
      submitting: false,
      sendingCode: false,
      verifying: false,
      codeSent: false,
      phoneVerified: false,
      form: {
        firstName: '', lastName: '', address: '', dob: '', languages: '', about: '',
        speciality: '', skills: '', university: '', college: '', studyYears: '',
        linkedin: '', github: '', behance: ''
      },
      phone: { country_code: '+20', phone_number: '', otp: '' }
    }
  },
  methods: {
    stepLabel(n) {
      return ['Personal Info', 'Professional Info', 'Verify phone'][n - 1]
    },
    // Trim a value, returning null when it is empty (keeps the payload clean).
    clean(value) {
      const text = (value || '').trim()
      return text || null
    },
    // Split a comma-separated string into a clean array of non-empty values.
    splitList(value) {
      return (value || '').split(',').map((s) => s.trim()).filter(Boolean)
    },
    namesFilled() {
      return Boolean(this.form.firstName.trim() && this.form.lastName.trim())
    },
    goBack() {
      if (this.currentStep > 1) this.currentStep--
    },
    goContinue() {
      // Step 1 requires a first and last name before moving on.
      if (this.currentStep === 1 && !this.namesFilled()) {
        this.toast.error('Please enter your first and last name.')
        return
      }
      if (this.currentStep < 3) this.currentStep++
    },
    jumpToStep(n) {
      if (n === this.currentStep) return
      if (n > 1 && !this.namesFilled()) {
        this.toast.error('Please enter your first and last name.')
        return
      }
      this.currentStep = n
    },
    async sendCode() {
      if (!this.phone.phone_number.trim()) {
        this.toast.error('Enter your phone number first.')
        return
      }
      this.sendingCode = true
      try {
        await userAPI.sendPhoneOTP({
          country_code: this.phone.country_code,
          phone_number: this.phone.phone_number.trim()
        })
        this.codeSent = true
        this.toast.success('Verification code sent.')
      } catch (err) {
        this.toast.error(err.response?.data?.message || 'Could not send the code.')
      } finally {
        this.sendingCode = false
      }
    },
    async verifyPhone() {
      if (this.phone.otp.trim().length < 6) {
        this.toast.error('Enter the 6-digit code.')
        return
      }
      this.verifying = true
      try {
        await userAPI.verifyPhone({
          country_code: this.phone.country_code,
          phone_number: this.phone.phone_number.trim(),
          otp: this.phone.otp.trim()
        })
        this.phoneVerified = true
        this.toast.success('Phone verified!')
      } catch (err) {
        this.toast.error(err.response?.data?.message || 'Verification failed.')
      } finally {
        this.verifying = false
      }
    },
    async finish() {
      if (!this.namesFilled()) {
        this.currentStep = 1
        this.toast.error('Please enter your first and last name.')
        return
      }
      this.submitting = true
      try {
        const payload = {
          first_name: this.form.firstName.trim(),
          last_name: this.form.lastName.trim(),
          address: this.clean(this.form.address),
          date_of_birth: this.clean(this.form.dob),
          languages: this.splitList(this.form.languages),
          brief: this.clean(this.form.about),
          speciality: this.clean(this.form.speciality),
          skills: this.splitList(this.form.skills),
          university: this.clean(this.form.university),
          college: this.clean(this.form.college),
          study_years: this.clean(this.form.studyYears),
          linkedin_url: this.clean(this.form.linkedin),
          github_url: this.clean(this.form.github),
          behance_url: this.clean(this.form.behance)
        }
        await userAPI.updateMyProfile(payload)
        this.toast.success('Profile complete!')
        this.$router.push('/home')
      } catch (err) {
        this.toast.error(err.response?.data?.message || 'Could not save your profile.')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

.onboarding-page { min-height: 100vh; background: linear-gradient(135deg, #F5F5F5 0%, #E8F5F5 100%); padding: 40px 20px; display: flex; justify-content: center; }
.onboarding-container { display: flex; width: 100%; max-width: 1150px; gap: 40px; align-items: flex-start; }

/* Sidebar */
.onboarding-sidebar { width: 260px; flex-shrink: 0; padding-top: 30px; }
.brand-logo { font-family: 'Dancing Script', cursive; font-size: 30px; font-weight: 700; color: #0C9892; margin-bottom: 50px; }
.brand-logo span { color: #000000; }
.steps { display: flex; flex-direction: column; }
.step-item { display: flex; align-items: center; gap: 15px; margin-bottom: 45px; cursor: pointer; position: relative; }
.step-item:not(:last-child)::after { content: ''; position: absolute; left: 19px; top: 42px; width: 3px; height: 45px; background: #CFE8E6; }
.step-item.active:not(:last-child)::after { background: #0C9892; }
.step-circle { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #0C9892; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #0C9892; background: #FFFFFF; z-index: 2; transition: all 0.3s; }
.step-item.active .step-circle { background: linear-gradient(135deg, #0C9892 0%, #14B5A5 100%); color: #FFFFFF; box-shadow: 2px 2px 8px rgba(12, 152, 146, 0.3); }
.step-label { color: #0C9892; font-size: 16px; font-weight: 600; }
.step-item.current .step-label { text-shadow: 1px 1px 2px rgba(12, 152, 146, 0.2); }

/* Form card */
.form-card { flex: 1; background: linear-gradient(180deg, #FFFFFF 0%, #FAFEFE 100%); border-radius: 25px; padding: 45px; box-shadow: 4px 4px 12px rgba(12, 152, 146, 0.15); border: 2px solid #E0F5F5; }
.step-panel { max-width: 650px; }
.step-title { font-size: 26px; font-weight: 700; color: #0C9892; margin: 0 0 25px; text-shadow: 1px 1px 2px rgba(12, 152, 146, 0.2); }
.step-intro { font-size: 15px; color: #666; margin: -10px 0 25px; line-height: 1.5; }

.photo-section { display: flex; justify-content: center; margin-bottom: 35px; }
.photo-placeholder { width: 110px; height: 110px; border-radius: 50%; border: 3px solid #0C9892; display: flex; align-items: center; justify-content: center; color: #9CC9C6; font-size: 32px; background: linear-gradient(135deg, #F8FFFF 0%, #F0FAFA 100%); }

.form-group { margin-bottom: 26px; }
.form-label { display: block; font-size: 17px; font-weight: 700; color: #0C9892; margin-bottom: 10px; }
.form-input { width: 100%; padding: 14px 20px; border: 2px solid #CCCCCC; border-radius: 30px; font-size: 16px; outline: none; transition: all 0.3s; background-color: #FFFFFF; font-family: 'Lato', sans-serif; box-sizing: border-box; }
.form-input:focus { border-color: #0C9892; box-shadow: 0 0 0 4px rgba(12, 152, 146, 0.15); }
textarea.form-input { border-radius: 20px; resize: vertical; }
.form-input.stacked { margin-bottom: 14px; }
.field-hint { font-size: 13px; color: #888; margin: 8px 4px 0; line-height: 1.4; }
.name-row { display: flex; gap: 15px; }
.name-row .form-input { flex: 1; }

.social-field { display: flex; align-items: center; border: 2px solid #CCCCCC; border-radius: 30px; padding-left: 18px; margin-bottom: 12px; transition: all 0.3s; background: #FFFFFF; }
.social-field:focus-within { border-color: #0C9892; box-shadow: 0 0 0 4px rgba(12, 152, 146, 0.15); }
.social-field i { width: 22px; color: #0C9892; font-size: 18px; }
.social-field input { flex: 1; border: none; outline: none; padding: 14px 18px 14px 10px; font-size: 16px; background: transparent; border-radius: 30px; font-family: 'Lato', sans-serif; }

.phone-row { display: flex; gap: 12px; align-items: center; }
.phone-row .form-input { flex: 1; }
.code-input { text-align: center; letter-spacing: 8px; font-size: 20px; }
.verified-note { color: #0C9892; font-weight: 700; font-size: 15px; margin: 12px 4px 0; display: flex; align-items: center; gap: 8px; }

/* Buttons */
.btn-primary { background: linear-gradient(135deg, #0C9892 0%, #14B5A5 100%); color: #FFFFFF; border: none; border-radius: 30px; padding: 14px 42px; font-size: 17px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 3px 3px 8px rgba(12, 152, 146, 0.3); }
.btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 5px 5px 12px rgba(12, 152, 146, 0.4); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-secondary { background: #FFFFFF; color: #0C9892; border: 2px solid #0C9892; border-radius: 30px; padding: 12px 24px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.3s; white-space: nowrap; }
.btn-secondary:hover:not(:disabled) { background: #E8F5F5; }
.btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-back { background: none; border: none; color: #999; cursor: pointer; font-weight: 700; font-size: 16px; padding: 10px 4px; transition: color 0.2s; }
.btn-back:hover { color: #0C9892; }
.btn-skip { margin-top: 18px; background: #FFFFFF; border: 2px dashed #0C9892; color: #0C9892; border-radius: 30px; padding: 12px 28px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.3s; }
.btn-skip:hover { background: #E8F5F5; transform: translateY(-2px); }

.form-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 35px; }

@media (max-width: 768px) {
  .onboarding-container { flex-direction: column; gap: 20px; }
  .onboarding-sidebar { width: 100%; padding-top: 0; }
  .steps { flex-direction: row; flex-wrap: wrap; gap: 10px; }
  .step-item { margin-bottom: 0; }
  .step-item:not(:last-child)::after { display: none; }
  .form-card { padding: 30px 22px; }
  .name-row { flex-direction: column; }
  .phone-row { flex-direction: column; align-items: stretch; }
  .btn-secondary { width: 100%; }
}
</style>
