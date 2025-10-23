<script>
/**
 * Activity component
 */
import { BCol, BCard, BCardBody, BDropdown, BDropdownItem } from 'bootstrap-vue-next'
export default {
  components: {
    BCol,
    BCard,
    BCardBody,
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
          <BDropdown right toggle-class="p-0" variant="white">
            <template v-slot:button-content>
              <span class="text-muted">
                Recent
                <i class="mdi mdi-chevron-down ms-1"></i>
              </span>
            </template>
            <BDropdownItem href="#">Recent</BDropdownItem>
            <BDropdownItem href="#">By Users</BDropdownItem>
          </BDropdown>
        </div>

        <h4 class="card-title mb-4">Recent Activity</h4>

        <ol class="activity-feed mb-0 ps-2" data-simplebar style="max-height: 336px">
          <li class="feed-item">
            <div class="feed-item-list">
              <p class="text-muted mb-1 font-size-13">
                Today
                <small class="d-inline-block ms-1">12:20 pm</small>
              </p>
              <p class="mt-0 mb-0">
                Andrei Coman magna sed porta finibus, risus posted a new article:
                <span class="text-primary"> Forget UX Rowland </span>
              </p>
            </div>
          </li>
          <li class="feed-item">
            <p class="text-muted mb-1 font-size-13">
              22 Jul, 2020
              <small class="d-inline-block ms-1">12:36 pm</small>
            </p>
            <p class="mt-0 mb-0">
              Andrei Coman posted a new article:
              <span class="text-primary">Designer Alex</span>
            </p>
          </li>
          <li class="feed-item">
            <p class="text-muted mb-1 font-size-13">
              18 Jul, 2020
              <small class="d-inline-block ms-1">07:56 am</small>
            </p>
            <p class="mt-0 mb-0">
              Zack Wetass, sed porta finibus, risus Chris Wallace Commented
              <span class="text-primary">Developer Moreno</span>
            </p>
          </li>
          <li class="feed-item">
            <p class="text-muted mb-1 font-size-13">
              10 Jul, 2020
              <small class="d-inline-block ms-1">08:42 pm</small>
            </p>
            <p class="mt-0 mb-0">
              Zack Wetass, Chris combined Commented
              <span class="text-primary">UX Murphy</span>
            </p>
          </li>

          <li class="feed-item">
            <p class="text-muted mb-1 font-size-13">
              23 Jun, 2020
              <small class="d-inline-block ms-1">12:22 am</small>
            </p>
            <p class="mt-0 mb-0">
              Zack Wetass, sed porta finibus, risus Chris Wallace Commented
              <span class="text-primary">Developer Moreno</span>
            </p>
          </li>
          <li class="feed-item pb-1">
            <p class="text-muted mb-1 font-size-13">
              20 Jun, 2020
              <small class="d-inline-block ms-1">09:48 pm</small>
            </p>
            <p class="mt-0 mb-0">
              Zack Wetass, Chris combined Commented
              <span class="text-primary">UX Murphy</span>
            </p>
          </li>
        </ol>
      </BCardBody>
    </BCard>
  </BCol>
</template>
