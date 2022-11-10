<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <SideBar />
    <div class="content">
      <section v-if="$store.state.username">
        <header>
          <h2>Notification Presets for @{{ $store.state.username }}</h2>
        </header>
        <CreatePresetForm />
      </section>
      <section>
        <header>
        </header>
        <section
          v-if="$store.state.presets.length"
        >
          <PresetComponent
            v-for="preset in $store.state.presets"
            :key="preset.id"
            :preset="preset"
          />
        </section>
        <article
          v-else
        >
          <h3 class="notFound">No presets found.</h3>
        </article>
      </section>
    </div>
  </main>
</template>

<script>
import SideBar from '@/components/common/SideBar.vue';
import CreatePresetForm from '@/components/Preset/CreatePresetForm.vue';
import PresetComponent from '@/components/Preset/PresetComponent.vue';

export default {
  name: 'PresetsPage',
  components: { SideBar, CreatePresetForm, PresetComponent },
  mounted() {
    this.$store.commit("refreshPresets");
  }
};
</script>
