import Editor from "@/lib/wangEditor"
import { IndentationOptions } from "@/lib/wangEditor/config/menus"
import { DomElement } from "@/lib/wangEditor/utils/dom-core"

export default class extends Editor.BtnMenu {
	constructor(editor: Editor) {
		const $elem = Editor.$(
			`<div class="w-e-menu" data-title="首字缩进">
                <span>T</span>
            </div>`
		)
		super($elem, editor)
	}
	firstIndent($node: DomElement, options: IndentationOptions) {
		const $elem = $node.elems[0]
		if ($elem.style["textIndent"] === "") {
			$node.css("text-indent", options.value + options.unit)
		} else {
			$node.css("text-indent", "")
		}
	}
	operateElement($node: DomElement) {
		const $elem = $node.getNodeTop(this.editor)
		const reg = /^P$/i

		if (reg.test($elem.getNodeName())) {
			this.firstIndent($elem, this.parseIndentation())
		}
	}
	parseIndentation() {
		const lengthRegex = /^(\d+)(\w+)$/
		const percentRegex = /^(\d+)%$/
		const { indentation } = this.editor.config
		if (typeof indentation === "string") {
			if (lengthRegex.test(indentation)) {
				const [value, unit] = indentation.trim().match(lengthRegex).slice(1, 3)
				return {
					value: Number(value),
					unit
				}
			} else if (percentRegex.test(indentation)) {
				return {
					value: Number(indentation.trim().match(percentRegex)[1]),
					unit: "%"
				}
			}
		} else if (indentation.value !== void 0 && indentation.unit) {
			return indentation
		}
		return {
			value: 2,
			unit: "em"
		}
	}
	clickHandler() {
		const editor = this.editor
		const $selectionElem = editor.selection.getSelectionContainerElem()
		if ($selectionElem && editor.$textElem.equal($selectionElem)) {
			const $elems = editor.selection.getSelectionRangeTopNodes()
			if ($elems.length > 0) {
				$elems.forEach(item => {
					this.operateElement(Editor.$(item))
				})
			}
		} else {
			if ($selectionElem && $selectionElem.length > 0) {
				$selectionElem.forEach(item => {
					this.operateElement(Editor.$(item))
				})
			}
		}
		editor.selection.restoreSelection()
		this.tryChangeActive()
	}
	tryChangeActive() {
		const $selectionElem = this.editor.selection.getSelectionStartElem()
		const $selectionStartElem = Editor.$($selectionElem).getNodeTop(this.editor)
		if ($selectionStartElem.length <= 0) return
		if ($selectionStartElem.elems[0].style["text-indent"] != "") {
			this.active()
		} else {
			this.unActive()
		}
	}
}
export const menuKey = "firstIndentMenuKey"
