module.exports = {
    entry: "./www/js/app.js",

    output: {
        path: __dirname + '/www',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /.js$/,
                loader: 'babel-loader',
                exclude: [/www\/lib/],
                query: {
                    presets: ['es2015', 'stage-2']
                }
            },
            {
                test: /\.woff/,
                loader: 'url?prefix=font/&limit=10000&mimetype=application/font-woff&name=assets/[hash].[ext]'
            },
            {
                test: /\.ttf/,
                loader: 'file?prefix=font/&name=assets/[hash].[ext]'
            },
            {
                test: /\.eot/,
                loader: 'file?prefix=font/&name=assets/[hash].[ext]'
            },
            {
                test: /\.svg/,
                loader: 'file?prefix=font/&name=assets/[hash].[ext]'
            },
            // we will load all html files raw, it will allow your to require html files as string templates
            // inside your components, directives
            {
                test: /\.html$/,
                loader: "raw-loader"
            },
            {test: /\.json/, loader: "json"}
        ]
    },

    resolve: {
        modules: [
            __dirname + '/www/js',
            __dirname + '/node_modules'
        ]
    }
};
