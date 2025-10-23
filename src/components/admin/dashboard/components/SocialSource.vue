<script>
import { BCard, BCardBody, BCol, BRow, BDropdown, BDropdownItem } from 'bootstrap-vue-next'
/**
 * Social-source component
 */
export default {
  components: {
    BCard,
    BCardBody,
    BCol,
    BRow,
    BDropdown,
    BDropdownItem,
  },
}
</script>

<style>
@import '../../../../css/assets/scss/app2.scss';
</style>

<template>
  <BCol cols="xl-4">
    <BCard no-body>
      <BCardBody>
        <div class="float-end">
          <BDropdown right variant="white" toggle-class="p-0">
            <template v-slot:button-content>
              <span class="text-muted">
                Monthly
                <i class="mdi mdi-chevron-down ms-1"></i>
              </span>
            </template>
            <BDropdownItem href="#">Yearly</BDropdownItem>
            <BDropdownItem href="#">Monthly</BDropdownItem>
            <BDropdownItem href="#">Weekly</BDropdownItem>
          </BDropdown>
        </div>

        <h4 class="card-title">Social Source</h4>

        <div class="text-center">
          <div class="avatar-sm mx-auto mb-4">
            <span class="avatar-title rounded-circle bg-primary-subtle font-size-24">
              <i class="mdi mdi-facebook text-primary"></i>
            </span>
          </div>
          <p class="font-16 text-muted mb-2"></p>
          <h5>
            <a href="#" class="text-dark">
              Facebook -
              <span class="text-muted font-16">125 sales</span>
            </a>
          </h5>
          <p class="text-muted">
            Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis
            faucibus tincidunt.
          </p>
          <a href="#" class="text-reset font-16">
            Learn more
            <i class="mdi mdi-chevron-right"></i>
          </a>
        </div>
        <BRow class="mt-4">
          <BCol cols="4">
            <div class="social-source text-center mt-3">
              <div class="avatar-xs mx-auto mb-3">
                <span class="avatar-title rounded-circle bg-primary font-size-16">
                  <i class="mdi mdi-facebook text-white"></i>
                </span>
              </div>
              <h5 class="font-size-15">Facebook</h5>
              <p class="text-muted mb-0">125 sales</p>
            </div>
          </BCol>
          <BCol cols="4">
            <div class="social-source text-center mt-3">
              <div class="avatar-xs mx-auto mb-3">
                <span class="avatar-title rounded-circle bg-info font-size-16">
                  <i class="mdi mdi-twitter text-white"></i>
                </span>
              </div>
              <h5 class="font-size-15">Twitter</h5>
              <p class="text-muted mb-0">112 sales</p>
            </div>
          </BCol>
          <BCol cols="4">
            <div class="social-source text-center mt-3">
              <div class="avatar-xs mx-auto mb-3">
                <span class="avatar-title rounded-circle bg-pink font-size-16">
                  <i class="mdi mdi-instagram text-white"></i>
                </span>
              </div>
              <h5 class="font-size-15">Instagram</h5>
              <p class="text-muted mb-0">104 sales</p>
            </div>
          </BCol>
        </BRow>

        <div class="mt-3 text-center">
          <a href="#" class="text-primary font-size-14 fw-medium">
            View All Sources
            <i class="mdi mdi-chevron-right"></i>
          </a>
        </div>
      </BCardBody>
    </BCard>
  </BCol>
</template>
