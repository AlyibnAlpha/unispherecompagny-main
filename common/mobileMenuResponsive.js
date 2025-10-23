const mobileMenuResponsive = () => {
  // Fonction pour trouver les frères d'un élément
  let getSiblings = function (e) {
    let siblings = []
    if (!e.parentNode) return siblings
    let sibling = e.parentNode.firstChild
    while (sibling) {
      if (sibling.nodeType === 1 && sibling !== e) {
        siblings.push(sibling)
      }
      sibling = sibling.nextSibling
    }
    return siblings
  }

  // Tous les toggles
  const subMenuToggle = document.querySelectorAll('.submenu-toggle')

  subMenuToggle.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const parentLi = this.closest('li') // le <li> parent
      const submenu = parentLi.querySelector('.submenu-wrapper') // sous-menu dans ce <li>

      if (!this.classList.contains('active')) {
        // Activer le toggle cliqué
        this.classList.add('active')
        if (submenu) submenu.classList.add('active')
        parentLi.classList.add('active')

        // Fermer les autres frères
        getSiblings(parentLi).forEach(function (item) {
          item.classList.remove('active')
          item.querySelectorAll('li, .submenu-toggle, .submenu-wrapper').forEach(function (child) {
            child.classList.remove('active')
          })
        })
      } else {
        // Désactiver si déjà ouvert
        parentLi.classList.remove('active')
        if (submenu) submenu.classList.remove('active')
        parentLi
          .querySelectorAll('li, .submenu-toggle, .submenu-wrapper')
          .forEach(function (child) {
            child.classList.remove('active')
          })
      }
    })
  })
}

export default mobileMenuResponsive
