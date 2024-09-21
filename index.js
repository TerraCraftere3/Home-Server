const express = require('express')
const app = express()
const port = 5500

function handleStaticPage(req, res, page){
    address = __dirname + '/pages/' + page
    console.log("Returning " + address + " to " + req.ip)
    res.sendFile(address)
}

app.get('/', (req, res) => {
    handleStaticPage(req, res, "index.html")
})

app.get('/settings', (req, res) => {
    handleStaticPage(req, res, "settings.html")
})

app.post("/settings/:option", (req, res) => {
    handleStaticPage(req, res, "settings.html")
    if(req.params.option == "restart"){
        console.log("Restaring...")
    }else if(req.params.option == "stop"){
        console.log("Shutting down...")
        process.exit(0);
    }
})

app.get('/minecraft', (req, res) => {
    handleStaticPage(req, res, "minecraft.html")
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

app.use(express.static("static"))
