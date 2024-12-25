# ToDos

Open topics, that have to be clarified before released to the public. After first cleanup, this should be transferred to github issues.

## Diese Funktionen will ich unterstützen:

### Trigger event:

[x] New File -> oder bei zapier geht, dass ich nur den vollständigen pfad+dateinamen als id verwenden!
[x] New or Updated File - kann ich das überhaupt differenzieren? nur über history! => auswahl des Pfads => einschrenken auf Dateiname /list items in directory -> repo, path, t=f, recursive = 0
[x] New Tagged File
[ ] New File Event
[ ] New Shared File
[ ] New Folder
[ ] New Library

### Create event:

[x] Download a file
[x] Create Folder
[ ] Create or Append to Text File
[x] Create Shared Link
[x] Create Text File
[x] Delete File
[x] Delete Folder
[x] Move File
[x] Rename File
[x] Upload File
[x] API Request (Beta)

### Search:

[ ] Find File
[ ] Find File (Content Search)
[ ] Find Folder
[x] Find Files/Folders (Multi Line Support)
=> hier immer direkt auch die file (hydrated) mit angeben

Vergleichen mit OneDrive und Dropbox.

## Authentication Warning:

⠙ Invoking authentication.test(node:1795686) [DEP0097] DeprecationWarning: Using a domain property in MakeCallback is deprecated. Use the async_context variant of MakeCallback or the AsyncResource class instead. (Triggered by calling processImmediate on process.)
(Use `node --trace-deprecation ...` to show where the warning was created)

429 status code behandeln...
400 bad request...

-> nodejs problem. Zapier has to solve that.

## Warnings

zapier validate
https://docs.zapier.com/platform/publish/integration-checks-reference#d002-provide-link-in-help-text-for-auth-fields

## Pagination

Bei den intern\_... pagination support?

-> Pagination deaktiviert

## repo list

- was, wenn viele viele repos? pagination?
  -> Pagination deaktiviert

- "intern" dateien irgendwie anders nennen? oder anderer ordner.

-> Offizielles Beispiel: https://github.com/zapier/zapier-platform/tree/main/example-apps/dynamic-dropdown
-> gleicher Ordner, ohne "intern" (nur "hidden" auf true gesetzt)

## tests

einfache tests mit beispieldaten bauen?

## error handling

delete folder, that does not exist... Was passiert dann?

-> Seafile API liefert 404
-> Zapier zeigt den Fehler
-> somit alles ok.

## search with line item support

das nochmal intensiv drauf schauen.
von hier: https://docs.zapier.com/platform/quickstart/recommended-triggers-and-actions
Zapier searches automatically return only the first result in the response. To return multiple results, return the set of results as an array of objects under a descriptive key.
https://docs.zapier.com/platform/build/response-types

-> Funktioniert mit Looping
-> Single "find File" nochmal anschauen (notwendig?)

## was ist noun in den dateien?

hier einmal komplett drüber gehen

-> "A single noun that describes what this action creates, used by Zapier to auto-generate text in Zaps about your action."

## download file from seafile

bieten wir bei den trigger ergebnissen nur den pfad an und dann muss man "download file" machen? Das würde einen multi-step zap erzwingen.
oder holen wir unmittelbar immer den content?
Bieten wir informationen an wie bei dropbox?
=> bei den triggern, wird immer auch gleich die Datei geholt und angeboten!!! (auswählbar aber default ist yes)

-> für die 3 Trigger umgesetzt

## klären wie trigger abgrenzen

ich bin der meinung zapier kümmert sich über die ID selbst darum. Klären!

-> Korrekt!
-> Kann auch per "primary" in "outputFields" festgelegt werden (auch mehrere Felder)

## Anreichern??

Immer bei full_path mit angeben => path + filename?!?

### better error handling?!?

z.B. download file und dann falsch angegeben...

-> Zapier zeigt Fehler an: "The path must start with a /."/"File not found"

## wie lange ist download link gültig? ID bei download file?

wo relevant, nur bei triggern?

-> Afaict nur bei Triggern: https://docs.zapier.com/platform/build/deduplication

## bei triggers:

- include file contents
- include sharing link

-> Done, sharing link wird nur zurückgeliefert, falls es noch keinen Link für die gleiche Datei gibt, da die Seafile-API sonst einen Fehler zurückliefert

## nicht boolean sondern string mit choices "YES", "NO".

-> Umgesetzt

## Simon

git pull
npm install
zapier account
zapier link
zapier invoke -> seafile-demo
spielen
trigger logik überprüfen. -> immer alles zurück? id bei new file austauschen...
