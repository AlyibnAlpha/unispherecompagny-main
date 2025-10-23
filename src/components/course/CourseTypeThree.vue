<template>
  <div class="edu-course course-style-5" :class="extraClass">
    <div class="inner">
      <div class="thumbnail">
        <router-link :to="`/enquete-details/${course.id}`">
          <img :src="'/images/course/course-type-01-02/' + course.image" :alt="course.alt" />
        </router-link>
      </div>
      <div class="content">
        <span class="course-level">{{ course.category }}</span>
        <h5 class="title">
          <router-link :to="`/enquete-details/${course.id}`">{{ course.title }}</router-link>
        </h5>
        <div class="course-rating">
          <div class="rating">
            <!-- Boucle sur 5 étoiles -->
            <span v-for="i in 5" :key="i">
              <!-- Étoile pleine -->
              <i v-if="i <= Math.floor(course.rating)" class="icon-23"></i>

              <!-- Demi-étoile -->
              <i v-else-if="i - course.rating <= 0.5" class="icon-23 half-star"></i>

              <!-- Étoile vide -->
              <i v-else class="icon-23 empty-star"></i>
            </span>
          </div>
          <span class="rating-count">({{ course.rating.toFixed(1) }}/notes)</span>
        </div>
        <p>{{ course.excerpt3 }}</p>
        <ul class="course-meta">
          <li>
            <i class="icon-24"></i>{{ course.lessons }}
            {{ course.lessons > 1 ? 'Questions' : 'Question' }}
          </li>
          <li>
            <i class="icon-25"></i>{{ course.students }}
            {{ course.students ? 'Réponses' : 'Réponse' }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['extraClass', 'course'],
}
</script>
<style>
.empty-star {
  opacity: 0.3;
}

/* demi-étoile → effet CSS (moitié remplie) */
.half-star {
  position: relative;
}
.half-star::before {
  content: '\e917'; /* le code unicode de ton icon-23 si c'est une icône perso */
  position: absolute;
  left: 0;
  width: 50%;
  overflow: hidden;
  color: gold; /* couleur étoile remplie */
}
</style>
