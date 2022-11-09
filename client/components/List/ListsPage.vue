<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <SideBar />
    <div class="content">
      <section v-if="$store.state.username">
        <header>
          <h2>Lists for @{{ $store.state.username }}</h2>
        </header>
        <CreateListForm />
      </section>
      <section>
        <header>
        </header>
        <section
          v-if="$store.state.lists.length"
        >
          <ListComponent
            v-for="list in $store.state.lists"
            :key="list.id"
            :list="list"
          />
        </section>
        <article
          v-else
        >
          <h3>No lists found.</h3>
        </article>
      </section>
    </div>
  </main>
</template>

<script>
import SideBar from '@/components/common/SideBar.vue';
import CreateListForm from '@/components/List/CreateListForm.vue';
import ListComponent from '@/components/List/ListComponent.vue';

export default {
  name: 'ListsPage',
  components: { SideBar, CreateListForm, ListComponent },
  mounted() {
    this.$store.commit("refreshUsers");
  }
};
</script>
