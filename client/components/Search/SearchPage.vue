<!-- Default page that also displays freets -->

<template>
    <main>
        <SideBar />
        <div class="content">
            <section>
                <h2>Search for: {{$store.state.search}}</h2>
            </section>
            <section>
                <header>
                    <div class="left">
                        <h3 :style="{ 'font-weight': show === 'lists' ? 'normal' : 'bold' }"
                            @click.prevent="getResults('users')">Users</h3>
                    </div>
                    <div class="right">
                        <h3 :style="{ 'font-weight': show === 'lists' ? 'bold' : 'normal' }"
                            @click.prevent="getResults('lists')">Lists</h3>
                    </div>
                </header>
                <section v-if="results.length">
                    <ListComponent v-if="show === 'lists'" v-for="list in results" :key="list.id" :list="list" />
                    <UserComponent v-if="show === 'users'" v-for="user in results" :key="user.id" :user="user" />
                </section>
                <article v-else>
                    <h3 class="notFound">No {{show === 'lists' ? 'lists' : 'users'}} found.</h3>
                </article>
            </section>
        </div>
    </main>
</template>
  
<script>
import ListComponent from '@/components/List/ListComponent.vue';
import UserComponent from '@/components/Profile/UserComponent.vue';
import SideBar from '@/components/common/SideBar.vue';

export default {
    name: 'SearchPage',
    components: { ListComponent, UserComponent, SideBar },
    mounted() {
        this.getResults('users');
    },
    data() {
        return {
            results: [],
            show: 'users',
        };
    },
    methods: {
        async getResults(type) {
            const url = `/api/${type}?contains=${this.$store.state.search}`;
            try {
                const r = await fetch(url);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }
                this.show = type;
                this.results = res;
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
    },
    watch: {
    '$store.state.search'(newSearch, oldSearch) {
        this.show = 'users';
        this.getResults('users');
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
  