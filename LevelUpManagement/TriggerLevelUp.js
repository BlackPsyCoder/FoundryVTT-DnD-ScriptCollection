// ** LiesMich **
// Dieses Skript kann verwendet werden um bei einem Actor ein LevelUp Auszulösen.
// Das Skript ist darauf Ausgelegt das es von einem Anderen Skript Ausgeöst werden kann, Verwendet man das PlayerManager.js Skript muss man sicherstrellen das der Name dieses Skriptes im PlayerManager.js angepasst wird.
// Beim Aufleveln kann man entscheiden ob man die Stufe einer Vorhandenen Klasse erhöht oder eine neue Klasse hinzufügt (Multiclass).
//
// ** ReadMe **
// This script can be used to trigger a level up for an actor.
// When leveling up, you can choose whether to increase the level of an existing class or add a new class (multiclass).
if (scope?.playerId) {
    if (scope?.playerId !== game.userId) {
        return;
    }
}
const actorId = scope?.actorId || game.canvas.tokens.controlled[0]?.actor?.id;
if (actorId) {
    levelUpProcess(game.actors.get(actorId));
} else {
    ui.notifications.warn("Kein Actor ausgewählt oder übergeben. Bitte wähle einen Actor aus oder übergebe die Actor ID.");
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
            // Wir nutzen hier automaticApplication: true für einen flüssigen Ablauf
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
                
                // WICHTIG: Wir übergeben automaticApplication: true in den Optionen
                const m = await manager.forLevelChange(actor, cls.id, 1, { 
                    automaticApplication: true 
                });

                if (m) {
                    // Falls der Manager Schritte hat, rendern wir ihn.
                    // Falls nicht (steps leer), wird durch automaticApplication 
                    // der Prozess oft direkt beim Rendern ohne Crash abgeschlossen.
                    if (m.steps && m.steps.length > 0) {
                        m.render(true);
                    } else {
                        // Falls wirklich gar nichts zu tun ist:
                        ui.notifications.info("Keine manuellen Änderungen für dieses Level erforderlich.");
                        // Da wir kein m.apply() haben, rendern wir kurz, 
                        // der Manager schließt sich bei 0 Steps meist sofort selbst.
                        m.render(true); 
                    }
                }
            }
        };
    }

    classButtons["newClass"] = {
        icon: '<i class="fas fa-plus"></i>',
        label: "Neue Klasse (Multiclass)",
        callback: async () => await addNewClass()
    };

    new Dialog({
        title: `Levelaufstieg: ${actor.name}`,
        content: `<p style="text-align:center">Wähle eine Klasse für Level ${actor.system.details.level + 1}</p>`,
        buttons: classButtons,
        default: "newClass"
    }).render(true);
}
