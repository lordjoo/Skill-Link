<template>
  <div class="category-page">
    <header>
      <div class="logo" @click="goHome">S<span>killLink</span></div>
      <div class="header-actions">
        <button class="btn-ghost" @click="goLogin">Login</button>
        <button class="btn-main" @click="goHome">Back Home</button>
      </div>
    </header>

    <section class="page-header">
      <h1>{{ category.title }}</h1>
      <p>{{ category.subtitle }}</p>
    </section>

    <section class="container">
      <div class="description">
        <div class="description-text">
          <h2>{{ category.heading }}</h2>
          <p v-for="(para, i) in category.intro" :key="'intro-' + i">{{ para }}</p>
          <p><b>{{ category.servicesLabel }}</b></p>
          <div class="services-tags">
            <span class="tag" v-for="(service, i) in category.services" :key="'svc-' + i">
              {{ service }}
            </span>
          </div>
          <p class="outro">{{ category.outro }}</p>
          <div class="cta-row">
            <button class="btn-main" @click="goFindWork">Find Work</button>
            <button class="btn-ghost" @click="goSignup">Get Started</button>
          </div>
          <a href="#" class="back-link" @click.prevent="goHome">&larr; Back to categories</a>
        </div>
        <div class="description-img">
          <img :src="category.image" :alt="category.title + ' illustration'" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Category',
  data() {
    return {
      categories: {
        audio: {
          title: 'Audio & Video',
          subtitle: 'Captivating visuals and immersive sounds tailored for your brand.',
          heading: 'Bringing stories to life',
          intro: [
            'In a world driven by multimedia, standing out requires high-quality audio and video production. Our student creators specialize in everything from cinematic video editing to professional sound engineering.'
          ],
          servicesLabel: 'Popular Multimedia Services:',
          services: [
            'Video Editing',
            'Motion Graphics',
            'Voice Over',
            'Podcast Production',
            'Sound Design',
            'Subtitling & Captions',
            'YouTube Content Creation'
          ],
          outro: 'By hiring students, you get modern editing styles and fresh creative energy, perfect for social media, advertisements, or personal projects.',
          image: '/assets/Audio Video.png'
        },
        business: {
          title: 'Business & Finance',
          subtitle: 'Optimize your growth with expert financial planning and business analysis.',
          heading: 'Professional insights for your success',
          intro: [
            'Scale your business with confidence. Our student experts in business and finance bring academic excellence and modern analytical tools to help you manage your accounts, analyze data, and create winning business plans.'
          ],
          servicesLabel: 'Finance & Business Services:',
          services: [
            'Business Planning',
            'Financial Analysis',
            'Bookkeeping',
            'Market Research',
            'Data Analytics',
            'Investment Advice'
          ],
          outro: 'By working with finance students, you get access to fresh perspectives on market trends and meticulous attention to detail for all your economic needs.',
          image: '/assets/Business Finance.png'
        },
        design: {
          title: 'Design & Creative',
          subtitle: 'Bring your brand to life with stunning visuals created by student artists.',
          heading: 'Visual storytelling at its best',
          intro: [
            'Our design marketplace is a hub for talented student creators who excel in turning concepts into beautiful visual identities. Whether you need a unique logo, social media graphics, or a complete UI/UX design for your next app, our students deliver professional results.'
          ],
          servicesLabel: 'Popular Creative Services:',
          services: [
            'Logo Design',
            'UI/UX Design',
            'Illustrations',
            'Brand Identity',
            'Video Editing',
            'Social Media Kits'
          ],
          outro: 'Choosing students means you get fresh trends, high enthusiasm, and a dedicated focus on making your project stand out from the crowd.',
          image: '/assets/Design Creative.png'
        },
        education: {
          title: 'Education & Training',
          subtitle: 'Empower your learning journey with peer-to-peer tutoring and expert training.',
          heading: 'Knowledge sharing at its best',
          intro: [
            'Education is about more than just textbooks. Our platform connects you with top-performing students who can provide personalized tutoring, create study materials, or lead specialized training sessions in various subjects.'
          ],
          servicesLabel: 'Education & Training Services:',
          services: [
            'Academic Tutoring',
            'Language Lessons',
            'Skill Workshops',
            'Course Design',
            'Exam Preparation',
            'E-learning Content'
          ],
          outro: 'By learning from fellow students, you get a relatable experience, practical study tips, and an affordable way to master new skills and subjects.',
          image: '/assets/Education Training.png'
        },
        engineering: {
          title: 'Engineering & Architecture',
          subtitle: 'From technical drafting to innovative structural designs.',
          heading: 'Building the future, one plan at a time',
          intro: [
            'Our engineering and architecture marketplace connects you with talented students skilled in modern design software and technical calculations. Whether you need a 3D floor plan, CAD drafting, or technical consulting, our student experts are here to help.'
          ],
          servicesLabel: 'Engineering & Arch Services:',
          services: [
            'AutoCAD Drafting',
            '3D Modeling & Rendering',
            'Interior Design',
            'Structural Analysis',
            'BIM Services',
            'Technical Report Writing'
          ],
          outro: 'Hiring students allows you to leverage fresh knowledge of the latest industry standards and software at a fraction of the cost of traditional firms.',
          image: '/assets/Engineering Architecture.png'
        },
        legal: {
          title: 'Legal Services',
          subtitle: 'Reliable legal research and documentation support from top law students.',
          heading: 'Navigate legalities with ease',
          intro: [
            'Our platform connects you with dedicated law students who can assist with the foundational aspects of legal work. From in-depth legal research to drafting basic agreements, get the support you need at an accessible rate.'
          ],
          servicesLabel: 'Legal Support Services:',
          services: [
            'Legal Research',
            'Contract Drafting',
            'Document Review',
            'Terms & Conditions',
            'Policy Writing',
            'Regulatory Analysis'
          ],
          outro: 'Hiring law students provides you with fresh academic insights and meticulous attention to detail, helping you stay organized and prepared for any legal requirements.',
          image: '/assets/Legal.png'
        },
        marketing: {
          title: 'Marketing & Sales',
          subtitle: 'Grow your business with data-driven strategies and creative outreach.',
          heading: 'Reach the right audience',
          intro: [
            "Our marketing experts are students who live and breathe digital trends. They understand social algorithms, consumer behavior, and how to build a brand voice that resonates with today's audience."
          ],
          servicesLabel: 'Core Marketing Services:',
          services: [
            'Social Media Management',
            'Search Engine Optimization (SEO)',
            'Email Marketing',
            'Sales Strategy',
            'Market Research',
            'Influencer Outreach'
          ],
          outro: 'By working with student marketers, you gain access to innovative ideas and cost-effective campaigns that leverage the latest digital tools.',
          image: '/assets/Marketing Sales.png'
        },
        programming: {
          title: 'Programming & Technology',
          subtitle: 'Innovative solutions developed by top-tier student developers.',
          heading: 'Turn your ideas into reality',
          intro: [
            'Our programming marketplace connects you with talented students specializing in various technologies. From building responsive websites to developing mobile applications, our students provide high-quality code.'
          ],
          servicesLabel: 'Most Requested Tech Services:',
          services: [
            'Web Development',
            'Mobile Apps (iOS/Android)',
            'Python Automation',
            'Game Development',
            'Database Management',
            'AI & Machine Learning'
          ],
          outro: 'Choosing student developers means you get creators who are up-to-date with the latest frameworks and highly motivated to build an impressive portfolio.',
          image: '/assets/Programming Technology.png'
        },
        support: {
          title: 'Support & Administration',
          subtitle: 'Stay organized and keep your customers happy with dedicated virtual assistance.',
          heading: 'Expert help for your daily tasks',
          intro: [
            'Managing a business or a project can be overwhelming. Our student assistants are highly organized, detail-oriented, and ready to handle your administrative needs so you can focus on the big picture.'
          ],
          servicesLabel: 'Admin & Support Services:',
          services: [
            'Virtual Assistant',
            'Customer Support',
            'Data Entry',
            'Project Management',
            'Calendar Scheduling',
            'File Organization'
          ],
          outro: 'By hiring students for support roles, you get reliable help from tech-savvy individuals who are quick to learn your workflows and software.',
          image: '/assets/Support Administration.png'
        },
        writing: {
          title: 'Writing & Translation',
          subtitle: 'Words that connect, convince, and convert—crafted by expert students.',
          heading: 'Power in every word',
          intro: [
            'Whether you need a compelling blog post, accurate academic translation, or professional copywriting for your website, our student writers are here to help. We bridge the gap between creative storytelling and technical precision.'
          ],
          servicesLabel: 'Popular Writing Services:',
          services: [
            'Content Writing',
            'Technical Translation',
            'Proofreading & Editing',
            'Creative Writing',
            'SEO Articles',
            'Academic Research'
          ],
          outro: 'Our community includes students from various linguistic and academic backgrounds, ensuring that your content is not only well-written but also contextually accurate.',
          image: '/assets/Writing Translation.png'
        }
      }
    }
  },
  computed: {
    category() {
      return this.categories[this.$route.params.slug] || this.categories.design
    }
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    goFindWork() {
      this.$router.push('/find-work')
    },
    goLogin() {
      this.$router.push('/login')
    },
    goSignup() {
      this.$router.push('/signup')
    }
  }
}
</script>

<style scoped>
.category-page {
  --primary: #12a39c;
  --accent: #f39c12;
  --dark: #1d1d1f;
  --gray: #6b7280;
  --border: #eeeeee;
  font-family: 'Poppins', sans-serif;
  background: #fefefe;
  color: var(--dark);
}

/* HEADER */
.category-page header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 8%;
  border-bottom: 1px solid var(--border);
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 999;
}

.logo {
  font-size: 24px;
  font-weight: 600;
  color: var(--primary);
  font-family: 'Dancing Script', cursive;
  cursor: pointer;
}

.logo span {
  color: #111;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* HERO SECTION */
.page-header {
  background: linear-gradient(135deg, #12a39c 0%, #0e7e78 100%);
  color: white;
  padding: 80px 8%;
  text-align: center;
}

.page-header h1 {
  font-size: 42px;
  margin-bottom: 15px;
}

/* CONTENT SECTION */
.container {
  padding: 60px 8%;
}

.description {
  display: flex;
  gap: 50px;
  align-items: center;
}

.description-text {
  flex: 1;
}

.description-text h2 {
  color: var(--primary);
  margin-bottom: 20px;
}

.description-text p {
  color: var(--gray);
  line-height: 1.8;
  margin-bottom: 20px;
}

.description-text .outro {
  margin-top: 20px;
}

.description-img img {
  width: 100%;
  max-width: 450px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* BUTTONS */
.btn-main {
  padding: 8px 20px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.btn-main:hover {
  background: var(--dark);
}

.btn-ghost {
  padding: 8px 20px;
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.btn-ghost:hover {
  background: var(--primary);
  color: #fff;
}

/* SERVICES TAGS */
.services-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.tag {
  background: #f0f0f0;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  color: var(--gray);
  border: 1px solid var(--border);
}

.cta-row {
  display: flex;
  gap: 12px;
  margin: 10px 0 20px;
  flex-wrap: wrap;
}

.back-link {
  display: inline-block;
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
}

.back-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .description {
    flex-direction: column-reverse;
    text-align: center;
  }

  .services-tags {
    justify-content: center;
  }

  .cta-row {
    justify-content: center;
  }
}
</style>
