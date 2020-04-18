<template>
  <input v-bind="$attrs" v-on="{ ...$listeners, input: () => {} }" v-model="valueComp" />
</template>

<script>
export default {
  props: ['value'],
  computed: {
    valueComp: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
}
</script>
