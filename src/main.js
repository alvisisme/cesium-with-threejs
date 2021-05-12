import Vue from 'vue'
import App from './App.vue'

import '@/thirdparty/Cesium/Widgets/widgets.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
