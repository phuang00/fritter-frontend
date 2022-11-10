<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left" @click.prevent="returnHome">
      <img src="../../public/logo.svg">
      <h1 class="title">
        Fritter
      </h1>
    </div>
    <div class="middle">
      <form @submit.prevent="submit" v-if="$store.state.username">
          <div class="input-group">
            <input class="form-control" placeholder="Search for users/lists" v-model="search" />
            <div class="input-group-append">
              <button class="btn btn-secondary" type="submit">Search</button>
            </div>          
          </div>
      </form>
    </div>
    <div class="right">
      <router-link
        v-if="!$store.state.username"
        to="/login"
      >
        Login
      </router-link>
      <a v-else href="" @click.prevent="logout">
        Logout
      </a>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {search: ''};
  },
  methods: {
    submit() {
      this.$store.commit('updateSearch', this.search);
      this.$router.push({name: 'Search'});
      this.search = '';
    },
    returnHome() {
      this.$router.push({name: 'Home'});
    },
    async logout() {
      const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };

      try {
        const r = await fetch('/api/users/session', options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('setUsername', null);
        this.$store.commit('alert', {
          message: 'You are now signed out!', status: 'success'
        });
        this.$router.push({name: 'Home'});
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }

    }
  }
};
</script>

<style scoped>
nav {
    padding: 1vw 2vw;
    background-color:rgb(182, 221, 255);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1;
}

.title {
    font-size: 32px;
    margin: 0 5px;
}

img {
    height: 32px;
}

.left {
	display: flex;
	align-items: center;
}

.right {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 5px;
}

.alerts {
    width: 25%;
}
</style>
