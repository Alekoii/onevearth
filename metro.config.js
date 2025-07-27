const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

config.resolver.alias = {
    '@': './src',
    '@/components': './src/components',
    '@/screens': './src/screens',
    '@/core': './src/core',
    '@/store': './src/store',
    '@/plugins': './src/plugins',
    '@/themes': './src/themes',
    '@/hooks': './src/hooks',
    '@/services': './src/services',
    '@/utils': './src/utils',
    '@/types': './src/types',
    '@/locales': './src/locales',
    '@/i18n': './src/i18n'
}

module.exports = config