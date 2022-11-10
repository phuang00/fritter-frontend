<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
    <article class="list">
        <header>
            <router-link
                class="username" :to="`profile/${user.username}`"
                :style="{'font-size': '1.17em'}"
                >
                @{{ user.username }}
            </router-link>
        </header>
        <section class="alerts">
            <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
                <p>{{ alert }}</p>
            </article>
        </section>
    </article>
</template>
  
<script>
export default {
    name: 'UserComponent',
    props: {
        // Data from the stored list
        user: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            alerts: {} // Displays success/error messages encountered during freet modification
        };
    },
};
</script>
  
<style scoped>
.list {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
  