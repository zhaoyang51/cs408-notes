import DefaultTheme from 'vitepress/theme'
import './custom.css'
import ThemeToggle from './ThemeToggle.vue'
import UserFilter from './UserFilter.vue'
import SidebarBorderToggle from './SidebarBorderToggle.vue'
import AuthorTag from './AuthorTag.vue'
import KP from './KP.vue'
import ProcessTable from './ProcessTable.vue'
import InterruptSimulator from './InterruptSimulator.vue'
import MediaCard from './MediaCard.vue'
import ProtocolStackMap from './ProtocolStackMap.vue'
import NetworkMetrics from './NetworkMetrics.vue'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h('div', { class: 'nav-controls-wrapper' }, [
        h(UserFilter),
        h(ThemeToggle)
      ]),
      'nav-screen-content-after': () => h('div', { class: 'nav-screen-controls-wrapper' }, [
        h(UserFilter),
        h(ThemeToggle)
      ]),
      'layout-top': () => h(SidebarBorderToggle)
    })
  },
  enhanceApp({ app }) {
    app.component('UserFilter', UserFilter)
    app.component('AuthorTag', AuthorTag)
    app.component('KP', KP)
    app.component('KnowledgePoint', KP)
    app.component('ProcessTable', ProcessTable)
    app.component('InterruptSimulator', InterruptSimulator)
    app.component('MediaCard', MediaCard)
    app.component('ProtocolStackMap', ProtocolStackMap)
    app.component('NetworkMetrics', NetworkMetrics)
  }
}
