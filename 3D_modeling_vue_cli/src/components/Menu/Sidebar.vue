<template>
    <div class="sidebar">
        <div class="sidebar-backdrop" @click="closeSidebarPanel" v-if="isPanelOpen"></div>
        <transition name="slide">
            <div v-if="isPanelOpen" @click="closeSidebarPanel"
                 class="sidebar-panel">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>
<script>
    import Constant from '../../store/Constant'
    export default {
        methods: {
            closeSidebarPanel(){
                this.$store.commit(Constant.TOGGLENAV)
            },
        },
        computed: {
            isPanelOpen:function () {
                return this.$store.state.isNavOpen
            }
        }
    }
</script>
<style>
@import '../../assets/css/style.css';
</style>
