import { Notify } from "quasar";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default ({ app }) => {
  app.config.globalProperties.$q.notify = Notify;
};
