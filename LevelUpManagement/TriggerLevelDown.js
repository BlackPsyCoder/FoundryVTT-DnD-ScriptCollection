/// <reference path="../PlayerManager.js" />

// ** LiesMich **
// Dieses Skript kann verwendet werden um bei einem Actor ein LevelDown Auszulösen.
// Das Skript ist darauf Ausgelegt das es von einem Anderen Skript Ausgeöst werden kann

// ** ReadMe **
// This script can be used to trigger a level down for an actor.
// The script is designed to be triggered by another script, such as PlayerManager.js. When using it with PlayerManager.js, make sure to adjust the name of this script in PlayerManager.js accordingly.

const textDictionary = GetTranslationDictionary(game.i18n.lang);

function GetTranslationDictionary(lang) {
    let dictionary = {};
    switch (lang) {
        case "de":
            dictionary = {
                dialogTitle: "Level-Abstieg",
                level: "Level",
                removeClass: "Klasse entfernen",
                reduceClass: "Klassen Level reduzieren",
                chooseClass: "Wähle die Klasse, die um ein Level reduziert werden soll",
                warningNoClasses: " besitzt keine Klassen für einen Level-Abstieg.",
                warningLevelDownTitle: "ACHTUNG",
                warningLevelDownContent: `Das Verringern von Klassenleveln oder das Entfernen einer Klasse <b>löscht unwiderruflich</b> folgende Abhängigkeiten:`,
                warningLevelDownList: [
                    "Klassenmerkmale (Features)",
                    "Talente (Feats)",
                    "Trefferwürfel & Trefferpunkte",
                    "Zauberplätze & Klassenspezifische Auswahlen"
                ],
                errorNoActor: "Kein Actor ausgewählt. Bitte wähle einen Actor aus bevor du das Makro ausführst.",
            };
            break;
        case "es":
            dictionary = {
                dialogTitle: "Nivel Abajo",
                level: "Nivel",
                removeClass: "Eliminar Clase",
                reduceClass: "Reducir Nivel de Clase",
                chooseClass: "Elige la clase para reducir un nivel",
                warningNoClasses: " no tiene clases disponibles para un descenso de nivel.",
                warningLevelDownTitle: "ADVERTENCIA",
                warningLevelDownContent: `Reducir niveles de clase o eliminar una clase <b>elimina irreversiblemente</b> las siguientes dependencias:`,
                warningLevelDownList: [
                    "Características de Clase",
                    "Talentos",
                    "Dados de Golpe & Puntos de Golpe",
                    "Espacios de Hechizos & Opciones Específicas de Clase"
                ],
                errorNoActor: "No se ha seleccionado ningún actor. Por favor, elige un actor antes de ejecutar el macro.",
            };
            break;
        case "it":
            dictionary = {
                dialogTitle: "Livello Giù",
                level: "Livello",
                removeClass: "Rimuovi Classe",
                reduceClass: "Riduci Livello Classe",
                chooseClass: "Scegli la classe da ridurre di un livello",
                warningNoClasses: " non ha classi disponibili per un calo di livello.",
                warningLevelDownTitle: "AVVISO",
                warningLevelDownContent: `Ridurre i livelli di classe o rimuovere una classe <b>elimina irreversibilmente</b> le seguenti dipendenze:`,
                warningLevelDownList: [
                    "Caratteristiche di Classe",
                    "Talenti",
                    "Dadi di Colpo & Punti di Colpo",
                    "Slot di Magia & Scelte Specifiche di Classe"
                ],
                errorNoActor: "Nessun attore selezionato. Per favore, scegli un attore prima di eseguire il macro.",
            };
            break;
        case "fr":
            dictionary = {
                dialogTitle: "Niveau en moins",
                level: "Niveau",
                removeClass: "Supprimer Classe",
                reduceClass: "Réduire Niveau de Classe",
                chooseClass: "Choisissez la classe à réduire d'un niveau",
                warningNoClasses: " n'a pas de classes disponibles pour une réduction de niveau.",
                warningLevelDownTitle: "AVERTISSEMENT",
                warningLevelDownContent: `Réduire les niveaux de classe ou supprimer une classe <b>supprime irréversiblement</b> les dépendances suivantes :`,
                warningLevelDownList: [
                    "Caractéristiques de Classe",
                    "Atouts",
                    "Dés de Toucher & Points de Vie",
                    "Emplacements de Sortileges & Choix Spécifiques de Classe"
                ],
                errorNoActor: "Aucun acteur sélectionné. Veuillez choisir un acteur avant d'exécuter le macro.",
            };
            break;
        case "en":
        default:
            dictionary = {
                dialogTitle: "Level Down",
                level: "Level",
                removeClass: "Remove Class",
                reduceClass: "Reduce Class Level",
                chooseClass: "Choose the class to reduce by one level",
                warningNoClasses: " has no classes available for a level down.",
                warningLevelDownTitle: "WARNING",
                warningLevelDownContent: `Reducing class levels or removing a class <b>irreversably deletes</b> the following dependencies:`,
                warningLevelDownList: [
                    "Class Features",
                    "Feats",
                    "Hit Dice & Hit Points",
                    "Spell Slots & Class-Specific Choices"
                ],
                errorNoActor: "Kein Actor ausgewählt. Bitte wähle einen Actor aus bevor du das Makro ausführst.",
            };
            break;
    }
    return dictionary;
}

// End of the area of easily customizable variables, adjustments in the rest of the script should be made with caution as they may affect functionality
/*
    ______ _            _   ______          _____           _           
    | ___ \ |          | |  | ___ \        /  __ \         | |          
    | |_/ / | __ _  ___| | _| |_/ /__ _   _| /  \/ ___   __| | ___ _ __ 
    | ___ \ |/ _` |/ __| |/ /  __/ __| | | | |    / _ \ / _` |/ _ \ '__|
    | |_/ / | (_| | (__|   <| |  \__ \ |_| | \__/\ (_) | (_| |  __/ |   
    \____/|_|\__,_|\___|_|\_\_|  |___/\__, |\____/\___/ \__,_|\___|_|   
                                       __/ |                            
                                      |___/                             
*/


const actorId = scope?.actorId || game.canvas.tokens.controlled[0]?.actor?.id;

if (actorId) {
    levelDownProcess(game.actors.get(actorId));
} else {
    ui.notifications.warn(textDictionary.errorNoActor);
}

async function levelDownProcess(actor) {
    const classes = actor.items.filter(i => i.type === "class");
    const manager = game.dnd5e.applications.advancement.AdvancementManager;

    if (classes.length === 0) {
        return ui.notifications.info(`${actor.name} ${textDictionary.warningNoClasses}`);
    }

    let classButtons = {};
    for (const cls of classes) {
        const isLevelOne = cls.system.levels <= 1;

        classButtons[cls.id] = {
            label: isLevelOne
                ? `${cls.name} ${textDictionary.removeClass} (${textDictionary.level} 1 ➔ 0)`
                : `${cls.name} ${textDictionary.reduceClass} (${textDictionary.level} ${cls.system.levels} ➔ ${cls.system.levels - 1})`,
            icon: isLevelOne ? '<i class="fas fa-trash"></i>' : '<i class="fas fa-arrow-down"></i>',
            callback: async () => {
                let m;
                if (isLevelOne) {
                    m = await manager.forDeletedItem(actor, cls.id, { automaticApplication: true });
                } else {
                    m = await manager.forLevelChange(actor, cls.id, -1, { automaticApplication: true });
                }

                m.render(true);
            }
        };
    }

    // Erstellung des Warnhinweises im HTML-Content des Dialogs
    const dialogContent = `
        <div style="
            background: rgba(255, 0, 0, 0.1); 
            border: 1px solid #ff0000; 
            padding: 10px; 
            border-radius: 5px; 
            margin-bottom: 15px;
            color: #4a0000;
        ">
            <h3 style="margin-top: 0; color: #8b0000;"><i class="fas fa-exclamation-triangle"></i> ${textDictionary.warningTitle}</h3>
            <p>${textDictionary.warningRelatedContent}</p>
            <ul>
                ${textDictionary.warningLevelDownList.map(item => `<li>${item}</li>`).join("")}
            </ul>
        </div>
        <p style="text-align:center"> ${textDictionary.chooseClass}</p>
    `;

    new Dialog({
        title: `${textDictionary.levelDownTitle}: ${actor.name}`,
        content: dialogContent,
        buttons: classButtons
    }).render(true);
}
