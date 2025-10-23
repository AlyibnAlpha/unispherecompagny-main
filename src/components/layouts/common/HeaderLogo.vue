<template>
  <div
    class="navbar-brand-box"
    style="background: linear-gradient(135deg, #f0f4ff, #e0f7fa); transition: background 0.5s ease"
  >
    <router-link to="/" class="logo logo-dark">
      <span class="logo-sm">
        <img src="/favicons.ico" alt="logo-sm" height="30" />
      </span>
      <span class="logo-lg">
        <img src="/favicons.ico" alt="logo-dark" height="80" />
      </span>
    </router-link>

    <router-link to="/" class="logo logo-light">
      <span class="logo-sm">
        <img src="/favicons.ico" alt="logo-sm" height="30" />
      </span>
      <span class="logo-lg">
        <img src="/favicons.ico" alt="logo-light" height="80" />
      </span>
    </router-link>
  </div>
</template>

<style>
@import '../../../css/assets/scss/app2.scss';
</style>
