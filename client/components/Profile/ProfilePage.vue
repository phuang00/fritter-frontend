<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
    <main>
      <SideBar />
      <div class="content">
        <section>
          <header>
            <h2>Profile for @{{ $store.state.username }}</h2>
          </header>
        </section>
        <section>
          <header>
          </header>
        </section>
      </div>
    </main>
  </template>
  
  <script>
  import SideBar from '@/components/common/SideBar.vue';
  
  export default {
    name: 'ProfilePage',
    components: { SideBar }
  };
  </script>
  