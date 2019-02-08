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
      'user:filmustage-actor_add': () => this.convert("actor_add"),
      'user:filmustage-delete_tag': () => this.convert("DELETE"),
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
      text_whitespace = text.replace(/^\s+|\s+$/g, "")
      text_characters = text_whitespace.replace(/^[,.-]|[,.-]+$/g, "")
      text_untag = text_characters.replace(/(<([^>]+)>)/ig, "")

      prefix = "<"+pref+">"
      suffix = "</"+pref+">"
      if (pref != "DELETE")
        selection.insertText(prefix + text_untag + suffix, {select: true})
      else
        selection.insertText(text_untag, {select: true})
    }
  }
}
