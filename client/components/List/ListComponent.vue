<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
    <article class="list">
        <header>
            <input v-if="editing" 
                :value="draftName" @input="draftName = $event.target.value" />
            <router-link v-else
                class="name" :to="`lists/${list.owner}/${list.listName}`">
                {{ list.listName }}
            </router-link>
            <p>
                {{list.owner}}
            </p>
            <div v-if="$store.state.username === list.owner" class="actions">
                <button v-if="editing" @click="submitEdit">
                    ✅ Save changes
                </button>
                <button v-if="editing" @click="stopEditing">
                    🚫 Discard changes
                </button>
                <button v-if="!editing" @click="startEditing">
                    ✏️ Edit
                </button>
                <button @click="deleteList">
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
                v-model="draftPrivacy">
                <option>public</option>
                <option>private</option>
            </select>
        </div>

        <p v-else class="privacy">
            {{ list.privacy }}
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
    name: 'ListComponent',
    props: {
        // Data from the stored list
        list: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            editing: false, // Whether or not this freet is in edit mode
            draftName: this.list.listName, // Potentially-new content for this freet
            draftPrivacy: this.list.privacy,
            draftMembers: this.list.members,
            alerts: {} // Displays success/error messages encountered during freet modification
        };
    },
    methods: {
        startEditing() {
            /**
             * Enables edit mode on this freet.
             */
            this.editing = true; // Keeps track of if a freet is being edited
            this.draftName = this.list.listName; // The content of our current "draft" while being edited
            this.draftPrivacy= this.list.privacy;
            this.draftMembers= this.list.members;
        },
        stopEditing() {
            /**
             * Disables edit mode on this freet.
             */
            this.editing = false;
            this.draftName = this.list.listName; 
            this.draftPrivacy= this.list.privacy;
            this.draftMembers= this.list.members;
        },
        deleteList() {
            /**
             * Deletes this list.
             */
            const params = {
                method: 'DELETE',
                callback: () => {
                    this.$store.commit('alert', {
                        message: 'Successfully deleted list!', status: 'success'
                    });
                }
            };
            this.request(params);
        },
        submitEdit() {
            /**
             * Updates freet to have the submitted draft content.
             */
            if (this.list.listName === this.draftName && this.list.privacy === this.draftPrivacy && this.list.members === this.draftMembers) {
                const error = 'Error: Edited list content should be different than current list content.';
                this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
                setTimeout(() => this.$delete(this.alerts, error), 3000);
                return;
            }

            const params = {
                method: 'PUT',
                message: 'Successfully edited list!',
                body: JSON.stringify({ listName: this.draftName, privacy: this.draftPrivacy, members: this.draftMembers }),
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
                const r = await fetch(`/api/lists/${this.list._id}`, options);
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }

                this.editing = false;
                this.$store.commit('refreshLists');

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
.list {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
  