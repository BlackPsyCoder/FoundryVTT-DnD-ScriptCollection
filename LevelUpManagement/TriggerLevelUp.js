// ** LiesMich **
// Dieses Skript kann verwendet werden um bei einem Actor ein LevelUp Auszulösen.
// Das Skript ist darauf Ausgelegt das es von einem Anderen Skript Ausgeöst werden kann, Verwendet man das PlayerManager.js Skript muss man sicherstrellen das der Name dieses Skriptes im PlayerManager.js angepasst wird.
// Beim Aufleveln kann man entscheiden ob man die Stufe einer Vorhandenen Klasse erhöht oder eine neue Klasse hinzufügt (Multiclass).
//
// ** ReadMe **
// This script can be used to trigger a level up for an actor.
// When leveling up, you can choose whether to increase the level of an existing class or add a new class (multiclass).

const textDictionary = GetTranslationDictionary(game.i18n.lang);


function GetTranslationDictionary(lang) {
    let dictionary = {};
    switch (lang) {
        case "de":
            dictionary = {
                dialogTitle: "Levelaufstieg",
                errorNoActor: "Kein Actor ausgewählt. Bitte wähle einen Actor aus.",
                chooseClass: "Wähle eine Klasse für das Level up",
                newClass: "Neue Klasse (Multiclass)",
            };
            break;
        case "es":
            dictionary = {
                dialogTitle: "Subida de nivel",
                errorNoActor: "No se ha seleccionado ningún actor. Por favor, selecciona un actor.",
                chooseClass: "Elige una clase para el nivel",
                newClass: "Nueva clase (Multiclase)",
            };
            break;
        case "it":
            dictionary = {
                dialogTitle: "Salto di livello",
                errorNoActor: "Nessun attore selezionato. Per favore, seleziona un attore.",
                chooseClass: "Scegli una classe per il livello",
                newClass: "Nuova classe (Multiclasse)",
            };
            break;
        case "fr":
            dictionary = {
                dialogTitle: "Augmentation de niveau",
                errorNoActor: "Aucun acteur sélectionné. Veuillez sélectionner un acteur.",
                chooseClass: "Choisissez une classe pour le niveau",
                newClass: "Nouvelle classe (Multiclasse)",
            };
            break;
        case "en":
        default:
            dictionary = {
                dialogTitle: "Level Up",
                errorNoActor: "No actor selected. Please select an actor.",
                chooseClass: "Choose a class for level up",
                newClass: "New Class (Multiclass)",
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
    levelUpProcess(game.actors.get(actorId));
} else {
    ui.notifications.warn(textDictionary.errorNoActor);
}

async function levelUpProcess(actor) {
    const classes = actor.items.filter(i => i.type === "class");
    const manager = game.dnd5e.applications.advancement.AdvancementManager;
    const browser = game.dnd5e.applications.compendiumBrowser;

    const addNewClass = async () => {
        const classUuid = await browser.selectOne({
            tab: "classes",
            filters: { locked: { types: new Set(["class"]) } }
        });

        if (classUuid) {
            const item = await fromUuid(classUuid);
            const m = await manager.forNewItem(actor, item.toObject(), { automaticApplication: true });
            return m.render(true);
        }
    };

    if (classes.length === 0) return addNewClass();

    let classButtons = {};
    for (const cls of classes) {
        classButtons[cls.id] = {
            label: `${cls.name} (${cls.system.levels} ➔ ${cls.system.levels + 1})`,
            callback: async () => {
                const nextLevel = cls.system.levels + 1;

                const m = await manager.forLevelChange(actor, cls.id, 1, {
                    automaticApplication: true
                });

                m.render(true);
            }
        };
    }

    classButtons["newClass"] = {
        icon: '<i class="fas fa-plus"></i>',
        label: textDictionary.newClass,
        callback: async () => await addNewClass()
    };

    new Dialog({
        title: `Levelaufstieg: ${actor.name}`,
        content: `<p style="text-align:center">${textDictionary.chooseClass} (${actor.system.details.level + 1})</p>`,
        buttons: classButtons,
        default: "newClass"
    }).render(true);
}
