<template>
  <ul class="mainmenu">
    <li class="has-droupdown">
      <router-link to="">Données publiques</router-link>
      <ul class="mega-menu" style="margin-left: 210px">
        <li>
          <h5 class="menu-title">Explorez les data</h5>
          <p
            class="submenu"
            style="font-weight: 600; color: black; font-size: 15px; padding-right: 20px"
          >
            Découvrez ce que pensent des millions de citoyens et consommateurs grâce à nos articles,
            nos études dédiées à certains secteurs et dans de l’industrie, nos livres blancs et ce
            dans le monde entier.
          </p>
        </li>
        <li v-if="loading">
          <q-spinner color="success" size="40px" class="q-my-md flex flex-center" />
        </li>
        <li v-else v-for="(chunk, index) in doneeChunks" :key="index">
          <h6 class="menu-title">{{ index === 0 ? 'Thèmes' : ' Thèmes' }}</h6>
          <ul class="submenu">
            <li v-for="item in chunk" :key="item.id">
              <router-link :to="`/enquete/${item.name}`">{{ item.name }}</router-link>
            </li>
          </ul>
        </li>
      </ul>
    </li>

    <li class="has-droupdown">
      <router-link to="">Pour les entreprises</router-link>
      <ul class="mega-menu2">
        <li>
          <h5 class="menu-title">Explorez les data</h5>
          <p
            class="submenu"
            style="font-weight: 600; color: black; font-size: 15px; padding-right: 30px"
          >
            Découvrez ce que pensent des millions de citoyens et consommateurs grâce à nos articles,
            nos études dédiées à certains secteurs et dans de l’industrie, nos livres blancs et ce
            dans le monde entier.
          </p>
        </li>
        <li v-if="loading">
          <q-spinner color="success" size="40px" class="q-my-md flex flex-center" />
        </li>
        <li v-else v-for="(chunk, index) in entrepriseChunks" :key="index">
          <h6 class="menu-title">{{ index === 0 ? 'Thème' : 'Autres thèmes' }}</h6>
          <ul class="submenu">
            <li v-for="item in chunk" :key="item.id">
              <router-link :to="`/enquete/${item.name}`">{{ item.name }}</router-link>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</template>
<script>
import { api } from 'src/boot/axios'
import { computed, onMounted, ref } from 'vue'

export default {
  data() {
    const doneéepublic = ref([])
    const pourlesentreprise = ref([])
    const loading = ref(true)
    const loadings = ref(true)
    const fetchData = async () => {
      try {
        loading.value = true
        loadings.value = true
        const response = await api.get('/front/surveys/categories/BUSINESS')

        const response1 = await api.get('/front/surveys/categories/PUBLIC')

        doneéepublic.value = response1.data

        pourlesentreprise.value = response.data
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        loading.value = false
        loadings.value = false
      }
    }
    onMounted(() => {
      fetchData()
    })
    const chunkArray = (arr, size) => {
      const chunks = []
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size))
      }
      return chunks
    }
    const doneeChunks = computed(() => chunkArray(doneéepublic.value, 5))
    const entrepriseChunks = computed(() => chunkArray(pourlesentreprise.value, 5))
    return { doneéepublic, pourlesentreprise, doneeChunks, entrepriseChunks, loading }
  },
}
</script>
