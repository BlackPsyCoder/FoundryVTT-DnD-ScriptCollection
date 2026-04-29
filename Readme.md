# Contents
- [English Version](#readme)
  - [Importing the scripts](#importing-the-scripts)
  - [Dependencies between Macros](#dependencies-between-macros)
  - [Configurable parameters](#configurable-parameters)
  - [Localization](#localization)
- [Deutsche Version](#liesmich)
  - [Importieren der Skripts](#importieren-der-skripts)
  - [Abhängigkeiten zwischen den Macros](#abhängigkeiten-zwischen-den-macros)
  - [Einstellbare Parameter](#einstellbare-parameter)
  - [Lokalisierung (Übersetzung)](#lokalisierung-übersetzung)

# Readme
## Importing the scripts
These script files are intended to be used as Macros in Foundry VTT with the DnD system.
Copy the content into a script Macro and save it with the same name (without `.js`).

## Dependencies between Macros
Some Macros use other Macros for additional functionality. These dependencies are listed in the readme section of the scripts.
For example, `CreationDialog` can trigger a LevelUp as long as the `TriggerLevelUp` macro exists.
If the macro is not named `TriggerLevelUp`, it will not work in `CreationDialog`.
However, the `CreationDialog` contains the name of the `TriggerLevelUp` script in the first lines, so you can easily adjust it there.

## Configurable parameters
Aside from macro names, each script includes a top section with configurable parameters that affect the script behavior.
These are designed to be easy to change.

## Localization
I try to list all texts shown in dialogs or error messages in a function in the script called `GetTranslationDictionary`.
In this function, all used texts are filled based on the Foundry core system language setting.
All translations other than German and English were created once by AI. Missing languages or incorrect translations can thus be corrected relatively easily.
Issues or pull requests for improvements are welcome.

# Liesmich
## Importieren der Skripts
Diese Script-Dateien sind für die Verwendung als Macro in Foundry VTT mit dem DnD-System gedacht.
Kopiere den Inhalt in ein Skript-Macro und speichere es am besten unter dem gleichen Namen (ohne `.js`).

## Abhängigkeiten zwischen den Macros
Manche Macros verwenden andere Macros für Zusatzfunktionen. Diese Abhängigkeiten werden im Liesmich-Bereich der Skripts aufgeführt.
Zum Beispiel kann der `CreationDialog` ein LevelUp auslösen, solange das `TriggerLevelUp`-Macro existiert.
Wenn das andere Macro nicht `TriggerLevelUp` heißt, funktioniert die Verknüpfung im `CreationDialog` nicht.
Im `CreationDialog` ist der Name des `TriggerLevelUp`-Scripts aber in den ersten Zeilen als Parameter angelegt, so dass du ihn dort einfach anpassen kannst.

## Einstellbare Parameter
Abgesehen von Macro-Namen enthält jedes Script einen oberen Abschnitt mit einstellbaren Parametern, die das Verhalten steuern.
Diese Parameter sind so gestaltet, dass man sie relativ einfach ändern kann.

## Lokalisierung (Übersetzung)
Ich versuche, alle Texte, die in Dialogen oder Fehlermeldungen angezeigt werden, in einer Funktion im Skript aufzulisten, die `GetTranslationDictionary` heißt.
In dieser Funktion werden alle verwendeten Texte anhand der Spracheinstellung des Foundry-Kernsystems befüllt.
Alle Übersetzungen außer Deutsch und Englisch wurden einmalig von mir per KI erstellt. Fehlende Sprachen oder falsche Übersetzungen kannst du so relativ einfach selbst korrigieren.
Ein Issue oder Pull Request zur Verbesserung ist natürlich gerne gesehen.
