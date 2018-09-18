const webpack = require('./config/webpack.config');
const wtmfront = require('./wtmfront.json');
const config={ 
    secure: false,
    changeOrigin: true,
    logLevel: "debug"
};
module.exports = webpack(__dirname, 8100, {
    /**
     * 脚手架服务器地址
     */
    '/server': {
        target: 'http://localhost:8765',
        pathRewrite: {
            "^/server": ""
        },
       ...config
    },
    /**
     * 
     */
    '/swaggerDoc': {
        target: wtmfront.swaggerDoc,
        pathRewrite: {
            "^/swaggerDoc": ""
        },
        ...config
    },
    '/api': {
        target: wtmfront.api,
        pathRewrite: {
            "^/api": ""
        },
        ...config
    },
})