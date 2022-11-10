import Vue from 'vue';
import VueRouter from 'vue-router';
import FreetsPage from './components/Freet/FreetsPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import ListPage from './components/List/ListPage.vue';
import ListsPage from './components/List/ListsPage.vue';
import NotifsPage from './components/Notification/NotifsPage.vue';
import PresetsPage from './components/Preset/PresetsPage.vue';
import ProfilePage from './components/Profile/ProfilePage.vue';
import SearchPage from './components/Search/SearchPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: FreetsPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/lists/:owner/:listName', name: 'List', component: ListPage},
  {path: '/lists', name: 'Lists', component: ListsPage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/notifs', name: 'Notifications', component: NotifsPage},
  {path: '/presets', name: 'Presets', component: PresetsPage},
  {path: '/profile/:user', name: 'Profile', component: ProfilePage},
  {path: '/search/:input', name: 'Search', component: SearchPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }
  }

  next();
});

export default router;
