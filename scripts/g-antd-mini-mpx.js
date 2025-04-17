const fs = require('fs')
const path = require('path')
const { isDir, isExists } = require('./util.js')

const baseDir = path.resolve('node_modules/antd-mini/compiled/wechat/src')
const ignoreFolder = ['_locale', '_util', 'mixins', 'Form', 'style']

main()

function main() {
  generateMpx(baseDir)
  generateMpx(path.join(baseDir, 'Form'))
  replaceMixins()
  replaceSimply()
}

function generateMpx(basePath) {
  let files = fs.readdirSync(basePath)
  files = files.filter(file => !ignoreFolder.includes(file) && isDir(path.join(basePath, file)))
  files.forEach(file => {
    createMpxFile(file, basePath)
  })
}

function createMpxFile(component, basePath) {
  const componentPath = path.join(basePath, component, 'index')
  let wxJs = fs.readFileSync(componentPath + '.js', 'utf8')
  const wxJson = fs.readFileSync(componentPath + '.json', 'utf8')
  const wxWxml = fs.readFileSync(componentPath + '.wxml', 'utf8')

  let wxWxss = null
  const wxssPath = componentPath + '.wxss'
  if (isExists(wxssPath)) {
    wxWxss = fs.readFileSync(wxssPath, 'utf8')
  }
  const matchComponents = wxJs.match(/Component/g)
  if (matchComponents && matchComponents.length === 1) {
    wxJs = wxJs.replaceAll('Component', 'createComponent')
    wxJs = `
import { createComponent } from '@mpxjs/core'
${wxJs}
`
  }
  const template = `
<template>
  ${wxWxml}
</template>
<script>
  ${wxJs}
</script>
<style>
  ${wxWxss || ''}
</style>
<script type="application/json">
  ${wxJson}
</script>
`
  fs.writeFileSync(componentPath + '.mpx', template)
}

function replaceMixins() {
  const folder = path.join(baseDir, 'mixins')
  const mixinFiles = ['value.js', 'computed.js']
  mixinFiles.forEach(file => {
    const originPath = path.join(folder, file)
    const backPath = path.join(folder, path.basename(file, '.js') + '-back.js')
    if (!isExists(backPath)) {
      fs.copyFileSync(originPath, backPath)
    }
    let content = fs.readFileSync(backPath, 'utf8')
    content = content.replace('mixin = Behavior(mixin);', '')
    fs.writeFileSync(originPath, content, 'utf8')
  })
}

function replaceSimply() {
  const originPath = path.join(baseDir, '_util/simply.js')
  const backPath = path.join(baseDir, '_util/simply-back.js')
  if (!isExists(backPath)) {
    fs.copyFileSync(originPath, backPath)
  }
  let content = fs.readFileSync(backPath, 'utf8')
  content = content.replaceAll('Component(', 'createComponent(')
  content = content.replaceAll('behaviors', 'mixins')
  content = `
import { createComponent } from '@mpxjs/core'
${content}
`
  fs.writeFileSync(originPath, content, 'utf8')
}
