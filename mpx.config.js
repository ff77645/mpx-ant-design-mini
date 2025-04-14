const { defineConfig } = require('@vue/cli-service')
const { resolve } = require('path')
const loadingPath = resolve('node_modules/antd-mini/es/Loading/index.sjs')
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
    return {
      resolve: {
        alias: {
          [loadingPath]: resolve('src/components/Loading/index.sjs')
        }
      }
    }
  }
})
