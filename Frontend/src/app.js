const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const app = express()
app.use(express.json())
app.set("views", "public")
app.engine("html", require("ejs").renderFile)

app.get("/", (req, res)=>{
    res.render("index.html")
})
app.listen(process.env.PORT || 80, ()=> console.log(`app has started listening on port...${process.env.PORT||80}`))