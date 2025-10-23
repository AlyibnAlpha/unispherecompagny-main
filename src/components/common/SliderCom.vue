<script>
import Slider from "@vueform/slider";
export default {
  components: {
    Slider
  },
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: undefined
    },
    max: {
      type: Number,
      default: undefined
    }
  },
  computed: {
    value: {
      get() {
        return this.$props.modelValue;
      },
      set(newVal) {
        this.$emit("input", newVal);
      }
    }
  }
};
</script>

<template>
  <Slider v-model="value" :min="min" :max="max" class="minible-slider" trackColor="#5b73e8" color="#5b73e8" />
</template>
<style src="@vueform/slider/themes/default.css"></style>

<style lang="scss">
.minible-slider {
  .slider-connect {
    background: #5b73e8 !important;
  }

  .slider-base {
    background-color: #f6f6f6 !important;
  }

  .slider-tooltip {
    background: #5b73e8;
    border: 1px solid #5b73e8;
  }
}
</style>
