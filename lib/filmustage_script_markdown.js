'use babel';
const {CompositeDisposable} = require('atom')

class TagsColor {
  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('filmustage_script_markdown');
  }
  getElement() {
    return this.element;
  }
  serialize() {}
  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }
}


module.exports = {
  TagsColor: null,
  modalPanel: null,
  subscriptions: null,

  activate (state) {

    // tags color
    this.TagsColor = new TagsColor(state.TagsColorViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.TagsColor.getElement(),
      visible: false
    });

    this.subscriptions = new CompositeDisposable()
    this.toggle()
    this.subscriptions.add(atom.commands.add('atom-workspace',{
      'user:filmustage-location': () => this.convert("location"),
      'user:filmustage-location_add': () => this.convert("location-add"),
      'user:filmustage-prop': () => this.convert("prop"),
      'user:filmustage-actor': () => this.convert("actor"),
      'user:filmustage-extras': () => this.convert("extras"),
      'user:filmustage-place': () => this.convert("place"),
      'user:filmustage-time': () => this.convert("time"),
      'user:filmustage-animal': () => this.convert("animal"),
      'user:filmustage-actor_add': () => this.convert("actor-add"),
      'user:filmustage-delete_tag': () => this.convert("DELETE")
    })
    )
  },

  deactivate () {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
		this.TagsColor.destroy()
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
      symbols_begin = symbols_begin + text_whitespace.match(/^[(,.-]+/gi)
      symbols_end = text_whitespace.match(/[),.-]+$/gi) + symbols_end
      text_characters = text_whitespace.replace(/^[(,.-]+|[),.-]+$/gi, "")

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
        selection.insertText(symbols_begin + text_untag + symbols_end, {select: true})
    }
  },

  //tags colors functions
  serialize() {
    return {
      TagsColorViewState: this.TagsColor.serialize()
    };
  },

  toggle() {
    this.notify();
    atom.workspace.observeTextEditors((editor) => {
      editor.onDidStopChanging(this.notify);
      editor.onDidChangeCursorPosition(this.notify);
      atom.views.getView(editor).onDidChangeScrollTop(this.notify);
    });
  },

  notify() {
    var View = atom.views.getView(atom.workspace);
    var dataTagName = View.querySelectorAll('[data-tag-name]');
    var cmTag = View.querySelectorAll('.syntax--tag.syntax--entity, .syntax--attribute-name, .syntax--property-name');
    Array.prototype.forEach.call(dataTagName, function(elm, i, arr) {
      elm.removeAttribute("data-tag-name");
    });
    Array.prototype.forEach.call(cmTag, function(elm, i, arr) {
      var html = elm.textContent;
      if(/^(\.|#)/.test(html)){
        console.log(html);
        html = html.slice(1);
      }
      if(elm.classList.contains("syntax--html")){
        elm.parentNode.setAttribute("data-tag-name", html);
      }else{
        elm.setAttribute("data-tag-name", html);
      }

    });
  }
}
