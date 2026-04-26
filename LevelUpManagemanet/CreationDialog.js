/**
 * CHARACTER MANAGEMENT DASHBOARD
 */

// Set Allow Level Down to true if you want to enable the level down functionality in the dashboard.
const allowLevelDown = false;

// Macros for Level Up and Level Down Logic must be created with the exact names as defined here, or you can change the names in the constants below to match your macro names.
const macroLevelUp = "TriggerLevelUp";
const macroLevelDown = "TriggerLevelDown";

// textDictionary is used for an simple type of localization
const textDictionary = {
    dialogTitle: "Charakter Management",
    btnClose: "Schließen",
    level: "Level",
    xp: "XP",
    insufficientXP: "Nicht genug XP für den nächsten Level",
    selectSpecies: "Spezies wählen",
    selectBackground: "Hintergrund wählen",
    levelUp: "Level Aufstieg",
    levelDown: "Level Abstieg",
    errorNoActor: "Kein Actor ausgewählt. Bitte wähle einen Actor aus bevor du das Makro ausführst.",
    errorMissingMacro: "Makro nicht gefunden. Bitte stell sicher dass das benötigte Makro vorhanden ist oder passe den Namen des Makros an."
}

if (scope?.playerId) {
    if (scope?.playerId !== game.userId) {
        return;
    }
}
const actorId = scope?.actorId || game.canvas.tokens.controlled[0]?.actor?.id;
if (actorId) {
    const actor = game.actors.get(actorId);
    let action = "main";
    while (true) {
        let breakLoop = false;
        switch (action) {
            case "main":
                action = await showDashboard(actor);
                break;
            case "levelUp":
                await game.macros.getName("TriggerLevelUp").execute();
                action = "close";
                break;
            case "levelDown":
                await game.macros.getName("TriggerLevelDown").execute();
                action = "close";
                break;
            case "selectSpecies":
                await selectSpecies(actor);
                action = "main";
                break;
            case "selectBackground":
                await selectBackground(actor);
                action = "main";
                break;
            case "close":
            default:
                breakLoop = true;
        }
        if (breakLoop) { break; }
    }

} else {
    ui.notifications.warn(textDictionary.errorNoActor);
}

return;
// End of Code execution from here, rest is function definitions

async function showDashboard(actor) {
    const hasSpecies = actor.items.some(i => i.type === "race");
    const hasBackground = actor.items.some(i => i.type === "background");
    const currentLevel = actor.system.details.level;
    const currentXP = actor.system.details.xp.value;

    const nextLevelXP = (currentLevel == 0) ? 0 : actor.system.details.xp.max;
    const canLevelUp = currentXP >= nextLevelXP && currentLevel < 20;

    let dialogContent = `
    <div style="text-align: center; font-family: sans-serif;">
        <h2>${actor.name} (${textDictionary.level} ${currentLevel})</h2>
        <p>${textDictionary.xp}: <b>${currentXP}</b> / ${nextLevelXP > 0 ? nextLevelXP : "MAX"}</p>
        <hr>
        <div style="display: flex; flex-direction: column; gap: 8px;">
    `;

    if (!hasSpecies) {
        dialogContent += `<button data-action="selectSpecies" style="background: #4a6176; color: white;">🧬 ${textDictionary.selectSpecies}</button>`;
    }
    if (!hasBackground) {
        dialogContent += `<button data-action="selectBackground" style="background: #4a6176; color: white;">📜 ${textDictionary.selectBackground}</button>`;
    }

    dialogContent += `
        <div style="display: flex; gap: 4px; margin-top: 10px;">
            ${allowLevelDown ? `<button data-action="levelDown" style="flex: 1;">⬇️ ${textDictionary.levelDown}</button>` : ''}
            <button data-action="levelUp" style="flex: 1;" ${!canLevelUp ? 'disabled title="' + textDictionary.insufficientXP + '"' : ''}>⬆️ ${textDictionary.levelUp}</button>
        </div>
        </div>
    </div>
    <br>`;

    let dialogResult = new Promise(resolve => {
        const d = new Dialog({
            title: `${textDictionary.dialogTitle}: ${actor.name}`,
            content: dialogContent,
            buttons: {
                close: { label: textDictionary.btnClose, callback: () => resolve("close") }
            },
            render: html => {
                html.on("click", "button", async (event) => {
                    const action = event.currentTarget.dataset.action;
                    resolve(action);
                    d.close();
                });
            }
        }, { width: 350 });
        
        d.render(true);
    });
    return await dialogResult;
}

async function triggerLevelUp(actor) {
    const macro = game.macros.getName(macroLevelUp);
    if (macro) {
        await macro.execute( { actorId: actor.id } );
    } else {
        ui.notifications.warn(`${macroLevelUp} ${textDictionary.errorMissingMacro}`);
    }
}

async function triggerLevelDown(actor) {
    const macro = game.macros.getName(macroLevelDown);
    if (macro) {
        await macro.execute( { actorId: actor.id } );
    } else {
        ui.notifications.warn(`${macroLevelDown} ${textDictionary.errorMissingMacro}`);
    }
}

async function selectSpecies(actor) {
    const selectedUuid = await game.dnd5e.applications.CompendiumBrowser.selectOne({
        tab: "races"
    });

    if (selectedUuid) {
        const item = await fromUuid(selectedUuid);
        const itemData = item.toObject();
        const manager = await game.dnd5e.applications.advancement.AdvancementManager.forNewItem(actor, itemData);
        if (manager) {
            await manager.render(true);
            ui.notifications.info(`${textDictionary.selectSpecies} ${item.name} hinzugefügt.`);
        } else {
            ui.notifications.error("Advancement Manager konnte nicht gestartet werden.");
        }
    }
}

async function selectBackground(actor) {
    Dialog.prompt({
        title: textDictionary.selectBackground,
        content: `<p>Diese Funktion ist noch nicht implementiert.</p>`,
    });
}
