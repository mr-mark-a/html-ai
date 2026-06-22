const fs = require('fs');
const path = require('path');

const prefixes = [
    "Aero", "Astro", "Alpha", "Apollo", "Aqua", "Aura", "Buster", "Bella", "Bingo", "Blaze",
    "Cyber", "Cosmo", "Captain", "Chrono", "Comet", "Daisy", "Dash", "Duke", "Dexter", "Echo",
    "Fluff", "Fuzz", "Fang", "Flash", "Gizmo", "Galaxy", "Ghost", "Hunter", "Hyper", "Iggy",
    "Jazz", "Jet", "Juno", "Kilo", "Kiki", "Luna", "Lucky", "Laser", "Mega", "Milo", "Nova",
    "Ninja", "Noodle", "Orion", "Oreo", "Paws", "Pixel", "Pluto", "Quantum", "Quark", "Rex",
    "Rover", "Rusty", "Star", "Shadow", "Sonic", "Turbo", "Titan", "Thor", "Ultra", "Vortex",
    "Venus", "Whisker", "Willow", "Xeno", "Xena", "Yoda", "Yoshi", "Zeus", "Ziggy", "Zero",
    "Bark", "Meow", "Hop", "Skip", "Jump", "Run", "Walk", "Sleep", "Dream", "Wake",
    "Sun", "Moon", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto",
    "Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Black", "White", "Gray",
    "Gold", "Silver", "Bronze", "Copper", "Iron", "Steel", "Diamond", "Ruby", "Sapphire", "Emerald"
];

const suffixes = [
    "y", "ie", "kins", "paws", "tron", "zilla", "ster", "ton", "by", "ly", "son", "man", "boy", "girl",
    "let", "ling", "ette", "ina", "ita", "ito", "o", "a", "i", "e", "u",
    "foot", "tail", "nose", "ear", "eye", "tooth", "claw", "fur", "hair", "skin",
    "heart", "soul", "mind", "spirit", "body", "head", "face", "neck", "back", "belly",
    "star", "moon", "sun", "sky", "cloud", "rain", "snow", "wind", "storm", "thunder"
];

const themes = ['Space', 'Cute', 'Funny', 'Fierce', 'Nature', 'Royalty', 'Animals'];
const animalTypes = ['CAT', 'DOG', 'RABBIT'];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateName() {
    let name = "";
    if (Math.random() > 0.5) {
        // Just a prefix (if long enough) or combine two prefixes
        if (Math.random() > 0.5) {
            name = getRandomItem(prefixes) + getRandomItem(prefixes).toLowerCase();
        } else {
            name = getRandomItem(prefixes);
        }
    } else {
        name = getRandomItem(prefixes) + getRandomItem(suffixes);
    }
    return name;
}

const uniqueNames = new Set();
while(uniqueNames.size < 10000) {
    let base = generateName();
    // To ensure 10000 unique names, if we run out of simple combos, append numbers or extra letters
    if (uniqueNames.has(base)) {
        base = base + Math.floor(Math.random() * 100);
    }
    uniqueNames.add(base);
}

const namesArray = Array.from(uniqueNames).map(name => {
    // Determine types (can be 1 to 3)
    let numTypes = Math.random() > 0.8 ? 2 : 1;
    if (Math.random() > 0.95) numTypes = 3;
    
    let shuffledTypes = [...animalTypes].sort(() => 0.5 - Math.random());
    let selectedTypes = shuffledTypes.slice(0, numTypes);
    
    return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        types: selectedTypes,
        theme: getRandomItem(themes)
    };
});

// Sort alphabetically to make the files neat
namesArray.sort((a, b) => a.name.localeCompare(b.name));

// Partition into 3 files
const fileCats = [];
const fileDogs = [];
const fileRabbits = [];

for (let i = 0; i < namesArray.length; i++) {
    if (i % 3 === 0) fileCats.push(namesArray[i]);
    else if (i % 3 === 1) fileDogs.push(namesArray[i]);
    else fileRabbits.push(namesArray[i]);
}

const index = {
    "犬": {},
    "猫": {},
    "うさぎ": {}
};

function formatFileContent(fileName, dataArray) {
    let content = `// ${fileName}\nif (!window.externalPetData) window.externalPetData = [];\n\nwindow.externalPetData.push(\n`;
    let lineNum = 5; // The first item will be on line 5
    
    for (let i = 0; i < dataArray.length; i++) {
        let pet = dataArray[i];
        let lineStr = `    { name: '${pet.name}', types: ${JSON.stringify(pet.types)}, theme: '${pet.theme}' }`;
        if (i < dataArray.length - 1) lineStr += ',';
        content += lineStr + '\n';
        
        // Add to index
        let firstLetter = pet.name.charAt(0).toUpperCase();
        if (!firstLetter.match(/[A-Z]/)) firstLetter = "#";
        
        const indexEntry = {
            名前: pet.name,
            ファイル: fileName,
            行: lineNum
        };
        
        if (pet.types.includes('DOG')) {
            if (!index["犬"][firstLetter]) index["犬"][firstLetter] = [];
            index["犬"][firstLetter].push(indexEntry);
        }
        if (pet.types.includes('CAT')) {
            if (!index["猫"][firstLetter]) index["猫"][firstLetter] = [];
            index["猫"][firstLetter].push(indexEntry);
        }
        if (pet.types.includes('RABBIT')) {
            if (!index["うさぎ"][firstLetter]) index["うさぎ"][firstLetter] = [];
            index["うさぎ"][firstLetter].push(indexEntry);
        }
        
        lineNum++;
    }
    content += `);\n`;
    return content;
}

const catsContent = formatFileContent('petnames_cats.h', fileCats);
const dogsContent = formatFileContent('petnames_dogs.h', fileDogs);
const rabbitsContent = formatFileContent('petnames_rabbits.h', fileRabbits);

fs.writeFileSync(path.join(__dirname, 'petnames_cats.h'), catsContent);
fs.writeFileSync(path.join(__dirname, 'petnames_dogs.h'), dogsContent);
fs.writeFileSync(path.join(__dirname, 'petnames_rabbits.h'), rabbitsContent);

const indexContent = `// petnames.h
// ペット名のインデックスシステム (Pet Name Index System)
// 目的: 動物とアルファベットで名前をソートし、正確なファイルと行を指し示す。

window.ペットインデックス = ${JSON.stringify(index, null, 4)};
`;

fs.writeFileSync(path.join(__dirname, 'petnames.h'), indexContent);

console.log("Successfully generated 10,000 names and updated all files!");
