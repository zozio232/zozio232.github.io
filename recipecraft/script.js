const woodTypes = ["oak", "birch", "spruce", "jungle", "acacia", "dark_oak", "mangrove", "cherry", "pale_oak", "warped", "crimson"];
const GROUPS = { "planks": "oak_planks", "coal": "coal", "log": "oak_log" };
const colors = ["white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "gray", "light_gray", "cyan", "purple", "blue", "brown", "green", "red", "black"];
let allItems = [];

function autoGenerateWood(baseData) {
    let generated = [...baseData];
    

    // --- AJOUT DES OBJETS SANS COULEURS ---
    const neutrals = [
        {
            id: "shulker_box",
            name: "Shulker Box",
            category: "Storage",
            icon: "assets/items/shulker_box.png",
            recipes: [[ [null, "shulker_shell", null], [null, "chest", null], [null, "shulker_shell", null] ]]
        },
          {
            id: "bundle",
            name: "Bundle",
            category: "Storage",
            icon: "assets/items/bundle.png",
            recipes: [[ [null, "string", null], [null, "leather", null], [null, null, null] ]]
        },
        {
            id: "candle",
            name: "Candle",
            category: "Colored Blocks",
            icon: "assets/items/candle.png",
            recipes: [[ [null, "string", null], [null, "honeycomb", null], [null, null, null] ]]
        },
        {
            id: "glass",
            name: "Glass",
            category: "Colored Blocks",
            icon: "assets/items/glass.png",
            "smelting": { "ingredient": "sand" }
        }
    ];
    // --- GÉNÉRATION DES DYES (Colorants) ---
    const dyeCrafts = [
        { id: "white_dye", name: "White Dye", r: ["bone_meal"] }, // Ou Lily of the valley
        { id: "orange_dye", name: "Orange Dye", r: ["orange_tulip"], m: ["red_dye", "yellow_dye"] },
        { id: "magenta_dye", name: "Magenta Dye", r: ["allium"], m: ["purple_dye", "pink_dye"] },
        { id: "light_blue_dye", name: "Light Blue Dye", r: ["blue_orchid"], m: ["blue_dye", "white_dye"] },
        { id: "yellow_dye", name: "Yellow Dye", r: ["dandelion"] },
        { id: "lime_dye", name: "Lime Dye", m: ["green_dye", "white_dye"] },
        { id: "pink_dye", name: "Pink Dye", r: ["peony"], m: ["red_dye", "white_dye"] },
        { id: "gray_dye", name: "Gray Dye", m: ["black_dye", "white_dye"] },
        { id: "light_gray_dye", name: "Light Gray Dye", r: ["oxeye_daisy"], m: ["gray_dye", "white_dye"] },
        { id: "cyan_dye", name: "Cyan Dye", m: ["blue_dye", "green_dye"] },
        { id: "purple_dye", name: "Purple Dye", m: ["blue_dye", "red_dye"] },
        { id: "blue_dye", name: "Blue Dye", r: ["cornflower"] },
        { id: "brown_dye", name: "Brown Dye", r: ["cocoa_beans"] },
        { id: "green_dye", name: "Green Dye", smelt: "cactus" },
        { id: "red_dye", name: "Red Dye", r: ["poppy"] },
        { id: "black_dye", name: "Black Dye", r: ["ink_sac"] }
    ];

    dyeCrafts.forEach(d => {
        let recipes = [];
        // Recette simple (Fleur -> Colorant)
        if(d.r) recipes.push([[null, null, null], [null, d.r[0], null], [null, null, null]]);
        // Recette de mélange (Colorant A + Colorant B)
        if(d.m) recipes.push([[null, null, null], [null, d.m[0], d.m[1]], [null, null, null]]);

        generated.push({
            "id": d.id,
            "name": d.name,
            "category": "Dyes",
            "icon": `assets/items/${d.id}.png`,
            "recipes": recipes.length > 0 ? recipes : null,
            "smelting": d.smelt ? { "ingredient": d.smelt } : null,
            "obtain": d.r || d.m ? 1 : 1 // On peut ajuster si certains donnent 2
        });
    });
    neutrals.forEach(n => {
        if(!generated.find(i => i.id === n.id)) generated.push(n);
    });

    // --- 2. GÉNÉRATION DES PIERRES (NEW) ---
    const stoneTypes = [
        { id: "stone", name: "Stone", hasPolished: false, smeltFrom: "cobblestone" },
        { id: "smooth_stone", name: "Smooth Stone", hasPolished: false, smeltFrom: "stone" },
        { id: "cobblestone", name: "Cobblestone", hasPolished: false },
        // Deepslate : On sépare bien les deux
        { id: "cobbled_deepslate", name: "Cobbled Deepslate", hasPolished: false }, 
        { id: "polished_deepslate", name: "Polished Deepslate", hasPolished: false, craftFrom: "cobbled_deepslate" },
        // Autres pierres
        { id: "diorite", name: "Diorite", hasPolished: true },
        { id: "andesite", name: "Andesite", hasPolished: true },
        { id: "granite", name: "Granite", hasPolished: true },
        { id: "sandstone", name: "Sandstone", hasPolished: false, craftFrom: "sand"},
        { id: "smooth_sandstone", name: "Smooth Sandstone", hasPolished: false, smeltFrom: "sandstone"},
        { id: "red_sandstone", name: "Red Sandstone", hasPolished: false, craftFrom: "red_sand"},
        { id: "smooth_red_sandstone", name: "Smooth Red Sandstone", hasPolished: false, smeltFrom: "red_sandstone"},
        { id: "quartz_block", name: "Block of Quartz", hasPolished: false, craftFrom: "quartz"},
        { id: "smooth_quartz", name: "Smooth Quartz Block", hasPolished: false, smeltFrom: "quartz_block"},
        { id: "blackstone", name: "Blackstone", hasPolished: true }, 

        { id: "polished_blackstone_bricks", name: "Polished Blackstone Bricks", hasPolished: false, craftFrom: "polished_blackstone" }
    ];

stoneTypes.forEach(s => {
    const base = s.id;

    if(!generated.find(i => i.id === base)) {
        generated.push({
            id: base, name: s.name, category: "Building",
            icon: `assets/items/${base}.png`,
            smelting: s.smeltFrom ? { ingredient: s.smeltFrom } : null
        });
    }

    const baseHasWall = !base.includes("quartz") && !base.includes("smooth") && !base.includes("stone");
    const baseHasStairs = (base !== "smooth_stone"); 

    generateStoneVariants(base, s.name, baseHasWall, baseHasStairs);

    // 3. Truc spécial
    if (s.hasPolished) {
        const pId = `polished_${base}`;
        const pName = `Polished ${s.name}`;
        
        generated.push({
            id: pId, name: pName, category: "Building",
            icon: `assets/items/${pId}.png`,
            recipes: [[ [null,null,null], [null,base,base], [null,base,base] ]], obtain: 4
        });

        // --- LA CORRECTION ICI ---
        const polishedHasWall = pId.includes("blackstone") || pId.includes("deepslate");
        
        generateStoneVariants(pId, pName, polishedHasWall, true);
    }
});
function generateStoneVariants(id, name, withWall, withStairs) {
    // 1. On nettoie le nom de base pour éviter les répétitions TROP bizarres dans les variantes (please maman)
    let baseName = name
        .replace(/^Block of /i, "")
        .replace(/ Block$/i, "");

    // 2. LE TRUC DES NOMS SUPER CHIANT

    const variantNameBase = baseName.replace(/ Bricks$/i, " Brick");

    const variants = [
        { suffix: "_slab", n: "Slab", qty: 6, r: [[id,id,id],[null,null,null],[null,null,null]] }
    ];
    
    if (withStairs) {
        variants.push({ suffix: "_stairs", n: "Stairs", qty: 4, r: [[id,null,null],[id,id,null],[id,id,id]] });
    }
    
    if (withWall) {
        variants.push({ suffix: "_wall", n: "Wall", qty: 6, r: [[id,id,id],[id,id,id],[null,null,null]] });
    }

    variants.forEach(v => {
        let vId = id + v.suffix;

        vId = vId.replace("quartz_block_", "quartz_");
        
        if (vId.includes("blackstone_bricks_")) {
            vId = vId.replace("blackstone_bricks_", "blackstone_brick_");
        }

        if(!generated.find(i => i.id === vId)) {
            generated.push({
                id: vId, 
                name: `${variantNameBase} ${v.n}`,
                category: "Building",
                icon: `assets/items/${vId}.png`,
                recipes: [v.r], 
                obtain: v.qty
            });
        }
    });
}
    // --- 3. GÉNÉRATION DES BOIS ---
    woodTypes.forEach(type => {
        const t = type.toLowerCase();
        const idLog = `${t}_log`;
        const idSLog = `stripped_${t}_log`;
        const idWood = `${t}_wood`;
        const idSWood = `stripped_${t}_wood`;
        const p = `${t}_planks`;

        // LOGS ET WOODS
        const bases = [
            { id: idLog, name: `${type} Log`, r: null },
            { id: idSLog, name: `Stripped ${type} Log`, r: null },
            // Correction ici : r est déjà un tableau de recettes [[[...]]], donc pas de [] autour de b.r
            { id: idWood, name: `${type} Wood`, r: [[[null,null,null],[null,idLog,idLog],[null,idLog,idLog]]], qty: 3 },
            { id: idSWood, name: `Stripped ${type} Wood`, r: [[[null,null,null],[null,idSLog,idSLog],[null,idSLog,idSLog]]], qty: 3 }
        ];

        bases.forEach(b => {
            generated.push({ 
                "id": b.id, "name": b.name, "category": "Woods", "icon": `assets/items/${b.id}.png`, 
                "recipes": b.r ? b.r : null, // FIX: retrait du [b.r] qui créait un niveau de tableau en trop
                "obtain": b.qty || 1 
            });
        });

        // PLANCHES
        generated.push({
            "id": p, "name": `${type} Planks`, "category": "Woods", "icon": `assets/items/${p}.png`, "obtain": 4,
            "recipes": [
                [[null,null,null],[null,idLog,null],[null,null,null]],
                [[null,null,null],[null,idSLog,null],[null,null,null]],
                [[null,null,null],[null,idWood,null],[null,null,null]],
                [[null,null,null],[null,idSWood,null],[null,null,null]]
            ]
        });

        // TRUCS DIFFERENTS
        const variants = [
            { id: `${t}_stairs`, name: "Stairs", qty: 4, r: [[p,null,null],[p,p,null],[p,p,p]] },
            { id: `${t}_slab`, name: "Slab", qty: 6, r: [[null,null,null],[p,p,p],[null,null,null]] },
            { id: `${t}_fence`, name: "Fence", qty: 3, r: [[null,null,null],[p,"stick",p],[p,"stick",p]] },
            { id: `${t}_fence_gate`, name: "Fence Gate", qty: 1, r: [[null,null,null],["stick",p,"stick"],["stick",p,"stick"]] },
            { id: `${t}_door`, name: "Door", qty: 3, r: [[p,p,null],[p,p,null],[p,p,null]] },
            { id: `${t}_trapdoor`, name: "Trapdoor", qty: 2, r: [[p,p,p],[p,p,p],[null,null,null]] },
            { id: `${t}_button`, name: "Button", qty: 1, r: [[null,null,null],[null,p,null],[null,null,null]] },
            { id: `${t}_pressure_plate`, name: "Pressure Plate", qty: 1, r: [[null,null,null],[p,p,null],[null,null,null]] },
            { id: `${t}_sign`, name: "Sign", qty: 3, r: [[p,p,p],[p,p,p],[null,"stick",null]] },
            { id: `${t}_hanging_sign`, name: "Hanging Sign", qty: 6, r: [["iron_chain",null,"iron_chain"],[idSLog,idSLog,idSLog],[idSLog,idSLog,idSLog]] }
        ];

        variants.forEach(v => {
            generated.push({ "id": v.id, "name": `${type} ${v.name}`, "category": "Building", "icon": `assets/items/${v.id}.png`, "recipes": [v.r], "obtain": v.qty });
        });
    });

    // --- 2. COULEURS ---
    colors.forEach(color => {
        const c = color;
        const dye = `${c}_dye`;
        const name = c.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        // WOOL, CARPET, BEDS, SHULKERS, GLASS, PANES, CONCRETE POWDER, BUNDLES, CANDLES
        const colorItems = [
            { id: `${c}_wool`, n: "Wool", cat: "Colored Blocks", r: [["white_wool", dye, null], [null, null, null], [null, null, null]], q: 1 },
            { id: `${c}_carpet`, n: "Carpet", cat: "Colored Blocks", r: [[null,null,null],[`${c}_wool`,`${c}_wool`,null],[null,null,null]], q: 3 },
            { id: `${c}_bed`, n: "Bed", cat: "Colored Blocks", r: [[`${c}_wool`,`${c}_wool`,`${c}_wool`],["planks","planks","planks"],[null,null,null]], q: 1, extra: [[null,"white_bed",dye],[null,null,null],[null,null,null]] },
            { id: `${c}_stained_glass`, n: "Stained Glass", cat: "Colored Blocks", r: [["glass","glass","glass"],["glass",dye,"glass"],["glass","glass","glass"]], q: 8 },
            { id: `${c}_stained_glass_pane`, n: "Stained Glass Pane", cat: "Colored Blocks", r: [[null,null,null],[`${c}_stained_glass`,`${c}_stained_glass`,`${c}_stained_glass`],[`${c}_stained_glass`,`${c}_stained_glass`,`${c}_stained_glass`]], q: 16 },
            { id: `${c}_shulker_box`, n: "Shulker Box", cat: "Storage", r: [["shulker_box", dye, null], [null, null, null], [null, null, null]], q: 1 },
            { id: `${c}_bundle`, n: "Bundle", cat: "Storage", r: [["bundle", dye, null], [null, null, null], [null, null, null]], q: 1 },
            { id: `${c}_concrete_powder`, n: "Concrete Powder", cat: "Building", r: [["sand","sand","sand"],["sand",dye,"gravel"],["gravel","gravel","gravel"]], q: 8 },
            { id: `${c}_candle`, n: "Candle", cat: "Colored Blocks", r: [["candle", dye, null], [null, null, null], [null, null, null]], q: 1 }
        ];

        colorItems.forEach(item => {
            let recipes = [item.r];
            if(item.extra) recipes.push(item.extra);
            generated.push({ "id": item.id, "name": `${name} ${item.n}`, "category": item.cat, "icon": `assets/items/${item.id}.png`, "recipes": recipes, "obtain": item.q });
        });
    });

    return generated;
}

function getImgHTML(iconPath, className = "", itemId = "") {

    let finalPath = iconPath;
    if (!finalPath && itemId) {
        finalPath = `assets/items/${itemId}.png`;
    }
    
    if (!finalPath) return '';

    return `<img src="${finalPath}" class="${className}" 
            onerror="handleImageError(this, '${itemId}')">`;
}


function handleImageError(img, itemId) {

    if (img.src.endsWith('.png')) {
        img.src = img.src.replace('.png', '.webp');
    } 

    else if (!img.src.includes('default.png')) {
        img.src = 'assets/items/default.png';
    }
}

// 3. CHARGEMENT
document.addEventListener('DOMContentLoaded', () => {
    fetch('data/items.json').then(res => res.json()).then(data => {
        allItems = autoGenerateWood(data);
        renderList(allItems);
        
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                if (searchTerm === '') {
                    renderList(allItems);
                } else {
                    const filtered = allItems.filter(item => 
                        (item.name && item.name.toLowerCase().includes(searchTerm)) || 
                        (item.category && item.category.toLowerCase().includes(searchTerm))
                    );
                    renderList(filtered);
                }
            });
        }
    }).catch(err => console.error("Erreur JSON:", err));
});

// 4. LISTE
function renderList(items) {
    const container = document.getElementById('item-list');
    container.innerHTML = '';

    // 1. Filtrer les items affichables (Craft ou Four)
    const displayable = items.filter(item => 
        (item.recipes && item.recipes.length > 0) || (item.smelting)
    );

    // 2. Grouper par catégorie
    const groups = {};
    displayable.forEach(item => {
        const cat = item.category || "Other"; // Catégorie par défaut
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(item);
    });


    for (const categoryName in groups) {

        const title = document.createElement('h2');
        title.className = 'category-title';
        title.innerText = categoryName;
        container.appendChild(title);

        groups[categoryName].forEach(item => {
            const div = document.createElement('div');
            div.className = 'item-row';
            div.innerHTML = `${getImgHTML(item.icon)} <span>${item.name}</span>`;
            div.onclick = () => showDetailsById(item.id);
            container.appendChild(div);
        });
    }
}

function showDetailsById(id) {
    const item = allItems.find(i => i.id === id);
    const panel = document.getElementById('details-panel');
    if (!item) return;

    let html = `
        <div class="item-header">
            ${getImgHTML(item.icon, "main-icon")}
            <h1>${item.name}</h1>
        </div>
    `;

    // TABLE DE CRAFT
    if (item.recipes && item.recipes.length > 0) {
        html += `<h3>Crafting Table</h3><div class="recipes-wrapper">`;
        item.recipes.forEach(recipe => {
            html += `<div class="crafting-container"><div class="grid-3x3">`;
            recipe.flat().forEach(slotId => {
                const finalId = GROUPS[slotId] || slotId;
                const ing = allItems.find(i => i.id === finalId);
                html += `<div class="slot" ${ing ? `onclick="showDetailsById('${ing.id}')" style="cursor:pointer"` : ''}>
                            ${ing ? getImgHTML(ing.icon) : ''}
                         </div>`;
            });
            html += `</div><div class="arrow">➜</div><div class="slot large">${getImgHTML(item.icon)}<span class="count">${item.obtain || 1}</span></div></div>`;
        });
        html += `</div>`;
    }

    // FOUR
    if (item.smelting) {
        const ingSmelt = allItems.find(i => i.id === item.smelting.ingredient);
        html += `<h3>Furnace</h3>
            <div class="furnace-container">
                <div class="furnace-input-group">
                    <div class="slot" ${ingSmelt ? `onclick="showDetailsById('${ingSmelt.id}')" style="cursor:pointer"` : ''}>
                        ${ingSmelt ? getImgHTML(ingSmelt.icon) : ''}
                    </div>
                    <img src="assets/gui/fire.gif" class="furnace-fire">
                </div>
                <div class="arrow">➜</div>
                <div class="slot large">${getImgHTML(item.icon)}</div>
            </div>`;
    }
    if ((!item.recipes || item.recipes.length === 0) && !item.smelting) {
        html += `
            <div class="no-recipe-box">
                <h3>How to Obtain</h3>
                <p>This item does not have a crafting or smelting recipe.</p>
                <p>It must be obtained directly from the world (mining, mob drops, or dungeon chests).</p>
            </div>
        `;
    }

    panel.innerHTML = html;
    panel.scrollTo({ top: 0, behavior: 'smooth' });
}