import { createRouter, createWebHistory } from 'vue-router'
import Signup from '@/components/SignUpPage.vue'
import Login from '@/components/LoginPage.vue'
import Cars from '@/components/CarsPage.vue'
import Contacts from '@/components/ContactsPage.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/signup', component: Signup },
  { path: '/login', component: Login },
  { path: '/cars', component: Cars },
  { path: '/contacts', component: Contacts, name: 'contacts' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
