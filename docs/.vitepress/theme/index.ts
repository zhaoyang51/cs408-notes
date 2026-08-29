import DefaultTheme from 'vitepress/theme'
import './custom.css'
import ThemeToggle from './ThemeToggle.vue'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(ThemeToggle),
    })
  }
}
