<template>
  <BDropdown
    variant="white"
    class="d-inline-block d-lg-none ms-2"
    toggle-class="header-item noti-icon"
    right
    menu-class="dropdown-menu-lg p-0"
  >
    <template #button-content>
      <i class="uil-search"></i>
    </template>
    <BForm class="p-3">
      <div class="form-group m-0">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('navbar.search.text')"
            aria-label="Recipient's username"
          />
          <div class="input-group-append">
            <BButton variant="primary" type="submit">
              <i class="mdi mdi-magnify"></i>
            </BButton>
          </div>
        </div>
      </div>
    </BForm>
  </BDropdown>
</template>

<script>
import { BDropdown, BForm, BButton } from 'bootstrap-vue-next'
export default {
  components: {
    BDropdown,
    BForm,
    BButton,
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
