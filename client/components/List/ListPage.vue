<!-- Default page that also displays freets -->

<template>
    <main>
        <SideBar />
        <div class="content">
            <section>
                <header>
                    <div class="left">
                        <h2 :style="{ 'font-weight': $store.state.highlightsOnly ? 'normal' : 'bold' }"
                            @click.prevent="getHighlights(false)">Freets</h2>
                    </div>
                    <div class="right">
                        <h2 :style="{ 'font-weight': $store.state.highlightsOnly ? 'bold' : 'normal' }"
                            @click.prevent="getHighlights(true)">Highlight</h2>
                    </div>
                </header>
                <section v-if="freets">
                    <FreetComponent v-for="freet in freets" :key="freet.id" :freet="freet" />
                </section>
                <article v-else>
                    <h3>No freets found.</h3>
                </article>
            </section>
        </div>
    </main>
</template>
  
<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
import SideBar from '@/components/common/SideBar.vue';

export default {
    name: 'ListPage',
    components: { FreetComponent, GetFreetsForm, CreateFreetForm, SideBar },
    mounted() {
        this.getList(this.$route.params.owner, this.$route.params.listName);
        this.getHighlights(false);
    },
    data() {
        return {
            list: {},
            freets: [],
        };
    },
    methods: {
        async getList(owner, listName) {
            const url = `/api/lists?owner=${owner}&listName=${listName}`;
            const res = await fetch(url).then(async r => r.json());
            this.list = res;
            this.freets = this.$store.state.freets.filter(freet => this.list.members.includes(freet.author));
        },
        async getHighlights(highlights) {
            const url = `/api/freets?highlighted=${highlights}`;
            try {
                const r = await fetch(url);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }

                this.$store.commit('updateHighlightFilter', highlights);
                this.$store.commit('updateFreets', res);
                this.freets = this.$store.state.freets.filter(freet => this.list.members.includes(freet.author));
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
    width: 50%;
}

h2 {
    margin-left: auto;
    margin-right: auto;
}
</style>
  