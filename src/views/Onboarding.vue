<template>
  <div class="onboarding-page">
    <div class="onboarding-container">
      <!-- Wordmark -->
      <div class="header-logo">
        <span class="logo"><span class="logo-s">S</span>killLink</span>
      </div>

      <div class="main-layout">
        <!-- Left: welcome + benefit steps -->
        <div class="content-left">
          <div class="welcome-text">
            <h1>Hey {{ greetingName }}.</h1>
            <h2>Ready for your next big opportunity?</h2>
          </div>

          <div class="steps">
            <div class="step-item">
              <div class="step-icon"><i class="fas fa-user"></i></div>
              <span>Answer a few questions and start building your profile</span>
            </div>
            <div class="step-item">
              <div class="step-icon"><i class="fas fa-briefcase"></i></div>
              <span>Apply for open roles or list services for clients to buy</span>
            </div>
            <div class="step-item">
              <div class="step-icon"><i class="fas fa-shield-halved"></i></div>
              <span>Get paid safely and know we're there to help</span>
            </div>
          </div>
        </div>

        <!-- Right: sample profile card -->
        <div class="content-right">
          <div class="profile-card">
            <img src="/assets/pexels danx.jpg" alt="Sample profile" class="profile-img">
            <h3>Amar Abdelaziz</h3>
            <span class="job">UX/UI Designer</span>
            <div class="stats">
              <span class="rating"><i class="fas fa-star"></i> 5.0</span>
              <span class="dot">·</span>
              <span>$65.00/hr</span>
              <span class="dot">·</span>
              <span><i class="fas fa-briefcase"></i> 14 jobs</span>
            </div>
            <p>"SkillLink has enabled me to increase my rates. I know what I'm bringing to the table and love the feeling of being able to help a variety of clients."</p>
          </div>
        </div>
      </div>

      <!-- Footer actions -->
      <div class="footer-action">
        <a class="skip-link" @click="skip">Skip for now</a>
        <button class="btn-get-started" @click="goNext">
          Get started <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

export default {
  name: 'Onboarding',
  setup() {
    const { state, userType } = useAuth()
    const greetingName = computed(
      () => state.user?.first_name || state.user?.username || 'there'
    )
    return { state, userType, greetingName }
  },
  methods: {
    goNext() {
      if (this.userType === 'client') {
        this.$router.push('/onboarding/client')
      } else {
        this.$router.push('/onboarding/student')
      }
    },
    skip() {
      this.$router.push(this.userType === 'client' ? '/client-home' : '/home')
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
  width: 100%;
  max-width: 1100px;
  background: linear-gradient(180deg, #FFFFFF 0%, #FAFEFE 100%);
  border: 2px solid #E0F5F5;
  border-radius: 28px;
  box-shadow: 4px 4px 18px rgba(12, 152, 146, 0.15);
  padding: 45px 55px;
}

.header-logo { margin-bottom: 45px; }
.logo { font-size: 30px; font-weight: 800; color: #000; letter-spacing: -0.5px; }
.logo-s { font-family: 'Dancing Script', cursive; color: #0C9892; font-size: 38px; }

.main-layout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 50px;
}

.content-left { flex: 1.3; }

.welcome-text h1 { font-size: 32px; margin: 0; color: #1d1d1f; font-weight: 700; }
.welcome-text h2 { font-size: 26px; margin: 10px 0 40px 0; color: #0C9892; font-weight: 700; }

.steps { display: flex; flex-direction: column; gap: 10px; }
.step-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 20px;
  border-radius: 18px;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FFFF 100%);
  border: 2px solid #E0F5F5;
  transition: all 0.3s;
}
.step-item:hover {
  transform: translateX(5px);
  border-color: #0C9892;
  box-shadow: 4px 4px 12px rgba(12, 152, 146, 0.15);
}
.step-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, #E8F5F5 0%, #F0FAFA 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-icon i { font-size: 22px; color: #0C9892; }
.step-item span { font-size: 17px; color: #333; font-weight: 500; line-height: 1.45; }

.content-right { flex: 0.7; display: flex; justify-content: center; }
.profile-card {
  background: #fff;
  border: 2px solid #E0F5F5;
  border-radius: 25px;
  padding: 35px 28px;
  width: 290px;
  text-align: center;
  box-shadow: 6px 6px 18px rgba(12, 152, 146, 0.18);
}
.profile-img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
  border: 4px solid #0C9892;
}
.profile-card h3 { font-size: 19px; margin: 0; color: #1d1d1f; font-weight: 700; }
.profile-card .job { font-size: 14px; color: #666; margin: 4px 0 14px; display: block; }
.profile-card .stats {
  font-size: 13px;
  color: #333;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.profile-card .stats .rating { color: #f1c40f; }
.profile-card .stats .dot { color: #ccc; }
.profile-card p { font-size: 12px; color: #555; line-height: 1.6; font-style: italic; margin: 0; }

.footer-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 28px;
  margin-top: 45px;
}
.skip-link {
  font-size: 15px;
  font-weight: 600;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}
.skip-link:hover { color: #0C9892; }
.btn-get-started {
  background: linear-gradient(135deg, #0C9892 0%, #14B5A5 100%);
  color: #FFFFFF;
  border: none;
  padding: 14px 42px;
  border-radius: 30px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 4px 4px 12px rgba(12, 152, 146, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.btn-get-started:hover {
  transform: translateY(-2px);
  box-shadow: 6px 6px 16px rgba(12, 152, 146, 0.4);
}

@media (max-width: 900px) {
  .onboarding-container { padding: 35px 25px; }
  .main-layout { flex-direction: column-reverse; align-items: stretch; gap: 35px; }
  .content-left { text-align: left; }
  .content-right { width: 100%; }
  .welcome-text h1 { font-size: 28px; }
  .welcome-text h2 { font-size: 22px; }
  .footer-action { flex-direction: column-reverse; align-items: stretch; gap: 16px; }
  .btn-get-started { width: 100%; justify-content: center; }
  .skip-link { text-align: center; }
}
</style>
