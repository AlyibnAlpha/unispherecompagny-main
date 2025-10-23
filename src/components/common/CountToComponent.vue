<script>
import CountUp from "vue-countup-v3";

export default {
  components: {
    CountUp
  },
  props: {
    startVal: {
      type: Number,
      default: 0
    },
    endVal: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0
    },
    prefix: {
      type: String,
      default: null
    }
  }
};
</script>

<template>
  <CountUp :startVal="startVal" :endVal="endVal" :duration="duration * 0.001">
    <template v-if="prefix" #prefix>
      {{ prefix }}
    </template>
  </CountUp>
</template>
