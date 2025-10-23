<template>
  <div
    class="edu-course course-style-1 hover-button-bg-white"
    :class="extraClass"
    style="background: linear-gradient(135deg, #f0f4ff, #e0f7fa)"
  >
    <div class="inner">
      <div class="thumbnail">
        <router-link :to="`/enquete-details/${course.id}`">
          <img src="/images/course/course-type-01-02/sondage.webp" alt="couse" />
        </router-link>
        <div class="time-top">
          <span class="duration"><i class="icon-61"></i>{{ course.startDate }} semaine</span>
        </div>
      </div>

      <div class="content">
        <span
          class="badge"
          :class="{
            'bg-success': course.status === 'En cours',
            'bg-danger': course.status === 'En cours',
            'bg-danger': course.status === 'Terminé',
          }"
          >{{ course.status }}</span
        >
        <h6 class="title" style="font-size: large">
          <router-link :to="`/enquete-details/${course.id}`"
            ><Strong>{{ course.title }}</Strong></router-link
          >
        </h6>
        <div class="course-rating">
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
        </div>
        <ul class="course-meta">
          <li><i class="icon-24"></i>{{ course.question_groups }}/Questions</li>
          <li><i class="icon-25"></i>{{ course.survey_participants }}/Réponses</li>
        </ul>
      </div>
    </div>
    <div class="course-hover-content-wrapper"></div>
    <button class="btn-share" @click="shareCourse(course)">
      <i class="icon-share-alt"></i>
    </button>
    <router-link :to="`/enquete-details/${course.id}`">
      <div class="course-hover-content">
        <div class="content">
          <span class="course-level">{{ course.status }}</span>
          <h6 class="title" style="font-size: large">
            <Strong>{{ course.title }}</Strong>
          </h6>
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
          <p>{{ course.description }}</p>
          <ul class="course-meta">
            <li><i class="icon-24"></i>{{ course.question_groups }}/Questions</li>
            <li><i class="icon-25"></i>{{ course.survey_participants }}/Réponses</li>
          </ul>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ['extraClass', 'course'],
  methods: {
    shareCourse(course) {
      const url = `${window.location.origin}/enquete-details/${course.id}`
      const text = `Découvrez ce sondage : ${course.title}`

      if (navigator.share) {
        navigator
          .share({
            title: course.title,
            text,
            url,
          })
          .catch((err) => console.log('Partage annulé', err))
      } else {
        navigator.clipboard.writeText(url)
        alert('Lien copié dans le presse-papiers ✅')
      }
    },
  },
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
.btn-share {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.85);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.btn-share:hover {
  background: #a2fc25;
  color: #fff;
}
.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  text-transform: capitalize;
}

/* Nouveau → vert clair */
.status-badge.nouveau {
  background-color: #d4f7dc; /* vert pastel */
  color: #1b5e20; /* vert foncé pour contraste */
}

/* En cours → jaune clair */
.status-badge.encours {
  background-color: #fff3cd; /* jaune pastel */
  color: #856404; /* jaune foncé/brun */
}

/* Clôturé → rouge clair */
.status-badge.clôturés {
  background-color: #ec2434; /* rouge pastel */
  color: #721c24; /* rouge foncé */
}
.thumbnail img {
  height: 190px; /* tu peux ajuster à 150px, 200px, etc. */
  width: 100%;
  object-fit: cover; /* garde le cadrage propre sans déformation */
  border-radius: 8px; /* facultatif : coins arrondis */
}
</style>
