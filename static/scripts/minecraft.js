async function generateDefaultProperties() {
    let content = "";

    try {
        const response = await fetch("/minecraft/get/properties.json");
        const data = await response.json();

        data.forEach(propertie => {
            console.log(propertie);
            content += propertie["name"] + ":" + propertie["default"] + "\n"
        });

    } catch (error) {
        console.error('Error fetching properties:', error);
    }

    return content;
}
