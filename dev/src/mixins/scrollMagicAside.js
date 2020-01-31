import { mapMutations } from "vuex";

const scrollMagicAside = {
    mounted() {
        this.$_showAside();
    },
    methods: {
        $_showAside() {
            const scene = new this.$scrollmagic.Scene({
                triggerElement: ".scroll-magic-aside",
                triggerHook: "onLeave"
            }).on("progress", () => {
                this.toggleAsideState();
            });
            // Add scene to ScrollMagic controller by emiting an 'addScene' event on vm.$ksvuescr (which is our global event bus)
            this.$ksvuescr.$emit("addScene", "showAside", scene);
        },
        ...mapMutations(["toggleAsideState"])
    },
    destroyed() {
        // Destroy ScrollMagic when our component is removed from DOM
        this.$ksvuescr.$emit("destroy");
    }
};

export default scrollMagicAside;
