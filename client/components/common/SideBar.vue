<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <div class="sidebar">
    <div class="page">
      <router-link to="/"
        :style="{ 'font-weight': $route.name === 'Home' ? 'bold': 'normal' }">
        Home
      </router-link>
    </div>
    <div class="page">
        <router-link to="/lists"
        :style="{ 'font-weight': $route.name === 'Lists' || $route.name === 'List' ? 'bold': 'normal' }">
        Lists
      </router-link>
    </div>
    <div class="page">
        <router-link to="/notifs"
        :style="{ 'font-weight': $route.name === 'Notifications' ? 'bold': 'normal' }">
        Notifications
      </router-link>
    </div>    
    <div class="page">
        <router-link to="/presets"
        :style="{ 'font-weight': $route.name === 'Presets' ? 'bold': 'normal' }">
        Notification Presets
      </router-link>
    </div>
    <div class="page">
        <router-link to="/account"
        :style="{ 'font-weight': $route.name === 'Account' ? 'bold': 'normal' }">
        Account Settings
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
    height:100%;
    width:280px;
    position: fixed;
    z-index: 0;
    top: 0;
    left: 0;
    background-color: aliceblue;
    overflow-x: hidden;
    padding-top: 80px;
    text-align: center;
}

.sidebar a {
  text-decoration: none;
  color: black;
}

.page {
  margin: 20px;
}
</style>