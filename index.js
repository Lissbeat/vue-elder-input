import InputComponent from './src/component.vue'

const install = Vue => {
  Vue.component('input-component', InputComponent)
}

export default {
  install,
}

export { InputComponent, install as InputComponentInstaller }
