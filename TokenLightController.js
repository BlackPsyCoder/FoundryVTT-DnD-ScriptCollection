// ** LiesMich **
// Dieses Skript ermöglicht es die Lichteinstellungen von mehreren Tokens schnell anzupassen.
// Die Einstellungen werden nur auf die Token angewendet und wirken sich nicht auf den verknüften Actor aus.
// Es gibt einige vordefinierte Presets, die durch die Buttons am Anfang des Dialogs schnell angewendet werden können.
// diese wurden so in das Sktipt integriert, dass sie leicht angepasst oder erweitert werden können.
// Dazu muss nur die Variable "lightPresets" bearbeitet werden. Es können beliebig viele Presets hinzugefügt werden.
// 
// ** README **
// This script allows you to quickly adjust the light settings of multiple tokens.
// The settings are only applied to the tokens and do not affect the linked actor.
// There are some predefined presets that can be quickly applied using the buttons at the beginning of the dialog.
// These have been integrated into the script in such a way that they can be easily customized or expanded.
// To do this, simply edit the "lightPresets" variable. You can add as many presets as you like.

const unit = game.canvas.grid.units;
const textDictionary = GetTranslationDictionary(game.i18n.lang);

// Predefined Light Presets - these can be easily customized or expanded by editing this variable
// Make sure to use the same keys (name, bright, dim, color, anim) for each preset and adjust the values accordingly
const lightPresets = [
  { name: (game.i18n.lang === "de" ? "🚫 Licht Aus" : "🚫 Light Off"), bright: 0, dim: 0, color: "#000000", anim: "none" },
  { name: (game.i18n.lang === "de" ? "🔥 Fackel" : "🔥 Torch"), bright: 6, dim: 12, color: "#ffaa00", anim: "flame" },
  { name: (game.i18n.lang === "de" ? "🏮 Laterne" : "🏮 Lantern"), bright: 9, dim: 18, color: "#ffcc66", anim: "torch" },
  { name: (game.i18n.lang === "de" ? "✨ Licht (Zauber)" : "✨ Light (Spell)"), bright: 6, dim: 12, color: "#ffffff", anim: "null" }
];

// Default distance for presets, can be adjusted as needed
const presetLightDistance = (unit === "m") ? 1.5 : 5.0; 

function GetTranslationDictionary(lang) {
  let dictionary = {};
  const unit = game.canvas.grid.units;
  switch (lang) {
    case "de":
      dictionary = {
        dialogTitle: "Licht einstellungen anpassen",
        groupLightTitle: "Licht",
        unitText: (unit === "m" ? "Meter" : unit === "ft" ? "Fuß" : unit || "Units"),
        brightLabel: "Hell",
        dimLabel: "Gedimmt",
        groupColorTitle: "Farbe",
        colorLabel: "Farbe",
        intensityLabel: "Intensität",
        groupAnimationLabel: "Animation",
        animTypeLabel: "Typ",
        animSpeedLabel: "Geschwindigkeit",
        animIntensityLabel: "Animationsintensität",
        saveBtnLabel: "Speichern",
        cancelBtnLabel: "Abbrechen",
        noTokenWarning: "Kein Token ausgewählt!"
      };
      break;
    case "es":
      dictionary = {
        dialogTitle: "Ajustar rango de luz",
        groupLightTitle: "Luz",
        unitText: (unit === "m" ? "Metros" : unit === "ft" ? "Pies" : unit || "Unidades"),
        brightLabel: "Bright",
        dimLabel: "Dim",
        groupColorTitle: "Color",
        colorLabel: "Color",
        intensityLabel: "Intensity",
        groupAnimationLabel: "Animation",
        animTypeLabel: "Type",
        animSpeedLabel: "Speed",
        animIntensityLabel: "Animation Intensity",
        saveBtnLabel: "Save",
        cancelBtnLabel: "Cancel",
        noTokenWarning: "No token selected!"
      };
      break;
    case "it":
      dictionary = {
        dialogTitle: "Regola la portata della luce",
        groupLightTitle: "Luce",
        unitText: (unit === "m" ? "Meters" : unit === "ft" ? "Feet" : unit || "Units"),
        brightLabel: "Bright",
        dimLabel: "Dim",
        groupColorTitle: "Color",
        colorLabel: "Color",
        intensityLabel: "Intensity",
        groupAnimationLabel: "Animation",
        animTypeLabel: "Type",
        animSpeedLabel: "Speed",
        animIntensityLabel: "Animation Intensity",
        saveBtnLabel: "Save",
        cancelBtnLabel: "Cancel",
        noTokenWarning: "No token selected!"
      };
      break;
    case "fr":
      dictionary = {
        dialogTitle: "Ajuster la portée de la lumière",
        groupLightTitle: "Lumière",
        unitText: (unit === "m" ? "Mètres" : unit === "ft" ? "Pieds" : unit || "Unités"),
        brightLabel: "Lumineux",
        dimLabel: "Sombre",
        groupColorTitle: "Couleur",
        colorLabel: "Couleur",
        intensityLabel: "Intensité",
        groupAnimationLabel: "Animation",
        animTypeLabel: "Type",
        animSpeedLabel: "Vitesse",
        animIntensityLabel: "Intensité de l'animation",
        saveBtnLabel: "Enregistrer",
        cancelBtnLabel: "Annuler",
        noTokenWarning: "Aucun token sélectionné!"
      };
      break;
    case "en":
    default:
      dictionary = {
        dialogTitle: "Adjust light range",
        groupLightTitle: "Light",
        unitText: (unit === "m" ? "Meters" : unit === "ft" ? "Feet" : unit || "Units"),
        brightLabel: "Bright",
        dimLabel: "Dim",
        groupColorTitle: "Color",
        colorLabel: "Color",
        intensityLabel: "Intensity",
        groupAnimationLabel: "Animation",
        animTypeLabel: "Type",
        animSpeedLabel: "Speed",
        animIntensityLabel: "Animation Intensity",
        saveBtnLabel: "Save",
        cancelBtnLabel: "Cancel",
        noTokenWarning: "No token selected!"
      };
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

function getAnimationTypes() {
  let options = `<option value="none">-</option>`;
  let anims = CONFIG.Canvas.lightAnimations;
  for (let key in anims) {
    options += `<option value="${key}">${game.i18n.localize(anims[key].label)}</option>`;
  }
  return options;
}

async function updateTokens(tokens, updateData) {
  for (let t of tokens) {
    await t.document.update(updateData);
  }
}

async function lightControllCallback(html) {
  const brightLight = parseFloat(html.find('[name="brightLight"]').val());
  const dimLight = parseFloat(html.find('[name="dimLight"]').val());

  const selectedColor = html.find('[name="lightColor"]').val();
  const colorAlpha = parseFloat(html.find('[name="lightAlpha"]').val());

  const animType = html.find('[name="animationType"]').val();
  const animSpeed = parseInt(html.find('[name="animSpeed"]').val());
  const animIntensity = parseInt(html.find('[name="animIntensity"]').val());

  const tokens = canvas.tokens.controlled;

  if (tokens.length === 0) {
    ui.notifications.warn(textDictionary.noTokenWarning);
    return;
  }

  let updateData = {
    light: {
      bright: brightLight,
      dim: dimLight
    }
  };

  if (selectedColor != "#000000") {
    updateData.light.color = selectedColor;
    updateData.light.alpha = colorAlpha;
  }

  if (animType != "none") {
    updateData.light.animation = new Object();
    if (animType === "null") {
      updateData.light.animation.type = null;
    } else {
      updateData.light.animation.type = animType;
      updateData.light.animation.speed = animSpeed;
      updateData.light.animation.intensity = animIntensity;
    }
  }

  // Update all selected tokens with the new light settings
  // this is man in an async function because foundy would not update all tokens reliably in an simple loop
  updateTokens(tokens, updateData);
}

function CreateLightPreset(name, displayName, bright, dim, color, anim) {
  return `<button type="button" class="preset-btn" data-bright="${bright}" data-dim="${dim}" data-color="${color}" data-anim="${anim}" style="flex: 1 1 45%;">${displayName}</button>`;
}

const presetsHtml = lightPresets.map(p => CreateLightPreset(p.name, p.name, p.bright, p.dim, p.color, p.anim)).join("");

const lightControlDialog = `
<form>
  <div class="form-group" style="display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; margin-bottom: 15px;">
    ${presetsHtml}
  </div>
  
  <fieldset>
    <legend>${textDictionary.groupLightTitle}</legend>
    <div class="form-group">
      <label for="brightLight">${textDictionary.brightLabel} (${textDictionary.unitText}):</label>
      <div class="form-fields">
        <input type="number" name="brightLight" id="brightLight" value="${presetLightDistance}" min="0" step="0.1">
      </div>
    </div>
    <div class="form-group">
      <label for="dimLight">${textDictionary.dimLabel} (${textDictionary.unitText}):</label>
      <div class="form-fields">
        <input type="number" name="dimLight" id="dimLight" value="${presetLightDistance}" min="0" step="0.1">
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>${textDictionary.groupColorTitle}</legend>
    <div class="form-group">
      <label for="lightColor">${textDictionary.colorLabel}</label>
      <div class="form-fields">
        <input type="color" name="lightColor" id="lightColor" value="#000000">
      </div>
    </div>
    <div class="form-group">
      <label for="lightAlpha">${textDictionary.intensityLabel}</label>
      <div class="form-fields">
        <input type="range" name="lightAlpha" min="0" max="1" step="0.05" value="0.10" 
               oninput="$(this).next().text(this.value)">
        <span class="range-value" style="margin-left: 8px; font-weight: bold;">0.10</span>
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>${textDictionary.groupAnimationLabel}</legend>
    <div class="form-group">
      <label for="animationType">${textDictionary.animTypeLabel}</label>
      <div class="form-fields">
        <select name="animationType" id="animationType">
          ${getAnimationTypes()}
        </select>
      </div>
    </div>
    <div class="form-group">
      <label for="animSpeed">${textDictionary.animSpeedLabel}</label>
      <div class="form-fields">
        <input type="range" name="animSpeed" min="1" max="10" step="1" value="2" 
               oninput="$(this).next().text(this.value)">
        <span class="range-value" style="margin-left: 8px; font-weight: bold;">2</span>
      </div>
    </div>
    <div class="form-group">
      <label for="animIntensity">${textDictionary.animIntensityLabel}</label>
      <div class="form-fields">
        <input type="range" name="animIntensity" min="1" max="10" step="1" value="5" 
               oninput="$(this).next().text(this.value)">
        <span class="range-value" style="margin-left: 8px; font-weight: bold;">5</span>
      </div>
    </div>
  </fieldset>
</form>
`;

// Dialogfenster erstellen
new Dialog({
  title: textDictionary.dialogTitle,
  content: lightControlDialog,
  buttons: {
    ok: {
      label: textDictionary.saveBtnLabel,
      callback: lightControllCallback
    },
    cancel: {
      label: textDictionary.cancelBtnLabel
    }
  },
  render: (html) => {
    // Logik für die Preset-Buttons
    html.find('.preset-btn').click(ev => {
      const btn = $(ev.currentTarget);
      html.find('[name="brightLight"]').val(btn.data('bright'));
      html.find('[name="dimLight"]').val(btn.data('dim'));
      html.find('[name="lightColor"]').val(btn.data('color'));
      html.find('[name="animationType"]').val(btn.data('anim'));

      // Feedback: Den Button kurz hervorheben
      html.find('.preset-btn').css("border", "none");
      btn.css("border", "2px solid #ffaa00");
    });
  }
}).render(true);