export default {
  appenders: {
    console: {
      type: 'stdout',
    },
    app: {
      type: 'dateFile',
      filename: 'logs/app.log',
      compress: true,
      layout: {
        type: 'pattern',
        pattern: '[%d] [%p] - %m',
      },
    },
  },
  categories: {
    default: {
      appenders: [ 'console', 'app' ],
      level: 'DEBUG',
    },
  },
};
