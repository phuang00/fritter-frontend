<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreatePresetForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/presets',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'name', label: 'Preset Name', value: ''},
        {id: 'members', label: 'Members', value: []},
        {id: 'setting', label: 'Settings', value: 'none'}
      ],
      title: 'Create a preset',
      refreshPresets: true,
      callback: () => {
        const message = 'Successfully created a preset!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
