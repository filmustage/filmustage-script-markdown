# atom_markdown_package
https://www.notion.so/filmustage/Datasets-Guidelines-5445b5559c8948d59e30b44b531f0dc4
## 1. Install package

Copy `filmustage-dataset` folder from GitHub to Atom package folder in (mac):

    ~/.atom/packages

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
- **Shift+F1** for `<wtf></wtf>`

## 3. Change Hotkeys

For change default hotkeys open file:

```JSON
~/.atom/packages/filmustage-dataset/keymaps/filmustage-dataset.json

{
  "atom-text-editor": {
    "f1": "user:filmustage-place",
    "f2": "user:filmustage-location",
    "f3": "user:filmustage-time",
    "f4": "user:filmustage-prop",
    "f5": "user:filmustage-actor",
    "f6": "user:filmustage-location_add",
    "f7": "user:filmustage-actor_add",
    "shift-f1": "user:filmustage-wtf"
  }
}
```
