let inventario = [
  { nome: "Mouse USB",        categoria: "elettronica", fornitore: "TechStore",   prezzo: 12.50, quantita: 15, minima: 5,  arrivo: "2025-05-01" },
  { nome: "Maglietta",   categoria: "abbigliamento", fornitore: "ModaShop",    prezzo: 19.99, quantita: 8,  minima: 3,  arrivo: "2025-04-20" },
  { nome: "Lampada da Tavolo",categoria: "casa",          fornitore: "ArredoCasa",  prezzo: 34.90, quantita: 4,  minima: 2,  arrivo: "2025-06-02" },
  { nome: "Pallone da Calcio",categoria: "sport",         fornitore: "SportLife",   prezzo: 25.00, quantita: 0,  minima: 5,  arrivo: "2025-03-15" },
  { nome: "Frullatore",  categoria: "casa",          fornitore: "ElettroDom",  prezzo: 45.75, quantita: 2,  minima: 1,  arrivo: "2025-05-15" },
  { nome: "Jeans",    categoria: "abbigliamento", fornitore: "DenimCo",     prezzo: 49.50, quantita: 12, minima: 4,  arrivo: "2025-04-28" },
  { nome: "Cuffie",   categoria: "elettronica", fornitore: "AudioPro",    prezzo: 79.90, quantita: 6,  minima: 2,  arrivo: "2025-06-05" },
  { nome: "Computer",   categoria: "alimentari",    fornitore: "BeeFarm",     prezzo: 8.20,  quantita: 20, minima: 5,  arrivo: "2025-05-30" }
];

let prodottiTot     = document.getElementById("prodottiTot");
let valoreTotaleEl  = document.getElementById("valoreTotale");
let form            = document.getElementById("inserisciProdotto");
let tBody           = document.getElementById("productlist");
let searchName      = document.getElementById("searchName");
let sortBy          = document.getElementById("sortBy");
let queryNome       = "";


searchName?.addEventListener("input", () => {
  queryNome = searchName.value.trim().toLowerCase();
  disegnaTabella();
});
sortBy?.addEventListener("change", () => disegnaTabella());

form.addEventListener("submit", function(event) {
  event.preventDefault();
  let nuovoProdotto = {
    nome:       document.getElementById("name").value.trim(),
    categoria:  document.getElementById("categoria").value,
    fornitore:  document.getElementById("supplier").value.trim(),
    prezzo:     parseFloat( document.getElementById("price").value ),
    quantita:   parseInt(   document.getElementById("quantity").value, 10 ),
    minima:     parseInt(   document.getElementById("minQuantity").value, 10 ),
    arrivo:     document.getElementById("arrivalDate").value
  };
  inventario.push(nuovoProdotto);
  form.reset();
  aggiornaTotale();
  disegnaTabella();
});


function disegnaTabella() {
  tBody.innerHTML = "";
  let lista = [...inventario];
  if (sortBy?.value === "nome") {
    lista.sort((a,b) => a.nome.localeCompare(b.nome));
  } else if (sortBy?.value === "categoria") {
    lista.sort((a,b) => a.categoria.localeCompare(b.categoria));
  }
  for (let prodotto of lista) {
    if (queryNome && !prodotto.nome.toLowerCase().includes(queryNome)) continue;
    let tr = document.createElement("tr");
    if (prodotto.quantita === 0) tr.classList.add("out-of-stock");
    else if (prodotto.quantita <= prodotto.minima) tr.classList.add("low-stock");
    tr.innerHTML = `
      <td>${prodotto.nome}</td>
      <td>${prodotto.categoria}</td>
      <td>${prodotto.fornitore}</td>
      <td>€ ${prodotto.prezzo.toFixed(2)}</td>
      <td class="quantita">${prodotto.quantita}</td>
      <td>${prodotto.minima}</td>
      <td>${prodotto.arrivo}</td>
      <td>
        <button class="carica">Carica</button>
        <button class="scarica">Scarica</button>
        <button class="elimina">Elimina</button>
      </td>
    `;
    tr.querySelector(".carica").addEventListener("click", () => {
      prodotto.quantita++;
      tr.querySelector(".quantita").innerText = prodotto.quantita;
      aggiornaTotale();
    });
    tr.querySelector(".scarica").addEventListener("click", () => {
      if (prodotto.quantita > 0) {
        prodotto.quantita--;
        tr.querySelector(".quantita").innerText = prodotto.quantita;
        aggiornaTotale();
      } else alert("Quantità già a zero!");
    });
    tr.querySelector(".elimina").addEventListener("click", () => {
      if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) return;
      inventario = inventario.filter(p => p !== prodotto);
      aggiornaTotale();
      disegnaTabella();
      alert("Prodotto eliminato con successo!");
    });
    tBody.appendChild(tr);
  }
}

function aggiornaTotale() {
  let totaleQt = inventario.reduce((sum,p) => sum + p.quantita, 0);
  prodottiTot.textContent    = totaleQt;
  let totaleVal = inventario.reduce((sum,p) => sum + p.prezzo * p.quantita, 0);
  valoreTotaleEl.textContent = totaleVal.toFixed(2);
}


aggiornaTotale();
disegnaTabella();
