<!-- Default page that also displays freets -->

<template>
  <main>
      <SideBar />
      <div class="content">
          <section>
            <header>
              <h2>{{$route.params.user === $store.state.username ? 'My Profile': `Profile of @${$route.params.user}`}}</h2>
            </header>
          </section>
          <section>
              <header>
                  <div class="left">
                      <h3 :style="{ 'font-weight': $store.state.highlightsOnly ? 'normal' : 'bold' }"
                          @click.prevent="getHighlights(false)">Freets</h3>
                  </div>
                  <div class="right">
                      <h3 :style="{ 'font-weight': $store.state.highlightsOnly ? 'bold' : 'normal' }"
                          @click.prevent="getHighlights(true)">Highlight</h3>
                  </div>
              </header>
              <section
                v-if="$store.state.freets.length"
              >
                <FreetComponent
                  v-for="freet in $store.state.freets"
                  :key="freet.id"
                  :freet="freet"
                />
              </section>
              <article v-else>
                  <h3 class="notFound">No freets found.</h3>
              </article>
          </section>
      </div>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import SideBar from '@/components/common/SideBar.vue';

export default {
  name: 'ProfilePage',
  components: { FreetComponent, SideBar },
  mounted() {
      this.getHighlights(false);
  },
  data() {
      return {
      };
  },
  methods: {
      async getHighlights(highlights) {
          const url = `/api/freets?author=${this.$route.params.user}&highlighted=${highlights}`;
          try {
              const r = await fetch(url);
              const res = await r.json();
              if (!r.ok) {
                  throw new Error(res.error);
              }

              this.$store.commit('updateHighlightFilter', highlights);
              this.$store.commit('updateFreets', res);
          } catch (e) {
              this.$set(this.alerts, e, 'error');
              setTimeout(() => this.$delete(this.alerts, e), 3000);
          }
      }
  }
};
</script>

<style scoped>
main {
  display: flex;
  flex-direction: row;
  align-items: center;
}

section {
  display: flex;
  flex-direction: column;
}

header,
header>* {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.left,
.right {
  margin: auto;
}

h2 {
  margin-left: auto;
  margin-right: auto;
}
</style>
