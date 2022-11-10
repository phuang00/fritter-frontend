<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
    <article class="preset">
        <header>
            <input v-if="editing" 
                :value="draftName" @input="draftName = $event.target.value" />
            <h3 v-else>
                {{preset.name}}
            </h3>
            <div v-if="$store.state.username === preset.owner" class="actions">
                <button v-if="editing" @click="submitEdit">
                    ✅ Save changes
                </button>
                <button v-if="editing" @click="stopEditing">
                    🚫 Discard changes
                </button>
                <button v-if="!editing" @click="startEditing">
                    ✏️ Edit
                </button>
                <button @click="deletePreset">
                    🗑️ Delete
                </button>
            </div>
        </header>
        <div v-if="editing">
            <select 
                v-model="draftMembers" multiple>
                <template v-for="user in $store.state.users">
                    <option v-if="user.username !== $store.state.username"
                        
                        :value="user.username"
                        >
                        {{user.username}}
                    </option>
                </template>
                
            </select>
            <select 
                v-model="draftSettings">
                <option value="highlight">Highlights Only</option>
                <option value="freet">All Freets</option>
                <option value="none">No Notifications</option>
            </select>
        </div>

        <p v-else class="setting">
            Members: {{preset.members.join(', ')}}
            <br/>
            {{ preset.setting === 'highlight' ? "HighlightsOnly" : preset.setting === 'freet' ? 'All Freets' : 'No Notifications' }}
        </p>
        <section class="alerts">
            <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
                <p>{{ alert }}</p>
            </article>
        </section>
    </article>
</template>
  
<script>
export default {
    name: 'PresetComponent',
    props: {
        // Data from the stored preset
        preset: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            editing: false, // Whether or not this freet is in edit mode
            draftName: this.preset.name, // Potentially-new content for this freet
            draftSettings: this.preset.setting.freets ? 'freet' : (this.preset.setting.highlight ? 'highlight': 'none'),
            draftMembers: this.preset.members,
            alerts: {} // Displays success/error messages encountered during freet modification
        };
    },
    methods: {
        startEditing() {
            /**
             * Enables edit mode on this freet.
             */
            this.editing = true; // Keeps track of if a freet is being edited
            this.draftName = this.preset.name; // The content of our current "draft" while being edited
            this.draftSettings= this.preset.setting.freets ? 'freet' : (this.preset.setting.highlight ? 'highlight': 'none');
            this.draftMembers= this.preset.members;
        },
        stopEditing() {
            /**
             * Disables edit mode on this freet.
             */
            this.editing = false;
            this.draftName = this.preset.name; 
            this.draftSettings= this.preset.setting.freets ? 'freet' : (this.preset.setting.highlight ? 'highlight': 'none');
            this.draftMembers= this.preset.members;
        },
        deletePreset() {
            /**
             * Deletes this preset.
             */
            const params = {
                method: 'DELETE',
                callback: () => {
                    this.$store.commit('alert', {
                        message: 'Successfully deleted preset!', status: 'success'
                    });
                }
            };
            this.request(params);
        },
        submitEdit() {
            /**
             * Updates freet to have the submitted draft content.
             */
            if (this.preset.name === this.draftName && this.preset.setting === this.draftSettings && this.preset.members === this.draftMembers) {
                const error = 'Error: Edited preset content should be different than current preset content.';
                this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
                setTimeout(() => this.$delete(this.alerts, error), 3000);
                return;
            }

            const params = {
                method: 'PUT',
                message: 'Successfully edited preset!',
                body: JSON.stringify({ name: this.draftName, setting: {'freet': this.draftSettings === 'freet', 'highlight': this.draftSettings === 'highlight'}, members: this.draftMembers }),
                callback: () => {
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            this.request(params);
        },
        async request(params) {
            /**
             * Submits a request to the freet's endpoint
             * @param params - Options for the request
             * @param params.body - Body for the request, if it exists
             * @param params.callback - Function to run if the the request succeeds
             */
            const options = {
                method: params.method, headers: { 'Content-Type': 'application/json' }
            };
            if (params.body) {
                options.body = params.body;
            }

            try {
                const r = await fetch(`/api/presets/${this.preset._id}`, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }

                this.editing = false;
                this.$store.commit('refreshPresets');

                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
};
</script>
  
<style scoped>
.preset {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
  