"use babel";
const {
	CompositeDisposable
} = require("atom");
const elementResizeDetectorMaker = require("./element-resize-detector.min");
const atom = global.atom;
const erd = elementResizeDetectorMaker();
const configSchema = require("./filmustage-config");
const mTags = window.Tags;

class TagsColor {
	constructor() {
		// Create root element
		this.element = document.createElement("div");
		this.element.classList.add("filmustage-script-markdown");
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
function rgbaToHex(rgb) {
	rgb = rgb + "";
	rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	return (rgb && rgb.length === 4) ? "#" +
		("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
		("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
		("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : "";
}

module.exports = {
	TagsColor: null,
	modalPanel: null,
	subscriptions: null,
	config: configSchema,

	// add dynamic css
	addCSS() {
		var tmpL = document.getElementById("colorTag");
		if (tmpL) {
			tmpL.parentElement.removeChild(tmpL);
		}

		// generate JSON for touchbar plugin
		var touchBar = [];
		var index;
		for (index = 0; index < mTags.length; index++) {
			next_index = index + 1
			touchBar[index] = {
				"type": "button",
				"name": "f" + next_index + "-button",
				"label": mTags[index].key,
				"command": "filmustage:tag-f" + next_index,
				"color": mTags[index].color,
				"icon": ""
			};
		}
		atom.config.set("filmustage-script-markdown.touchBar", JSON.stringify(touchBar));
	},

	activate(state) {
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
			atom.config.onDidChange("filmustage-script-markdown", () => {
				this.addCSS();
			})
		);
		var subscriptions = {};
  		var index;

   		for (index = 0; index < mTags.length; index++) {
			next_index = index + 1
    		Object.assign(subscriptions, {["filmustage:tag-f"+next_index]:() => this.convert(atom.config.get("filmustage-script-markdown.f" + next_index + "Tag"))});
   		}

   		this.subscriptions.add(atom.commands.add("atom-workspace", subscriptions));
	},

	deactivate() {
		this.modalPanel.destroy();
		this.subscriptions.dispose();
		this.TagsColor.destroy();
	},

	isBetweenWordAndNonWord_(this_) {
		if (this_.isAtBeginningOfLine() || this_.isAtEndOfLine()) {
			return true;
		}

		const {
			row,
			column
		} = this_.getBufferPosition();
		const range = [[row, column - 1], [row, column + 1]];
		const text = this_.editor.getTextInBufferRange(range);


		if (/\s/.test(text[0]) || /\s/.test(text[1])) {
			return true;
		}

		if (/</.test(text[0])) {
			return [row, column - 1];
		}

		if (/>/.test(text[1])) {
			return [row, column + 1];
		}

		return false;
	},

	convert(pref) {
		const editor = atom.workspace.getActiveTextEditor();
		if (editor) {
			var cursor = editor.getLastCursor();
			var startSelect, endSelect;

			startSelect = editor.getSelectedBufferRange().start;
			endSelect = editor.getSelectedBufferRange().end;

			var beginWord = startSelect;
			var endWord = endSelect;

			if (editor.getLastSelection().isEmpty()) {
				editor.getLastSelection().selectWord();
			}
			else {
				editor.setCursorBufferPosition(startSelect);
				if (!this.isBetweenWordAndNonWord_(cursor)) {
					beginWord = cursor.getBeginningOfCurrentWordBufferPosition();

					editor.setCursorBufferPosition(beginWord);
					if (this.isBetweenWordAndNonWord_(cursor) !== true && this.isBetweenWordAndNonWord_(cursor) !== false) {
						beginWord = this.isBetweenWordAndNonWord_(cursor);
					}
				}
				editor.setCursorBufferPosition(endSelect);
				if (!this.isBetweenWordAndNonWord_(cursor)) {
					endWord = cursor.getEndOfCurrentWordBufferPosition();

					editor.setCursorBufferPosition(endWord);
					if (this.isBetweenWordAndNonWord_(cursor) !== true && this.isBetweenWordAndNonWord_(cursor) !== false) {
						endWord = this.isBetweenWordAndNonWord_(cursor);
					}
				}

				editor.setSelectedBufferRange({
					start: beginWord,
					end: endWord
				});
			}



			var selection = editor.getLastSelection();
			var text = selection.getText();

			// push outside spaces
			var symbolsBegin = text.match(/^\s+/g) + "";
			var symbolsEnd = text.match(/\s+$/g) + "";
			var textWhitespace = text.replace(/^\s+|\s+$/g, "");
			var textArticles;

			if (pref !== "location") {
				// push outside characters like ,.-
				symbolsBegin = symbolsBegin + textWhitespace.match(/^[(,.-]+/gi);
				symbolsEnd = textWhitespace.match(/[),.-]+$/gi) + symbolsEnd;
				var textCharacters = textWhitespace.replace(/^[(,.-]+|[),.-]+$/gi, "");

				// push outside 'S in names end
				symbolsEnd = textCharacters.match(/'s+$|'+$/gi) + symbolsEnd;
				var textSs = textCharacters.replace(/'s+$|'+$/gi, "");

				// push outside articles (a, an, the) in begin
				symbolsBegin = symbolsBegin + textSs.match(/^a\s|^an\s|^the\s/gi);
				textArticles = textSs.replace(/^a\s|^an\s|^the\s/gi, "");
			}
			else {
				textArticles = textWhitespace;
			}

			// remove around tags
			var textUntag = textArticles.replace(/(<([^>]+)>)/gi, "");

			symbolsBegin = symbolsBegin.replace(/null/gi, "");
			symbolsEnd = symbolsEnd.replace(/null/gi, "");

			var prefix = symbolsBegin + "<" + pref + ">";
			var suffix = "</" + pref + ">" + symbolsEnd;
			if (pref !== "delete-tag") {
				selection.insertText(prefix + textUntag + suffix, {
					select: true
				});
			}
			else {
				selection.insertText(symbolsBegin + textUntag + symbolsEnd, {
					select: true
				});
			}
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
			atom.views.getView(editor).onDidChangeScrollTop(() => {
				setTimeout(this.notify, 100);
			});
			atom.workspace.onDidStopChangingActivePaneItem(this.notify);
			editor.onDidChangeCursorPosition(this.notify);

			var scrollView = atom.views.getView(editor).querySelectorAll(".scroll-view");
			erd.listenTo(scrollView, function () {
				setTimeout(than.notify, 0);
			});
		});
	},

	notify() {
		var View = atom.views.getView(atom.workspace);
		var cmTag = View.querySelectorAll(".syntax--tag.syntax--entity, .syntax--attribute-name, .syntax--property-name");

		Array.prototype.forEach.call(cmTag, function (elm) {
			var html = elm.textContent;

			if (/^(\.|#)/.test(html)) {
				html = html.slice(1);
			}

			if (elm.classList.contains("syntax--html")) {
				elm.parentNode.setAttribute("data-tag-name", html);
			}
			else {
				elm.setAttribute("data-tag-name", html);
			}

			if (atom.config.get("filmustage-script-markdown.enableColortags") === false) {
				elm.removeAttribute("data-tag-name", html);
			}
		});
	}
};
