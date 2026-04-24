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

const isGer = game.i18n.lang.startsWith("de");

// Predefined Light Presets - these can be easily customized or expanded by editing this variable
// Make sure to use the same keys (name, bright, dim, color, anim) for each preset and adjust the values accordingly
const lightPresets = [
  { name: (isGer ? "🚫 Licht Aus" : "🚫 Light Off"), bright: 0, dim: 0, color: "#000000", anim: "none" },
  { name: (isGer ? "🔥 Fackel" : "🔥 Torch"), bright: 6, dim: 12, color: "#ffaa00", anim: "flame" },
  { name: (isGer ? "🏮 Laterne" : "🏮 Lantern"), bright: 9, dim: 18, color: "#ffcc66", anim: "torch" },
  { name: (isGer ? "✨ Licht (Zauber)" : "✨ Light (Spell)"), bright: 6, dim: 12, color: "#ffffff", anim: "null" }
];

const isMeter = game.canvas.grid.units.includes("m");
const unitText = isMeter ? (isGer ? "Meter" : "Meters") : (isGer ? "Fuß" : "Feet");
const textDictionary = {
  dialogTitle: isGer ? "Licht einstellungen anpassen" : "Adjust light range",
  groupLightTitle: isGer ? "Licht" : "Light",
  brightLabel: `${(isGer ? "Hell" : "Bright")}` + ` ${unitText}:`,
  dimLabel: `${(isGer ? "Gedimmt" : "Dim")}` + ` ${unitText}:`,
  groupColorTitle: isGer ? "Farbe:" : "Color:",
  colorLabel: isGer ? "Farbe:" : "Color:",
  intensityLabel: isGer ? "Intensität:" : "Intensity:",
  groupAnimationLabel: isGer ? "Animation:" : "Animation:",
  animTypeLabel: isGer ? "Typ:" : "Type:",
  animSpeedLabel: isGer ? "Geschwindigkeit:" : "Speed:",
  animIntensityLabel: isGer ? "Animationsintensität:" : "Animation Intensity:",
  saveBtnLabel: isGer ? "Speichern" : "Save",
  cancelBtnLabel: isGer ? "Abbrechen" : "Cancel",
  noTokenWarning: isGer ? "Kein Token ausgewählt!" : "No token selected!",  
};

const presetLightDistance = isMeter ? 1.5 : 5.0; // Default distance for presets, can be adjusted as needed

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
      <label for="brightLight">${textDictionary.brightLabel}</label>
      <div class="form-fields">
        <input type="number" name="brightLight" id="brightLight" value="${presetLightDistance}" min="0" step="0.1">
      </div>
    </div>
    <div class="form-group">
      <label for="dimLight">${textDictionary.dimLabel}</label>
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
      <label>${textDictionary.intensityLabel}</label>
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
      <label>${textDictionary.animSpeedLabel}</label>
      <div class="form-fields">
        <input type="range" name="animSpeed" min="1" max="10" step="1" value="2" 
               oninput="$(this).next().text(this.value)">
        <span class="range-value" style="margin-left: 8px; font-weight: bold;">2</span>
      </div>
    </div>
    <div class="form-group">
      <label>${textDictionary.animIntensityLabel}</label>
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