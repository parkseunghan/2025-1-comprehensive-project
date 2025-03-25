const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  watchFolders: [__dirname], // 프로젝트 루트 감지
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx'], // 지원 확장자
  },
  server: {
    enableVisualizer: true, // 디버깅 도구 활성화
  },
  transformer: {
    resetCache: true, // 캐시 문제 해결
  },
};
