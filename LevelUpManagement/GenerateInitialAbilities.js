/** GenerateInitialAbilities
 * ---- LiesMich ---- 
 * Dieses Makro sollte die Initiale Verteilung der Attribute über die gänigen in DnD verwendeten Methoden ermöglichen.
 * Der Gewählte Actor bekommt die festgelegten werte nach der Verteilung nach wunsch entweder direkt zugeordnet oder als ein Item mit Passiven Effekt der die Attribute entspechend erhöht.   
 */

const textDictionary = GetTranslationDictionary(game.i18n.lang || "en");

function GetTranslationDictionary(lang) {
  let dictionary = {};

  switch (lang) {
    case "de":
      dictionary = {
        dialogTitle: "Start Attribute",
        standardArray: "Standart Verteilung",
        pointBuy: "Punkte Verteilung",
        rollAttributes: "Attribute Auswürfeln",
        chooseMethodDescription: "Wähle eine Methode zur Generierung deiner Attribute",
        current: "Aktuell",
        btnContinue: "Weiter",
        btnSave: "Speichern",
        btnCancel: "Abbrechen",
        abilityRoll: "Attributswurf",
        abilitySTR: "STÄ",
        abilitySTRLong: "Stärke",
        abilityDEX: "GES",
        abilityDEXLong: "Geschick",
        abilityCON: "KON",
        abilityCONLong: "Konstitution",
        abilityINT: "INT",
        abilityINTLong: "Intelligenz",
        abilityWIS: "WEI",
        abilityWISLong: "Weisheit",
        abilityCHA: "CHA",
        abilityCHALong: "Charisma",
        disributionDescription: "Ziehe die Werte auf die entsprechenden Attribute",
        disributionWarning: "Bitte alle Werte verteilen",
        errorNoActor: "Kein Actor ausgewählt. Bitte wähle vor dem ausführen des Makros einen Actor aus.",
        baseAttributeTitle: "Basis Attribute"
      }
      break;
  }

  return dictionary;
}

const abilities = [
  { id: "str", short: textDictionary.abilitySTR, long: textDictionary.abilitySTRLong },
  { id: "dex", short: textDictionary.abilityDEX, long: textDictionary.abilityDEXLong },
  { id: "con", short: textDictionary.abilityCON, long: textDictionary.abilityCONLong },
  { id: "int", short: textDictionary.abilityINT, long: textDictionary.abilityINTLong },
  { id: "wis", short: textDictionary.abilityWIS, long: textDictionary.abilityWISLong },
  { id: "cha", short: textDictionary.abilityCHA, long: textDictionary.abilityCHALong },
];

const DIALOG_CLASSES = {
  distributeDialog: {
    attrContainer: "attr-container",
    attrGrid: "attr-grid",
    attrCard: "attr-card",
    attrLabel: "attr-label",
    attrValue: "attr-value",
    attrPreview: "attr-preview",
    dropZone: "drop-zone",
    poolZone: "pool-zone",
  }
};

const DIALOG_STYLES = {
  distributeDialog: `<style>
    .dnd-container { display: flex; flex-direction: column; gap: 15px; }
    .pool-zone { display: flex; flex-wrap: wrap; gap: 8px; padding: 15px; border: 2px dashed #7a7971; background: rgba(0,0,0,0.1); min-height: 50px; justify-content: center; align-items: center; }
    .attr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .attr-card { display: flex; flex-direction: column; align-items: center; background: rgba(0,0,0,0.05); padding: 8px; border: 1px solid #7a7971; border-radius: 5px; }
    .attr-label { font-weight: bold; margin-bottom: 5px; font-size: 0.9em; text-transform: uppercase; border-bottom: 1px solid #7a7971; width: 100%; text-align: center; }
    .drop-zone { width: 100%; height: 45px; border: 2px inset #4b4a44; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; margin: 5px 0; }
    .attr-value { cursor: grab; background: #4b4a44; color: white; padding: 5px 12px; border-radius: 3px; font-weight: bold; font-size: 1.2em; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
    .attr-preview { font-size: 0.75em; color: #444; }
    .drop-zone.drag-over { background: rgba(255, 100, 0, 0.2); border-color: #ff6400; }
  </style>`
};

const actorId = scope?.actorId || game.canvas.tokens.controlled[0]?.actor?.id;
if (actorId) {
  StartGenerateAttributeDialog(game.actors.get(actorId));
} else {
  ui.notifications.warn(textDictionary.errorNoActor);
}
// END OF CODE Von hier an kommen nur mehr Funktionsdefinitionen

async function StartGenerateAttributeDialog(actor) {

  const method = await chooseMethod();
  if (!method) return false;
  let success = false;
  if (method === "standard") {
    success = await showDistributionDialog(actor, textDictionary.standardArray, [15, 14, 13, 12, 10, 8]);
  } else if (method === "roll") {
    const values = await RollAttributes();
    success = await showDistributionDialog(actor, textDictionary.rollAttributes, values);
  } else if (method === "pointBuy") {
    success = await showPointBuyDialog();
  }

  return success;
}

function chooseMethod() {
  return new Promise((resolve) => {
    new Dialog({
      title: textDictionary.dialogTitle,
      content: `<p style="text-align: center; margin-bottom: 10px;">${textDictionary.chooseMethodDescription}</p>`,
      buttons: {
        standard: {
          icon: '<i class="fas fa-list-ol"></i>',
          label: textDictionary.standardArray,
          callback: () => resolve("standard"),
        },
        pointBuy: {
          icon: '<i class="fas fa-calculator"></i>',
          label: textDictionary.pointBuy,
          callback: () => resolve("pointBuy"),
        },
        roll: {
          icon: '<i class="fas fa-dice"></i>',
          label: textDictionary.rollAttributes,
          callback: () => resolve("roll"),
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: textDictionary.btnCancel,
          callback: () => resolve(false),
        },
      },
      default: "standard",
      close: () => resolve(false)
    }).render(true);
  });
}

async function RollAttributes() {
  const isDSN = game.modules.get("dice-so-nice")?.active;
  const values = [];

  for (let i = 0; i < 6; i++) {
    let r = new Roll("4d6kh3");
    await r.evaluate();
    let rollOptions = {};
    if (isDSN) {
      const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      r.options.appearance = {
        colorset: "custom",
        foreground: "#ffffff",
        background: randomColor,
        outline: "#000000",
        texture: "none"
      };
    }

    await r.toMessage({ flavor: `${textDictionary.rollAttributes} (${i + 1}/6)` }, rollOptions);
    values.push(r.total);

    if (i === 2) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  await new Promise(resolve => setTimeout(resolve, 4000));
  return values;
}

async function showDistributionDialog(actor, title, values) {
  return new Promise((resolve) => {
    let valuesHtml = values.map((v, i) =>
      `<div class="${DIALOG_CLASSES.distributeDialog.attrValue}" draggable="true" data-value="${v}" id="val-${i}">${v}</div>`
    ).join("");

    const gridHtml = abilities.map(a => `
        <div class="${DIALOG_CLASSES.distributeDialog.attrCard}">
          <label class="${DIALOG_CLASSES.distributeDialog.attrLabel}">${a.long}</label>
          <div class="${DIALOG_CLASSES.distributeDialog.dropZone}" data-ability="${a.id}"></div>
          <div class="${DIALOG_CLASSES.distributeDialog.attrPreview}" id="preview-${a.id}">
            ${textDictionary.current}: <strong>${actor.system.abilities[a.id].value}</strong>
          </div>
        </div>`).join("");

    const content = `
        ${DIALOG_STYLES.distributeDialog}

        <div class="${DIALOG_CLASSES.distributeDialog.attrContainer}">
          <div class="${DIALOG_CLASSES.distributeDialog.poolZone}" id="pool">${valuesHtml}</div>
          <div class="${DIALOG_CLASSES.distributeDialog.attrGrid}">${gridHtml}</div>
        </div>`;

    const d = new Dialog({
      title: title,
      content: content,
      buttons: {
        save: {
          icon: '<i class="fas fa-save"></i>',
          label: textDictionary.btnSave,
          callback: (html) => {
            let results = {};
            const attributeSlots = html.find(`.${DIALOG_CLASSES.distributeDialog.dropZone}`);

            let complete = true;
            attributeSlots.each((i, el) => {
              const val = $(el).find(`.${DIALOG_CLASSES.distributeDialog.attrValue}`).data('value');
              if (!val) complete = false;
              results[$(el).data('ability')] = val;
            })

            if (!complete) {
              ui.notifications.warn(`${textDictionary.disributionWarning}!`);
              return false;
            }

            resolve(true);
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: textDictionary.btnCancel,
          callback: () => resolve(false)
        }
      },
      default: "save",
      close: () => resolve(false),
      render: (html) => {
        const pool = html.find('#pool');

        html.find(`.${DIALOG_CLASSES.distributeDialog.attrValue}`).on('dragstart', (ev) => {
          ev.originalEvent.dataTransfer.setData("text/plain", ev.target.id);
        });

        const dropZones = html.find(`.${DIALOG_CLASSES.distributeDialog.dropZone}, #pool`);
        dropZones.on('dragover', (ev) => {
          ev.preventDefault();
          $(ev.currentTarget).addClass('drag-over');
        });
        dropZones.on('dragleave', (ev) => {
          $(ev.currentTarget).removeClass('drag-over');
        });
        dropZones.on('drop', (ev) => {
          const target = $(ev.currentTarget);
          target.removeClass('drag-over');

          const id = ev.originalEvent.dataTransfer.getData("text/plain");
          const draggedElem = html.find(`#${id}`);

          if (target.hasClass(DIALOG_CLASSES.distributeDialog.dropZone)) {
            const existing = target.find(`.${DIALOG_CLASSES.distributeDialog.attrValue}`);
            if (existing.length > 0) {
              pool.append(existing);
            }
            target.append(draggedElem);
          } else {
            target.append(draggedElem);
          }
        });
      }
    });

    d.render(true);
  });
}

function showPointBuyDialog() {
  return false;
}

function getMod(value) { return Math.floor((value - 10) / 2); };
