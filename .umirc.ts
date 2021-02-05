import { defineConfig } from 'umi'
import routes from './src/routers'

const CompressionPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i

export default defineConfig({
  title: '能力开放平台',
  outputPath: '/docker/dist',
  hash: true,
  nodeModulesTransform: {
    type: 'none',
    exclude: ['evian'],
  },
  history: {
    type: 'browser',
  },
  sass: {
    sassOptions: {
      includePaths: ['./src/assets/sass'],
    },
  },
  targets: {
    ie: 10
  },
  publicPath: '/',
  proxy: {
    '/ocp': {
      target: 'http://172.16.4.103:29000',
      changeOrigin: true,
      pathRewrite: {
        '^/ocp': '/ocp'
      }
    },
    '/api': {
      target: 'http://172.16.4.103:29000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api'
      }
    },
    '/file': {
      target: 'http://172.16.4.103:29008',
      changeOrigin: true,
      pathRewrite: {
        '^/file': '/file'
      }
    },
    '/yanshiapi': {
      target: 'http://172.16.4.124:29000',
      changeOrigin: true,
      pathRewrite: {
        '^/yanshiapi': '/ocp'
      }
    },
    '/demo': {
      target: 'http://172.16.4.124:8889',
      changeOrigin: true,
      pathRewrite: {
        '^/demo': '/demo'
      }
    },
  },
  dynamicImport: {
    loading: '@/layouts/loading'
  },
  routes,
  chainWebpack(memo: any) {
    memo.devtool = false;
    memo.plugin('CompressionPlugin').use(
      new CompressionPlugin({
        algorithm: 'gzip',
        test: productionGzipExtensions,
        // 只处理大于xx字节 的文件，默认：0
        threshold: 10240,
        // 示例：一个1024b大小的文件，压缩后大小为768b，minRatio : 0.75
        minRatio: 0.8, // 默认: 0.8
        // 是否删除源文件，默认: false
        deleteOriginalAssets: false,
      })
    )
  },
  favicon: '/favicon.ico',
})