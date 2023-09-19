const path = require("path")


module.exports = {
    entry:path.join(__dirname, "/src/roots/index.jsx"),
    output:{
        filename: "bundled.js",
        path:path.resolve(__dirname, "public/"),
        publicPath:"/"
    },
    module:{
        rules:[
        {
            test: /\.(js|jsx)$/,
            use:{
                loader: "babel-loader",
                options:{
                    presets:["@babel/preset-env", "@babel/preset-react"]
                }
            }
        },
        {
            test:/\.(css|scss)$/,
            use:["style-loader", "css-loader"]
        },
        {
            test:/\.(png|jpg|ico|svg)$/,
            type: "asset/resources"
        }
    ]
    },
    devServer:{
        static:{
            directory:"./public"
        },
        port:5000,
        historyApiFallback:true,
        hot:true
    }
}