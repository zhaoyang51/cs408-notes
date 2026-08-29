import DefaultTheme from 'vitepress/theme'
import './custom.css'
import ThemeToggle from './ThemeToggle.vue'
import UserFilter from './UserFilter.vue'
import SidebarBorderToggle from './SidebarBorderToggle.vue'
import AuthorTag from './AuthorTag.vue'
import KP from './KP.vue'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => [
        h(UserFilter),
        h(ThemeToggle)
      ],
      'layout-top': () => h(SidebarBorderToggle)
    })
  },
  enhanceApp({ app }) {
    app.component('UserFilter', UserFilter)
    app.component('AuthorTag', AuthorTag)
    app.component('KP', KP)
    app.component('KnowledgePoint', KP)
  }
}
