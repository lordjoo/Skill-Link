<template>
  <!-- Smooth fade between pages (transition classes live in styles/index.css). -->
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <Chatbot :isOpen="isChatbotOpen" @close="closeChatbot" @minimize="minimizeChatbot" />
  <!-- Renders app-wide toast messages (see composables/useToast.js). -->
  <ToastHost />
</template>

<script>
import Chatbot from './components/Chatbot.vue'
import ToastHost from './components/ToastHost.vue'

export default {
  name: 'App',
  components: {
    Chatbot,
    ToastHost
  },
  data() {
    return {
      isChatbotOpen: false
    }
  },
  methods: {
    openChatbot() {
      this.isChatbotOpen = true;
    },
    closeChatbot() {
      this.isChatbotOpen = false;
    },
    minimizeChatbot() {
      this.isChatbotOpen = false;
    }
  },
  created() {
    window.addEventListener('open-chatbot', this.openChatbot);
  },
  // Vue 3 lifecycle hook (was `beforeDestroy` in Vue 2).
  beforeUnmount() {
    window.removeEventListener('open-chatbot', this.openChatbot);
  }
}
</script>
