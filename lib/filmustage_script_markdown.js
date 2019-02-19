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
      'user:filmustage-extras': () => this.convert("extras"),
      'user:filmustage-place': () => this.convert("place"),
      'user:filmustage-time': () => this.convert("time"),
      'user:filmustage-wtf': () => this.convert("wtf"),
      'user:filmustage-actor_add': () => this.convert("actor_add"),
      'user:filmustage-delete_tag': () => this.convert("DELETE")
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

      // push outside spaces
      symbols_begin = text.match(/^\s+/g) + ""
      symbols_end = text.match(/\s+$/g) + ""
      text_whitespace = text.replace(/^\s+|\s+$/g, "")

      // push outside characters like ,.-
      symbols_begin = symbols_begin + text_whitespace.match(/^[,.-]+/gi)
      symbols_end = text_whitespace.match(/[,.-]+$/gi) + symbols_end
      text_characters = text_whitespace.replace(/^[,.-]+|[,.-]+$/gi, "")

      // push outside 'S in names end
      symbols_end = text_characters.match(/'s+$|'+$/gi) + symbols_end
      text_ss = text_characters.replace(/'s+$|'+$/gi, "")

      // push outside articles (a, an, the) in begin
      symbols_begin = symbols_begin + text_ss.match(/^a\s|^an\s|^the\s/gi)
      text_articles = text_ss.replace(/^a\s|^an\s|^the\s/gi, "")

      // remove around tags
      text_untag = text_articles.replace(/(<([^>]+)>)/gi, "")

      symbols_begin = symbols_begin.replace(/null/gi, "")
      symbols_end = symbols_end.replace(/null/gi, "")

      prefix = symbols_begin + "<"+pref+">"
      suffix = "</"+pref+">" + symbols_end
      if (pref != "DELETE")
        selection.insertText(prefix + text_untag + suffix, {select: true})
      else
        selection.insertText(text_untag, {select: true})
    }
  }
}
