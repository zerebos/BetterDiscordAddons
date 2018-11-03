//META{"name":"EmoteSearch", "displayName":"EmoteSearch"}*//

class EmoteSearch {

	constructor() {
		this.lastSearch = '';
		this.emoteStore = {};

		this.css = `/* EmoteSearch CSS */

		@keyframes backdrop-open {
			to { opacity: 0.85; }
		}

		@keyframes modal-open {
			to { transform: scale(1); opacity: 1; }
		}

		@keyframes backdrop-close {
			to { opacity: 0; }
		}

		@keyframes modal-close {
			to { transform: scale(0.7); opacity: 0; }
		}

		#EmoteSearchModal .backdrop {
			animation: backdrop-open 250ms ease;
			animation-fill-mode: forwards;
			opacity: 0;
			background-color: rgb(0, 0, 0);
			transform: translateZ(0px);
		}

		#EmoteSearchModal.closing .backdrop {
			animation: backdrop-close 200ms linear;
			animation-fill-mode: forwards;
			animation-delay: 50ms;
			opacity: 0.85;
		}

		#EmoteSearchModal.closing .modal {
			animation: modal-close 250ms cubic-bezier(0.19, 1, 0.22, 1);
			animation-fill-mode: forwards;
			opacity: 1;
			transform: scale(1);
		}

		#EmoteSearchModal .modal {
			animation: modal-open 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
			animation-fill-mode: forwards;
			transform: scale(0.7);
			opacity: 0;
		}

		#EmoteSearchModal .emote-list {
			padding-top: 5px;
			min-height: 250px;
		}

		#EmoteSearchModal .modal-inner {
			min-height: unset;
		}

		#EmoteSearchModal .footer {
			display: flex;
			justify-content: space-between;
			color: white;
		}

		#EmoteSearchModal .page-button {
			cursor: pointer;
		}

		#EmoteSearchModal .page-button.disabled {
			pointer-events: none;
			color: transparent;
		}

		#EmoteSearchModal .emotewrapper {
			cursor: pointer;
			margin: 1px;
			vertical-align: top;
		}
		`;

		this.modalHTML = `<div id="EmoteSearchModal" class="theme-dark">
		<div class="backdrop \${backdrop}"></div>
		<div class="modal \${modalWrapper}">
			<div class="\${modalWrapperInner}">
				<div class="modal-inner \${modal}">
					<div class="\${header}">
						<h4 class="title \${title}"></h4>
						<svg viewBox="0 0 12 12" name="Close" width="18" height="18" class="close-button \${close}"><g fill="none" fill-rule="evenodd"><path d="M0 0h12v12H0"></path><path class="fill" fill="currentColor" d="M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5l-.705.705L5.295 6 2.5 8.795l.705.705L6 6.705 8.795 9.5l.705-.705L6.705 6"></path></g></svg>
					</div>
					<div class="\${scrollerWrap}">
						<div class="emote-list \${scroller}">

						</div>
					</div>
					<div class="footer \${footer}">
						<div class="page-button previous">←</div>
						<div class="page-indicator"></div>
						<div class="page-button next">→</div>
					</div>
				</div>
			</div>
		</div>
	</div>`;

	}

	replace(string, values) {
		for (let val in values) {
			string = string.replace(new RegExp(`\\$\\{${val}\\}`, 'g'), values[val]);
		}
		return string;
	}

	async start() {
		BdApi.injectCSS(this.getName(), this.css);
		this.textAreaClasses = BDV2.WebpackModules.findByUniqueProperties(['textArea', 'channelTextArea']);
		let modalClasses = BDV2.WebpackModules.findByUniqueProperties(['modal', 'close']);
		let modalWrapClasses = BDV2.WebpackModules.find(m => m.modal && m.inner && !m.close);
		let backdropClass = BDV2.WebpackModules.findByUniqueProperties(['backdrop']).backdrop;
		let scrollerClasses = BDV2.WebpackModules.findByUniqueProperties(['scrollerWrap']);
		let titleClasses = BDV2.WebpackModules.findByUniqueProperties(['title', 'h4']);
		let flexClasses = BDV2.WebpackModules.findByUniqueProperties(['flex', 'horizontal']);
		this.modalHTML = this.replace(this.modalHTML, {
			backdrop: backdropClass,
			modalWrapper: modalWrapClasses.modal,
			modalWrapperInner: modalWrapClasses.inner,
			modal: modalClasses.modal + " " + modalClasses.sizeMedium,
			header: `${modalClasses.header} ${flexClasses.flex} ${flexClasses.horizontal} ${flexClasses.directionRow} ${flexClasses.justifyStart} ${flexClasses.alignCenter} ${flexClasses.noWrap}`,
			title: `${titleClasses.title} ${titleClasses.h4} ${titleClasses.defaultColor} ${titleClasses.defaultMarginh4}`,
			close: modalClasses.close,
			scrollerWrap: `${modalClasses.content} ${scrollerClasses.scrollerWrap} ${scrollerClasses.scrollerThemed} ${scrollerClasses.themeGhostHairline}`,
			scroller: modalClasses.inner + " " + scrollerClasses.scroller,
			footer: modalClasses.footer
		});
		this.attachParser();
		var start = performance.now();
		try {
			await window.emotePromise;
			this.emoteStore = Object.assign({}, window.bdEmotes.BTTV, window.bdEmotes.BTTV2, window.bdEmotes.FrankerFaceZ, window.bdEmotes.TwitchGlobal, window.bdEmotes.TwitchSubscriber);
			if (Object.keys(this.emoteStore).length < 10) {
				console.error('EmoteSearch: zerebos probably broke it go ping him');
			} else {
				console.log('EmoteSearch: emotes loaded');
			}
			var diff = performance.now() - start;
			console.log('EmoteSearch: took ' + diff + 'ms');
		}
		catch(e) { console.warn('EmoteSearch: failed to load emotes: ' + e); }
	}

	stop() {
		$('*').off("." + this.getName());
		BdApi.clearCSS(this.getName());
	}

	attachParser() {
		var el = $('.' + this.textAreaClasses.textArea.split(" ")[0]);
		if (el.length == 0) return;
		el.on("keydown." + this.getName(), this.handleKeypress.bind(this));
	}

	handleKeypress(e) {
		var code = e.keyCode || e.which;
		if(code !== 13) return;
		try {
			var val = $('.' + this.textAreaClasses.textArea.split(" ")[0]).val().trim(),
				split = val.split(' '),
				commandIndex = split.indexOf('/es'),
				text = "",
				query = null;
			if (commandIndex >= 0) {
				e.preventDefault();
				e.stopPropagation();
				if (commandIndex > 0) text = split.slice(0, commandIndex).join(' ');
				if (query = split[commandIndex + 1]) {
					this.lastSearch = query;
					this.showResults(this.search(query));
				}
				this.setText(text);
				return;
			}
		}
		catch(e) { console.warn("EmoteSearch: failed to show search results: " + e); }
	}

	showResults(results) {
		var modal = $(this.modalHTML),
			emoteList = modal.find('.emote-list'),
			closeButton = modal.find('.close-button'),
			backdrop = modal.find('.backdrop'),
			nextButton = modal.find('.next'),
			prevButton = modal.find('.previous'),
			pageLabel = modal.find('.page-indicator');

		var closeModal = () => {
			BDV2.reactDom.unmountComponentAtNode(emoteList[0]);
			modal.addClass('closing');
			$(document).off(`mouseover.${this.getName()}`);
			setTimeout(() => { modal.remove(); }, 300);
		};
		closeButton.on('click', closeModal);
		backdrop.on('click', closeModal);
		modal.find('.title').text(results.length + " Results containing '" + this.lastSearch + "'");
		$("body").append(modal);

		const component = BDV2.reactDom.render(BDV2.react.createElement(this.component), emoteList[0]);

		var totalPages = results.length / 100,
			currentPage = totalPages && 1;
		if (results.length % 100) totalPages = (0 | totalPages) + 1;

		var changePage = (pageNum) => {
			currentPage = pageNum;
			if (totalPages === currentPage) nextButton.addClass("disabled");
			else nextButton.removeClass("disabled");
			if (currentPage === 0 || currentPage === 1) prevButton.addClass("disabled");
			else prevButton.removeClass("disabled");
			pageLabel.text(`Page ${currentPage}/${totalPages}`);
			if (currentPage) component.setState({items: this.getEmoteProps(results, (pageNum - 1) * 100, ((pageNum - 1) * 100) + 100)});
		};

		changePage(currentPage);

		nextButton.on('click', () => {changePage(currentPage + 1);});
		prevButton.on('click', () => {changePage(currentPage - 1);});
	}

	getEmoteProps(results, start, end) {
		const self = this;
		const emotes = [];
		if (end >= results.length) end = results.length;
		for (let i = start; i < end; i++){
			const emoteKey = results[i];
			const emote = this.emoteStore[emoteKey];
			emotes.push({
				name: emoteKey,
				url: emote,
				modifier: "",
				jumboable: true,
				onClick: function() {
				self.addText(this.name);
			}});
		}
		return emotes;
	}

	search(s) {
		s = s.toLowerCase()
		var matches = [];
		for (var k in this.emoteStore) if (k.toLowerCase().indexOf(s) > -1) matches.push(k);
		return matches;
	}

	setText(new_val) {
		try {
			var textarea = $('.' + this.textAreaClasses.textArea.split(" ")[0])[0];
			textarea.focus();
			textarea.selectionStart = 0;
			textarea.selectionEnd = textarea.value.length;
			document.execCommand("insertText", false, new_val);
		} catch(e) { console.log('failed to set text: ' + e); }
	}

	addText(new_val) {
		try {
			new_val = ' ' + new_val;
			var textarea = $('.' + this.textAreaClasses.textArea.split(" ")[0])[0];
			textarea.focus();
			textarea.selectionStart = textarea.value.length;
			textarea.selectionEnd = textarea.value.length;
			document.execCommand("insertText", false, new_val);
		} catch(e) { console.log( 'failed to add text: ' + e); }
	}

	observer(e) {
		if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element)) return;
		if (e.addedNodes[0].querySelector('.' + this.textAreaClasses.textArea.split(" ")[0]))	this.attachParser();
	}

	get component() {
		return class EmoteListWrapper extends BDV2.react.Component {
			constructor(props) {
				super(props);
				this.state = {
					items: []
				};
			}
		
			render() {
				if (!this.state.items.length) return null;
				return BDV2.react.createElement(
					"div", {
						className: "react-wrapper"
					}, ...this.state.items.map(i => BDV2.react.createElement(BDEmote, i)));
			}
		};
	}


	load() {}
	onSwitch() { this.attachParser(); }
	getName() { return "EmoteSearch"; }
	getDescription() { return "Search through all emotes in bd with /es emoteuwant"; }
	getVersion() { return "1.2.4"; }
	getAuthor() { return "Ckat/Cate edited by confus, rewritten by zerebos"; }
}
