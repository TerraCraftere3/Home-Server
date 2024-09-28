var server_data
var server_template_data
var server_index

function getServerIndex() {
    // Use a regular expression to capture the index after "/server/"
    const regex = /\/server\/(\d+)(?:\/|$)/;
    const url = window.location.href; // Get the current URL from the document
    const match = url.match(regex);

    if (match && match[1]) {
        return parseInt(match[1], 10); // Convert the index to an integer
    }

    return null; // Return null if no match is found
}

function onServerDataReadyInternal(){
    document.title = server_data["name"] + " | " + server_page_title
    document.getElementById("title").innerHTML = server_data["name"]
    document.getElementById("sidebar").innerHTML = document.getElementById("sidebar").innerHTML.replaceAll("[I]", server_index)
}

function getServerProperties(){
    fetch("/minecraft/get/server/server" + server_index +"/server.properties")
    .then((file) => {

    });
}


fetch("/minecraft/get/server.json")
.then((response) => response.json())
.then((data) => {
    server_index = getServerIndex()
    server_data = data[server_index]
    fetch("/minecraft/get/templates.json")
    .then((response) => response.json())
    .then((templates) => {
        server_template_data = templates[server_data["template"]]
        onServerDataReadyInternal()
        onServerDataReady()
    });
});
