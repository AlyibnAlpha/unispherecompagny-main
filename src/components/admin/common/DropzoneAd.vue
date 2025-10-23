<template>
  <div
    :class="[{ 'active-dropzone': active }, dropzoneClass]"
    class="dropzone text-center dz-clickable"
    @dragenter.prevent="toggleActive"
    @dragleave.prevent="toggleActive"
    @dragover.prevent
    @drop.prevent="toggleActive"
  >
    <div class="dz-message needsclick">
      <div class="mb-3">
        <i class="display-4 text-muted bx bxs-cloud-upload" v-if="cloudIcon == 'remix'"></i>
        <i class="bi bi-cloud-download fs-1" v-if="cloudIcon == 'bootstrap'"></i>
      </div>
      <h5 class="fs-md mb-0" v-if="cloudIcon == 'bootstrap'">Télécharger votre fichier.</h5>
      <h4 v-if="cloudIcon == 'remix'">Télécharger {{ files }} votre fichier.</h4>
    </div>
    <label :for="dropzoneFile" class="stretched-link"></label>
    <input
      type="file"
      :id="dropzoneFile"
      class="btn btn-primary d-none"
      :class="dropzoneFile"
      :multiple="isMultiple"
      accept=".jpg,.jpeg,.png,.tiff,.webp"
    />
  </div>
</template>

<script>
export default {
  props: {
    files: {
      type: String,
      default: '',
    },
    cloudIcon: {
      type: String,
      default: '',
    },
    dropzoneClass: {
      type: String,
      default: '',
    },
    dropzoneFile: {
      type: String,
      default: 'dropzoneFile',
    },
    isMultiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      active: false,
    }
  },
  methods: {
    toggleActive() {
      this.active = !this.active
    },
  },
}
</script>
