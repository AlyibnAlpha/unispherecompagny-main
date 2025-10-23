<script>
import {
  BCard,
  BCardBody,
  BRow,
  BCol,
  BProgress,
  BDropdown,
  BDropdownItem,
} from 'bootstrap-vue-next'
/**
 * Selling-product component
 */
export default {
  components: {
    BCard,
    BCardBody,
    BRow,
    BCol,
    BProgress,
    BDropdown,
    BDropdownItem,
  },
}
</script>

<style>
@import '../../../../css/assets/scss/app2.scss';
</style>

<template>
  <BCard no-body class="card">
    <BCardBody>
      <div class="float-end">
        <BDropdown right toggle-class="text-reset p-0" variant="white">
          <template v-slot:button-content>
            <span class="font-weight-semibold">Sort By:</span>
            <span class="text-muted">
              Yearly
              <i class="mdi mdi-chevron-down ms-1"></i>
            </span>
          </template>
          <BDropdownItem href="#">Monthly</BDropdownItem>
          <BDropdownItem href="#">Yearly</BDropdownItem>
          <BDropdownItem href="#">Weekly</BDropdownItem>
        </BDropdown>
      </div>

      <h4 class="card-title mb-4">Top Selling Products</h4>

      <BRow class="align-items-center no-gutters mt-3">
        <BCol sm="3">
          <p class="text-truncate mt-1 mb-0">
            <i class="mdi mdi-circle-medium text-primary me-2"></i> Desktops
          </p>
        </BCol>

        <BCol sm="9">
          <BProgress :value="52" variant="primary" class="mt-1" height="6px"></BProgress>
        </BCol>
      </BRow>

      <BRow class="align-items-center no-gutters mt-3">
        <BCol sm="3">
          <p class="text-truncate mt-1 mb-0">
            <i class="mdi mdi-circle-medium text-info me-2"></i> iPhones
          </p>
        </BCol>
        <BCol sm="9">
          <BProgress :value="45" variant="info" class="mt-1" height="6px"></BProgress>
        </BCol>
      </BRow>

      <BRow class="align-items-center no-gutters mt-3">
        <BCol sm="3">
          <p class="text-truncate mt-1 mb-0">
            <i class="mdi mdi-circle-medium text-success me-2"></i> Android
          </p>
        </BCol>
        <BCol sm="9">
          <BProgress :value="48" variant="success" class="mt-1" height="6px"></BProgress>
        </BCol>
      </BRow>

      <BRow class="align-items-center no-gutters mt-3">
        <BCol sm="3">
          <p class="text-truncate mt-1 mb-0">
            <i class="mdi mdi-circle-medium text-warning me-2"></i> Tablets
          </p>
        </BCol>
        <BCol sm="9">
          <BProgress :value="78" variant="warning" class="mt-1" height="6px"></BProgress>
        </BCol>
      </BRow>

      <BRow class="align-items-center no-gutters mt-3">
        <BCol sm="3">
          <p class="text-truncate mt-1 mb-0">
            <i class="mdi mdi-circle-medium text-purple me-2"></i> Cables
          </p>
        </BCol>
        <BCol sm="9">
          <BProgress :value="63" variant="purple" class="mt-1" height="6px"></BProgress>
        </BCol>
      </BRow>
    </BCardBody>
  </BCard>
</template>
