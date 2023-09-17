const path = require("path")


module.exports = {
    entry:path.join(__dirname, ""),
    output:{
        filename: "",
        path:path.resolve(),
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
            use:["css-loader", "style-loader"]
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
        historyApiFallback:true
    }
}