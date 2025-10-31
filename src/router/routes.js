const routes = [
  {
    path: '',
    component: () => import('pages/IndexPage.vue'),
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/registre',
    component: () => import('pages/RegistrePage.vue'),
    meta: {},
  },
  {
    path: '/mot-de-passe-oublie',
    component: () => import('pages/ForgotPassword.vue'),
  },
  {
    path: '/api/reset-password/:id',
    component: () => import('pages/ResetPassword.vue'),
  },
  {
    path: '/enquete/encour-1',
    component: () => import('pages/enqueteEncour/CourseOne.vue'),
  },
  {
    path: '/enquete/encour-2',
    component: () => import('pages/enqueteEncour/CourseFour.vue'),
  },
  { path: '/course/coursefour', component: () => import('pages/enqueteEncour/CourseFour.vue') },
  {
    path: '/enquete/:id',
    component: () => import('pages/enqueteEncour/CourseTYPE.vue'),
  },
  {
    path: '/about',
    component: () => import('pages/AproposPage.vue'),
  },
  {
    path: '/contact',
    component: () => import('pages/ContactPage.vue'),
  },
  {
    path: '/corporate-contact',
    component: () => import('pages/CorContactPage.vue'),
  },
  {
    path: '/infoprofil',
    component: () => import('pages/InfoprofilPage.vue'),
  },
  {
    path: '/infoprofilbusiness',
    component: () => import('src/pages/InfoprofilbusPage.vue'),
  },
  {
    path: '/verify-email',
    component: () => import('pages/EmailVerification.vue'),
  },
  {
    path: '/confirm-email',
    component: () => import('pages/EmailConfirmed.vue'),
  },
  {
    path: '/ad',
    component: () => import('layouts/DefaultLayout.vue'),
    children: [
      {
        path: '/busness',
        component: () => import('pages/admin/BussPage.vue'),
        meta: { requiresAuth: true, roles: [import.meta.env.VITE_DEFAULT_ROLEB] },
      },
      {
        path: '/admin',
        component: () => import('pages/admin/AdminPage.vue'),
        meta: { requiresAuth: true, roles: [import.meta.env.VITE_DEFAULT_ROLEA] },
      },
      {
        path: '/business/profil',
        component: () => import('pages/admin/ProfilPage.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEB],
        },
      },
      {
        path: '/participant/profil',
        component: () => import('pages/admin/ProfilPage.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEP],
        },
      },
      {
        path: '/bussines/profil',
        component: () => import('pages/admin/ProfilBPage.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEB],
        },
      },
      {
        path: '/admin/profil',
        component: () => import('pages/admin/ProfilAPage.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/enquetes-details/:id',
        component: () => import('pages/admin/enquetes/EnqueteDetail.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/business/enquetes-details/:id',
        component: () => import('pages/admin/enquetes/EnqueteDetail.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEB],
        },
      },
      {
        path: '/admin/enquetes-modification/:id',
        component: () => import('pages/admin/enquetes/EnqueteModif.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/business/enquetes-modification/:id',
        component: () => import('pages/admin/enquetes/EnqueteModif.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEB],
        },
      },
      {
        path: '/admin/enquetes-mes',
        component: () => import('pages/admin/enquetes/EnqueteMes.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/business/enquetes-mes',
        component: () => import('pages/admin/enquetes/EnqueteMes.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEB],
        },
      },
      {
        path: '/admin/enquetes/create',
        component: () => import('../components/admin/enquete/CreateEnquetePage.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/business/enquetes/create',
        component: () => import('../components/admin/enquete/CreateEnquetePage.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEB],
        },
      },
      {
        path: '/admin/participants',
        component: () => import('src/pages/admin/enquetes/ParticipantGroup.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/business/participants',
        component: () => import('src/pages/admin/enquetes/ParticipantGroup.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEB],
        },
      },
      {
        path: '/admin/contact',
        component: () => import('pages/admin/enquetes/ContactAdmin.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/contacts-collaborations',
        component: () => import('pages/admin/enquetes/ContactAdminCopo.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/historique-details/:id',
        component: () => import('pages/admin/AdminPage.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA, import.meta.env.VITE_DEFAULT_ROLEB],
        },
      },
      {
        path: '/admin/paticipant-groupe/details/:id',
        component: () => import('pages/admin/enquetes/ParticipantDetails.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/business/paticipant-groupe/details/:id',
        component: () => import('pages/admin/enquetes/ParticipantDetails.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEB],
        },
      },
      {
        path: '/admin/sondage-rapide',
        component: () => import('pages/admin/enquetes/EnqueteRapides.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/gestions-users',
        component: () => import('pages/admin/enquetes/UsersGesPage.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/gestions-admin',
        component: () => import('pages/admin/enquetes/AdGesPage.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/business/sondage-rapide',
        component: () => import('pages/admin/enquetes/EnqueteRapides.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEB],
        },
      },

      {
        path: '/admin/rapport',
        component: () => import('pages/admin/enquetes/RapportPage.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },

      {
        path: '/admin/rapport-add',
        component: () => import('pages/admin/enquetes/AddRapportPage.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/subscription',
        component: () => import('pages/admin/enquetes/SubscriptionPage.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/business/subscription',
        component: () => import('pages/admin/enquetes/SubsBusPage.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEB],
        },
      },
      {
        path: '/admin/historique-subscription',
        component: () => import('pages/admin/enquetes/HistoriqueSub.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/category-enquete',
        component: () => import('pages/admin/enquetes/CategoryEnquete.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/tache',
        component: () => import('pages/admin/enquetes/TaskPage.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/rewards',
        component: () => import('pages/admin/enquetes/AdCatalogue.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/reward-redemption',
        component: () => import('pages/admin/enquetes/AdEch.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/points-transaction',
        component: () => import('pages/admin/enquetes/AdTransac.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/leaderboard',
        component: () => import('pages/admin/enquetes/AdLead.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/logs',
        component: () => import('pages/admin/enquetes/AdLogPage.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/logs-recents',
        component: () => import('pages/admin/enquetes/AdLogPageRc.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/logs-users',
        component: () => import('pages/admin/enquetes/AdLogPageUs.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/enquetes-bienvenue',
        component: () => import('pages/admin/enquetes/EnqueteMesWel.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/enquetes-welcome/create',
        component: () => import('pages/admin/enquetes/EnqueteWelcomeCreate.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/enquetes-welcome-modification/:id',
        component: () => import('pages/admin/enquetes/EnqueteWelcomeModif.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
      {
        path: '/admin/enquetes-details-bienvenue/:id',
        component: () => import('pages/admin/enquetes/EnqueteWelDetail.vue'),
        meta: {
          requiresAuth: true,
          roles: [import.meta.env.VITE_DEFAULT_ROLEA],
        },
      },
    ],
  },
  {
    path: '/participant/enquetes-encours',
    component: () => import('pages/admin/enquetes/EnqueteLes.vue'),
    meta: {
      requiresAuth: true,
      roles: [import.meta.env.VITE_DEFAULT_ROLEP],
    },
  },
  {
    path: '/participant/historique',
    component: () => import('pages/admin/enquetes/historiqueAnalyse.vue'),
    meta: {
      requiresAuth: true,
      roles: [import.meta.env.VITE_DEFAULT_ROLEP],
    },
  },
  {
    path: '/participant/catalogue',
    component: () => import('pages/admin/enquetes/PartCatalogue.vue'),
    meta: {
      requiresAuth: true,
      roles: [import.meta.env.VITE_DEFAULT_ROLEP],
    },
  },
  {
    path: '/participant/transaction',
    component: () => import('pages/admin/enquetes/PartTransac.vue'),
    meta: {
      requiresAuth: true,
      roles: [import.meta.env.VITE_DEFAULT_ROLEP],
    },
  },
  {
    path: '/admin/enquetes-avis/:id',
    component: () => import('pages/admin/enquetes/EnqueteAvis.vue'),
    meta: {
      requiresAuth: true,
      roles: [
        import.meta.env.VITE_DEFAULT_ROLEA,
        import.meta.env.VITE_DEFAULT_ROLEB,
      ],
    },
  },
  {
    path: '/participant/enquetes-avis/:id',
    component: () => import('pages/admin/enquetes/EnqueteAvis.vue'),
    meta: {
      requiresAuth: true,
      roles: [import.meta.env.VITE_DEFAULT_ROLEP],
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
