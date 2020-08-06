// 存在组件间循环引用的场景，因此在外部统一注册
import TableFormList from "./TableFormList";

const install = (Vue) => {
  Vue.component(TableFormList.name, TableFormList)
}

export default {
  install,
  version: '1.0.0'
}