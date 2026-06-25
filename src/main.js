import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Font Awesome icons
import '@fortawesome/fontawesome-free/css/all.min.css'

// Lato (brand font)
import '@fontsource/lato/400.css'
import '@fontsource/lato/700.css'

// Tailwind + shared component styles
import './styles/index.css'

createApp(App).use(router).mount('#app')
