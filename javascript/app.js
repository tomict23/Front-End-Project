//--------------------------------------------------
//--------------------------------------------------
//Animated Background SETUP.
//--------------------------------------------------
//--------------------------------------------------

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);

const material1 = new THREE.MeshPhongMaterial({
  emissive: `#AC02F2`,
});
const material2 = new THREE.MeshPhongMaterial({
  emissive: `#5903FC`,
});
const material3 = new THREE.MeshPhongMaterial({
  emissive: `#00B1FC`,
});
const material4 = new THREE.MeshPhongMaterial({
  emissive: `#00F5E8`,
});

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

for (let i = 0; i < 2000; i++) {
  let cubeSize = Math.random() / 5;
  const geometry = new THREE.IcosahedronGeometry(cubeSize, 2);

  let cube = new THREE.Mesh(geometry, material1);
  cube.position.x = Math.floor(Math.random() * 100) - 50;
  cube.position.y = Math.floor(Math.random() * 100) - 50;
  cube.position.z = Math.floor(Math.random() * 100) - 50;
  scene.add(cube);

  let cube2 = new THREE.Mesh(geometry, material2);
  cube2.position.x = Math.floor(Math.random() * 100) - 50;
  cube2.position.y = Math.floor(Math.random() * 100) - 50;
  cube2.position.z = Math.floor(Math.random() * 100) - 50;
  scene.add(cube2);

  let cube3 = new THREE.Mesh(geometry, material3);
  cube3.position.x = Math.floor(Math.random() * 100) - 50;
  cube3.position.y = Math.floor(Math.random() * 100) - 50;
  cube3.position.z = Math.floor(Math.random() * 100) - 50;
  scene.add(cube3);

  let cube4 = new THREE.Mesh(geometry, material4);
  cube4.position.x = Math.floor(Math.random() * 100) - 50;
  cube4.position.y = Math.floor(Math.random() * 100) - 50;
  cube4.position.z = Math.floor(Math.random() * 100) - 50;
  scene.add(cube4);
}

camera.position.x = 0;
camera.position.y = 20;
camera.position.z = 0;

function animate() {
  requestAnimationFrame(animate);
  scene.rotation.x += 0.002;
  scene.rotation.y += 0.0005;
  renderer.render(scene, camera);
}
animate();

//--------------------------------------------------
//--------------------------------------------------
//Defined searchbar and button elements in JS.
//--------------------------------------------------
//--------------------------------------------------

let $searchBar = $("#searchbar");
let $searchButton = $("#submit");
let $randomButton = $("#randomCardButton");

//--------------------------------------------------
//--------------------------------------------------
//Function to execute when searching.
//--------------------------------------------------
//--------------------------------------------------

function randomCardPlease(event) {
  $.get(
    `https://pokeapi.co/api/v2/pokemon/${
      Math.floor(Math.random() * 1008) + 1
    }/`,
    initialDataRetrieval
  );
}

function executeSearch(event) {
  if ($searchBar[0].value == ``) {
    $.get(
      `https://pokeapi.co/api/v2/pokemon/${
        Math.floor(Math.random() * 1008) + 1
      }/`,
      initialDataRetrieval
    );
  }

  $.get(
    `https://pokeapi.co/api/v2/pokemon/${$searchBar[0].value}/`,
    initialDataRetrieval
  ); //JQuery get function end.
} //executeSearch func. end.

//--------------------------------------------------
//--------------------------------------------------
//Function to process the data received
//--------------------------------------------------
//--------------------------------------------------

function initialDataRetrieval(data) {
  //
  //--------------------------------------------------
  //Second request to get different but related data.
  //--------------------------------------------------
  //
  $.get(data.species.url, secondDataRetrieval);
  function secondDataRetrieval(species) {
    $.get(species.evolution_chain.url, evolutionData);
    function evolutionData(evo) {
      console.log(`DATA: `, data); //console log the results, this comes in the form of an ARRAY.
      console.log(`SPECIES: `, species);
      console.log(`EVOULTION`, evo);
      //
      //--------------------------------------------------
      //Console log data received
      //--------------------------------------------------
      //
      console.log(`User search terms: ${species.id} OR ${data.name}`); //Console log what the user typed in the search bar.
      //
      //--------------------------------------------------
      //Call to the second data retrieval.
      //--------------------------------------------------
      //
      //
      //--------------------------------------------------
      //This loop establishes our cards
      //--------------------------------------------------
      //
      const typesArr = data.types;
      const typesStr = getTypes(typesArr);
      function getTypes(arr) {
        let str = ``;
        for (let i = 0; i < arr.length; i++) {
          str += `${arr[i].type.name}, `;
        }
        return str.slice(0, str.length - 2).toUpperCase();
      }

      const pokeName = data.name.toUpperCase();
      const japName = species.names[0].name;
      const dexNumber = species.pokedex_numbers[0].entry_number;
      const ancestor = evo.chain.species.name.toUpperCase();
      const abilityArr = data.abilities;
      const abilitiesStr = getAbilities(abilityArr).toUpperCase();
      function getAbilities(arr) {
        let str = ``;
        for (let i = 0; i < arr.length; i++) {
          str += `${arr[i].ability.name}, `;
        }
        return str.slice(0, str.length - 2);
      }
      const pokeColor = species.color.name;
      const legendary = species.is_legendary;
      const mythical = species.is_mythical;
      for (let i = 0; i < 1; i++) {
        let resultCard = $(
          `<div id="cardholder"><span id="card" class="result-card" style="background-image: url(${data.sprites.other["official-artwork"].front_default});">
          <h1 class="card-name-jap text">${japName}</h1>
            <h1 class="card-name text">${pokeName}</h1>
            <h1 class="card-dexnum text"># ${dexNumber}</h1>
              <em class="evolves-text text">FAMILY TREE - ${ancestor}</em>
              <em class="abilities-text text">ABILITIES - ${abilitiesStr}</em>
              <em class="types-text text">${typesStr}</em>
              <em id="back-button" class="text">➤</em>
              <em id="next-button" class="text">➤</em>
            </span></div>`
        );
        // console.log(resultCard);
        resultCard[0].draggable = true;
        $("#results").prepend(resultCard);
        let legendaryStar = $(`<em class="star text">✦</em>`);
        let mythicalStar = $(`<em class="mythical-star text">✧</em>`);
        if (legendary === true) {
          $("#card").append(legendaryStar);
        }
        if (mythical === true) {
          $("#card").append(mythicalStar);
        }
      } //for loop end.
      function lookForBackId(event) {
        $.get(
          `https://pokeapi.co/api/v2/pokemon/${dexNumber - 1}/`,
          initialDataRetrieval
        ); //JQuery get function end.
      }
      function lookForNextId(event) {
        $.get(
          `https://pokeapi.co/api/v2/pokemon/${dexNumber + 1}/`,
          initialDataRetrieval
        ); //JQuery get function end.
      }

      $("#back-button").click(lookForBackId);
      $("#next-button").click(lookForNextId);
    }
  } //secondDataRetrieval func. end
} //dataRetrievl func. end.

$($searchButton).click(executeSearch);
$($randomButton).click(randomCardPlease);
