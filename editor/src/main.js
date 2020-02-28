import * as emojicon from 'emojicon';
import 'focus-visible';
import Vue from 'vue';
import App from './App.vue';

emojicon.set('💭');

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
