grid = document.getElementById("grid")
card_template = `<a href="[LINK]" class="card-link"><div class="card" id="card-[ID]">
                <h1 class="card-title">[TITLE]</h1>
                <span class="card-desc">[DESCRIPTION]</span>
            </div></a>`
cards.forEach(card => {
    console.log(card)
    grid.innerHTML += card_template.replace("[ID]", card.id).replace("[TITLE]", card.title).replace("[DESCRIPTION]", card.desc).replace("[LINK]", card.link)
});
