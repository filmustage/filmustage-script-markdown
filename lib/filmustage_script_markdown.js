'use babel';
const {CompositeDisposable} = require('atom')
configSchema = require('./config-schema')
mTags = window.Tags;

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

// conver RGBA to HEX
function rgbaToHex(rgb){
  rgb = rgb + "";
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}


module.exports = {
  TagsColor: null,
  modalPanel: null,
  subscriptions: null,
  config: configSchema,

  // add dynamic css
  addCSS () {
    tmp_l = document.getElementById("colorTag");
    if (tmp_l){
      tmp_l.parentElement.removeChild(tmp_l);
    }

    // generate JSON for touchbar plugin
    touchBar = [];
    for (index = 1; index < mTags.length+1; ++index) {
      bLabel = atom.config.get('filmustage_script_markdown.f'+index+'Tag');
      if (bLabel == "location") bLabel = "loc";
      if (bLabel == "location-add") bLabel = "loc-add";
      touchBar[index-1] = {"type":"button","name":"f"+index+"-button","label":""+bLabel.substring(0, 10)+"","command":"filmustage:tag-f"+index+"","color":""+rgbaToHex(atom.config.get('filmustage_script_markdown.f'+index+'Color'))+"","icon":""}
    }
    atom.config.set('filmustage_script_markdown.touchBar', JSON.stringify(touchBar));


    if (atom.config.get('filmustage_script_markdown.enableColortags')){
      var sheet = document.createElement('style');
      sheet.setAttribute("id","colorTag");

      for (index = 1; index < mTags.length+1; ++index) {
          sheet.innerHTML += "\natom-text-editor .lines .line:not(#arienai) [data-tag-name='"+atom.config.get('filmustage_script_markdown.f'+index+'Tag')+"']{color:"+atom.config.get('filmustage_script_markdown.f'+index+'Color')+";}"
      }
      document.getElementsByTagName("atom-styles")[0].appendChild(sheet);
    }
  },

  activate (state) {
    // tags color
    this.TagsColor = new TagsColor(state.TagsColorViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.TagsColor.getElement(),
      visible: false
    });

    this.subscriptions = new CompositeDisposable()

    if (atom.config.get('filmustage_script_markdown.enableColortags')){
      this.addCSS()
      this.toggle()
    }

    this.subscriptions.add(
      atom.config.onDidChange('filmustage_script_markdown', ({newValue}) => { this.addCSS () })
      //({newValue}) => { newValue })
    )

    this.subscriptions.add(atom.commands.add('atom-workspace',{
          'filmustage:tag-f1': () => this.convert(atom.config.get('filmustage_script_markdown.f1Tag')),
          'filmustage:tag-f2': () => this.convert(atom.config.get('filmustage_script_markdown.f2Tag')),
          'filmustage:tag-f3': () => this.convert(atom.config.get('filmustage_script_markdown.f3Tag')),
          'filmustage:tag-f4': () => this.convert(atom.config.get('filmustage_script_markdown.f4Tag')),
          'filmustage:tag-f5': () => this.convert(atom.config.get('filmustage_script_markdown.f5Tag')),
          'filmustage:tag-f6': () => this.convert(atom.config.get('filmustage_script_markdown.f6Tag')),
          'filmustage:tag-f7': () => this.convert(atom.config.get('filmustage_script_markdown.f7Tag')),
          'filmustage:tag-f8': () => this.convert(atom.config.get('filmustage_script_markdown.f8Tag')),
          'filmustage:tag-f9': () => this.convert(atom.config.get('filmustage_script_markdown.f9Tag')),
          'filmustage:tag-f10': () => this.convert(atom.config.get('filmustage_script_markdown.f10Tag'))
    }))
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

      if (pref != "place" && pref != "location" && pref != "time") {
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
      }else{
        text_articles = text_whitespace;
      }

      // remove around tags
      text_untag = text_articles.replace(/(<([^>]+)>)/gi, "")

      symbols_begin = symbols_begin.replace(/null/gi, "")
      symbols_end = symbols_end.replace(/null/gi, "")

      prefix = symbols_begin + "<"+pref+">"
      suffix = "</"+pref+">" + symbols_end
      if (pref != "delete-tag")
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
        //console.log(html);
        html = html.slice(1);
      }
      if(elm.classList.contains("syntax--html")){
        elm.parentNode.setAttribute("data-tag-name", html);
      }else{
        elm.setAttribute("data-tag-name", html);
      }
      if (atom.config.get('filmustage_script_markdown.enableColortags') == false)
        elm.removeAttribute("data-tag-name", html);
    });
  }
}
