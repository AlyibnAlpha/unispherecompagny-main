<template>
  <div class="edu-team-area team-area-3 edu-section-gap z-10">
    <div class="container">
      <SectionTitle preTitle="Instructors" title="Course Instructors" alignment="section-center" />

      <div class="row g-5">
        <div
          class="col-lg-4 col-md-6"
          data-aos-delay="50"
          data-aos="fade-up"
          data-aos-duration="800"
          v-for="(instructor, key) in instructors.slice(0, 3)"
          :key="key"
        >
          <InstructorThree :instructor="instructor" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import instructorProfilesMixin from '../../../mixins/instructorProfilesMixin'
import InstructorThree from '../instructor/InstructorThree.vue'

export default {
  mixins: [instructorProfilesMixin],
  components: {
    InstructorThree,
  },
}
</script>
