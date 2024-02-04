let pokemonList = document.getElementById("pokemonList");
let catchedList = document.getElementById("catchedList");

printPokemons();
catchedPokemons();

function printPokemons(){

    fetch("https://pokeapi.co/api/v2/pokemon?limit=200")
    .then(res => res.json())
    .then(data => {
        data.results.forEach(pokemon => {
            fetch(pokemon.url)
                .then(res => res.json())
                .then(data => {
                    
                    let li = document.createElement("li");
                    li.innerText = pokemon.name;

                    let typeText = data.types.map(type => type.type.name).join(', ');
                    let typeElement = document.createElement("p");
                    typeElement.innerText = `Typ: ${typeText}`;

                    let pokemonImg = document.createElement("img");
                    pokemonImg.src = data.sprites.front_default;

                    let catchBtn = document.createElement("button");
                    catchBtn.innerText = "Fånga Pokemon!";

                    catchBtn.addEventListener("click", () =>{

                        fetch("http://localhost:8080/catch-pokemon",{
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(pokemon.name)
                        })
                        .then(res => res.json())
                        .then(data =>{

                            catchedList.innerHTML = "";
                            catchedPokemons();
                        })
                    })
                    li.appendChild(pokemonImg);
                    li.appendChild(typeElement);
                    li.appendChild(catchBtn);
                    
                    pokemonList.appendChild(li);
                })
        });
    })
}

function catchedPokemons() {

    fetch("http://localhost:8080/pokemons")
        .then(res => res.json())
        .then(data => {
            data.forEach(pokemon => {
                    let li = document.createElement("li");
                    li.innerText = pokemon.name;
                    
                    let removeBtn = document.createElement("button");
                    removeBtn.innerText = "Ta bort";

                    removeBtn.addEventListener("click", () =>{
  
                        fetch("http://localhost:8080/delete-pokemon/" + pokemon.id,{
                            method: "DELETE"
                        })
                        .then(data =>{

                        catchedList.innerHTML = "";
                        catchedPokemons();
                        })    
                    })
                 
                    li.appendChild(removeBtn);
                    catchedList.appendChild(li);
                });
        }
)}