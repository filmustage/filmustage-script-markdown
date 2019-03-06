"use babel";
const { CompositeDisposable } = require("atom");
const elementResizeDetectorMaker = require("./element-resize-detector.min");
const atom = global.atom;
const erd = elementResizeDetectorMaker();
const configSchema = require("./filmustage-config");
const mTags = window.Tags;

class TagsColor {
	constructor () {
		// Create root element
		this.element = document.createElement("div");
		this.element.classList.add("filmustage-script-markdown");
	}

	getElement () {
		return this.element;
	}

	serialize () {}
	// Tear down any state and detach
	destroy () {
		this.element.remove();
	}
}

// conver RGBA to HEX
function rgbaToHex(rgb) {
	rgb = rgb + "";
	rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : "";
}

module.exports = {
	TagsColor: null,
	modalPanel: null,
	subscriptions: null,
	config: configSchema,

	// add dynamic css
	addCSS () {
		var tmpL = document.getElementById("colorTag");
		if (tmpL) {
			tmpL.parentElement.removeChild(tmpL);
		}

		// generate JSON for touchbar plugin
		var touchBar = [];
		var index;
		for (index = 1; index < mTags.length+1; ++index) {
			var bLabel = atom.config.get("filmustage-script-markdown.f" + index + "Tag");
			if (bLabel === "location") {
				bLabel = "loc";
			}
			if (bLabel === "location-add") {
				bLabel = "loc-add";
			}
			touchBar[index-1] = { "type":"button", "name":"f" + index + "-button", "label":"" + bLabel.substring(0, 10) + "", "command":"filmustage:tag-f" + index + "", "color":"" + rgbaToHex(atom.config.get("filmustage-script-markdown.f" + index + "Color"))+"", "icon":"" };
		}
		atom.config.set("filmustage-script-markdown.touchBar", JSON.stringify(touchBar));

		var sheet = document.createElement("style");
		sheet.setAttribute("id","colorTag");

		for (index = 1; index < mTags.length+1; ++index) {
			sheet.innerHTML += "\natom-text-editor .lines .line:not(#arienai) [data-tag-name='"+atom.config.get("filmustage-script-markdown.f"+index+"Tag")+"']{ color:"+atom.config.get("filmustage-script-markdown.f"+index+"Color")+"; }";
		}
		document.getElementsByTagName("atom-styles")[0].appendChild(sheet);
	},

	activate (state) {
		// tags color
		this.TagsColor = new TagsColor(state.TagsColorViewState);
		this.modalPanel = atom.workspace.addModalPanel({
			item: this.TagsColor.getElement(),
			visible: false
		});

		this.subscriptions = new CompositeDisposable();

		if (atom.config.get("filmustage-script-markdown.enableColortags")) {
			this.addCSS();
			this.toggle();
		}
		this.subscriptions.add(
			atom.config.onDidChange("filmustage-script-markdown", () => { this.addCSS(); })
		);

		this.subscriptions.add(atom.commands.add("atom-workspace",{
			"filmustage:tag-f1": () => this.convert(atom.config.get("filmustage-script-markdown.f1Tag")),
			"filmustage:tag-f2": () => this.convert(atom.config.get("filmustage-script-markdown.f2Tag")),
			"filmustage:tag-f3": () => this.convert(atom.config.get("filmustage-script-markdown.f3Tag")),
			"filmustage:tag-f4": () => this.convert(atom.config.get("filmustage-script-markdown.f4Tag")),
			"filmustage:tag-f5": () => this.convert(atom.config.get("filmustage-script-markdown.f5Tag")),
			"filmustage:tag-f6": () => this.convert(atom.config.get("filmustage-script-markdown.f6Tag")),
			"filmustage:tag-f7": () => this.convert(atom.config.get("filmustage-script-markdown.f7Tag")),
			"filmustage:tag-f8": () => this.convert(atom.config.get("filmustage-script-markdown.f8Tag")),
			"filmustage:tag-f9": () => this.convert(atom.config.get("filmustage-script-markdown.f9Tag")),
			"filmustage:tag-f10": () => this.convert(atom.config.get("filmustage-script-markdown.f10Tag"))
		}));
	},

	deactivate () {
		this.modalPanel.destroy();
		this.subscriptions.dispose();
		this.TagsColor.destroy();
	},

	isBetweenWordAndNonWord_ (this_) {
		if (this_.isAtBeginningOfLine() || this_.isAtEndOfLine()) {
			return true;
		}

		const { row, column } = this_.getBufferPosition();
		const range = [[row, column - 1], [row, column + 1]];
		const text = this_.editor.getTextInBufferRange(range);

		if (/\s/.test(text[0]) || /\s/.test(text[1])) {
			return true;
		}

		const nonWordCharacters = "./\\()\"':,.;<>~!@#%^&*|+=[]{}`~?-";

		return nonWordCharacters.includes(text[0]) !== nonWordCharacters.includes(text[1]);
	},

	convert (pref) {
		const editor = atom.workspace.getActiveTextEditor();
		if (editor) {
			var cursor = editor.getLastCursor();
			var startSelect = editor.getSelectedBufferRange().start;
			var endSelect = editor.getSelectedBufferRange().end;
			var beginWord = startSelect;
			var endWord = endSelect;

			if (editor.getLastSelection().isEmpty()) {
				editor.getLastSelection().selectWord();
			} else {
				editor.setCursorBufferPosition(startSelect);

				if(!this.isBetweenWordAndNonWord_(cursor))
					beginWord = cursor.getBeginningOfCurrentWordBufferPosition();

				editor.setCursorBufferPosition(endSelect);
				if(!this.isBetweenWordAndNonWord_(cursor))
					endWord = cursor.getEndOfCurrentWordBufferPosition();

				editor.setSelectedBufferRange({ start: beginWord, end: endWord });
			}

			var selection = editor.getLastSelection();
			var text = selection.getText();

			// push outside spaces
			var symbols_begin = text.match(/^\s+/g) + "";
			var symbols_end = text.match(/\s+$/g) + "";
			var text_whitespace = text.replace(/^\s+|\s+$/g, "");

			if (pref !== "location") {
				// push outside characters like ,.-
				symbols_begin = symbols_begin + text_whitespace.match(/^[(,.-]+/gi);
				symbols_end = text_whitespace.match(/[),.-]+$/gi) + symbols_end;
				var text_characters = text_whitespace.replace(/^[(,.-]+|[),.-]+$/gi, "");

				// push outside 'S in names end
				symbols_end = text_characters.match(/'s+$|'+$/gi) + symbols_end;
				var text_ss = text_characters.replace(/'s+$|'+$/gi, "");

				// push outside articles (a, an, the) in begin
				symbols_begin = symbols_begin + text_ss.match(/^a\s|^an\s|^the\s/gi);
				text_articles = text_ss.replace(/^a\s|^an\s|^the\s/gi, "");
			}else{
				var text_articles = text_whitespace;
			}

			// remove around tags
			var text_untag = text_articles.replace(/(<([^>]+)>)/gi, "");

			symbols_begin = symbols_begin.replace(/null/gi, "");
			symbols_end = symbols_end.replace(/null/gi, "");

			var prefix = symbols_begin + "<"+pref+">";
			var suffix = "</"+pref+">" + symbols_end;
			if (pref != "delete-tag")
				selection.insertText(prefix + text_untag + suffix, {select: true});
			else
				selection.insertText(symbols_begin + text_untag + symbols_end, {select: true});
		}
	},

	//tags colors functions
	serialize() {
		return {
			TagsColorViewState: this.TagsColor.serialize()
		};
	},

	toggle() {
		var than = this;
		setTimeout(this.notify, 200);
		atom.workspace.observeTextEditors((editor) => {
			editor.onDidStopChanging(this.notify);
			atom.views.getView(editor).onDidChangeScrollTop(() => { setTimeout(this.notify, 100); });
			atom.workspace.onDidStopChangingActivePaneItem(this.notify);
			editor.onDidChangeCursorPosition(this.notify);

			var scrollView = atom.views.getView(editor).querySelectorAll(".scroll-view");
			erd.listenTo(scrollView, function() {
				setTimeout(than.notify, 0);
			});
		});
	},

	notify() {
		var View = atom.views.getView(atom.workspace);
		var cmTag = View.querySelectorAll(".syntax--tag.syntax--entity, .syntax--attribute-name, .syntax--property-name");

		Array.prototype.forEach.call(cmTag, function(elm) {
			var html = elm.textContent;

			if(/^(\.|#)/.test(html))
				html = html.slice(1);

			if(elm.classList.contains("syntax--html"))
				elm.parentNode.setAttribute("data-tag-name", html);
			else
				elm.setAttribute("data-tag-name", html);

			if (atom.config.get("filmustage-script-markdown.enableColortags") === false)
				elm.removeAttribute("data-tag-name", html);
		});
	}
};
