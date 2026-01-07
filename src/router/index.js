import { createRouter, createWebHistory } from 'vue-router'
import Signup from '@/components/SignupPage.vue'
import Login from '@/components/LoginPage.vue'
import Cars from '@/components/CarsPage.vue'
import Contacts from '@/components/ContactsPage.vue'
import QRContacts from '@/components/QRContactsPage.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/signup', component: Signup },
  { path: '/login', component: Login },
  { path: '/cars', component: Cars, name: 'cars', meta: { requiresAuth: true } },
  {
    path: '/contacts',
    component: Contacts,
    name: 'contacts',
    meta: { requiresAuth: true },
    props: (route) => ({
      carId: route.query.carId ? Number(route.query.carId) : null,
    }),
  },
  { path: '/qr/:serialNo', component: QRContacts },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('loggedIn')) {
    next('/login')
  } else {
    next()
  }
})

export default router
