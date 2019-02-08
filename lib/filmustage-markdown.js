const {CompositeDisposable} = require('atom')

module.exports = {
  subscriptions: null,

  activate () {
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-workspace',{
      'user:filmustage-location': () => this.convert("location"),
      'user:filmustage-location_add': () => this.convert("location_add"),
      'user:filmustage-prop': () => this.convert("prop"),
      'user:filmustage-actor': () => this.convert("actor"),
      'user:filmustage-place': () => this.convert("place"),
      'user:filmustage-time': () => this.convert("time"),
      'user:filmustage-wtf': () => this.convert("wtf"),
      'user:filmustage-actor_add': () => this.convert("actor_add")
    })
    )
  },

  deactivate () {
    this.subscriptions.dispose()
  },

  convert (pref) {
    const editor = atom.workspace.getActiveTextEditor()
    if (editor) {
      selection = editor.getLastSelection()
      text = selection.getText()
      prefix = "<"+pref+">"
      suffix = "</"+pref+">"

      selection.insertText(prefix + selection.getText() + suffix, {select: true})
    }
  }
}
