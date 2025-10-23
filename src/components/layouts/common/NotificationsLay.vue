<template>
  <BDropdown
    variant="black"
    class="dropdown d-inline-block"
    toggle-class="header-item noti-icon"
    right
    menu-class="dropdown-menu-lg dropdown-menu-end p-0"
    no-caret
  >
    <template #button-content>
      <i class="uil-bell"></i>
      <span class="badge bg-danger rounded-pill">3</span>
    </template>

    <div class="p-3">
      <BRow class="align-items-center">
        <BCol>
          <h5 class="m-0 font-size-16">
            {{ $t('navbar.dropdown.notification.text') }}
          </h5>
        </BCol>
        <BCol class="text-end">
          <a href="#!" class="small">{{ $t('navbar.dropdown.notification.subtext') }}</a>
        </BCol>
      </BRow>
    </div>
    <div style="max-height: 230px" data-simplebar>
      <!--<a href="#" class="text-reset notification-item">
        <div class="media d-flex">
          <img
            src="/images2/users/avatar-4.jpg"
            class="me-3 rounded-circle avatar-xs"
            alt="user-pic"
          />
          <div class="media-body">
            <h6 class="mt-0 mb-1">
              {{ $t('navbar.dropdown.notification.salena.title') }}
            </h6>
            <div class="font-size-12 text-muted">
              <p class="mb-1">
                {{ $t('navbar.dropdown.notification.salena.text') }}
              </p>
              <p class="mb-0">
                <i class="mdi mdi-clock-outline"></i>
                {{ $t('navbar.dropdown.notification.salena.time') }}
              </p>
            </div>
          </div>
        </div>
      </a>-->
    </div>
    <div class="p-2 border-top d-grid">
      <a class="btn btn-sm btn-link font-size-14 text-center" href="javascript:void(0)">
        <i class="uil-arrow-circle-right me-1"></i>
        {{ $t('navbar.dropdown.notification.button') }}
      </a>
    </div>
  </BDropdown>
</template>

<script>
import { BDropdown, BRow, BCol } from 'bootstrap-vue-next'
export default {
  components: {
    BDropdown,
    BRow,
    BCol,
  },
}
</script>

<style>
@import '../../../css/assets/scss/app2.scss';
</style>
