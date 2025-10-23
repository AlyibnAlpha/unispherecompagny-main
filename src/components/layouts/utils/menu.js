export const menuItemsSA = [
  {
    id: 1,
    label: 'menuitems.menu.text',
    isTitle: true,
  },
  {
    id: 2,
    label: 'menuitems.dashboard.text',
    icon: 'uil-home-alt',

    link: '/admin',
  },
  {
    id: 3,
    label: 'menuitems.apps.text',
    isTitle: true,
  },
  {
    id: 4,
    label: 'Catégories des Enquêtes',
    icon: 'uil-align-left',
    link: '/admin/category-enquete',
  },

  {
    id: 5,
    label: 'Groupes des Participants',
    link: '/admin/participants',

    icon: 'uil-users-alt',
  },
  {
    id: 6,
    label: 'Enquêtes de bienvenue',
    link: '/admin/enquetes-bienvenue',

    icon: 'uil-comments-alt',
  },
  {
    id: 7,
    label: 'Enquêtes',
    link: '/admin/enquetes-mes',

    icon: 'uil-comments-alt',
  },
  {
    id: 8,
    label: 'Enquêtes Flash',
    link: '/admin/sondage-rapide',

    icon: 'uil-comments-alt',
  },

  {
    id: 9,
    label: 'Gestions des Users',
    icon: 'uil-user-square',
    subItems: [
      {
        id: 10,
        label: 'Administrateur ',
        link: '/admin/gestions-admin',
        parentId: 9,
      },
      {
        id: 11,
        label: 'Business & Participants ',
        link: '/admin/gestions-users',
        parentId: 9,
      },
    ],
  },
  {
    id: 12,
    label: 'Abonnements',
    icon: 'uil-dollar-alt',
    subItems: [
      {
        id: 13,
        label: 'Abonnements',
        link: '/admin/subscription',
        parentId: 12,
      },
      {
        id: 14,
        label: 'Historique des Abonnements',
        link: '/admin/historique-subscription',
        parentId: 12,
      },
    ],
  },
  {
    id: 15,
    label: 'Gamifications',
    icon: 'uil-game-structure',
    subItems: [
      {
        id: 16,
        label: 'Catalogue ',
        link: '/admin/rewards',
        parentId: 15,
      },
      {
        id: 17,
        label: 'Echanges des récompenses',
        link: '/admin/reward-redemption',
        parentId: 15,
      },
      {
        id: 18,
        label: 'Transactions des points',
        link: '/admin/points-transaction',
        parentId: 15,
      },
      {
        id: 19,
        label: 'Classement',
        link: '/admin/leaderboard',
        parentId: 15,
      },
    ],
  },
  {
    id: 20,
    label: 'Journaux d’activités',
    icon: 'uil-game-structure',
    subItems: [
      {
        id: 21,
        label: 'Actions récents',
        link: '/admin/logs-recents',
        parentId: 20,
      },
      {
        id: 22,
        label: 'Actions Globale',
        link: '/admin/logs',
        parentId: 20,
      },
      {
        id: 23,
        label: 'Activités par utilisateurs',
        link: '/admin/logs-users',
        parentId: 20,
      },
    ],
  },
  {
    id: 24,
    label: 'Tâches',
    link: '/admin/tache',

    icon: 'uil-clipboard-notes',
  },

  {
    id: 25,
    label: 'Rapports',
    link: '/admin/rapport',
    icon: 'uil-folder-download',
  },

  {
    id: 26,
    label: 'Contacts',
    icon: 'uil-boombox',
    link: '/admin/contact',
  },
  {
    id: 27,
    label: 'Contacts-collaborations',
    icon: 'uil-boombox',
    link: '/admin/contacts-collaborations',
  },
]
export const menuItemsA = [
  {
    id: 1,
    label: 'menuitems.menu.text',
    isTitle: true,
  },
  {
    id: 2,
    label: 'menuitems.dashboard.text',
    icon: 'uil-home-alt',

    link: '/admin',
  },
  {
    id: 3,
    label: 'menuitems.apps.text',
    isTitle: true,
  },
  {
    id: 4,
    label: 'Catégories des Enquêtes',
    link: '/admin/category-enquete',

    icon: 'uil-align-left',
  },
  {
    id: 5,
    label: 'Groupes des Participants',
    link: '/admin/participants',

    icon: 'uil-users-alt',
  },
  {
    id: 6,
    label: 'Enquêtes de bienvenue',
    link: '/admin/enquetes-bienvenue',

    icon: 'uil-comments-alt',
  },
  {
    id: 7,
    label: 'Enquêtes',
    link: '/admin/enquetes-mes',

    icon: 'uil-comments-alt',
  },
  {
    id: 8,
    label: 'Enquêtes Flash',
    link: '/admin/sondage-rapide',

    icon: 'uil-comments-alt',
  },

  {
    id: 9,
    label: 'Gestions des utilisateurs',
    link: '/admin/gestions-users',

    icon: 'uil-user-square',
  },
  {
    id: 10,
    label: 'Abonnements',
    icon: 'uil-dollar-alt',
    subItems: [
      {
        id: 11,
        label: 'Abonnements',
        link: '/admin/subscription',
        parentId: 10,
      },
      {
        id: 12,
        label: 'Historique des Abonnements',
        link: '/admin/historique-subscription',
        parentId: 10,
      },
    ],
  },
  {
    id: 13,
    label: 'Gamifications',
    icon: 'uil-game-structure',
    subItems: [
      {
        id: 14,
        label: 'Catalogue ',
        link: '/admin/rewards',
        parentId: 13,
      },
      {
        id: 15,
        label: 'Echanges des récompenses',
        link: '/admin/reward-redemption',
        parentId: 13,
      },
      {
        id: 16,
        label: 'Transactions des points',
        link: '/admin/points-transaction',
        parentId: 13,
      },
      {
        id: 17,
        label: 'Classement',
        link: '/admin/leaderboard',
        parentId: 13,
      },
    ],
  },
  {
    id: 18,
    label: 'Journaux d’activités',
    icon: 'uil-game-structure',
    subItems: [
      {
        id: 19,
        label: 'Actions récents',
        link: '/admin/logs-recents',
        parentId: 18,
      },
      {
        id: 20,
        label: 'Actions Globale',
        link: '/admin/logs',
        parentId: 18,
      },
      {
        id: 21,
        label: 'Activités par utilisateurs',
        link: '/admin/logs-users',
        parentId: 18,
      },
    ],
  },
  {
    id: 22,
    label: 'Tâches',
    link: '/admin/tache',

    icon: 'uil-clipboard-notes',
  },

  {
    id: 23,
    label: 'Rapports',
    link: '/admin/rapport',
    icon: 'uil-folder-download',
  },

  {
    id: 24,
    label: 'Contacts',
    icon: 'uil-boombox',
    link: '/admin/contact',
  },
  {
    id: 25,
    label: 'Contacts-collaborations',
    icon: 'uil-boombox',
    link: '/admin/contacts-collaborations',
  },
]

export const menuItemsB = [
  {
    id: 1,
    label: 'menuitems.menu.text',
    isTitle: true,
  },
  {
    id: 2,
    label: 'menuitems.dashboard.text',
    icon: 'uil-home-alt',

    link: '/busness',
  },
  {
    id: 3,
    label: 'menuitems.apps.text',
    isTitle: true,
  },
  {
    id: 4,
    label: 'Groupes des Participants',
    link: '/business/participants',

    icon: 'uil-users-alt',
  },
  {
    id: 5,
    label: 'menuitems.enquetes.list.enquetesvos',
    link: '/business/enquetes-mes',

    icon: 'uil-comments-alt',
  },
  {
    id: 6,
    label: 'Enequêtes Flash',
    link: '/business/sondage-rapide',
    icon: 'uil-comments-alt',
  },
  {
    id: 7,
    label: 'Abonnements',
    link: '/business/subscription',
    icon: 'uil-dollar-alt',
  },
]

export const menuItemsP = [
  {
    id: 1,
    label: 'menuitems.menu.text',
    isTitle: true,
  },

  {
    id: 2,
    label: 'menuitems.apps.text',
    isTitle: true,
  },

  {
    id: 3,
    label: 'Enquêtes en cours',
    link: '/participant/enquetes-encours',
    icon: 'uil-comments-alt',
  },
  {
    id: 4,
    label: 'Historiques',
    icon: 'uil-history',
    link: '/participant/historique',
  },
  {
    id: 5,
    label: 'Gains',
    icon: 'uil-dollar-alt',
    subItems: [
      {
        id: 6,
        label: 'Catalogue',
        link: '/partcipant/catalogue',
        parentId: 5,
      },
      {
        id: 7,
        label: 'Statisque & transactions',
        link: '/partcipant/transaction',
        parentId: 5,
      },
    ],
  },
]
