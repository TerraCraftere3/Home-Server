const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser')
const ncp = require('ncp').ncp;

const app = express()
const port = 5500

var jsonParser = bodyParser.json()

function handleStaticPage(req, res, page){
    address = __dirname + '/pages/' + page
    console.log("Returning /pages/" + page + " to " + req.ip)
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

function changeServer(index, data){
    console.log(data)
    fs.readFile(__dirname + "/minecraft-server/server.json", "utf8", (error, content) => {
        if (error) {
          console.log(error);
          return;
        }else{
            content = JSON.parse(content)
            if (!(content.length >= index)){
                content.push({})
            }
            console.log(content)
            content[index] = data
            console.log(content)
            fs.writeFile(__dirname + "/minecraft-server/server.json", JSON.stringify(content), (error) => {
                if (error) {
                  console.log('An error has occurred ', error);
                  return;
                }
                console.log('Server list successfully changed!');
            });
        }
    });
}

app.post("/minecraft/createServer/", jsonParser, (req, res) => {
    console.log("Creating Minecraft Server...")
    fs.readFile(__dirname + "/minecraft-server/server.json", "utf8", (error, data) => {
        if (error) {
          console.log(error);
          return;
        }else{
            var i = JSON.parse(data).length
            var folder = "/server" + i
            var folder_path = __dirname + "/minecraft-server/server" + folder
            fs.mkdirSync(folder_path)
            console.log(req.body)
            changeServer(i, {"name": "Server #" + i, "template": parseInt(req.body.template), "folder": folder})

            fs.readFile(__dirname + "/minecraft-server/templates.json", "utf8", (error, templates) => {
                if (error) {
                  console.log(error);
                  return;
                }else{
                    var template_path = __dirname + "/minecraft-server/templates" + JSON.parse(templates)[parseInt(req.body.template)]["folder"]
                    console.log("Copying from " + "/minecraft-server/templates" + JSON.parse(templates)[parseInt(req.body.template)]["folder"] + " -> " + "/minecraft-server/server" + folder)
                    ncp(template_path, folder_path,function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log('Folders copied recursively');
                        res.status(200)
                    });
                }
            });
        }
    });
})

app.post("/minecraft/server/:server/settings/change", jsonParser, (req, res) => {
    console.log("Changing Minecraft Server Settings...")
    const server = req.params.server
    const content = req.body.properties
    console.log(content)
    fs.readFile(__dirname + "/minecraft-server/server.json", "utf8", (error, data) => {
        if (error) {
          console.log(error);
          return;
        }else{
            var folder = JSON.parse(data)[server]["folder"]
            var folder_path = __dirname + "/minecraft-server/server" + folder

            const path = folder_path + "/server.properties"

            fs.writeFile(path, content, { flag: 'w+' }, (error) => {
                if (error) {
                  console.log('An error has occurred ', error);
                  return;
                }
                console.log('Server list successfully changed!');
            });
        }
    });
})

app.get("/minecraft/server/:server", (req, res) => {
    console.log(req.params.server)
    handleStaticPage(req, res, "minecraft/server-settings.html")
})

app.get("/minecraft/server/:server/overview", (req, res) => {
    console.log(req.params.server)
    handleStaticPage(req, res, "minecraft/server-overview.html")
})

app.get("/minecraft/get/:file", (req, res) => {
    console.log("Getting Minecraft Server File " + req.params.file)
    res.sendFile(__dirname + '/minecraft-server/' + req.params.file)
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

app.use(express.static("static"))
