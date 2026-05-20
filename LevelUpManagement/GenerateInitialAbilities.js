/** GenerateInitialAbilities
 * ---- LiesMich ----
 *
 * Beschreibung:
 * Dieses Makro unterstützt die Erzeugung von Startwerten für Attribute in Foundry VTT
 * nach klassischen D&D-Methoden: Standard Array, Point Buy, manuelle Zuordnung und Würfeln.
 *
 * Funktion:
 * - Zeigt einen Auswahl-Dialog zur Methode der Attributgenerierung an.
 * - Erlaubt Zuordnung der Werte auf die sechs Grundattribute.
 * - Speichert das Ergebnis als passives Item mit aktiven Effekten auf den Actor.
 *
 * Hinweise:
 * - Die unterschiedlichen möglichkeiten zum Generieren der Attribute können deaktiviert werden.
 * - Übersetzungen und Texte werden in GetTranslationDictionary() verwaltet und können dort angepasst werden.
 *
 *  ---- Readme ----
 * Description:
 * This macro supports generating seed values for attributes in Foundry VTT
 * using classic D&D methods: standard array, point buy, manual assignment and dice rolling.
 *
 * Function:
 * - Displays a selection dialog for the method of attribute generation.
 * - Allows assignment of values ​​to the six basic attributes.
 * - Saves the result as a passive item with active effects on the actor.
 *
 *Notes:
 * - The different options for generating the attributes can be deactivated.
 * - Translations and texts are managed in GetTranslationDictionary() and can be adjusted there.
 */

// Choose allowed methods for Base Ability generation
// You can use !IsUserGM/() to allow this method only for gamemaster or secondarygamemaster users
const disableStandardArray = false;
const disableRollAttributes = false;
const disablePointBuy = false;
const disableManualMode = !IsUserGM();

// You can set this variable to true or false to choose between the dark or light theme; the IsDarkThemeUsed method attempts to set this based on the Foundry setting
const useDarkTheme = IsDarkThemeUsed();

// This function contains all the text used for the display.
// Here, you can edit the text as needed, and any errors in the translation can be corrected here. 
function GetTranslationDictionary(lang) {
  let dictionary = {};

  switch (lang) {
    case "de":
      dictionary = {
        dialogTitle: "Start Attribute",
        standardArray: "Standart Verteilung",
        pointBuy: "Punkte Verteilung",
        manualAllocation: "Manuelle Verteilung",
        rollAttributes: "Attribute Auswürfeln",
        warningBaseAttributeItemExisting: "Das vorhandene Basis-Attribute Merkmal wird ersetzt",
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
        baseAttributeTitle: "Basis Attribute",
        baseAttributeItemName: "Basis-Attribute",
        baseAttributeDescription: "Basis Attribute des Actors, generiert über die Methode ",
        pointBuyCost: "Kosten",
        pointBuyRemainig: "Verbleibend",
        pointBuySpendPoints: "Verbrauchte Punkte",
        messageSuccess: "Die Basis Attribute wurden erfolgreich zugeordnet.",
        messageSuccessActorItem: "erhielt das Merkmal",
      };
      break;
    case "es":
      dictionary = {
        dialogTitle: "Atributos Iniciales",
        standardArray: "Distribución Estándar",
        pointBuy: "Compra de Puntos",
        manualAllocation: "Asignación Manual",
        rollAttributes: "Tirar Atributos",
        warningBaseAttributeItemExisting: "La característica de atributos base existente será reemplazada",
        chooseMethodDescription: "Elige un método para generar tus atributos",
        current: "Actual",
        btnContinue: "Continuar",
        btnSave: "Guardar",
        btnCancel: "Cancelar",
        abilityRoll: "Tirada de Atributos",
        abilitySTR: "FOR",
        abilitySTRLong: "Fuerza",
        abilityDEX: "DES",
        abilityDEXLong: "Destreza",
        abilityCON: "CON",
        abilityCONLong: "Constitución",
        abilityINT: "INT",
        abilityINTLong: "Inteligencia",
        abilityWIS: "SAB",
        abilityWISLong: "Sabiduría",
        abilityCHA: "CAR",
        abilityCHALong: "Carisma",
        disributionDescription: "Aplica los valores a los atributos correspondientes",
        disributionWarning: "Por favor distribuye todos los valores",
        errorNoActor: "No hay actor seleccionado. Por favor selecciona un actor antes de ejecutar el macro.",
        baseAttributeTitle: "Atributos Base",
        baseAttributeItemName: "Atributos Base",
        baseAttributeDescription: "Atributos base del actor, generados mediante el método ",
        pointBuyCost: "Costo",
        pointBuyRemainig: "Restante",
        pointBuySpendPoints: "Puntos Gastados",
        messageSuccess: "Los atributos base se asignaron correctamente.",
        messageSuccessActorItem: "recibió la característica",
      };
      break;
    case "it":
      dictionary = {
        dialogTitle: "Attributi Iniziali",
        standardArray: "Distribuzione Standard",
        pointBuy: "Acquisto Punti",
        manualAllocation: "Assegnazione Manuale",
        rollAttributes: "Tira gli Attributi",
        warningBaseAttributeItemExisting: "La caratteristica Attributi Base esistente verrà sostituita",
        chooseMethodDescription: "Scegli un metodo per generare i tuoi attributi",
        current: "Attuale",
        btnContinue: "Continua",
        btnSave: "Salva",
        btnCancel: "Annulla",
        abilityRoll: "Tiro degli Attributi",
        abilitySTR: "FOR",
        abilitySTRLong: "Forza",
        abilityDEX: "DES",
        abilityDEXLong: "Destrezza",
        abilityCON: "COS",
        abilityCONLong: "Costituzione",
        abilityINT: "INT",
        abilityINTLong: "Intelligenza",
        abilityWIS: "SAG",
        abilityWISLong: "Saggezza",
        abilityCHA: "CAR",
        abilityCHALong: "Carisma",
        disributionDescription: "Applica i valori agli attributi corrispondenti",
        disributionWarning: "Per favore distribuisci tutti i valori",
        errorNoActor: "Nessun attore selezionato. Seleziona un attore prima di eseguire la macro.",
        baseAttributeTitle: "Attributi Base",
        baseAttributeItemName: "Attributi Base",
        baseAttributeDescription: "Attributi base dell'attore, generati tramite il metodo ",
        pointBuyCost: "Costo",
        pointBuyRemainig: "Rimanenti",
        pointBuySpendPoints: "Punti Spesi",
        messageSuccess: "Gli attributi base sono stati assegnati con successo.",
        messageSuccessActorItem: "ha ricevuto la caratteristica",
      };
      break;
    case "fr":
      dictionary = {
        dialogTitle: "Attributs de départ",
        standardArray: "Répartition standard",
        pointBuy: "Achat de points",
        manualAllocation: "Répartition manuelle",
        rollAttributes: "Lancer les attributs",
        warningBaseAttributeItemExisting: "La caractéristique Attributs de base existante sera remplacée",
        chooseMethodDescription: "Choisissez une méthode pour générer vos attributs",
        current: "Actuel",
        btnContinue: "Continuer",
        btnSave: "Enregistrer",
        btnCancel: "Annuler",
        abilityRoll: "Lancer d'attributs",
        abilitySTR: "FOR",
        abilitySTRLong: "Force",
        abilityDEX: "DEX",
        abilityDEXLong: "Dextérité",
        abilityCON: "CON",
        abilityCONLong: "Constitution",
        abilityINT: "INT",
        abilityINTLong: "Intelligence",
        abilityWIS: "SAG",
        abilityWISLong: "Sagesse",
        abilityCHA: "CHA",
        abilityCHALong: "Charisme",
        disributionDescription: "Appliquez les valeurs aux attributs correspondants",
        disributionWarning: "Veuillez distribuer toutes les valeurs",
        errorNoActor: "Aucun acteur sélectionné. Veuillez sélectionner un acteur avant d'exécuter la macro.",
        baseAttributeTitle: "Attributs de base",
        baseAttributeItemName: "Attributs de base",
        baseAttributeDescription: "Attributs de base de l'acteur, générés via la méthode ",
        pointBuyCost: "Coût",
        pointBuyRemainig: "Restant",
        pointBuySpendPoints: "Points dépensés",
        messageSuccess: "Les attributs de base ont été attribués avec succès.",
        messageSuccessActorItem: "a reçu la caractéristique",
      };
      break;
    case "en":
    default:
      dictionary = {
        dialogTitle: "Starting Attributes",
        standardArray: "Standard Array",
        pointBuy: "Point Buy",
        manualAllocation: "Manual Allocation",
        rollAttributes: "Roll Attributes",
        warningBaseAttributeItemExisting: "The existing Base-Attributes Feature will be replaced",
        chooseMethodDescription: "Choose a method to generate your attributes",
        current: "Current",
        btnContinue: "Continue",
        btnSave: "Save",
        btnCancel: "Cancel",
        abilityRoll: "Ability Roll",
        abilitySTR: "STR",
        abilitySTRLong: "Strength",
        abilityDEX: "DEX",
        abilityDEXLong: "Dexterity",
        abilityCON: "CON",
        abilityCONLong: "Constitution",
        abilityINT: "INT",
        abilityINTLong: "Intelligence",
        abilityWIS: "WIS",
        abilityWISLong: "Wisdom",
        abilityCHA: "CHA",
        abilityCHALong: "Charisma",
        disributionDescription: "Apply the values to the corresponding attributes",
        disributionWarning: "Please distribute all values",
        errorNoActor: "No actor selected. Please select an actor before running the macro.",
        baseAttributeTitle: "Base Attributes",
        baseAttributeItemName: "Base-Attributes",
        baseAttributeDescription: "Base Attributes of actor, generated via method ",
        pointBuyCost: "Cost",
        pointBuyRemainig: "Remaining",
        pointBuySpendPoints: "Spent Points",
        messageSuccess: "Base attributes were successfully assigned.",
        messageSuccessActorItem: "received the feature",
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

const textDictionary = GetTranslationDictionary(game.i18n.lang || "en");

const abilityItemId = "base-ability";

const classPresets = {
  artificer: { str: 8, dex: 14, con: 13, int: 15, wis: 10, cha: 12 },
  barbarian: { str: 15, dex: 13, con: 14, int: 10, wis: 12, cha: 8 },
  bard: { str: 8, dex: 14, con: 12, int: 13, wis: 10, cha: 15 },
  cleric: { str: 14, dex: 8, con: 13, int: 10, wis: 15, cha: 12 },
  druid: { str: 8, dex: 12, con: 14, int: 13, wis: 15, cha: 10 },
  fighter: { str: 15, dex: 14, con: 13, int: 8, wis: 10, cha: 12 },
  monk: { str: 12, dex: 15, con: 13, int: 10, wis: 14, cha: 8 },
  paladin: { str: 15, dex: 10, con: 13, int: 8, wis: 12, cha: 14 },
  ranger: { str: 12, dex: 15, con: 13, int: 8, wis: 14, cha: 10 },
  rogue: { str: 12, dex: 15, con: 13, int: 14, wis: 10, cha: 8 },
  sorcerer: { str: 10, dex: 13, con: 14, int: 8, wis: 12, cha: 15 },
  warlock: { str: 8, dex: 14, con: 13, int: 12, wis: 10, cha: 15 },
  wizard: { str: 8, dex: 12, con: 13, int: 15, wis: 14, cha: 10 },
}

const abilities = [
  { id: "str", short: textDictionary.abilitySTR, long: textDictionary.abilitySTRLong, preset: 0 },
  { id: "dex", short: textDictionary.abilityDEX, long: textDictionary.abilityDEXLong, preset: 0 },
  { id: "con", short: textDictionary.abilityCON, long: textDictionary.abilityCONLong, preset: 0 },
  { id: "int", short: textDictionary.abilityINT, long: textDictionary.abilityINTLong, preset: 0 },
  { id: "wis", short: textDictionary.abilityWIS, long: textDictionary.abilityWISLong, preset: 0 },
  { id: "cha", short: textDictionary.abilityCHA, long: textDictionary.abilityCHALong, preset: 0 },
];

const themeColors = {
  background: useDarkTheme ? "#00000070" : "#eeeeee70",
  border: useDarkTheme ? "#7a7971" : "#cccccc",
  text: useDarkTheme ? "#f0f0f0" : "#111111",
  secondaryText: useDarkTheme ? "#888888" : "#555555",
  statusBackground: useDarkTheme ? "#404040" : "#e0e0e0",
};

const DIALOG_CLASSES = {
  commonDialog: {
    root: "dialog-root",
    container: "dialog-container",
    card: "dialog-card",
    label: "dialog-label",
    preview: "dialog-preview",
    status: "dialog-status"
  },
  chooseMethodDialog: {
    root: "choose-method-dialog",
    message: "choose-method-message",
    warning: "choose-method-warning"
  },
  distributeDialog: {
    root: "distribute-dialog",
    attrGrid: "attr-grid",
    attrValue: "attr-value",
    dropZone: "drop-zone",
    poolZone: "pool-zone",
  },
  pointBuyDialog: {
    root: "pointbuy-dialog",
    pointsDisplay: "pb-points-display",
    buttonGroup: "pb-button-group",
    valueContainer: "pb-value-container",
    valueDisplay: "pb-value-display",
    costDisplay: "pb-cost-display",
    adjustButton: "pb-adjust-button",
    pointsRemaining: "pb-points-remaining",
    positive: "pb-positive",
    negative: "pb-negative"
  }
};

const DIALOG_STYLES = {
  commonDialog: `<style>
  .${DIALOG_CLASSES.commonDialog.root} {
    min-width: 550px;
  }
  .${DIALOG_CLASSES.commonDialog.root} .window-content {
    background: ${themeColors.background};
    color: ${themeColors.text};
    border: 1px solid ${themeColors.border};
  }
  .${DIALOG_CLASSES.commonDialog.root} button {
      background: ${themeColors.statusBackground};
      color: ${themeColors.text};
      border: 1px solid ${themeColors.border};
      margin: 5px;
  }
  .${DIALOG_CLASSES.commonDialog.container} { display: flex; flex-direction: column; gap: 15px; }
  .${DIALOG_CLASSES.commonDialog.card} { display: flex; flex-direction: column; align-items: center; background: ${themeColors.background}; padding: 8px; border: 1px solid ${themeColors.border}; border-radius: 5px; }
  .${DIALOG_CLASSES.commonDialog.label} { font-weight: bold; margin-bottom: 5px; font-size: 0.9em; text-transform: uppercase; border-bottom: 1px solid ${themeColors.border}; width: 100%; text-align: center; color: ${themeColors.text}; }
  .${DIALOG_CLASSES.commonDialog.preview} { font-size: 0.75em; color: ${themeColors.text}; }
  .${DIALOG_CLASSES.commonDialog.status} { text-align: center; padding: 10px; background: ${themeColors.statusBackground}; border-radius: 5px; color: ${themeColors.text}; }
  .${DIALOG_CLASSES.chooseMethodDialog.message} { text-align: center; margin-bottom: 10px; color: ${themeColors.text}; }
  .${DIALOG_CLASSES.chooseMethodDialog.warning} { text-align: center; margin-bottom: 10px; color: #ff6400; font-weight: bold; }
  </style>`,
  distributeDialog: `<style>
  .${DIALOG_CLASSES.distributeDialog.attrGrid} { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .${DIALOG_CLASSES.distributeDialog.poolZone} { display: flex; flex-wrap: wrap; gap: 8px; padding: 15px; border: 2px dashed ${themeColors.border}; background: ${themeColors.statusBackground}; min-height: 50px; justify-content: center; align-items: center; }
  .${DIALOG_CLASSES.distributeDialog.dropZone} { width: 100%; height: 45px; border: 2px inset ${themeColors.border}; background: ${themeColors.statusBackground}; display: flex; align-items: center; justify-content: center; margin: 5px 0; cursor: pointer; }
  .${DIALOG_CLASSES.distributeDialog.attrValue} { cursor: grab; background: #4b4a44; color: white; padding: 5px 12px; border-radius: 3px; font-weight: bold; font-size: 1.2em; box-shadow: 0 2px 4px rgba(0,0,0,0.3); transition: all 0.2s ease; }
  .${DIALOG_CLASSES.distributeDialog.attrValue}:hover { background: #5d5c56; }
  .${DIALOG_CLASSES.distributeDialog.attrValue}.selected { background: #ff6400; box-shadow: 0 0 8px rgba(255, 100, 0, 0.6); }
  .${DIALOG_CLASSES.distributeDialog.dropZone}.drag-over { background: rgba(255, 100, 0, 0.2); border-color: #ff6400; }
  .${DIALOG_CLASSES.distributeDialog.dropZone}.click-target { background: rgba(255, 100, 0, 0.3); border-color: #ff6400; border-style: solid; }
  </style>`,
  pointBuyDialog: `<style>
  .${DIALOG_CLASSES.pointBuyDialog.buttonGroup} { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 8px 0; }
  .${DIALOG_CLASSES.pointBuyDialog.adjustButton} { padding: 4px 8px; font-weight: bold; cursor: pointer; background: #4b4a44; color: white; border: 1px solid ${themeColors.border}; border-radius: 3px; }
  .${DIALOG_CLASSES.pointBuyDialog.adjustButton}:disabled { opacity: 0.5; cursor: not-allowed; }
  .${DIALOG_CLASSES.pointBuyDialog.adjustButton}:hover:not(:disabled) { background: #5d5c56; }
  .${DIALOG_CLASSES.pointBuyDialog.valueContainer} { min-width: 35px; text-align: center; }
  .${DIALOG_CLASSES.pointBuyDialog.valueDisplay} { font-weight: bold; font-size: 1.3em; }
  .${DIALOG_CLASSES.pointBuyDialog.costDisplay} { font-size: 0.75em; color: ${themeColors.secondaryText}; }
  .${DIALOG_CLASSES.pointBuyDialog.pointsDisplay} { text-align: center; padding: 10px; background: ${themeColors.statusBackground}; border-radius: 5px; color: ${themeColors.text}; }
  .${DIALOG_CLASSES.pointBuyDialog.pointsRemaining} { margin-top: 5px; }
  .${DIALOG_CLASSES.pointBuyDialog.positive} { color: #4caf50; }
  .${DIALOG_CLASSES.pointBuyDialog.negative} { color: #f44336; }
  </style>`
};

const POINT_BUY_COSTS = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
};

const actorId = scope?.actorId || game.canvas.tokens.controlled[0]?.actor?.id;
const classId = scope?.classId || null;
if (actorId) {
  StartGenerateAttributeDialog(game.actors.get(actorId), classId);
} else {
  ui.notifications.warn(textDictionary.errorNoActor);
}

return;
// END OF CODE execution, from here on there are only function definitions 

function IsUserGM() {
  const user = game?.user;
  if (!user) {
    return false;
  }
  if (user.isGM) {
    return true;
  }
  return false;
}

function IsDarkThemeUsed() {
  let theme = "dark";
  try {
    theme = game?.settings?.get?.("core", "uiConfig")?.colorScheme?.applications || theme;
  } catch (error) {
  }

  if (typeof theme !== "string") {
    return true;
  }

  theme = theme.toLowerCase();
  if (theme.includes("bright") || theme === "bright") return false;
  return true;
}

function ResetAbilityPresets() {
  abilities.forEach(a => a.preset = 0);
}

function GetActorAbilityValue(actor, abilityId) {
  return actor?.system?.abilities?.[abilityId]?.value ?? 0;
}

function LoadClassPreset(classId) {
  ResetAbilityPresets();
  if (!classId) {
    return;
  }
  const presets = classPresets[classId];
  if (!presets) {
    return;
  }
  abilities.forEach(a => {
    if (presets[a.id]) {
      a.preset = presets[a.id];
    }
  });
}

async function StartGenerateAttributeDialog(actor, classId) {
  let success = false;
  LoadClassPreset(classId);
  while (!success) {
    const method = await ChooseMethod(actor);
    if (!method) {
      return false;
    }

    const existingItem = actor.items.find(i => (i.identifier === abilityItemId));
    if (existingItem) {
      await existingItem.delete();
    }

    if (method === "standard") {
      success = await ShowDistributionDialog(actor, textDictionary.standardArray, [15, 14, 13, 12, 10, 8]);
    } else if (method === "roll") {
      const values = await RollAttributes();
      success = await ShowDistributionDialog(actor, textDictionary.rollAttributes, values);
    } else if (method === "pointBuy") {
      success = await ShowPointBuyDialog(actor, false);
    } else if (method === "manual") {
      success = await ShowPointBuyDialog(actor, true);
    }
  }

  return success;
}

function ChooseMethod(actor) {
  return new Promise((resolve) => {
    const existingItem = actor.items.find(i => (i.identifier === abilityItemId));
    const warningContent = existingItem
      ? `<p class="${DIALOG_CLASSES.chooseMethodDialog.warning}">⚠️ ${textDictionary.warningBaseAttributeItemExisting}!</p>`
      : '';

    const methodButtonsStyle = `<style>
      .method-buttons-grid { 
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        gap: 12px; 
        margin: 15px 0;
      }
      .method-button { 
        padding: 15px; 
        background: #4b4a44; 
        color: white; 
        border: 2px solid ${themeColors.border}; 
        border-radius: 5px; 
        cursor: pointer; 
        font-weight: bold; 
        font-size: 0.95em;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        transition: all 0.2s ease;
      }
      .method-button:hover { 
        background: #5d5c56; 
        border-color: #ff6400;
        transform: translateY(-2px);
      }
      .method-button i {
        font-size: 1.5em;
      }
    </style>`;

    const methodButtons =
      (disableStandardArray ? "" : `
      <button class="method-button" id="method-standard">
          <i class="fas fa-list-ol"></i>
          ${textDictionary.standardArray}
        </button>`) +
      (disableRollAttributes ? "" : `
      <button class="method-button" id="method-roll">
          <i class="fas fa-dice"></i>
          ${textDictionary.rollAttributes}
        </button>`) +
      (disablePointBuy ? "" : `
      <button class="method-button" id="method-pointbuy">
          <i class="fas fa-calculator"></i>
          ${textDictionary.pointBuy}
        </button>`) +
      (disableManualMode ? "" : `
      <button class="method-button" id="method-manual">
          <i class="fas fa-arrows-alt"></i>
          ${textDictionary.manualAllocation}
        </button>`)
      ;

    const content = `
      ${DIALOG_STYLES.commonDialog}
      ${methodButtonsStyle}
      <p class="${DIALOG_CLASSES.chooseMethodDialog.message}">${textDictionary.chooseMethodDescription}</p>
      ${warningContent}
      <div class="method-buttons-grid">
        ${methodButtons}
      </div>
    `;

    const dialog = new Dialog({
      title: textDictionary.dialogTitle,
      content: content,
      buttons: {
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: textDictionary.btnCancel,
          callback: () => resolve(false),
        },
      },
      default: "cancel",
      close: () => resolve(false),
      render: (html) => {
        html.find('#method-standard').on('click', () => {
          resolve("standard");
          dialog.close();
        });
        html.find('#method-pointbuy').on('click', () => {
          resolve("pointBuy");
          dialog.close();
        });
        html.find('#method-roll').on('click', () => {
          resolve("roll");
          dialog.close();
        });
        html.find('#method-manual').on('click', () => {
          resolve("manual");
          dialog.close();
        });
      }
    }, {
      classes: [DIALOG_CLASSES.commonDialog.root, DIALOG_CLASSES.chooseMethodDialog.root]
    });

    dialog.render(true);
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

async function ShowDistributionDialog(actor, title, values) {
  return new Promise((resolve) => {
    const sortedValues = [...values].sort((a, b) => b - a);
    const presetAssignments = {};

    const abilitiesWithPreset = abilities
      .filter(a => Number.isInteger(a.preset) && a.preset > 0)
      .sort((a, b) => b.preset - a.preset);

    const remainingValues = [...sortedValues];

    abilitiesWithPreset.forEach((ability) => {
      if (remainingValues.length > 0) {
        presetAssignments[ability.id] = remainingValues.shift();
      }
    });

    let valueId = 0;
    let valuesHtml = remainingValues.map((v, i) => {
      const uniqueId = `val-${valueId++}`;
      return `<div class="${DIALOG_CLASSES.distributeDialog.attrValue}" draggable="true" data-value="${v}" id="${uniqueId}">${v}</div>`;
    }).join("");

    const gridHtml = abilities.map(a => {
      const currentActorValue = GetActorAbilityValue(actor, a.id);
      const presetValue = presetAssignments[a.id];
      const previewText = presetValue
        ? `${textDictionary.current}: <strong>${currentActorValue}</strong> + ${presetValue - 10 >= 0 ? '+' : ''}${presetValue - 10} = <strong>${currentActorValue + presetValue - 10}</strong>`
        : `${textDictionary.current}: <strong>${currentActorValue}</strong>`;

      return `
        <div class="${DIALOG_CLASSES.commonDialog.card}">
          <label class="${DIALOG_CLASSES.commonDialog.label}">${a.long}</label>
          <div class="${DIALOG_CLASSES.distributeDialog.dropZone}" data-ability="${a.id}">
            ${presetValue ? `<div class="${DIALOG_CLASSES.distributeDialog.attrValue}" draggable="true" data-value="${presetValue}" id="val-preset-${a.id}">${presetValue}</div>` : ''}
          </div>
          <div class="${DIALOG_CLASSES.commonDialog.preview}" id="preview-${a.id}">
            ${previewText}
          </div>
        </div>`;
    }).join("");

    const content = `
        ${DIALOG_STYLES.commonDialog}
        ${DIALOG_STYLES.distributeDialog}

        <div class="${DIALOG_CLASSES.commonDialog.container}">
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
              results[$(el).data('ability')] = val - 10; // Speichere die Differenz von 10
            })

            if (!complete) {
              ui.notifications.warn(`${textDictionary.disributionWarning}!`);
              return false;
            }

            ApplyAttributesAsItem(actor, results);

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
        let selectedElementId = null;

        const clearSelection = () => {
          html.find(`.${DIALOG_CLASSES.distributeDialog.attrValue}.selected`).removeClass('selected');
          html.find(`.${DIALOG_CLASSES.distributeDialog.dropZone}.click-target`).removeClass('click-target');
          selectedElementId = null;
        };

        const updatePreview = (ability, value) => {
          const currentActorValue = GetActorAbilityValue(actor, ability);
          const modifier = value - 10;
          const newValue = currentActorValue + modifier;
          html.find(`#preview-${ability}`).html(`${textDictionary.current}: <strong>${currentActorValue}</strong> + ${modifier >= 0 ? '+' : ''}${modifier} = <strong>${newValue}</strong>`);
        };

        const assignValue = (elementId, targetZone) => {
          const valueElem = html.find(`#${elementId}`);
          if (valueElem.length === 0) return;

          const value = valueElem.data('value');

          if (targetZone.hasClass(DIALOG_CLASSES.distributeDialog.dropZone)) {
            const existing = targetZone.find(`.${DIALOG_CLASSES.distributeDialog.attrValue}`);
            if (existing.length > 0) {
              pool.append(existing);
            }
            targetZone.append(valueElem);

            const ability = targetZone.data('ability');
            updatePreview(ability, value);
          } else {
            targetZone.append(valueElem);
          }
          clearSelection();
        };

        // Drag and Drop Events
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
          assignValue(id, target);
        });

        // Click to Select Events
        html.find(`.${DIALOG_CLASSES.distributeDialog.attrValue}`).on('click', (ev) => {
          ev.stopPropagation();
          const elementId = $(ev.currentTarget).attr('id');

          if (selectedElementId === elementId) {
            clearSelection();
          } else {
            clearSelection();
            $(ev.currentTarget).addClass('selected');
            selectedElementId = elementId;
            html.find(`.${DIALOG_CLASSES.distributeDialog.dropZone}`).addClass('click-target');
          }
        });

        html.find(`.${DIALOG_CLASSES.distributeDialog.dropZone}`).on('click', (ev) => {
          if (selectedElementId !== null) {
            assignValue(selectedElementId, $(ev.currentTarget));
          }
        });

        html.find('#pool').on('click', (ev) => {
          if (selectedElementId !== null && $(ev.target).closest(`.${DIALOG_CLASSES.distributeDialog.attrValue}`).length === 0) {
            assignValue(selectedElementId, pool);
          }
        });

        html.on('click', (ev) => {
          if ($(ev.target).closest(`.${DIALOG_CLASSES.distributeDialog.attrValue}`).length === 0 &&
            $(ev.target).closest(`.${DIALOG_CLASSES.distributeDialog.dropZone}`).length === 0 &&
            !$(ev.target).is('#pool')) {
            clearSelection();
          }
        });
      }
    }, {
      classes: [DIALOG_CLASSES.commonDialog.root, DIALOG_CLASSES.distributeDialog.root]
    });

    d.render(true);
  });
}

function GetPointBuyCost(value) {
  return POINT_BUY_COSTS[value] || 0;
}

function ShowPointBuyDialog(actor, manualMode) {
  return new Promise((resolve) => {
    const PBPointsTotal = 27;
    const AbilityBaseValue = 10;
    const MinAbilityValue = 8;
    const MaxabilityValue = 15;
    const MIN_MANUAL_VALUE = 1;
    const basePointBuyCost = GetPointBuyCost(AbilityBaseValue);
    const availablePoints = PBPointsTotal - (basePointBuyCost * abilities.length);

    let values = abilities.reduce((obj, ability) => {
      const presetValue = Number.isInteger(ability.preset) && ability.preset > 0 ? ability.preset : AbilityBaseValue;
      obj[ability.id] = manualMode
        ? presetValue
        : Math.max(MinAbilityValue, Math.min(MaxabilityValue, presetValue));
      return obj;
    }, {});

    const calculateTotalCost = () => {
      if (manualMode) return 0;
      return Object.values(values).reduce((sum, val) => sum + (GetPointBuyCost(val) - basePointBuyCost), 0);
    };

    const gridHtml = abilities.map(a => {
      const currentActorValue = GetActorAbilityValue(actor, a.id);
      const value = values[a.id];
      return `
        <div class="${DIALOG_CLASSES.commonDialog.card}">
          <label class="${DIALOG_CLASSES.commonDialog.label}">${a.long}</label>
          <div class="${DIALOG_CLASSES.pointBuyDialog.buttonGroup}">
            <button id="btn-minus-${a.id}" class="${DIALOG_CLASSES.pointBuyDialog.adjustButton}">−</button>
            <div class="${DIALOG_CLASSES.pointBuyDialog.valueContainer}">
              <div id="value-${a.id}" class="${DIALOG_CLASSES.pointBuyDialog.valueDisplay}">${value}</div>
              <div id="cost-${a.id}" class="${DIALOG_CLASSES.pointBuyDialog.costDisplay}">${textDictionary.pointBuyCost}: ${manualMode ? '---' : GetPointBuyCost(value)}</div>
            </div>
            <button id="btn-plus-${a.id}" class="${DIALOG_CLASSES.pointBuyDialog.adjustButton}">+</button>
          </div>
          <div class="${DIALOG_CLASSES.commonDialog.preview}" id="preview-${a.id}">
            ${textDictionary.current}: <strong>${currentActorValue}</strong> + ${value - AbilityBaseValue >= 0 ? '+' : ''}${value - AbilityBaseValue} = <strong>${currentActorValue + value - AbilityBaseValue}</strong>
          </div>
        </div>`;
    }).join("");

    const content = `
      ${DIALOG_STYLES.commonDialog}
      ${DIALOG_STYLES.distributeDialog}
      ${DIALOG_STYLES.pointBuyDialog}
      <div class="${DIALOG_CLASSES.commonDialog.container}">
        <div id="points-display" class="${DIALOG_CLASSES.pointBuyDialog.pointsDisplay}"></div>
        <div class="${DIALOG_CLASSES.distributeDialog.attrGrid}">${gridHtml}</div>
      </div>`;

    new Dialog({
      title: manualMode ? textDictionary.manualAllocation : textDictionary.pointBuy,
      content: content,
      buttons: {
        save: {
          icon: '<i class="fas fa-save"></i>',
          label: textDictionary.btnSave,
          callback: (html) => {
            if (!manualMode) {
              const totalCost = calculateTotalCost();
              if (totalCost > availablePoints) {
                return false;
              }
            }

            let results = {};
            Object.entries(values).forEach(([ability, value]) => {
              results[ability] = value - AbilityBaseValue;
            });

            ApplyAttributesAsItem(actor, results);
            resolve(true);
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: textDictionary.btnCancel,
          callback: () => resolve(false)
        }
      },
      classes: [DIALOG_CLASSES.commonDialog.root, DIALOG_CLASSES.pointBuyDialog.root],
      default: "save",
      close: () => resolve(false),
      render: (html) => {
        let renderDialog = (html) => {
          const totalCost = calculateTotalCost();
          const remainingPoints = manualMode ? 0 : availablePoints - totalCost;

          if (manualMode) {
            html.find(`#points-display`).html(`
              <div>${textDictionary.manualAllocation}</div>
            `);
          } else {
            html.find(`#points-display`).html(`
              <div>
                <div>${textDictionary.pointBuySpendPoints}: <strong>${totalCost}</strong> / ${availablePoints}</div>
                <div class="${DIALOG_CLASSES.pointBuyDialog.pointsRemaining} ${remainingPoints >= 0 ? DIALOG_CLASSES.pointBuyDialog.positive : DIALOG_CLASSES.pointBuyDialog.negative}">${textDictionary.pointBuyRemainig}: <strong>${remainingPoints}</strong></div>
              </div>
            `);
          }

          abilities.forEach(a => {
            const val = values[a.id];
            const cost = manualMode ? '---' : GetPointBuyCost(val);
            const currentActorValue = GetActorAbilityValue(actor, a.id);
            const modifier = val - AbilityBaseValue;
            const newValue = currentActorValue + modifier;

            html.find(`#value-${a.id}`).text(val);
            html.find(`#cost-${a.id}`).text(`${textDictionary.pointBuyCost}: ${cost}`);
            html.find(`#preview-${a.id}`).html(`${textDictionary.current}: <strong>${currentActorValue}</strong> ${modifier >= 0 ? '+' : ''}${modifier} = <strong>${newValue}</strong>`);

            const currentVal = values[a.id];
            const disableMinus = currentVal <= (manualMode ? 1 : MinAbilityValue);
            const disablePlus = manualMode ? (currentVal >= 20) : (currentVal >= MaxabilityValue || remainingPoints < (GetPointBuyCost(currentVal + 1) - GetPointBuyCost(currentVal)));

            html.find(`#btn-minus-${a.id}`).prop('disabled', disableMinus);
            html.find(`#btn-plus-${a.id}`).prop('disabled', disablePlus);
          });
        };

        renderDialog(html);

        abilities.forEach(a => {
          html.find(`#btn-minus-${a.id}`).on('click', () => {
            const minValue = manualMode ? 1 : MinAbilityValue;
            if (values[a.id] > minValue) {
              values[a.id]--;
              renderDialog(html);
            }
          });

          html.find(`#btn-plus-${a.id}`).on('click', () => {
            if (manualMode || values[a.id] < MaxabilityValue) {
              values[a.id]++;
              renderDialog(html);
            }
          });
        });
      }
    }, {
      classes: [DIALOG_CLASSES.commonDialog.root, DIALOG_CLASSES.distributeDialog.root]
    }).render(true);
  });
}

async function ApplyAttributesAsItem(actor, values) {
  if (!actor || !values) return;

  const itemName = textDictionary.baseAttributeItemName;
  const itemFlag = abilityItemId;

  const existingItem = actor.items.find(i => (i.identifier === itemFlag));
  if (existingItem) {
    await existingItem.delete();
  }

  const changes = Object.entries(values).map(([ability, value]) => {
    return {
      key: `system.abilities.${ability}.value`,
      mode: CONST.ACTIVE_EFFECT_MODES.ADD,
      value: value,
      priority: 20
    };
  });

  const itemData = {
    name: itemName,
    type: "feat",
    img: "icons/svg/aura.svg",
    system: {
      identifier: itemFlag,
      description: {
        value: `${itemName} - Basiswerte des Actors.`
      },
      type: {
        value: "background"
      },
      properties: ["trait"]
    },
    effects: [{
      name: itemName,
      icon: "icons/svg/aura.svg",
      origin: "",
      disabled: false,
      transfer: true,
      changes: changes
    }]
  };

  await actor.createEmbeddedDocuments("Item", [itemData]);

  ChatMessage.create({ content: `${textDictionary.messageSuccess}<br/>${actor.name} ${textDictionary.messageSuccessActorItem} ${itemName}`, speaker: { alias: "System" } });
}