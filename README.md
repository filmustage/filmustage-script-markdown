# Filmustage script markdown

Team datasets guidelines in [Notion](https://www.notion.so/filmustage/Datasets-Guidelines-5445b5559c8948d59e30b44b531f0dc4).

## 1. Install package
Install from the app:
- In Atom, open Preferences (Settings on Windows)
- Go to Install section
- Search for `filmustage_script_markdown` package.<br>
Once it found, click Install button to install package.

Install from the site:

Install `filmustage_script_markdown` from Atom package page:<br>
[https://atom.io/packages/filmustage_script_markdown](https://atom.io/packages/filmustage_script_markdown)

## 2. Use tags

After you've done that you should be able to use the `hotkeys` for adding tags.

Select text and press:

- **F1** for `<place></place>`
- **F2** for `<location></location>`
- **F3** for `<time></time>`
- **F4** for `<prop></prop>`
- **F5** for `<actor></actor>`
- **F6** for `<location_add></location_add>`
- **F7** for `<actor_add></location>`
- **F8** for `<wtf></wtf>`

If you want to delete or change tags, `<>select text with tags</>` and press:
- **ALT+F1** for `delete tags around`
- Any **hotkeys** from top for `replace tags around`

## 3. Change Hotkeys

For change default hotkeys open file:

```JSON
~/.atom/packages/filmustage_script_markdown/keymaps/filmustage_script_markdown.json

{
  "atom-text-editor": {
    "f1": "user:filmustage-place",
    "f2": "user:filmustage-location",
    "f3": "user:filmustage-time",
    "f4": "user:filmustage-prop",
    "f5": "user:filmustage-actor",
    "f6": "user:filmustage-location_add",
    "f7": "user:filmustage-actor_add",
    "f8": "user:filmustage-wtf",
    "alt-f1": "user:filmustage-delete_tag"
  }
}
```
