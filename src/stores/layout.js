import { defineStore } from 'pinia'
import { LAYOUT_TYPE, LAYOUT_MODE } from '../app/const'
const { VERTICAL } = LAYOUT_TYPE
const { DARK, LIGHT } = LAYOUT_MODE

export const useLayoutStore = defineStore('layout', {
  id: 'layout-store',
  state: () => ({
    layoutType: VERTICAL,
    layoutWidth: 'fluid',
    leftSidebarType: 'light',
    topbar: 'light',
    loader: false,
    mode: LIGHT,
  }),
  actions: {
    changeLayoutType(layoutType) {
      this.layoutType = layoutType
    },
    changeLayoutWidth(layoutWidth) {
      this.layoutWidth = layoutWidth
    },
    changeLeftSideBarType(leftSidebarType) {
      this.leftSidebarType = leftSidebarType
    },
    changeTopBar(topbar) {
      this.topbar = topbar
    },
    changeLoader(loader) {
      this.loader = loader
    },
    changeLayoutMode(mode) {
      this.mode = mode
    },
  },
  getters: {
    isDarkMode: (state) => state.mode === DARK,
    isLightMode: (state) => state.mode === LIGHT,
    layoutTypecom: (state) => state.layoutType || VERTICAL,
    layoutWidthcom: (state) => state.layoutWidth || 'fluid',
    leftSidebarTypecom: (state) => state.leftSidebarType || 'light',
    topbarcom: (state) => state.topbar || 'colored',
    loadercom: (state) => state.loader || false,
    modecom: (state) => state.mode || LIGHT,
  },

  persist: true,
})
