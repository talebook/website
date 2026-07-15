import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import SponsorCard from './SponsorCard.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('SponsorCard', SponsorCard)
  },
}
