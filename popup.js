browser.runtime.sendMessage({ action: "getPopularityStats" }, response => {
  display(response.popularityStats);
});

function display(popularityStats) {
  let table = document.querySelector(".popularity-table");
  let body = document.createElement("tbody");
  table.appendChild(body);
  for (let i = 0; i < popularityStats.length; i++) {
    let stat = popularityStats[i];
    let tr = document.createElement("tr");
    let title = document.createElement("td");
    let type = document.createElement("td");
    let popularity = document.createElement("td");
    title.textContent = stat["title"] || "???";
    type.textContent = stat["type"] || "TRACK";
    popularity.textContent = stat["popularity"] || "???";
    tr.appendChild(title);
    tr.appendChild(type);
    tr.appendChild(popularity);
    body.appendChild(tr);
  }
  sorttable.makeSortable(table);
}
    
