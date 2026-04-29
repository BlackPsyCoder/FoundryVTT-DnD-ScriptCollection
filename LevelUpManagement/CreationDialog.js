/**
 * CHARACTER MANAGEMENT DASHBOARD
 */

// Set Allow Level Down to true if you want to enable the level down functionality in the dashboard.
const allowLevelDown = false;

// Macros for Level Up and Level Down Logic must be created with the exact names as defined here, or you can change the names in the constants below to match your macro names.
const macroLevelUp = "TriggerLevelUp";
const macroLevelDown = "TriggerLevelDown";

// textDictionary is used for an simple type of localization
const textDictionary = GetTranslationDictionary(game.i18n.lang || "en");

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

// In this function is the translation of the Macro defined, you can add more Languages by adding another case with the according language code (e.g. "fr" for french) and translating the values in the dictionary.
// The languages were generated with an AI translator, if you find any mistakes, please creat an issue or even better, a pull request with the correction.
function GetTranslationDictionary(lang)
{
    let dictionary = {};
    switch (lang) {
        case "de":
            dictionary = {
                dialogTitle: "Charakter Management",
                btnClose: "Schließen",
                level: "Level",
                xp: "XP",
                insufficientXP: "Nicht genug XP für den nächsten Level",
                selectSpecies: "Spezies wählen",
                selectBackground: "Hintergrund wählen",
                levelUp: "Level Aufstieg",
                levelDown: "Level Abstieg",
                messageAborted: "Aktion abgebrochen",
                messageCompleted: "wurde abgeschlossen",
                errorNoActor: "Kein Actor ausgewählt. Bitte wähle einen Actor aus bevor du das Makro ausführst.",
                errorMissingMacro: "Makro nicht gefunden. Bitte stell sicher dass das benötigte Makro vorhanden ist oder passe den Namen des Makros an."
            };
            break;
        case "es":
            dictionary = {
                dialogTitle: "Gestión de Personajes",
                btnClose: "Cerrar",
                level: "Nivel",
                xp: "XP",
                insufficientXP: "No hay suficientes XP para el próximo nivel",
                selectSpecies: "Seleccionar Especie",
                selectBackground: "Seleccionar trasfondo",
                levelUp: "Subir de Nivel",
                levelDown: "Bajar de Nivel",
                messageAborted: "Acción cancelada",
                messageCompleted: "ha sido completada",
                errorNoActor: "No se ha seleccionado ningún actor. Por favor, selecciona un actor antes de ejecutar la macro.",
                errorMissingMacro: "Macro no encontrada. Por favor, asegúrate de que la macro requerida esté disponible o ajusta el nombre de la macro."
            };
            break;
        case "it":
            dictionary = {
                dialogTitle: "Gestione Personaggio",
                btnClose: "Chiudi",
                level: "Livello",
                xp: "XP",
                insufficientXP: "Non abbastanza XP per il prossimo livello",
                selectSpecies: "Seleziona Specie",
                selectBackground: "Seleziona Background",
                levelUp: "Salire di Livello",
                levelDown: "Scendere di Livello",
                messageAborted: "Azione annullata",
                messageCompleted: "è stata completata",
                errorNoActor: "Nessun attore selezionato. Seleziona un attore prima di eseguire la macro.",
                errorMissingMacro: "Macro non trovata. Assicurati che la macro necessaria sia disponibile o adatta il nome della macro."
            };
            break;
        case "fr":
            dictionary = {
                dialogTitle: "Gestion de Personnage",
                btnClose: "Fermer",
                level: "Niveau",
                xp: "XP",
                insufficientXP: "Pas assez de XP pour le prochain niveau",
                selectSpecies: "Sélectionner une Espèce",
                selectBackground: "Sélectionner un Arrière-plan",
                levelUp: "Monter en Niveau",
                levelDown: "Descendre en Niveau",
                messageAborted: "Action annulée",
                messageCompleted: "a été complétée",
                errorNoActor: "Aucun acteur sélectionné. Veuillez sélectionner un acteur avant d'exécuter la macro.",
                errorMissingMacro: "Macro non trouvée. Veuillez vous assurer que la macro requise est disponible ou ajustez le nom de la macro."
            };
            break;
        case "en":
        default:
            dictionary = {
                dialogTitle: "Character Management",
                btnClose: "Close",
                level: "Level",
                xp: "XP",
                insufficientXP: "Not enough XP for the next level",
                selectSpecies: "Select Species",
                selectBackground: "Select Background",
                levelUp: "Level Up",
                levelDown: "Level Down",
                messageAborted: "Action aborted",
                messageCompleted: "has been completed",
                errorNoActor: "No actor selected. Please select an actor before executing the macro.",
                errorMissingMacro: "Macro not found. Please ensure the required macro is available or adjust the macro name."
            };
    }
    return dictionary;
}

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

    if (!selectedUuid) {
        ui.notifications.info(`${textDictionary.selectSpecies} ${textDictionary.messageAborted}.`);
        return;
    }

    const item = await fromUuid(selectedUuid);
    const itemData = item.toObject();
    const manager = await game.dnd5e.applications.advancement.AdvancementManager.forNewItem(actor, itemData);
    if (!manager) {
        ui.notifications.error(textDictionary.errorAtAdvancementManager);
        return;
    }

    const waitFinish = waitForApplicationClose(manager);
    await manager.render(true);
    
    await waitFinish;
    ui.notifications.info(`${textDictionary.selectSpecies} ${item.name} ${textDictionary.messageCompleted}.`);
}

async function selectBackground(actor) {
    const selectedUuid = await game.dnd5e.applications.CompendiumBrowser.selectOne({
        tab: "backgrounds"
    });

    if (!selectedUuid) {
        ui.notifications.info(`${textDictionary.selectBackground} ${textDictionary.messageAborted}.`);
        return;
    }

    const item = await fromUuid(selectedUuid);
    const itemData = item.toObject();
    const manager = await game.dnd5e.applications.advancement.AdvancementManager.forNewItem(actor, itemData);
    if (!manager) {
        ui.notifications.error(textDictionary.errorAtAdvancementManager);
        return;
    }

    const waitFinish = waitForApplicationClose(manager);
    await manager.render(true);
    
    await waitFinish;
    ui.notifications.info(`${textDictionary.selectBackground} ${item.name} ${textDictionary.messageCompleted}.`);
}

async function waitForApplicationClose(app) {
    return new Promise(resolve => {
        app.addEventListener("close", () => {
            resolve();
        });
    });
}
