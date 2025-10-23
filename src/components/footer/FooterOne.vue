<template>
  <footer class="edu-footer footer-dark bg-image footer-style-2">
    <div class="footer-top footer-top-2">
      <div class="container">
        <!-- Ligne 1 : Logo + Infos + Platform + Infos légales -->
        <div class="footer-row d-flex flex-wrap align-items-start gap-30">
          <!-- Logo + infos -->
          <div class="footer-col logo-col">
            <div class="edu-footer-widget">
              <div class="logo mb-3">
                <router-link to="/">
                  <img class="logo-dark" src="/favicons.ico" alt="Light Logo" />
                </router-link>
              </div>
              <div class="widget-information">
                <ul class="information-list">
                  <li><span>Lieux:</span> 70-80 Upper St Norwich NR2</li>
                  <li><span>Tel:</span><a href="tel:+011235641231">+01 123 5641 231</a></li>
                  <li>
                    <span>Email:</span><a href="mailto:info@edublink.com">info@edublink.com</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Platform -->
          <div class="footer-col">
            <div class="edu-footer-widget">
              <h4 class="widget-title">Platform</h4>
              <ul class="footer-link link-hover">
                <li><router-link to="/">Acceuille</router-link></li>
                <li><router-link to="/about">A propos</router-link></li>
                <li><router-link to="/contact">Contacts</router-link></li>
                <li><router-link to="/corporate-contact">Corporate-Contacts</router-link></li>
              </ul>
            </div>
          </div>

          <!-- Informations légales -->
          <div class="footer-col">
            <div class="edu-footer-widget">
              <h4 class="widget-title">Informations légales</h4>
              <ul class="footer-link link-hover">
                <li><router-link to="/">Conditions générales</router-link></li>
                <li><router-link to="/">Mentions légales</router-link></li>
                <li><router-link to="/">Politique de confidentialité</router-link></li>
                <li><router-link to="/">Licence des données publiques</router-link></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Ligne 2 : Contacts sous le logo -->
        <div class="footer-row d-flex flex-wrap align-items-start mt-4" style="margin-top: 10px">
          <div class="footer-col">
            <div class="edu-footer-widget">
              <h4 class="widget-title">Contacts</h4>
              <ul class="social-share icon-transparent">
                <li>
                  <a href="https://facebook.com/" target="_blank" class="color-fb"
                    ><i class="icon-facebook"></i
                  ></a>
                </li>
                <li>
                  <a href="https://linkedin.com/" target="_blank" class="color-linkd"
                    ><i class="icon-linkedin2"></i
                  ></a>
                </li>
                <li>
                  <a href="https://instagram.com/" target="_blank" class="color-ig"
                    ><i class="icon-instagram"></i
                  ></a>
                </li>
                <li>
                  <a href="https://twitter.com/" target="_blank" class="color-twitter"
                    ><i class="icon-twitter"></i
                  ></a>
                </li>
                <li>
                  <a href="https://youtube.com/" target="_blank" class="color-yt"
                    ><i class="icon-youtube"></i
                  ></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-row {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

/* Colonnes flex vertical */
.footer-col {
  display: flex;
  flex-direction: column;
  flex: 1 1 20%;
}
.logo-col {
  margin-top: -30px; /* ajuste cette valeur pour monter plus ou moins */
}
/* Mobile / tablette : empile verticalement */
@media (max-width: 992px) {
  .footer-col {
    flex: 1 1 100%;
  }
  .footer-row.mt-4 {
    margin-top: 10px;
  }
  .logo-col {
    margin-top: 0; /* sur mobile, on remet normal */
  }
}

/* Espacement entre titres et listes */
.footer-col h4 {
  margin-bottom: 10px;
}
.footer-col ul {
  padding-left: 0;
  list-style: none;
}
</style>
