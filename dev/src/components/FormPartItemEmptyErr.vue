<template lang="pug">
    .form-part__item-empty-err.col-red
        p {{errText}}
</template>

<script>
export default {
    props: {
        errText: {
            type: String,
            required: false,
            default: "Выберите один из пунктов"
        }
    }
};
</script>
