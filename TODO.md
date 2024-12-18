# ToDos

Open topics, that have to be clarified before released to the public. After first cleanup, this should be transferred to github issues.

## Authentication Warning:

⠙ Invoking authentication.test(node:1795686) [DEP0097] DeprecationWarning: Using a domain property in MakeCallback is deprecated. Use the async_context variant of MakeCallback or the AsyncResource class instead. (Triggered by calling processImmediate on process.)
(Use `node --trace-deprecation ...` to show where the warning was created)

429 status code behandeln...
400 bad request...

## Warnings

zapier validate
https://docs.zapier.com/platform/publish/integration-checks-reference#d002-provide-link-in-help-text-for-auth-fields

## Pagination

Bei den intern\_... pagination support?

## repo list

- was, wenn viele viele repos? pagination?
- dateien irgendwie anders nennen?

## tests

einfache tests mit beispieldaten bauen?

## error handling

delete folder, that does not exist... Was passiert dann?

## search with line item support

das nochmal intensiv drauf schauen.

## was ist noun in den dateien?

hier einmal komplett drüber gehen

## download file from seafile

bieten wir bei den trigger ergebnissen nur den pfad an und dann muss man "download file" machen? Das würde einen multi-step zap erzwingen.
oder holen wir unmittelbar immer den content?
Bieten wir informationen an wie bei dropbox?

## klären wie trigger abgrenzen

ich bin der meinung zapier kümmert sich über die ID selbst darum. Klären!

## Diese Funktionen will ich unterstützen:

### Trigger event:

[x] New File -> oder bei zapier geht, dass ich nur den vollständigen pfad+dateinamen als id verwende!
[x] New or Updated File - kann ich das überhaupt differenzieren? nur über history! => auswahl des Pfads => einschrenken auf Dateiname /list items in directory -> repo, path, t=f, recursive = 0
[x] New Tagged File
[ ] New File Event
[ ] New Shared File
[2] New Folder
[2] New Library

### Create event:

[1] Download a file
[x] Create Folder
[ ] Create or Append to Text File
[ ] Create Shared Link
[x] Create Text File
[ ] Delete File
[x] Delete Folder
[ ] Move File
[ ] Rename File
[x] Upload File
[1] API Request (Beta)

### Search:

[x] Find File
[ ] Find File (Content Search)
[ ] Find Folder
[x] Find Files/Folders (Multi Line Support)
