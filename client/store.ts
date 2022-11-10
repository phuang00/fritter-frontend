import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    highlightsOnly: false, // Filter shown freets by highlights
    freets: [], // All freets created in the app
    lists: [], // All lists created in the app
    myLists: [],
    users: [], // All users created in the app
    presets: [],
    search: [],
    presetMembers: [],
    username: null, // Username of the logged in user
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateHighlightFilter(state, highlightsOnly) {
      state.highlightsOnly = highlightsOnly;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/freets?author=${state.filter}&highlighted=${state.highlightsOnly}` : `/api/freets?highlighted=${state.highlightsOnly}`;
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    updateLists(state, lists) {
      state.lists = lists;
    },
    async refreshLists(state) {
      const url = 'api/lists';
      const res = await fetch(url).then(async r => r.json());
      state.lists = res;
    },
    async refreshMyLists(state) {
      const url = `api/lists?owner=${state.username}`;
      const res = await fetch(url).then(async r => r.json());
      state.myLists = res;
    },
    async refreshUsers(state) {
      const url = 'api/users';
      const res = await fetch(url).then(async r => r.json());
      state.users = res;
    },
    updatePresets(state, presets) {
      state.presets = presets;
    },
    async refreshPresets(state) {
      const url = `api/presets?owner=${state.username}`;
      const res = await fetch(url).then(async r => r.json());
      state.presets = res;
    },
    updateSearch(state, search) {
      state.search = search;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
