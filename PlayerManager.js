// ** LiesMich **
// Dieses Skript kann verwendet werden um eine Übersicht aller Spieler und ihrer Charaktere zu erhalten.
// Es zeigt XP/HP Balken, Effekte und Sinne an.
// Die XP und HP können schnell angepasst werden und Effekte können einfach entfernt werden.
// - Werte die Angepasst werden können - 
//   - onlyShowMainCharacter: Wenn true, wird nur der Hauptcharakter jedes Spielers angezeigt, bei false werden alle Charaktere mit Besitzrecht angezeigt.
//   - skipActors: Hier können Actor IDs hinzugefügt werden, die nicht in der Übersicht angezeigt werden sollen (z.B. Pets, Summons, Companions, Spectators, etc.).
//                 Wenn onlyShowMainCharacter true ist, hat dies keine Wirkung.
//                 Als ID wird die Actor ID (UUID) aus dem Charakterbogen erwartet, der Code kommt mit Actor.XXyy12UUVV34bla und mit XXyy12UUVV34bla zurecht.
// ** ReadMe **
// This script can be used to get an overview of all players and their characters.
// It shows XP/HP bars, effects and senses.
// The XP and HP can be quickly adjusted and effects can be easily removed.
// - Adjustable values - 
//   - onlyShowMainCharacter: If true, only the main character of each player will be shown, if false all characters with ownership will be shown.
//   - skipActors: Here you can add Actor IDs that should not be listed in the overview (e.g. Pets, Summons, Companions, Spectators, etc.).
//                 If onlyShowMainCharacter is true, this has no effect.
//                 The ID expected here is the Actor ID (UUID) from the character sheet, the code can handle both Actor.XXyy12UUVV34bla and XXyy12UUVV34bla.


// Set to true to only show the main character of each player, false to show all characters with ownership
// If this is used consider to add IDs of sider characters (pets, summons, companions, spectators, etc.) to the skipActors Set to not show them in the overview.
const onlyShowMainCharacter = false;

// Hear can actor ben added than schould not been listed in the Overview (e.g. Pets, Summons, Companions, Spectators, etc.)
// if onlyShowManCharacter is true, this has no effect
const skipActors = new Set();
skipActors.add("Actor.UUIDToSkip1");
skipActors.add("Actor.UUIDToSkip2");

// Name of the Macro that should be executed when clicking the level up button, this should be the macro that manages the Levelup fron player perspective
const levelManager = "PlayerLevelManager";

const isGer = game.i18n.lang.startsWith("de");
const textDictonary = {
    dialogTitle: isGer ? "Spielerübersicht" : "Player Overview",
    xp: isGer ? "EP" : "XP",
    hp: isGer ? "TP" : "HP",
    stats: isGer ? "Status:" : "Status:",
    senses: isGer ? "Sinne:" : "Senses:",
    noCharacterFound: isGer ? "Keine Akteure gefunden für" : "No actors found for"
};

// Start of main code from here there are no changable values, so make sure you know what you are doing if you want to change something below this line.
const players = game.users.filter(u => !u.isGM);

const actorBlockStyle = `border: 1px solid #555; border-radius: 5px; padding: 10px; margin-bottom: 15px; background: rgba(255, 255, 255, 0.1);`;
const resourceBlockStyle = `display: flex; align-items: center; gap: 6px; margin-bottom: 10px;`;
const barStyle = `width: 100%; height: 10px; background: #333; border-radius: 4px; margin-bottom: 4px;`;
const innerBarStyle = `height: 100%; border-radius: 4px;`;
const hpBarColor = "#3fa63f";
const xpBarColor = "#cfa93f";
const btnStyle = `display: inline-flex; gap: 5px; justify-content: center; margin: 5px; vertical-align: middle;`;
const btnBtnStyle = `padding: 0px 4px; width: 18px; height: 18px; line-height: 16px; font-size: 12px; border: none; background: #555; color: white; cursor: pointer;`;

// Initial render of the overview dialog and function loop
while (await renderPlayerOverview()) {
    console.log("Redrawing player overview...");
}

return;
// End of main code, function definitions below

function getActorsOfPlayer(player) {
    let result = [];
    for (const actor of game.actors) {
        if (actor.hasPlayerOwner && actor.ownership[player.id] === 3) {
            let isSkipped = false;
            for (let skipId of skipActors) {
                if (actor.id === skipId || skipId.endsWith(actor.id)) {
                    isSkipped = true;
                    break;
                }
            }
            if (!isSkipped) {
                result.push(actor);
            }
        }
    }
    return result;
}

function xpBar(actor, player) {
    const xp = actor.system.details.xp.value;
    const min = actor.system.details.xp.min;
    const max = actor.system.details.xp.max;

    let pct = 0;
    if (min > max) { pct = 100; }
    else if (xp < min) { pct = 0; }
    else if (xp > max) { pct = 100; }
    else { pct = Math.min(100, ((xp - min) / (max - min)) * 100); }

    const canLevelUp = xp >= max;

    return `
    <div style="${resourceBlockStyle}">
      <label>${textDictonary.xp}: ${xp} / ${max}</label>
      <div style="${barStyle}">
        <div style="${innerBarStyle} background: ${xpBarColor}; width:${pct}%"></div>
      </div>
      <div class="buttons" style="${btnStyle}">
        ${canLevelUp ? // if the Character can level up only the levelup button is shown
            `<button data-action="levelup" data-id="${actor.id}" data-player="${player.id}" style="${btnBtnStyle}; background: #d4af37;"><i class="fas fa-arrow-up"></i></button>`
            :
            `<button data-action="xp-minus" data-id="${actor.id}" style="${btnBtnStyle}">−</button>
            <input type="number" data-id="${actor.id}" data-field="xp-change" value="0" style="width:40px; height:16px; font-size:11px; text-align:center;"></input>
            <button data-action="xp-plus" data-id="${actor.id}" style="${btnBtnStyle}">+</button>`
        }
      </div>
    </div>
  `;
}

function hpBar(actor) {
    const hp = actor.system.attributes.hp.value;
    const max = actor.system.attributes.hp.max;
    let pct = 0;
    if (max < hp) {
        pct = 100;
    } else if (hp < 0) {
        pct = 0;
    } else {
        pct = Math.min(100, (hp / max) * 100);
    }

    return `
    <div style="${resourceBlockStyle}">
      <label>${textDictonary.hp}: ${hp} / ${max}</label>
      <div style="${barStyle}">
        <div style="${innerBarStyle} background: ${hpBarColor}; width:${pct}%"></div>
      </div>
      <div class="buttons" style="${btnStyle}">
        <button data-action="hp-minus" data-id="${actor.id}" style="${btnBtnStyle}">−</button>
        <input type="number" data-id="${actor.id}" data-field="hp-change" value="1" style="width:40px; height:16px; font-size:11px; text-align:center;">
        <button data-action="hp-plus" data-id="${actor.id}" style="${btnBtnStyle}">+</button>
      </div>
    </div>
  `;
}

function effectList(actor) {
    let resultHtml = "";

    let effects = actor.effects;
    let activeEffects = effects.filter(e => !e.disabled);
    //let inactiveEffects = effects.filter(e => e.disabled);
    for (const effect of activeEffects) {
        let label = effect.name;
        let image = effect.img;

        resultHtml += `
        <li style="display: flex; align-items: center; gap: 5px; margin-bottom: 4px;">
          <img src="${image}" alt="${label}" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 5px;">
          ${label}
          <button data-action="disable-effect" data-id="${actor.id}" data-effect="${effect.id}" style="${btnBtnStyle}">✖</button>
          </li>
          `;
    }
    return resultHtml;
}

function sensesList(actor) {
    let resultHtml = "";
    const unitSuffix = actor.system.attributes.senses.units;
    const senses = actor.system.attributes.senses.ranges;
    const senseLabels = game.dnd5e.config.senses;
    for (let [key, value] of Object.entries(senses)) {
        if (!value || value <= 0) { continue; }
        resultHtml += `<li>${senseLabels[key] || key}: ${value} ${unitSuffix}</li>`;
    }
    return resultHtml;
}

async function renderPlayerOverview() {
    let html = `<div class="dm-overview">`;

    for (const player of players) {
        html += `<h2>${player.name}</h2>`;

        const actors = [];
        if (onlyShowMainCharacter) {
            if (player.character != null) {
                actors.push(player.character);
            }
        } else {
            let playerActors = getActorsOfPlayer(player);
            if (playerActors.length != 0) {
                actors.push(...playerActors);
            }
        }

        if (!actors || actors.length === 0) { html += `<p>${textDictonary.noCharacterFound} ${player.name}.</p>`; continue; }

        for (const actor of actors) {
            html += `
        <div class="actor-block">
        <h3>${actor.name}</h3>
        
        ${xpBar(actor, player)}
        ${hpBar(actor)}
        
        <div class="status-block">
        <label>${textDictonary.stats}</label>
        <ul>${effectList(actor)}</ul>
        </div>
        
        <div class="sense-block">
        <label>${textDictonary.senses}</label>
        <ul>${sensesList(actor)}</ul>
        </div>
        </div>
        `;
        }
    }
    html += `</div>`;


    let dialogResult = new Promise((resolve) => {
        let redrawDialog = false;
        let dialog = new Dialog({
            title: textDictonary.dialogTitle,
            content: html,
            buttons: {},
            render: (html) => {
                html.on("click", "button", async (ev) => {

                    const btn = ev.currentTarget;
                    const action = btn.dataset.action;
                    const actor = game.actors.get(btn.dataset.id);
                    const player = game.users.get(btn.dataset.player);

                    if (!actor) return;

                    // Change XP
                    if (action === "xp-plus" || action === "xp-minus") {
                        const change = Number(html.find(`input[data-field="xp-change"][data-id="${actor.id}"]`).val());
                        const delta = action === "xp-plus" ? change : -change;
                        await actor.update({ "system.details.xp.value": actor.system.details.xp.value + delta });
                        redrawDialog = true; // Set flag to redraw dialog after XP change              
                    }

                    if (action === "hp-plus" || action === "hp-minus") {
                        const change = Number(html.find(`input[data-field="hp-change"][data-id="${actor.id}"]`).val());
                        const delta = action === "hp-plus" ? change : -change;
                        await actor.update({ "system.attributes.hp.value": actor.system.attributes.hp.value + delta });
                        redrawDialog = true; // Set flag to redraw dialog after HP change
                    }

                    if (action === "disable-effect") {
                        const effect = actor.effects.get(btn.dataset.effect);
                        if (effect) await effect.update({ disabled: !effect.disabled });
                        redrawDialog = true; // Set flag to redraw dialog after effect change
                    }

                    if (action === "levelup") {
                        console.log(`Triggering level up for ${actor.name} by player ${player.name}`);
                        const macro = game.macros.getName(levelManager);
                        if (macro) {
                            const messageContent = `
                                <p>${actor.name} kann ein Level aufsteigen!</p>
                                <div style="text-align:center; margin-top:10px;">
                                    <span class="btn" style="display: inline-block; padding: 10px 30px; background: #d4af37; color: #000; border-radius: 20px; box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);">
                                        @Macro[${levelManager}]{Level Up!}
                                    </span>
                                </div>
                            `;
                            ChatMessage.create({ content: messageContent, speaker: { alias: "System" }, whisper: [player.id] });
                        } else {
                            await Dialog.prompt({ title: "Levelaufstieg auslösen?", content: "Das levelup Script ist noch nicht verknüpft. bitte Führen sie das Levelup Manuell aus." });
                        }
                        redrawDialog = true; // Set flag to redraw dialog after levelup message
                    }
                    dialog.close();
                });
            },
            close: () => {
                resolve(redrawDialog);
            }
        });
        dialog.options.popOut = true; // Make dialog pop out
        dialog.render(true);
    });

    return await dialogResult;
}