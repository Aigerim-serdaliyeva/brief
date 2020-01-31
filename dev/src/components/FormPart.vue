<template lang="pug">

mixin both 
    .form-part__wrap
        h2.lh-n {{title}}
        .form-part__items
            slot
        
section.form-part
    +both

</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        }
    }
};
</script>
