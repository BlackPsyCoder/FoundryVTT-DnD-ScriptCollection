// ** LiesMich **
// Dieses Skript ermöglicht es dieLichteinstellungen von mehreren Tokens schnell anzupassen.
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
const isMeter = game.canvas.grid.units.includes("m");

// Predefined Light Presets - these can be easily customized or expanded by editing this variable
// Make sure to use the same keys (name, bright, dim, color, anim) for each preset and adjust the values accordingly
const lightPresets = [
  { name: (isGer ? "🚫 Licht Aus" : "🚫 Light Off"), bright: 0, dim: 0, color: "#000000", anim: "none" },
  { name: (isGer ? "🔥 Fackel" : "🔥 Torch"), bright: 6, dim: 12, color: "#ffaa00", anim: "flame" },
  { name: (isGer ? "🏮 Laterne" : "🏮 Lantern"), bright: 9, dim: 18, color: "#ffcc66", anim: "torch" },
  { name: (isGer ? "✨ Licht (Zauber)" : "✨ Light (Spell)"), bright: 6, dim: 12, color: "#ffffff", anim: "null" }
];

const unitText = isMeter ? (isGer ? "Meter" : "Meters") : (isGer ? "Fuß" : "Feet");
const dialogTitle = isGer ? "Licht einstellungen anpassen" : "Adjust light range";
const groupLightTitle = isGer ? "Licht" : "Light";
const brightLabel = `${(isGer ? "Hell" : "Bright")}` + ` ${unitText}:`;
const dimLabel = `${(isGer ? "Gedimmt" : "Dim")}` + ` ${unitText}:`;
const groupColorTitle = isGer ? "Farbe:" : "Color:";
const colorLabel = isGer ? "Farbe:" : "Color:";
const intensityLabel = isGer ? "Intensität:" : "Intensity:";
const groupAnimationLabel = isGer ? "Animation:" : "Animation:";
const animTypeLabel = isGer ? "Typ:" : "Type:";
const animSpeedLabel = isGer ? "Geschwindigkeit:" : "Speed:";
const animIntensityLabel = isGer ? "Animationsintensität:" : "Animation Intensity:";
const saveBtnLabel = isGer ? "Speichern" : "Save";
const cancelBtnLabel = isGer ? "Abbrechen" : "Cancel";
const noTokenWarning = isGer ? "Kein Token ausgewählt!" : "No token selected!";

const presetLightDistance = isMeter ? 1.5 : 5.0; // Default distance for presets, can be adjusted as needed

const animationTypes = `
  <option value="none">-</option>
  <option value="null">${isGer ? "Keine" : "None"}</option>
  <option value="witchwave">${isGer ? "Bezaubernde Welle" : "Enchanting Wave"}</option>
  <option value="chroma">${isGer ? "Chroma" : "Chroma"}</option>
  <option value="energy">${isGer ? "Energiefeld" : "Energy Field"}</option>
  <option value="flame">${isGer ? "Fackel" : "Torch"}</option>
  <option value="fairy">${isGer ? "Feenlicht" : "Fairy Light"}</option>
  <option value="reactivepulse">${isGer ? "Reaktiver Puls" : "Reactive Pulse"}</option>
  <option value="torch">${isGer ? "Flackerndes Licht" : "Flickering Light"}</option>
  <option value="ghost">${isGer ? "Gespenstisches Licht" : "Ghostly Light"}</option>
  <option value="hexa">${isGer ? "Hex-kuppel" : "Hex Dome"}</option>
  <option value="grid">${isGer ? "Kraftfeld" : "Power Field"}</option>
  <option value="dome">${isGer ? "Lichtkuppel" : "Light Dome"}</option>
  <option value="emanation">${isGer ? "Mysteriöse Emanation" : "Mysterious Emanation"}</option>
  <option value="pulse">${isGer ? "Pulsierend" : "Pulsing"}</option>
  <option value="wave">${isGer ? "Pulsierende Welle" : "Pulsing Wave"}</option>
  <option value="radialrainbow">${isGer ? "Radialer Regenbogen" : "Radial Rainbow"}</option>
  <option value="smokepatch">${isGer ? "Rauch" : "Smoke"}</option>
  <option value="revolving">${isGer ? "Rotierendes Licht" : "Spinning Light"}</option>
  <option value="siren">${isGer ? "Sirenenlicht" : "Siren Light"}</option>
  <option value="sunburst">${isGer ? "Sonnenschein" : "Sunburst"}</option>
  <option value="starlight">${isGer ? "Sternenlicht" : "Starlight"}</option>
  <option value="vortex">${isGer ? "Wirbel" : "Vortex"}</option>
  <option value="fog">${isGer ? "Wirbelnder Nebel" : "Swirling Mist"}</option>
  <option value="rainbowswirl">${isGer ? "Wirbelnder Regenbogen" : "Swirling Rainbow"}</option>`;

async function updateTokens (tokens, updateData)
{
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
    ui.notifications.warn("Kein Token ausgewählt!");
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
    <legend>${groupLightTitle}</legend>
    <div class="form-group">
      <label for="brightLight">${brightLabel}</label>
      <div class="form-fields">
        <input type="number" name="brightLight" id="brightLight" value="${presetLightDistance}" min="0" step="0.1">
      </div>
    </div>
    <div class="form-group">
      <label for="dimLight">${dimLabel}</label>
      <div class="form-fields">
        <input type="number" name="dimLight" id="dimLight" value="${presetLightDistance}" min="0" step="0.1">
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>${groupColorTitle}</legend>
    <div class="form-group">
      <label for="lightColor">${colorLabel}</label>
      <div class="form-fields">
        <input type="color" name="lightColor" id="lightColor" value="#000000">
      </div>
    </div>
    <div class="form-group">
      <label>${intensityLabel}</label>
      <div class="form-fields">
        <input type="range" name="lightAlpha" min="0" max="1" step="0.05" value="0.10" 
               oninput="$(this).next().text(this.value)">
        <span class="range-value" style="margin-left: 8px; font-weight: bold;">0.10</span>
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>${groupAnimationLabel}</legend>
    <div class="form-group">
      <label for="animationType">${animTypeLabel}</label>
      <div class="form-fields">
        <select name="animationType" id="animationType">
          ${animationTypes}
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>${animSpeedLabel}</label>
      <div class="form-fields">
        <input type="range" name="animSpeed" min="1" max="10" step="1" value="2" 
               oninput="$(this).next().text(this.value)">
        <span class="range-value" style="margin-left: 8px; font-weight: bold;">2</span>
      </div>
    </div>
    <div class="form-group">
      <label>${animIntensityLabel}</label>
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
  title: dialogTitle,
  content: lightControlDialog,
  buttons: {
    ok: {
      label: saveBtnLabel,
      callback: lightControllCallback
    },
    cancel: {
      label: cancelBtnLabel
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