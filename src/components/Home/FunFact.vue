<template>
  <div class="counterup-area-5 edu-section-gap">
    <div class="container">
      <div class="row g-5">
        <div class="col-lg-3 col-sm-6" v-for="(counter, i) in funFacts" :key="i">
          <div class="edu-counterup counterup-style-5" :class="counter.class">
            <h2 class="counter-item count-number">
              <span>{{ counter.number }}</span>
              <span>{{ counter.suffix }}</span>
            </h2>
            <h6 class="title">{{ counter.title }}</h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      funFacts: [
        {
          number: 29.3,
          decimal: 1,
          class: 'primary-color',
          title: 'ENQUETE DISPONIBLE',
          suffix: 'K',
        },
        {
          number: 32.4,
          decimal: 1,
          class: 'secondary-color',
          title: 'ENQUETE COMPLETER',
          suffix: 'K',
        },
        {
          number: 100,
          decimal: null,
          class: 'extra02-color',
          title: 'SATISFACTION',
          suffix: '%',
        },
        {
          number: 354,
          decimal: null,
          class: 'extra05-color',
          title: 'PLUS DE AVIS',
          suffix: 'K+',
        },
      ],
    }
  },
}
</script>
