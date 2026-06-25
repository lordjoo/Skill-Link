<template>
  <div class="landing">
    <header>
      <div class="logo" @click="$router.push('/')">S<span>killLink</span></div>

      <button class="nav-toggle" aria-label="Toggle menu" @click="mobileMenuOpen = !mobileMenuOpen">
        <i :class="mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
      </button>

      <div class="nav-collapse" :class="{ open: mobileMenuOpen }">
        <nav>
          <ul>
            <li><a href="#" @click="closeMenu">Home</a></li>
            <li><a href="#explore" @click="closeMenu">Explore</a></li>
            <li><a href="#feature" @click="closeMenu">For Features</a></li>
            <li><a href="#how" @click="closeMenu">How it works</a></li>
          </ul>
        </nav>

        <div class="auth">
          <button class="login" @click="$router.push('/login')">Login</button>
          <button class="signup" @click="$router.push('/signup')">Sign up</button>
        </div>
      </div>
    </header>

    <section class="hero">
      <div>
        <h1>The Best Freelancing <br> Platform for <span>Students</span></h1>
        <p>SkillLink connects students from different fields with clients looking for freelance services.</p>

        <div class="hero-btns">
          <button class="hire" @click="$router.push('/hire')">Hire freelancers</button>
          <button class="work" @click="$router.push('/find-work')">Find work</button>
        </div>
      </div>

      <div class="hero-img">
        <div class="dots top">
          <div v-for="n in 16" :key="'dt' + n"></div>
        </div>

        <div class="circle">
          <img src="/assets/student girl.png" alt="Student" />
        </div>

        <div class="dots bottom">
          <div v-for="n in 16" :key="'db' + n"></div>
        </div>
      </div>
    </section>

    <div class="announce">
      Need a task done? Find talented students offering affordable, high-quality services.
      <a href="#" @click.prevent="joinAsClient">Join as a client</a>
    </div>

    <div class="floating-bot">
      <img src="/assets/Chat bot.png" alt="Chatbot" />
    </div>

    <section id="explore" class="section-padding">
      <h2 class="section-title">Explore the marketplaces</h2>

      <div class="market-grid">
        <div class="market-card" @click="goCategory('programming')">
          <i class="fas fa-laptop-code"></i><span>Programming &amp; Technology</span>
        </div>
        <div class="market-card" @click="goCategory('design')">
          <i class="fas fa-palette"></i><span>Design &amp; Creative</span>
        </div>
        <div class="market-card" @click="goCategory('writing')">
          <i class="fas fa-pen-nib"></i><span>Writing &amp; Translation</span>
        </div>
        <div class="market-card" @click="goCategory('marketing')">
          <i class="fas fa-solid fa-chart-simple"></i><span>Marketing &amp; Sales</span>
        </div>
        <div class="market-card" @click="goCategory('support')">
          <i class="fas fa-headset"></i><span>Support &amp; Administration</span>
        </div>
        <div class="market-card" @click="goCategory('audio')">
          <i class="fas fa-film"></i><span>Audio &amp; Video</span>
        </div>
        <div class="market-card" @click="goCategory('business')">
          <i class="fas fa-building-columns"></i><span>Business &amp; Finance</span>
        </div>
        <div class="market-card" @click="goCategory('education')">
          <i class="fas fa-person-chalkboard"></i><span>Education &amp; Training</span>
        </div>
        <div class="market-card" @click="goCategory('legal')">
          <i class="fas fa-scale-unbalanced"></i><span>Legal</span>
        </div>
        <div class="market-card" @click="goCategory('engineering')">
          <i class="fas fa-gear"></i><span>Engineering &amp; Arch</span>
        </div>
      </div>

      <div class="dots-decorator explore-dots">
        <div v-for="n in 64" :key="'ed' + n"></div>
      </div>
    </section>

    <section id="how" class="section-padding">
      <div class="dots-decorator how-dots"></div>

      <div class="how-header">
        <h2 class="section-title">How it works</h2>

        <div class="tabs">
          <div class="tab" :class="{ active: activeTab === 'students' }" @click="activeTab = 'students'">
            For Students
          </div>
          <div class="tab" :class="{ active: activeTab === 'clients' }" @click="activeTab = 'clients'">
            For Clients
          </div>
        </div>
      </div>

      <div class="steps">
        <div class="step" v-for="(step, i) in displayedSteps" :key="i">
          <i :class="step.icon"></i>
          <p>{{ step.text }}</p>
        </div>
      </div>
    </section>

    <section id="feature" class="section-padding">
      <h2 class="section-title">SkillLink key features</h2>

      <div class="features-grid">
        <div
          class="feat-card feat-tall"
          style="display: flex; flex-direction: column; gap: 20px; width: 650px; height: 300px;"
        >
          <img src="/assets/Knowledge.png" alt="Built for Students" />
          <h3>Built for Students</h3>

          <div class="overlay">
            <p>
              <b>Built for Students</b><br />
              A freelancing platform designed especially for students — simple, supportive and easy to start.
            </p>
          </div>
        </div>

        <div class="feat-card">
          <img src="/assets/Agreement.png" alt="Real Projects" />
          <h3>Real Projects, Real Experience</h3>

          <div class="overlay">
            <p>
              <b>Real Projects</b><br />
              Gain hands-on experience by working on real projects and building your portfolio while studying.
            </p>
          </div>
        </div>

        <div class="feat-card">
          <img src="/assets/Work time.png" alt="Learn Remotely" />
          <h3>Save Time, Learn Remotely</h3>

          <div class="overlay">
            <p>
              <b>Learn Remotely</b><br />
              Gain hands-on experience by working on real projects and building your portfolio while studying.
            </p>
          </div>
        </div>

        <div
          class="feat-card feat-tall"
          style="display: flex; flex-direction: column; gap: 20px; width: 650px; height: 300px; margin-top: -109px;"
        >
          <img src="/assets/Cyber attack.png" alt="Secure Payment" />
          <h3>Secure Payment System</h3>

          <div class="overlay">
            <p>
              <b>Secure Payments</b><br />
              Safe and reliable payments — funds are protected and released only when the project is successfully
              approved.
            </p>
          </div>
        </div>

        <div class="feat-card">
          <img src="/assets/Chat bot pana.png" alt="Chatbot" />
          <h3>Chatbot — Always Here to Help</h3>

          <div class="overlay">
            <p>
              <b>Chatbot</b><br />
              Get instant guidance and support anytime — whether you need help finding the right projects, setting up
              your profile, or navigating the platform.
            </p>
          </div>
        </div>
      </div>

      <div class="title-dots">
        <div v-for="n in 64" :key="'td' + n"></div>
      </div>
    </section>

    <div class="cta">
      <div>
        <h2>Start your first project today</h2>
        <p>Join thousands of students building real experience</p>
      </div>

      <button @click="$router.push('/signup')">
        Get started <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <footer>
      <div class="footer-brand">
        <div class="logo" @click="$router.push('/')">S<span>killLink</span></div>
        <p class="footer-desc">
          A student-focused freelance platform <br />
          for real projects and experience.
        </p>

        <div class="social-icons">
          <a href="#"><i class="fab fa-facebook-f"></i></a>
          <a href="#"><i class="fab fa-linkedin-in"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-github"></i></a>
          <a href="#"><i class="fas fa-envelope"></i></a>
        </div>
      </div>

      <div>
        <h4>Quick links</h4>
        <ul>
          <li>Home</li>
          <li>Explore Categories</li>
          <li>How It Works</li>
          <li>Key Features</li>
          <li>Chatbot</li>
        </ul>
      </div>

      <div>
        <h4>Categories</h4>
        <ul>
          <li>Programming &amp; Technology</li>
          <li>Design &amp; Creative</li>
          <li>Writing &amp; Translation</li>
          <li>Marketing &amp; Sales</li>
          <li>Support &amp; Administration</li>
        </ul>
      </div>

      <div>
        <ul>
          <br />
          <li>Audio &amp; video</li>
          <li>Business &amp; Finance</li>
          <li>Education &amp; Training</li>
          <li>Legal</li>
          <li>Engineering &amp; Architecture</li>
        </ul>
      </div>

      <h5>© 2025 Student Freelance Platform — Made for Students</h5>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Landing',

  data() {
    return {
      activeTab: 'students',
      mobileMenuOpen: false
    }
  },

  computed: {
    displayedSteps() {
      if (this.activeTab === 'students') {
        return [
          { icon: 'fas fa-user-circle', text: 'Create your profile' },
          { icon: 'fas fa-bullseye', text: 'Get matched with projects' },
          { icon: 'fas fa-handshake', text: 'Secure Delivery & Payment' }
        ]
      }

      return [
        { icon: 'fas fa-file-signature', text: 'Describe Your Needs' },
        { icon: 'fas fa-users', text: 'Compare Best Talent' },
        { icon: 'fas fa-lock', text: 'Hire Securely' }
      ]
    }
  },

  methods: {
    closeMenu() {
      this.mobileMenuOpen = false
    },

    goCategory(slug) {
      this.$router.push('/category/' + slug)
    },

    joinAsClient() {
      this.$router.push('/signup')
    }
  }
}
</script>

<style scoped>
.landing {
  --primary: #12a39c;
  --primary-light: #e6f7f6;
  --dark: #1d1d1f;
  --gray: #6b7280;
  --border: #eeeeee;
  background: #fdfdfd;
  color: var(--dark);
  overflow-x: hidden;
  font-family: 'Poppins', sans-serif;
}

/* Note: don't set font-family here. A universal font-family would override the
   Font Awesome icon font on every <i>, making the icons render as empty boxes.
   The `.landing` root sets Poppins, which text inherits; icons keep their own
   font via the .fas/.fab classes. */
.landing * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.landing a {
  text-decoration: none;
  color: inherit;
}

section {
  scroll-margin-top: 300px;
}

/* `.landing header` (not just `header`) so the padding beats the `.landing *`
   reset, which would otherwise zero it and push the logo against the edge. */
.landing header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 6%;
  border-bottom: 1px solid #a09a9aae;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 999;
}

.logo {
  top: 30px;
  left: 50px;
  font-size: 26px;
  font-weight: 600;
  color: #0c9892;
  font-family: 'Dancing Script', cursive;
  cursor: pointer;
}

.logo span {
  color: #000;
}

nav ul {
  display: flex;
  gap: 30px;
  list-style: none;
}

nav ul li a {
  font-size: 15px;
  font-weight: 500;
  transition: 0.3s;
}

nav ul li a:hover {
  color: var(--primary);
}

.auth button {
  padding: 8px 22px;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
}

.login {
  border: 1px solid #000000cb;
  background: #fff;
  margin-right: 10px;
}

.login:hover {
  border: 1px solid #12a39c;
  background: #fff;
  color: #12a39c;
}

.signup {
  background: var(--primary);
  color: #fff;
  border: 1px solid #000000cb;
}

.signup:hover {
  border: 1px solid #12a39c;
  background: #fff;
  color: #12a39c;
}

/* On desktop `display: contents` makes the wrapper transparent to layout, so the
   nav and auth become direct flex children of the header — giving the original
   logo · nav · auth spacing. On mobile the media query turns it into a real
   dropdown panel. */
.nav-collapse {
  display: contents;
}

/* Hamburger — hidden on desktop, shown on mobile via the media query below. */
.nav-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: var(--dark);
  cursor: pointer;
  line-height: 1;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 90px 8% 50px;
  gap: 40px;
}

.hero h1 {
  font-size: 52px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
}

.hero h1 span {
  color: var(--primary);
}

.hero p {
  color: var(--gray);
  margin-bottom: 35px;
  max-width: 480px;
}

.hero-btns button {
  padding: 14px 40px;
  border-radius: 35px;
  font-weight: 600;
  cursor: pointer;
  font-size: medium;
}

.hire {
  background: var(--primary);
  color: #fff;
  border: none;
  margin-right: 15px;
}

.hire:hover {
  border: 1px solid #12a39c;
  background: #fff;
  color: #12a39c;
}

.work {
  padding: 14px 40px;
  border: 1px solid #ccc;
  border-radius: 35px;
  background: white;
  cursor: pointer;
  font-size: medium;
}

.work:hover {
  border: 1px solid #12a39c;
  background: #fff;
  color: #12a39c;
}

.hero-img {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: flex-end;
}

.circle {
  width: 480px;
  height: 480px;
  background: var(--primary);
  border-radius: 50%;
  position: relative;
  overflow: visible;
}

.circle img {
  width: 115%;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scale(1.2);
  z-index: 3;
}

.dots {
  position: absolute;
  display: grid;
  grid-template-columns: repeat(4, 16px);
  gap: 15px;
  z-index: 1;
}

.dots.top {
  top: 20px;
  right: -25px;
}

.dots.bottom {
  bottom: 15px;
  left: 155px;
}

.dots div {
  width: 14px;
  height: 14px;
  background: var(--primary);
  border-radius: 50%;
  opacity: 0.8;
}

.floating-bot {
  position: fixed;
  bottom: 30px;
  right: 10px;
  width: 80px;
  height: 80px;
  z-index: 1000;
  cursor: pointer;
  border: 2px solid #12a39c;
  border-radius: 50%;
  padding: 15px;
  animation: floatSide 3s ease-in-out infinite;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.floating-bot img {
  width: 100%;
  height: auto;
  display: block;
}

@keyframes floatSide {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.announce {
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  margin: 12px 8%;
  margin-top: 5px;
  border: 2px solid #a09a9ac0;
  padding: 15px;
  border-radius: 14px;
  text-align: center;
  font-size: 22px;
}

.announce a {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.section-padding {
  padding: 100px 8%;
}

.section-title {
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 20px;
  position: relative;
}

.section-title::before {
  content: '';
  width: 100px;
  height: 5px;
  background: var(--primary);
  position: absolute;
  top: -20px;
  left: 0;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.market-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 30px;
}

.market-card {
  background: #ffffff;
  border: 2px solid #a09a9aae;
  padding: 50px 50px;
  border-radius: 12px;
  text-align: left;
  transition: 0.4s;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  z-index: 1;
}

.market-card:hover {
  border-color: var(--primary);
  box-shadow: 0 30px 30px rgba(0, 0, 0, 0.05);
}

.market-card i {
  font-size: 30px;
  color: #333;
  margin-bottom: 19px;
  display: block;
}

.market-card span {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.market-card:hover i,
.market-card:hover span {
  color: var(--primary);
}

.dots-decorator {
  display: grid;
  grid-template-columns: repeat(8, 16px);
  gap: 40px;
  margin-top: -100px;
  margin-bottom: 25px;
  margin-right: -90px;
  justify-content: flex-end;
  z-index: -1;
}

.dots-decorator div {
  width: 15px;
  height: 15px;
  border-radius: 90%;
  background-color: #12a39c33;
}

.how-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  margin-top: -240px;
}

.tabs {
  border: 1px solid #111;
  display: flex;
  background: #fff;
  padding: 0px;
  border-radius: 30px;
}

.tab {
  padding: 10px 30px;
  border-radius: 25px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
}

.tab.active {
  background: var(--primary);
  color: #fff;
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.step {
  background: var(--primary);
  color: #fff;
  padding: 50px 50px;
  border-radius: 15px;
  text-align: center;
  font-size: 20px;
}

.step i {
  font-size: 40px;
  margin-bottom: 15px;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.feat-card {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  cursor: pointer;
  background: #fff;
  border: 1px solid #a09a9aae;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: right;
  padding: 20px;
  transition: 0.4s;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  min-height: 180px;
}

.feat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feat-card:not(.feat-tall) {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  padding: 20px 30px;
}

.feat-card:not(.feat-tall) img {
  margin-bottom: 0;
  margin-left: 20px;
  width: 150px;
}

.feat-tall {
  grid-row: span 2;
}

.feat-card img {
  width: 220px;
  margin-bottom: -20px;
  margin-right: 40px;
}

.feat-card h3 {
  color: var(--primary);
  font-size: 28px;
  margin-left: 35px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  opacity: 0;
  transition: 0.3s;
  border-radius: 20px;
}

b {
  font-size: x-large;
}

.feat-card:hover .overlay {
  opacity: 1;
}

.title-dots {
  display: grid;
  grid-template-columns: repeat(8, 16px);
  gap: 40px;
  margin-top: -170px;
  margin-bottom: 25px;
  margin-right: -80px;
  justify-content: flex-end;
  z-index: -1;
}

.title-dots div {
  width: 15px;
  height: 15px;
  border-radius: 90%;
  background-color: #12a39c33;
}

.cta {
  position: relative;
  margin: -160px 8% 80px;
  background: linear-gradient(90deg, #128c86 0%, #63c2b8 100%);
  padding: 100px 100px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  z-index: 10;
}

.cta h2 {
  font-size: 35px;
}

.cta button {
  padding: 12px 20px;
  border-radius: 60px;
  border: 2px solid #111;
  font-weight: 400;
  font-size: 26px;
  color: #111;
  background-color: #fff;
  cursor: pointer;
}

.cta button:hover {
  border: 1px solid #12a39c;
  background: #fff;
  color: #12a39c;
}

/* `.landing footer` so the padding beats the `.landing *` reset (same fix as the
   header) — otherwise the footer content sits flush against the screen edges. */
.landing footer {
  padding: 60px 6% 30px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 30px;
  background: #fcfcfc;
  border-top: 1px solid #eee;
}

.footer-desc {
  margin-top: 15px;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.social-icons {
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin-top: 20px;
  justify-content: flex-start;
}

.social-icons a {
  width: 36px;
  height: 36px;
  background-color: #000;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s ease;
}

.social-icons a:hover {
  background-color: var(--primary);
  transform: translateY(-3px);
}

footer .logo {
  font-size: 28px;
}

footer h4 {
  margin-bottom: 15px;
  font-size: 16px;
}

footer ul {
  list-style: none;
}

footer ul li {
  margin-bottom: 8px;
  color: var(--gray);
  font-size: 13px;
  cursor: pointer;
}

h5 {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #888;
  margin-top: 10px;
  padding-top: 25px;
  width: 100%;
  grid-column: 1 / -1;
}

@media (max-width: 900px) {
  /* Collapse the header into a hamburger dropdown.
     `.landing header` (not just `header`) so this beats the `.landing *`
     padding reset, which would otherwise zero the header padding and shove the
     logo against the screen edge. */
  .landing header {
    padding: 16px 22px;
  }

  .nav-toggle {
    display: block;
  }

  .nav-collapse {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
    background: #fff;
    padding: 20px;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  }

  .nav-collapse.open {
    display: flex;
  }

  .nav-collapse nav ul {
    flex-direction: column;
    gap: 4px;
  }

  .nav-collapse nav ul li a {
    display: block;
    padding: 10px 4px;
    font-size: 16px;
  }

  .auth {
    display: flex;
    gap: 10px;
  }

  .auth button {
    flex: 1;
    padding: 12px;
  }

  .login {
    margin-right: 0;
  }

  .hero {
    flex-direction: column;
    text-align: center;
  }

  .market-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .steps,
  .features-grid,
  footer {
    grid-template-columns: 1fr;
  }

  .cta {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
}

@media (max-width: 600px) {
  .market-grid {
    grid-template-columns: 1fr;
  }
}
</style>
