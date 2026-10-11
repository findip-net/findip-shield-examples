import { createApp } from 'vue';
import App from './App.vue';
import { shield } from './shield';

createApp(App).use(shield).mount('#app');
