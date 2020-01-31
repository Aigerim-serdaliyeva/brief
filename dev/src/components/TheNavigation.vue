<template lang="pug">

section.the-navigation
    .the-navigation__wrap(:class="{ 'opacity-0': asideState }")
        font-awesome-icon(
            :icon=['fas','chevron-up'] 
            @click="scrollTo('#header')"
        )
        font-awesome-icon(
            :icon=['fas','chevron-down'] 
            @click="scrollTo('#form-submit')"
        )

</template>

<script>
import { TweenLite } from "gsap";
import { mapState } from "vuex";
// eslint-disable-next-line
const ScrollToPlugin = require('gsap/ScrollToPlugin')

export default {
    computed: {
        ...mapState(["asideState"])
    },
    methods: {
        scrollTo(direction) {
            TweenLite.to(window, 0.5, {
                scrollTo: direction
            });
        }
    }
};
</script>
