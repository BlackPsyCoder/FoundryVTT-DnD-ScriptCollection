/// <reference path="../PlayerManager.js" />

// ** LiesMich **
// Dieses Skript kann verwendet werden um bei einem Actor ein LevelDown Auszulösen.
// Das Skript ist darauf Ausgelegt das es von einem Anderen Skript Ausgeöst werden kann

// ** ReadMe **
// This script can be used to trigger a level down for an actor.
// The script is designed to be triggered by another script, such as PlayerManager.js. When using it with PlayerManager.js, make sure to adjust the name of this script in PlayerManager.js accordingly.


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
    ui.notifications.warn("Kein Actor ausgewählt. Bitte wähle einen Actor aus bevor du das Makro ausführst.");
}

async function levelDownProcess(actor) {
    const classes = actor.items.filter(i => i.type === "class");
    const manager = game.dnd5e.applications.advancement.AdvancementManager;

    if (classes.length === 0) {
        return ui.notifications.info(`${actor.name} besitzt keine Klassen für einen Level-Abstieg.`);
    }

    let classButtons = {};
    for (const cls of classes) {
        const isLevelOne = cls.system.levels <= 1;
        
        classButtons[cls.id] = {
            label: isLevelOne 
                ? `${cls.name} entfernen (Level 1 ➔ 0)` 
                : `${cls.name} reduzieren (${cls.system.levels} ➔ ${cls.system.levels - 1})`,
            icon: isLevelOne ? '<i class="fas fa-trash"></i>' : '<i class="fas fa-arrow-down"></i>',
            callback: async () => {
                let m;
                if (isLevelOne) {
                    m = await manager.forDeletedItem(actor, cls.id, { automaticApplication: true });
                } else {
                    m = await manager.forLevelChange(actor, cls.id, -1, { automaticApplication: true });
                }

                if (m) {
                    if (m.steps && m.steps.length > 0) {
                        m.render(true);
                    } else {
                        ui.notifications.info("Level-Abstieg wurde verarbeitet.");
                        m.render(true); 
                    }
                }
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
            <h3 style="margin-top: 0; color: #8b0000;"><i class="fas fa-exclamation-triangle"></i> ACHTUNG</h3>
            <p>Das Verringern von Klassenleveln oder das Entfernen einer Klasse <b>löscht unwiderruflich</b> alle damit verbundenen:</p>
            <ul>
                <li>Klassenmerkmale (Features)</li>
                <li>Talente (Feats)</li>
                <li>Trefferwürfel & Trefferpunkte</li>
                <li>Zauberplätze & Klassenspezifische Auswahlen</li>
            </ul>
        </div>
        <p style="text-align:center">Wähle die Klasse, die ein Level verlieren soll:</p>
    `;

    new Dialog({
        title: `Level-Abstieg: ${actor.name}`,
        content: dialogContent,
        buttons: classButtons
    }).render(true);
}
