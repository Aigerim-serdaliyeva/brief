<template>
    <div id="app">
        <the-header />
        <main class="main desk" id="main">
            <router-view />
            <the-aside />
            <the-navigation />
        </main>
    </div>
</template>

<script>
import TheHeader from "@/components/TheHeader";
import TheAside from "@/components/TheAside";
import TheNavigation from "@/components/TheNavigation";

export default {
    components: {
        TheHeader,
        TheAside,
        TheNavigation
    }
};
</script>

<style lang="postcss">
@import "assets/postcss/main.pcss";
</style>
