<template>
  <ul class="edublink-mobile-menu mainmenu">
    <!-- Loader -->
    <li v-if="loading" class="text-center py-2">
      <span>⏳ Chargement...</span>
    </li>

    <li v-else v-for="(link, i) in menus" :key="i">
      <router-link :to="link.url">{{ link.title }}</router-link>

      <!-- bouton toggle -->
      <span class="submenu-toggle" v-if="link.submenu?.length">
        <i class="ri-arrow-down-s-line"></i>
      </span>

      <!-- sous-menu (toujours présent, caché par CSS, ouvert par JS) -->
      <ul class="submenu-wrapper" v-if="link.submenu?.length">
        <li v-for="(sub, j) in link.submenu" :key="j" class="title">
          <router-link :to="sub.url">{{ sub.title }}</router-link>

          <span class="submenu-toggle" v-if="sub.submenu?.length">
            <i class="ri-arrow-down-s-line"></i>
          </span>

          <ul class="submenu-wrapper" v-if="sub.submenu?.length">
            <li v-for="(sub2, k) in sub.submenu" :key="k">
              <router-link :to="sub2.url">{{ sub2.title }}</router-link>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
  <div class="d-flex gap-3 justify-content-center my-4">
    <router-link to="/login" class="btn-connexion">Connexion</router-link>
    <router-link to="/register" class="btn-inscription">Inscription</router-link>
  </div>
</template>

<script>
import { nextTick, onMounted, ref } from 'vue'
import mobileMenuResponsive from '../../../common/mobileMenuResponsive'
import { api } from 'src/boot/axios'

export default {
  setup() {
    const menus = ref([])
    const loading = ref(true)

    const fetchData = async () => {
      try {
        const response = await api.get('/front/surveys/categories/BUSINESS')

        const response1 = await api.get('/front/surveys/categories/PUBLIC')

        menus.value = [
          {
            url: '',
            title: 'Nos Solutions',
            submenu: [
              {
                url: '/',
                title: 'Infrastructures et Urbanisme',
              },
              {
                url: '/',
                title: 'Services publics et collectivités',
              },
            ],
          },
          {
            url: '',
            title: 'Données publiques',
            submenu: response1.data.map((cat) => ({
              url: `/enquete/${cat.name}`,
              title: cat.name,
            })),
          },
          {
            url: '',
            title: 'Pour les entreprises',
            submenu: response.data.map((cat) => ({
              url: `/enquete/${cat.name}`,
              title: cat.name,
            })),
          },
          { url: '/about', title: 'à propos' },
          { url: '/contact', title: 'Contact' },
        ]
      } catch (error) {
        console.error(' Erreur API:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      await fetchData() // attend que les données soient chargées
      await nextTick()
      mobileMenuResponsive()
    })

    return { menus, loading }
  },
}
</script>

<style lang="scss">
/* ✅ Style simple pour différencier */
.btn-connexion {
  padding: 6px 12px;
  background: linear-gradient(135deg, #34c38f, #2ea3f2);
  border-radius: 6px;
  color: white;
  text-decoration: none;

  &:hover {
    background: linear-gradient(135deg, #2ea3f2, #34c38f);
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(46, 163, 242, 0.4);
  }

  &:active {
    transform: scale(0.96);
    color: whitesmoke;
  }
}
.btn-inscription {
  padding: 6px 12px;
  border-radius: 6px;
  background: linear-gradient(135deg, #34c38f, #2ea3f2);
  color: white;
  text-decoration: none;

  &:hover {
    background: linear-gradient(135deg, #2ea3f2, #34c38f);
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(46, 163, 242, 0.4);
    color: whitesmoke;
  }

  &:active {
    transform: scale(0.96);
    color: whitesmoke;
  }
}
</style>
