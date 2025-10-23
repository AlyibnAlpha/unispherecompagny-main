import { defineStore } from 'pinia'

export const useRegisterStore = defineStore('register', {
  state: () => ({
    forms: {
      title: '',
      description: '',
      supportedLanguages: '',
      status: '',
      isPublished: false,
      startDate: '',
      endDate: '',
    },
    formList1: [],
    idsurvey: '',
    surveyData: {},
    idsurveyw: '',
    surveyDataw: {},
    subscriptionPlan: '',
    conx: {
      ema: '',
      pas: '',
    },
  }),
  actions: {
    setFormData1(formp) {
      this.forms.title = formp.title
      this.forms.description = formp.description
      this.forms.supportedLanguages = formp.supportedLanguages
      this.forms.status = formp.status
      this.forms.isPublished = formp.isPublished
      this.forms.startDate = formp.startDate
      this.forms.endDate = formp.endDate
    },
    setFormData2(formListP) {
      this.formList1 = formListP
    },
    setSurveyData(formListP) {
      this.surveyData = formListP
    },
    setSurveyDataw(formListP) {
      this.surveyDataw = formListP
    },
    setCom(formListP, formListPs) {
      this.conx.ema = formListP
      this.conx.pas = formListPs
    },
    restCom() {
      this.conx.ema = ''
      this.conx.pas = ''
    },
    setIdSurvey(id) {
      this.idsurvey = id
    },
    setIdSurveyw(id) {
      this.idsurveyw = id
    },
    resetFormData2() {
      this.formList1 = []
    },
    resetFormData() {
      this.forms = {
        title: '',
        description: '',
        supportedLanguages: '',
        status: '',
        isPublished: false,
        startDate: '',
        endDate: '',
      }
    },
    setpreniumBUS({ subscriptionPlan }) {
      this.subscriptionPlan = subscriptionPlan
    },
  },
  persist: true,
})
