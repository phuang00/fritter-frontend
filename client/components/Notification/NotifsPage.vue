<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
    <main>
      <SideBar />
      <div class="content">
        <section>
          <header>
            <h2>Notifications from the last 3 days</h2>
          </header>
        </section>
        <section v-if="freets.length">
          <FreetComponent
            v-for="freet in freets"
            :key="freet.id"
            :freet="freet"
          />
        </section>
        <article v-else>
          <h3 class="notFound">No notifications found.</h3>
        </article>
      </div>
    </main>
  </template>
  
  <script>
  import SideBar from '@/components/common/SideBar.vue';
  import FreetComponent from '@/components/Freet/FreetComponent.vue';
  
  export default {
    name: 'NotifsPage',
    components: { SideBar, FreetComponent },
    mounted() {
      this.getNotifs();
    },
    data() {
      return {
        freets: []
      }
    },
    methods: {
      async getNotifs() {
        const url = '/api/freets/notifs';
            try {
                const r = await fetch(url);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }
                this.freets = res;
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
      }
    }

  };
  </script>
  