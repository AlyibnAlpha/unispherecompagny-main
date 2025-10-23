<template>
  <div class="edu-categorie-area categorie-area-1 edu-section-gap">
    <div class="container">
      <SectionTitle
        alignment="section-center"
        preTitleClass="pre-textsecondary"
        title='Rechercher <span class="color-primary">la Réalitée</span>'
        subTitle="Nos solutions aident les marques, les médias et les agences du monde entier à explorer la réalité."
      />

      <div class="row g-5">
        <div
          class="col-lg-3 col-sm-6"
          data-aos-delay="100"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <div
            class="categorie-grid categorie-style-1 color-primary-style edublink-svg-animate"
            style="height: 430px"
          >
            <div class="icon">
              <CatIconOne />
            </div>
            <div class="content">
              <h4 class="title"><strong>Des données précises</strong></h4>
              <p>
                Dispose de données fiables et précises,ancrées dans la réalité de vos
                consomateurs,pour prendre des décisions impactantes et vous démarquer.
              </p>
            </div>
          </div>
        </div>

        <div
          class="col-lg-3 col-sm-6"
          data-aos-delay="200"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <div
            class="categorie-grid categorie-style-1 color-secondary-style edublink-svg-animate"
            style="height: 430px"
          >
            <div class="icon">
              <CatIconTwo />
            </div>
            <div class="content">
              <h4 class="title"><strong>Des membres engagés</strong></h4>
              <p>
                Accéder à des millions de consomateurs, couvrant toutes les localitées
                démographiques.
              </p>
            </div>
          </div>
        </div>
        <div
          class="col-lg-3 col-sm-6"
          data-aos-delay="300"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <div
            class="categorie-grid categorie-style-1 color-extra08-style edublink-svg-animate"
            style="height: 430px"
          >
            <div class="icon">
              <CatIconThree />
            </div>
            <div class="content">
              <h4 class="title"><strong>Des technologies innovantes</strong></h4>
              <p>
                La technologies et l'IA enrichissent des données réelles. Explorez la réalité de
                façon innovante avec nos outils et tableaux de bord puissants.
              </p>
            </div>
          </div>
        </div>
        <div
          class="col-lg-3 col-sm-6"
          data-aos-delay="400"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <div
            class="categorie-grid categorie-style-1 color-extra05-style edublink-svg-animate"
            style="height: 430px"
          >
            <div class="icon">
              <CatIconFour />
            </div>
            <div class="content">
              <h4 class="title"><strong>Des experts à vos côtés</strong></h4>

              <p>
                Notre équipe vous accompagne à chaque étape,pour vous aider à accéder, comprendre et
                exploiter les données au services de votre croissance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SectionTitle from '../common/SectionTitle.vue'
import CatIconOne from '../svg/CatIconOne.vue'
import CatIconTwo from '../svg/CatIconTwo.vue'
import CatIconThree from '../svg/CatIconThree.vue'
import CatIconFour from '../svg/CatIconFour.vue'

export default {
  components: {
    SectionTitle,
    CatIconOne,
    CatIconTwo,
    CatIconThree,
    CatIconFour,
  },
}
</script>
<style>
@import '../../css/app.scss';
</style>
