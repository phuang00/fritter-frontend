<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    
    <h3>{{ title }}</h3>
    <article class="form-inline"
      v-if="fields.length"
    >
      <div
        v-for="field in fields"
        :key="field.id"
      >
        <div class="row">
          <label :class="`form-label ${['username', 'password'].includes(field.label) ? 'col-2': 'col-auto'}`" :for="field.id">{{ field.label }}:</label>
        <div class="col">
          <textarea class="form-control"
            v-if="field.id === 'content'"
            :name="field.id"
            :value="field.value"
            @input="field.value = $event.target.value"
          />
          <input
            v-else-if="field.id === 'highlighted'"
            :type="'checkbox'"
            :name="field.id"
            :checked="field.value"
            @input="field.value = $event.target.checked"
          >
          <select class="form-control"
            v-else-if="field.id === 'members'"
            :name="field.id"
            v-model="field.value" :multiple="true">
            <template v-for="user in $store.state.users">
              <option v-if="user.username !== $store.state.username && !$store.state.presets.map((preset) => preset.members).flat().includes(user.username) "
              :value="user.username"
            >
              {{user.username}}
              </option>
            </template>
            
          </select>
          <select class="form-control"
            v-else-if="field.id === 'privacy'"
            :name="field.id"
            :value="field.value"
            @input="field.value = $event.target.value">
            <option :selected="field.id === 'public'" value="public">Public</option>
            <option :selected="field.id === 'private'" value="private">Private</option>
          </select>
          <select class="form-control"
            v-else-if="field.id === 'setting'"
            :name="field.id"
            v-model="field.value"
            >
            <option value="highlight">Highlights Only</option>
            <option value="freet">All Freets</option>
            <option value="none">No Notifications</option>
          </select>
          <input class="form-control"
            v-else
            :type="field.id === 'password' ? 'password' : 'text'"
            :name="field.id"
            :value="field.value"
            @input="field.value = $event.target.value"
          >
          </div>
        </div>
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <button class="btn btn-primary"
      type="submit"
    >
      {{ title }}
    </button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>

export default {
  name: 'BlockForm',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      refreshFreets: false, // Whether or not stored freets should be updated after form submission
      refreshLists: false, // Wehterer or not stored lists should be updated after form submission
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null // Function to run after successful form submission
    };
  },
  methods: {
    async submit() {
      /**
        * Submits a form with the specified options from data().
        */
      const options = {
        method: this.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      if (this.hasBody) {
        options.body = JSON.stringify(Object.fromEntries(
          this.fields.map(field => {
            const {id, value} = field;
            if (id === 'members') {field.value = [];}
            else if (id === 'privacy') {field.value = 'public';}
            else if (id === 'setting') {
              // const newVal = new Map([['freet', field.value === 'freet'], ['highlight', field.value === 'highlight']]);
              const newVal = {'freet': field.value === 'freet', 'highlight': field.value === 'highlight'};
              field.value = 'none';
              return [id, newVal];
            }
            else {field.value = '';}
            return [id, value];
          })
        ));
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setUsername', res.user ? res.user.username : null);
          this.$store.commit('refreshUsers');
        }

        if (this.refreshFreets) {
          this.$store.commit('refreshFreets');
        }

        if (this.refreshLists) {
          this.$store.commit('refreshLists');
        }

        if (this.refreshMyLists) {
          this.$store.commit('refreshMyLists');
        }

        if (this.refreshPresets) {
          this.$store.commit('refreshPresets');
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

.row {
  padding-top:5px;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
   font-family: inherit;
   font-size: inherit;
}
</style>
