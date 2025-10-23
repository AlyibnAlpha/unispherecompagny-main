<template>
  <div>
    <h6>{{ title }}</h6>
    <BFormGroup :key="key">
      <BFormRadioGroup v-model="modelValue" :options="options" />
    </BFormGroup>
  </div>
</template>

<script>
import { BFormGroup, BFormRadioGroup } from 'bootstrap-vue-next'
export default {
  components: {
    BFormGroup,
    BFormRadioGroup,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    keys: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Boolean],
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    modelValue: {
      get() {
        return this.$props.value
      },
      set(newVal) {
        this.$emit('change', newVal)
      },
    },
  },
}
</script>
<style scoped>
@import '../../css/assets/scss/app2.scss';
</style>
