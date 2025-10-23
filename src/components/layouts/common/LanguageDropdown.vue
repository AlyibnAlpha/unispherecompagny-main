<template>
  <BDropdown variant="white" right toggle-class="header-item" no-caret>
    <template #button-content>
      <img class :src="flag" alt="Header Language" height="16" />
    </template>
    <BDropdownItem
      class="notify-item"
      v-for="(entry, i) in languages"
      :key="`Lang${i}`"
      :value="entry"
      @click="$emit('onChange', entry)"
      :link-class="{ active: entry.language === current_language }"
    >
      <img :src="`${entry.flag}`" alt="user-image" class="me-1" height="12" />
      <span class="align-middle">{{ entry.title }}</span>
    </BDropdownItem>
  </BDropdown>
</template>

<script>
import { BDropdown, BDropdownItem } from 'bootstrap-vue-next'
export default {
  components: {
    BDropdown,
    BDropdownItem,
  },
  props: {
    flag: {
      type: [String, null],
      required: true,
    },
    languages: {
      type: Array,
      default: () => [],
    },
    current_language: {
      type: String,
      required: true,
    },
  },
}
</script>

<style>
@import '../../../css/assets/scss/app2.scss';
</style>
