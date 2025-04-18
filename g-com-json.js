const components = require('./corss-components.js')
const fs = require('fs')
const usingComponents = {}
components.forEach(com => {
  const name = com.replace(/([A-Z])/g, '-$1').toLocaleLowerCase().slice(1)
  usingComponents[`ant-${name}`] = `antd-mini/${com}/index`
})

fs.writeFileSync('./compoents.json', JSON.stringify({ usingComponents }), undefined, '\t')
