import Rellax from 'rellax'

const parallaxAnimations = () => {
  let animatiedItem = document.querySelectorAll('.rellax')
  if (animatiedItem) {
    animatiedItem.forEach((item, _) => {
      new Rellax(item)
    })
  }
}

export default parallaxAnimations
