<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateListForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/lists',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'listName', label: 'List Name', value: ''},
        {id: 'privacy', label: 'Privacy', value: 'public'},
        {id: 'members', label: 'Members', value: []}
      ],
      title: 'Create a list',
      refreshLists: true,
      callback: () => {
        const message = 'Successfully created a list!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
