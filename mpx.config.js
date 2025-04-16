const { defineConfig } = require('@vue/cli-service')
const { resolve } = require('path')
const corssComponents = require('./corss-components.js')

module.exports = defineConfig({
  outputDir: `dist/${process.env.MPX_CURRENT_TARGET_MODE}`,
  pluginOptions: {
    mpx: {
      plugin: {
        srcMode: 'wx',
        modeRules: {
          ali: {
            include: [
              resolve('node_modules/antd-mini')
            ]
          },
          wx: {
            include: [
              resolve('node_modules/antd-mini')
            ]
          }
        },
        hackResolveBuildDependencies: ({ files, resolveDependencies }) => {
          const path = require('path')
          const packageJSONPath = path.resolve('package.json')
          if (files.has(packageJSONPath)) files.delete(packageJSONPath)
          if (resolveDependencies.files.has(packageJSONPath)) {
            resolveDependencies.files.delete(packageJSONPath)
          }
        }
      },
      loader: {},
      unocss: {}
    }
  },
  /**
   * 如果希望node_modules下的文件时对应的缓存可以失效，
   * 可以将configureWebpack.snap.managedPaths修改为 []
   */
  configureWebpack(config) {
    const alias = {}

    if (process.env.MPX_CURRENT_TARGET_MODE === 'ali') {
      corssComponents.forEach(key => {
        alias[`antd-mini/${key}/index`] = `antd-mini/es/${key}/index`
      })
    }
    return {
      resolve: {
        alias
      }
    }
  }
})
