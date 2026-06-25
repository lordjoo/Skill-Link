import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// Public marketing pages (ported from the legacy static site)
import Landing from '@/views/Landing.vue'
import Category from '@/views/Category.vue'
import FindWork from '@/views/FindWork.vue'
import Hire from '@/views/Hire.vue'

// Student pages
import Home from '@/views/Home.vue'
import Messages from '@/views/Messages.vue'
// Community is disabled until the backend ships the community endpoints.
// import Community from '@/views/Community.vue'
import Profile from '@/views/Profile.vue'
import Settings from '@/views/Settings.vue'
import Saved from '@/views/Saved.vue'
import Report from '@/views/Report.vue'
import ProjectDetails from '@/views/ProjectDetails.vue'
import ApplyProject from '@/views/ApplyProject.vue'

// Client pages
import ClientHome from '@/views/ClientHome.vue'
import ClientProfile from '@/views/ClientProfile.vue'
import ClientSettings from '@/views/ClientSettings.vue'
import ClientSaved from '@/views/ClientSaved.vue'
import ClientReport from '@/views/ClientReport.vue'
// import ClientCommunity from '@/views/ClientCommunity.vue'
import Payment from '@/views/Payment.vue'
import FreelancerProfile from '@/views/FreelancerProfile.vue'

// Auth pages
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
// Post-register onboarding: welcome screen + role-based profile-completion wizard.
import Onboarding from '@/views/Onboarding.vue'
import StudentOnboarding from '@/views/StudentOnboarding.vue'
import ClientOnboarding from '@/views/ClientOnboarding.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import VerifyCode from '@/views/VerifyCode.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import PasswordSuccess from '@/views/PasswordSuccess.vue'

// `audience` controls who may open a route once logged in:
//   'student' / 'client' -> that account type only
//   'any'                -> any authenticated user
//   'public'             -> reachable without logging in (auth screens)
const routes = [
  // Public marketing pages ('open' = reachable by anyone, logged in or not)
  { path: '/', name: 'Landing', component: Landing, meta: { audience: 'open' } },
  { path: '/category/:slug', name: 'Category', component: Category, props: true, meta: { audience: 'open' } },
  { path: '/find-work', name: 'FindWork', component: FindWork, meta: { audience: 'open' } },
  { path: '/hire', name: 'Hire', component: Hire, meta: { audience: 'open' } },

  // Student
  { path: '/home', name: 'StudentHome', component: Home, meta: { audience: 'student' } },
  { path: '/student-home', redirect: '/home' },
  { path: '/messages', name: 'Messages', component: Messages, meta: { audience: 'any' } },
  // { path: '/community', name: 'Community', component: Community, meta: { audience: 'student' } },
  { path: '/profile', name: 'Profile', component: Profile, meta: { audience: 'student' } },
  { path: '/settings', name: 'Settings', component: Settings, meta: { audience: 'student' } },
  { path: '/saved', name: 'Saved', component: Saved, meta: { audience: 'student' } },
  { path: '/report', name: 'Report', component: Report, meta: { audience: 'student' } },
  { path: '/project/:id', name: 'ProjectDetails', component: ProjectDetails, props: true, meta: { audience: 'student' } },
  { path: '/apply/:id', name: 'ApplyProject', component: ApplyProject, props: true, meta: { audience: 'student' } },
  { path: '/freelancer/:slug', name: 'FreelancerProfile', component: FreelancerProfile, props: true, meta: { audience: 'any' } },

  // Client
  { path: '/client-home', name: 'ClientHome', component: ClientHome, meta: { audience: 'client' } },
  { path: '/client-profile', name: 'ClientProfile', component: ClientProfile, meta: { audience: 'client' } },
  { path: '/client-settings', name: 'ClientSettings', component: ClientSettings, meta: { audience: 'client' } },
  { path: '/client-saved', name: 'ClientSaved', component: ClientSaved, meta: { audience: 'client' } },
  { path: '/client-report', name: 'ClientReport', component: ClientReport, meta: { audience: 'client' } },
  // { path: '/client-community', name: 'ClientCommunity', component: ClientCommunity, meta: { audience: 'client' } },
  { path: '/payment', name: 'Payment', component: Payment, meta: { audience: 'client' } },

  // Auth
  { path: '/login', name: 'Login', component: Login, meta: { audience: 'public' } },
  { path: '/signup', name: 'Signup', component: Signup, meta: { audience: 'public' } },
  // Onboarding (after registering): welcome -> role-based profile completion.
  { path: '/onboarding', name: 'Onboarding', component: Onboarding, meta: { audience: 'any' } },
  { path: '/onboarding/student', name: 'StudentOnboarding', component: StudentOnboarding, meta: { audience: 'student' } },
  { path: '/onboarding/client', name: 'ClientOnboarding', component: ClientOnboarding, meta: { audience: 'client' } },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword, meta: { audience: 'public' } },
  { path: '/verify-code', name: 'VerifyCode', component: VerifyCode, meta: { audience: 'public' } },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword, meta: { audience: 'public' } },
  { path: '/password-success', name: 'PasswordSuccess', component: PasswordSuccess, meta: { audience: 'public' } },

  // Unknown paths fall back to login
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to) => {
  const { isAuthenticated, userType } = useAuth()
  const audience = to.meta.audience

  // Public marketing pages: reachable by everyone, no redirects.
  if (audience === 'open') {
    return true
  }

  // Auth screens: send already-logged-in users to their dashboard.
  if (audience === 'public') {
    if (isAuthenticated.value) {
      return userType.value === 'client' ? { name: 'ClientHome' } : { name: 'StudentHome' }
    }
    return true
  }

  // Everything else needs a session.
  if (!isAuthenticated.value) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  // Keep each account type inside its own area.
  if (audience === 'student' && userType.value === 'client') {
    return { name: 'ClientHome' }
  }
  if (audience === 'client' && userType.value !== 'client') {
    return { name: 'StudentHome' }
  }

  return true
})

export default router
