//META{"name":"BetterFormattingRedux"}*//

/* global PluginSettings:false, PluginUtilities:false, PluginContextMenu:false, PluginTooltip:false, BdApi:false */

class BetterFormattingRedux {
	getName() { return "BetterFormattingRedux"; }
	getShortName() { return "BFRedux"; }
	getDescription() { return "Enables different types of formatting in standard Discord chat. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "2.2.4"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.isOpen = false;
		this.initialized = false;
		this.replaceList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
		this.smallCapsList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ{|}";
		this.superscriptList = " !\"#$%&'⁽⁾*⁺,⁻./⁰¹²³⁴⁵⁶⁷⁸⁹:;<⁼>?@ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ[\\]^_`ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻ{|}";
		this.upsideDownList = " ¡\"#$%⅋,)(*+'-˙/0ƖᄅƐㄣϛ9ㄥ86:;>=<¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z]\\[^‾,ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz}|{";
		this.fullwidthList = "　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝";
		this.leetList = " !\"#$%&'()*+,-./0123456789:;<=>?@48CD3FG#IJK1MN0PQЯ57UVWXY2[\\]^_`48cd3fg#ijk1mn0pqЯ57uvwxy2{|}";

		this.toolbarString = `<div id="bfredux" class='bf-toolbar'><div class='bf-arrow'></div></div>`;
		
		this.discordWrappers = {bold: "**", italic: "*", underline: "__", strikethrough: "~~", code: "`", codeblock: "```"};

		this.defaultSettings = {toolbar: {bold: {enabled: true, order: 0}, italic: {enabled: true, order: 1}, underline: {enabled: true, order: 2}, strikethrough: {enabled: true, order: 3},
										code: {enabled: true, order: 4}, codeblock: {enabled: true, order: 5}, superscript: {enabled: true, order: 6}, smallcaps: {enabled: true, order: 7},
										fullwidth: {enabled: true, order: 8}, upsidedown: {enabled: true, order: 9}, varied: {enabled: true, order: 10}, leet: {enabled: false, order: 11}},
								formats: {superscript: true, smallcaps: true, fullwidth: true, upsidedown: true, varied: true, leet: false},
								wrappers: {superscript: "^^", smallcaps: "%%", fullwidth: "##", upsidedown: "&&", varied: "||", leet: "++"},
								formatting: {fullWidthMap: true, reorderUpsidedown: true, startCaps: true},
								plugin: {hoverOpen: true, closeOnSend: true, chainFormats: true, icons: true},
								style: {rightSide: true, opacity: 1, fontSize: "85%"}};
		this.settings = this.defaultSettings;
						
		this.customWrappers = Object.keys(this.defaultSettings.wrappers);
		
		
		this.toolbarData = {
			bold: {type: "native-format",
					name: "Bold",
					displayName: "<b>Bold</b>",
					icon: "<img src='data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTE1LjYgMTAuNzljLjk3LS42NyAxLjY1LTEuNzcgMS42NS0yLjc5IDAtMi4yNi0xLjc1LTQtNC00SDd2MTRoNy4wNGMyLjA5IDAgMy43MS0xLjcgMy43MS0zLjc5IDAtMS41Mi0uODYtMi44Mi0yLjE1LTMuNDJ6TTEwIDYuNWgzYy44MyAwIDEuNS42NyAxLjUgMS41cy0uNjcgMS41LTEuNSAxLjVoLTN2LTN6bTMuNSA5SDEwdi0zaDMuNWMuODMgMCAxLjUuNjcgMS41IDEuNXMtLjY3IDEuNS0xLjUgMS41eiIvPiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+'>"},
			italic: {type: "native-format",
					name: "Italic",
					displayName: "<i>Italic</i>",
					icon: "<img src='data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMTAgNHYzaDIuMjFsLTMuNDIgOEg2djNoOHYtM2gtMi4yMWwzLjQyLThIMThWNHoiLz48L3N2Zz4='>"},
			underline: {type: "native-format",
						name: "Underline",
						displayName: "<u>Underline</u>",
						icon: "<img src='data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMTIgMTdjMy4zMSAwIDYtMi42OSA2LTZWM2gtMi41djhjMCAxLjkzLTEuNTcgMy41LTMuNSAzLjVTOC41IDEyLjkzIDguNSAxMVYzSDZ2OGMwIDMuMzEgMi42OSA2IDYgNnptLTcgMnYyaDE0di0ySDV6Ii8+PC9zdmc+'>"},
			strikethrough: {type: "native-format",
							name: "Strikethrough",
							displayName: "<s>Strikethrough</s>",
							icon: "<img src='data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMTAgMTloNHYtM2gtNHYzek01IDR2M2g1djNoNFY3aDVWNEg1ek0zIDE0aDE4di0ySDN2MnoiLz48L3N2Zz4='>"},
			code: {type: "native-format",
					name: "Code",
					displayName: "<span style='font-family:monospace;'>Code</span>",
					icon: "<img src='data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+ICAgIDxwYXRoIGQ9Ik05LjQgMTYuNkw0LjggMTJsNC42LTQuNkw4IDZsLTYgNiA2IDYgMS40LTEuNHptNS4yIDBsNC42LTQuNi00LjYtNC42TDE2IDZsNiA2LTYgNi0xLjQtMS40eiIvPjwvc3ZnPg=='>"},
			codeblock: {type: "native-format",
						name: "Codeblock",
						displayName: "<span style='font-family:monospace;text-decoration: underline overline;'>|Codeblock|</span>",
						icon: "<img src='data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNNy43NyA2Ljc2TDYuMjMgNS40OC44MiAxMmw1LjQxIDYuNTIgMS41NC0xLjI4TDMuNDIgMTJsNC4zNS01LjI0ek03IDEzaDJ2LTJIN3Yyem0xMC0yaC0ydjJoMnYtMnptLTYgMmgydi0yaC0ydjJ6bTYuNzctNy41MmwtMS41NCAxLjI4TDIwLjU4IDEybC00LjM1IDUuMjQgMS41NCAxLjI4TDIzLjE4IDEybC01LjQxLTYuNTJ6Ii8+PC9zdmc+'>"},
			superscript: {type: "bfr-format",
						name: "Superscript",
						displayName: "ˢᵘᵖᵉʳˢᶜʳᶦᵖᵗ",
						icon: "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAC9UlEQVR4nO2av08UQRTH+WFhDDFXUFhcYcKBFMRYWtgLgdLS4go7IHAJBYl2FJb8UOsrLC0sjJyGPwMTf5xWJFhYUFBcYfRjsUOczL1d9sfczuwyn+Sa2/fefWdu33ffwI2NBQKBQIUBFoBdoA+cA7+Ad8AO0HStb2QAN4Bt4JR4PgEd4KZrvVYBrgNvExZu8tq1ZqsATzMs/oIt17qtADSJel2nDzxS16aBJ0ReoDMAFlzrLwzwXFh8Q4hrAj+N2F0Xmq0C9IxFPU6IbRuxn8vUOhKAL8ai7iTE3jViT8vU6hzgvrEBZ641lQZwCzgxNuDIta5SIJoOzcUDrLjWNnKU8ZmPSYCdvAW7QrG2XdmiYwN0M+TfJjoDSLwBruUVNgUcGwXPsThUqFvW/NaOgakUuQ2i2WAgLPw3sO1UYIrauTaY6DywBZzFfOsnwIOi+vQPLHSLJtTtCnXbCfEN4BnDU55OD5guqq2w2BT1Mm8q8q2emrxaLz68BRwaNb8BizlqLapcnUOgdUleIfKv/r+AJaIDiM57YCZDjZbK0ekDSyly3W6AErEu1N7PkL8v5K+nzHW/AUrIgVH7L7CWIm9NxeocWBNWFsh+8JUEPwAeqhidS/veW8jgB8AMOfvea5D9YE+I2xPiUvW99zDsB3+AVe36qnpPp3p9HwcJ4ywjHKO9ImGhIz1IeUWMH9Sz7+MQ/KCefR8H8nwAVX7eZyFswFVugSttgsiPwT7Do3L9HoPIg9AAuKde5l9x6jUIxfR9R7veEa7Xww+Q+/4VMKnFTKr3TKrtB8jH4Y/AvBA7r67pVPc4jPy8/0HC/9+AFRWjU835ALnvN1PkbQp51fID5L5/CUykyJ1QsSbV8APkvv8AzGWoMadydPz3A+S+/w4s56i1rHJ1/PYD5L7fKFBvQ6jnpx8g9/0LYLxAzXFVw8QvP0Du+x4wa6H2LMM/ffPHD5D73qrAmA32ww+Q+976LRrTYn76QSAQCAQCgUAgEKg8/wD8huCrKK8/kQAAAABJRU5ErkJggg=='>"},
			smallcaps: {type: "bfr-format",
						name: "Smallcaps",
						displayName: "SᴍᴀʟʟCᴀᴘs",
						icon: "<img src='data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+ICAgIDxkZWZzPiAgICAgICAgPHBhdGggZD0iTTI0IDI0SDBWMGgyNHYyNHoiIGlkPSJhIi8+ICAgIDwvZGVmcz4gICAgPGNsaXBQYXRoIGlkPSJiIj4gICAgICAgIDx1c2Ugb3ZlcmZsb3c9InZpc2libGUiIHhsaW5rOmhyZWY9IiNhIi8+ICAgIDwvY2xpcFBhdGg+ICAgIDxwYXRoIGNsaXAtcGF0aD0idXJsKCNiKSIgZD0iTTIuNSA0djNoNXYxMmgzVjdoNVY0aC0xM3ptMTkgNWgtOXYzaDN2N2gzdi03aDNWOXoiLz48L3N2Zz4='>"},
			fullwidth: {type: "bfr-format",
						name: "Fullwidth",
						displayName: "Ｆｕｌｌｗｉｄｔｈ",
						icon: "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAA80lEQVR4nO3XzQ2CMBxAcQ4MwcFFHIRBWIQF2MBBZBAGeV5ogkSj1JQife9s0n9/Uj6qyszMzMzMLCIyl3v/AghQOkBsp9lIbAIIIIAAAggggAACCCCAAAIIIIAAuefZPQEEEEAAAQQQQIDTAAA1MGz4fRQAMAB13JSJAhpg3OOfnL1GoEm91lcBLXDf61JeXDR3oE293qdhOmDa8yyvTs4EdKnXfDXEBejX5zgDQKgHLqnXDgNcgdubQXJ2A66pN/903g9Y2vsCpQPMCOUegQVCuTfB1TBlPgZXA5X7IhSi5FfhEBs/hn5Y53gfQ2ZmZv/ZAxEIe1ZZ+BlyAAAAAElFTkSuQmCC'>"},
			upsidedown: {type: "bfr-format",
						name: "Upsidedown",
						displayName: "uʍopǝpᴉsd∩",
						icon: "<img src='data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTE2IDE3LjAxVjEwaC0ydjcuMDFoLTNMMTUgMjFsNC0zLjk5aC0zek05IDNMNSA2Ljk5aDNWMTRoMlY2Ljk5aDNMOSAzeiIvPiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+'>"},
			varied: {type: "bfr-format",
					name: "Varied",
					displayName: "VaRiEd CaPs",
					icon: "<img src='data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTE4IDRsLTQgNGgzdjdjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yVjhjMC0yLjIxLTEuNzktNC00LTRTNSA1Ljc5IDUgOHY3SDJsNCA0IDQtNEg3VjhjMC0xLjEuOS0yIDItMnMyIC45IDIgMnY3YzAgMi4yMSAxLjc5IDQgNCA0czQtMS43OSA0LTRWOGgzbC00LTR6Ii8+ICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4='>"},
			leet: {type: "bfr-format",
					name: "Leet",
					displayName: "1337",
					icon: "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABnklEQVRoge2YL1MCQRiHCRf8EATCBZwhEPwARILR4DeQaDDeDIFgMPAhDAQDgaDdYDAQcMYZMThDNBgIBsJj2GXmXFdub937g/M+kfe3w+/ZeQ8YGg1BEITaAbSAa2BF9ayACRDnKb+utrOVNS4SqJuvK1MXgUXVLXfw4iLwDae9K5DcfUQgMCKQev3OnBXIrAiB81KqK86KEDgE3kooPweawQX0zPYl1wNGwDJnyQQ4sswuXfv4CPQsb9hJzbs7ZLal41S+Y2Q2pG4/uICePxuRgSXTtAg0LbmBkZnk7eMj0DciCyAyMolFYGhkIuAxNf8EWoUL6MzUiN0AMermE9QqmGyAoc7E+kyaxLePj0BL31gWc9we7iVwUJqAztnWZMsGONW5CBhnCPT/2sdHIOLnGmzLn1jyV7+UH4fo43VAS4xQq/IB3ALdHflj4F5nH4CLkH38DhSMCJTQMWyf/yDwZB6qEa8uAraPxrowcxGIqe8fW23XvWujfu+8V9sZUB1muJYX9p2sfai6XyZ7IxDi6axUTAREQBAEoQ58Aaheq+k8olaNAAAAAElFTkSuQmCC'>"}
		};

		this.allLanguages = {
			C: {cpp: "C++", csharp: "C#", coffeescript: "CoffeeScript", css: "CSS"},
			H: {html: "HTML/XML"},
			J: {java: "Java", js: "JavaScript", json: "JSON"},
			M: {markdown: "Markdown"},
			P: {perl: "Perl", php: "PHP", py: "Python"},
			R: {ruby: "Ruby"},
			S: {sql: "SQL"},
			V: {vbnet: "VB.NET", vhdl: "VHDL"}
		};
		
		
		// CSS is a modified form of the CSS used in
		// Beard's Material Design Theme for BetterDiscord
		// Make sure to check it out!
		// http://www.beard-design.com/discord-material-theme
		this.mainCSS =  `/* CSS STUFF */
		
.bf-toolbar {
    user-select: none;
    white-space: nowrap;
    font-size:85%;
	display:block;
    position: absolute;
    color: rgba(255, 255, 255, .5);
    width:auto!important;
    right:0;
    bottom:auto;
    border-radius:3px;
    margin:0!important;
    height:27px!important;
    top:0px;
    transform:translate(0,-100%);
    opacity:1;
    overflow: hidden!important;
    pointer-events: none;
    padding:10px 30px 15px 5px;
    margin-right:5px!important;
}

.bf-toolbar.bf-visible,
.bf-toolbar.bf-hover:hover{
    pointer-events: initial;
}

.bf-toolbar:before {
    content:"";
    display: block;
    width:100%;
    height:calc(100% - 15px);
    position: absolute;
    z-index: -1;
    background:#424549;
    pointer-events: initial;
    left:0px;
    top:5px;
    border-radius:3px;
    transform:translate(0,55px);
    transition:all 200ms ease;
}

.bf-toolbar.bf-visible:before,
.bf-toolbar.bf-hover:hover:before {
    transform:translate(0,0px);
    transition:all 200ms cubic-bezier(0,0,0,1);
}

.bf-toolbar .format {
    display: inline;
    padding: 7px 5px;
    cursor: pointer;
    display : inline-flex;
    align-items : center;
    transform:translate(0,55px);
    transition:all 50ms,transform 200ms ease;
    position:relative;
    pointer-events: initial;
	border-radius:2px;
	max-height: 27px;
	box-sizing: border-box;
	vertical-align: middle;
}

.bf-toolbar .format img {
	opacity: 0.6;
	vertical-align: middle;
	max-height: inherit;
}

.bf-toolbar .format .format-border {
	border: 1px solid rgba(255, 255, 255, .5);
	border-radius: inherit;
}

.bf-toolbar .format:hover{
    background:rgba(255,255,255,.1);
    color:rgba(255,255,255,.9);
}

.bf-toolbar .format:active{
    background:rgba(0,0,0,.1)!important;
    transition:all 0ms,transform 200ms ease;
}

.bf-toolbar.bf-visible .format,
.bf-toolbar.bf-hover:hover .format{
    transform:translate(0,0);
    transition:all 50ms,transform 200ms cubic-bezier(0,0,0,1);
}

.bf-toolbar .format.disabled {
	display: none;
}

.bf-toolbar .format.ghost {
	color: transparent;
	background: rgba(0,0,0,.1);
}

.bf-toolbar .format.ghost img {
	opacity: 0;
}

.bf-toolbar .bf-arrow {
    content:"";
    display:block;
    background:url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTcuNDEgMTUuNDFMMTIgMTAuODNsNC41OSA0LjU4TDE4IDE0bC02LTYtNiA2eiIvPiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+);
    height:30px;
    width:30px;
    right:5px;
    position: absolute;
    pointer-events: initial;
    bottom:0;
    background-repeat: no-repeat;
    background-position: 50%;
    transition:all 200ms ease;
    opacity: .3;
    cursor:pointer;
}
.bf-toolbar.bf-visible .bf-arrow,
.bf-toolbar.bf-hover:hover .bf-arrow {
    transform:translate(0,-14px)rotate(-90deg);
    transition:all 200ms cubic-bezier(0,0,0,1);
    opacity: .9;
}

.message-group .bf-toolbar{
    padding: 10px 5px 15px 5px;
    animation:slide-up 300ms cubic-bezier(0,0,0,1), opacity 300ms ease
}
.upload-modal .bf-toolbar {
	position: relative;
	transform: none;
	padding: 5px 0;
	margin-right: 0;
	border-radius: 2px;
	text-align: center;
	background: #424549;
}
.upload-modal .bf-toolbar::before {
	display: none;
}
.upload-modal .bf-toolbar .format:hover{
    background:rgba(255,255,255,.1);
}
.upload-modal .bf-toolbar .format:active{
    background:rgba(0,0,0,.1);
}
.upload-modal .bf-toolbar .format,
.upload-modal .bf-toolbar:before,
.message-group .bf-toolbar .format,
.message-group .bf-toolbar:before{
    transform:translate(0,0);
}
.upload-modal .bf-toolbar .bf-arrow,
.message-group .bf-toolbar .bf-arrow{
    display: none;
}

.bf-toolbar.bf-left {
	left: 0!important;
	right: auto!important;
	margin-right: 0!important;
	margin-left: 5px!important;
	padding: 10px 10px 15px 30px!important;
}

.bf-toolbar.bf-left .bf-arrow {
	left: 5px!important;
	right: auto!important;
}

.bf-toolbar.bf-left.bf-hover:hover .bf-arrow,.bf-toolbar.bf-left.bf-visible .bf-arrow {
	-webkit-transform: translate(0,-14px) rotate(90deg)!important;
	-ms-transform: translate(0,-14px) rotate(90deg)!important;
	transform: translate(0,-14px) rotate(90deg)!important;
}
.bf-languages {
	display: block;
	position: fixed !important;
	transform: scale(1,0);
	transform-origin: 100% 100%!important;
	background: #424549;
	border-radius: 3px;
	color: rgba(255,255,255,.5);
	padding: 3px;
}
.bf-languages.bf-visible {
	height: auto;
	transition: 200ms cubic-bezier(.2,0,0,1);
	transform: scale(1,1);
	transform-origin: 100% 100%!important;
}

.bf-languages div {
	display: block;
	cursor: pointer;
	padding: 5px 7px;
	border-radius: 2px;
}

.bf-languages div:hover {
    background: rgba(255,255,255,.1);
    color: rgba(255,255,255,.9);
}
`;

	}

	loadSettings() {
		this.settings = PluginUtilities.loadSettings(this.getShortName(), this.defaultSettings);
	}

	saveSettings() {
		PluginUtilities.saveSettings(this.getShortName(), this.settings);
	}
	
	escape(s) {
		return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
	}

	checkForUpdate() { PluginUtilities.checkForUpdate(this.getName(), this.getVersion()); }
	
	load() {}

	unload() {}
	
	start() {
		var libraryScript = document.getElementById('zeresLibraryScript');
		if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
		libraryScript = document.createElement("script");
		libraryScript.setAttribute("type", "text/javascript");
		libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
		libraryScript.setAttribute("id", "zeresLibraryScript");
		document.head.appendChild(libraryScript);

		if (typeof window.ZeresLibrary !== "undefined") this.initialize();
		else libraryScript.addEventListener("load", () => { this.initialize(); });
	}

	initialize() {
		var sortableScript = document.createElement("script");
		sortableScript.setAttribute("type", "text/javascript");
		sortableScript.setAttribute("src", "//cdn.rawgit.com/rauenzi/BetterDiscordAddons/master/Plugins/Sortable.js");
		sortableScript.setAttribute("id", "sortableScript");
		document.head.appendChild(sortableScript);

		if (typeof window.Sortable !== "undefined") {
			this.secondaryInitialize();
		}
		else {
			sortableScript.addEventListener("load", () => {this.secondaryInitialize();});
		}
	}

	secondaryInitialize() {
		this.initialized = true;
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		this.loadSettings();
		BdApi.injectCSS(this.getShortName()  + "-style", this.mainCSS);
		this.sortableScriptLoaded = true;
		this.setupToolbar();
	}
	
	stop() {
		this.initialized = false;
		$("*").off("." + this.getShortName());
		$(".bf-toolbar").remove();
		var sortableScript = document.getElementById('sortableScript');
		if (sortableScript) sortableScript.parentElement.removeChild(sortableScript);
		BdApi.clearCSS(this.getShortName() + "-style");
	}
	
	onSwitch() {}
	
	observer(e) {
		if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !this.initialized) return;

		var elem = e.addedNodes[0];
		
		if (elem.querySelector(".textArea-20yzAH") && this.initialized) {
			var textarea = elem.querySelector(".textArea-20yzAH");
			this.addToolbar($(textarea));
		}
	}
	
	getSettingsPanel() {
		var panel = $("<form>").addClass("form").css("width", "100%");
		if (this.initialized) this.generateSettings(panel);
		return panel[0];
	}

	updateStyle() {
		this.updateSide();
		this.updateOpacity();
		this.updateFontSize();
	}
	
	updateSide() {
		if (this.settings.style.rightSide) { $(".bf-toolbar").removeClass("bf-left"); }
		else { $(".bf-toolbar").addClass("bf-left"); }
	}
	
	updateOpacity() {
		$(".bf-toolbar").css("opacity", this.settings.style.opacity);
	}

	updateFontSize() {
		$(".bf-toolbar").css("font-size", this.settings.style.fontSize);
	}
	
	openClose() {
		this.isOpen = !this.isOpen;
		$(".bf-toolbar").toggleClass('bf-visible');
	}
	
	doFormat(text, wrapper, offset) {

		// If this is not a wrapper, return original
		if (text.substring(offset, offset + wrapper.length) != wrapper) return text;
		
		var returnText = text, len = text.length;
		var begin = text.indexOf(wrapper, offset);
		
		if (text[begin - 1] == "\\") return text; // If the wrapper is escaped, remove the backslash and return the text
		
		var end = text.indexOf(wrapper, begin + wrapper.length);
		if (end != -1) end += wrapper.length - 1;
		
		// Making it to this point means that we have found a full wrapper
		// This block performs inner chaining
		if (this.settings.plugin.chainFormats) {
			for (var w = 0; w < this.customWrappers.length; w++) {
				var newText = this.doFormat(returnText, this.settings.wrappers[this.customWrappers[w]], begin + wrapper.length);
				if (returnText != newText) {
					returnText = newText;
					end = end - this.settings.wrappers[this.customWrappers[w]].length * 2;
				}
			}
		}
		
		returnText = returnText.replace(new RegExp(`([^]{${begin}})${this.escape(wrapper)}([^]*)${this.escape(wrapper)}([^]{${len - end - 1}})`), (match, before, middle, after) => {
			var letterNum = 0;
			middle = middle.replace(/./g, letter => {
				var index = this.replaceList.indexOf(letter);
				letterNum += 1;
				if (wrapper == this.settings.wrappers.fullwidth) {
					if (this.settings.formatting.fullWidthMap) return index != -1 ? this.fullwidthList[index] : letter;
					else return index != -1 ? letterNum == middle.length ? letter.toUpperCase() : letter.toUpperCase() + " " : letter;
				}
				else if (wrapper == this.settings.wrappers.superscript) {return index != -1 ? this.superscriptList[index] : letter;}
				else if (wrapper == this.settings.wrappers.smallcaps) {return index != -1 ? this.smallCapsList[index] : letter;}
				else if (wrapper == this.settings.wrappers.upsidedown) {return index != -1 ? this.upsideDownList[index] : letter;}
				else if (wrapper == this.settings.wrappers.leet) {return index != -1 ? this.leetList[index] : letter;}
				else if (wrapper == this.settings.wrappers.varied) {
					var compare = this.settings.formatting.startCaps ? 1 : 0;
					if (letter.toLowerCase() == letter.toUpperCase()) letterNum = letterNum - 1;
					return index != -1 ? letterNum % 2 == compare ? letter.toUpperCase() : letter.toLowerCase() : letter;
				}
				else {return letter;}
			});
			if (wrapper == this.settings.wrappers.upsidedown && this.settings.formatting.reorderUpsidedown) return before + middle.split("").reverse().join("") + after;
			else return before + middle + after;
		});
		
		return returnText;
	}
	
	format(e) {
		if (e.shiftKey || e.which != 13) return;
		var textarea = $(e.currentTarget);
		var text = textarea.val();
		for (var i = 0; i < text.length; i++) {
			if (text[i] == "`") {
				var next = text.indexOf("`", i + 1);
				if (next != -1)
					i = next;
			}
			else if (text[i] == "@") {
				var match = /@.*#[0-9]*/.exec(text.substring(i));
				if(match && match.index == 0) i += match[0].length - 1;
			}
			else {
				for (var w = 0; w < this.customWrappers.length; w++) {
					if (!this.settings.formats[this.customWrappers[w]]) continue;
					var newText = this.doFormat(text, this.settings.wrappers[this.customWrappers[w]], i);
					if (text != newText) {
						text = newText;
						i = i - this.settings.wrappers[this.customWrappers[w]].length * 2;
					}
				}
			}
		}
		var txt = textarea[0];
		txt.selectionStart = 0;
		txt.selectionEnd = txt.value.length;
		document.execCommand("insertText", false, text);
		if (this.settings.plugin.closeOnSend) $(".bf-toolbar").removeClass('bf-visible');
	}
	
	wrapSelection(textarea, wrapper, language) {
		var text = textarea.value;
		var start = textarea.selectionStart;
		var len = text.substring(textarea.selectionStart, textarea.selectionEnd).length;
		var lang = language ? language : "";
		var newline = wrapper === "```" ? "\n" : "";
		text = wrapper + lang + newline + text.substring(textarea.selectionStart, textarea.selectionEnd) + newline + wrapper;
		textarea.focus();
		document.execCommand("insertText", false, text);
		textarea.selectionEnd = (textarea.selectionStart = start + wrapper.length + lang.length + newline.length) + len;
	}
	
	getContextMenu(textarea) {
		var items = [];
		for (var letter in this.allLanguages) {
			var subItems = [];
			for (var language in this.allLanguages[letter]) {
				((language) => {
					subItems.push(new PluginContextMenu.TextItem(this.allLanguages[letter][language], {callback: () => {this.wrapSelection(textarea[0], "```", language);}}));
				})(language);
			}
			items.push(new PluginContextMenu.SubMenuItem(letter, new PluginContextMenu.Menu(true).addItems(...subItems)));
		}
		return new PluginContextMenu.Menu().addItems(...items);
	}

	buildToolbar(textarea) {
		var toolbar = $(this.toolbarString);
		if (typeof this.settings.toolbar.bold === "boolean") {
			this.settings.toolbar = this.defaultSettings.toolbar;
			this.saveSettings();
		}
		var sorted = Object.keys(this.settings.toolbar).sort((a,b) => {return this.settings.toolbar[a].order - this.settings.toolbar[b].order;});
		for (var i = 0; i < sorted.length; i++) {
			var button = $("<div>");
			button.addClass("format");
			button.addClass(this.toolbarData[sorted[i]].type);
			new PluginTooltip.Tooltip(button, this.toolbarData[sorted[i]].name);
			if (!this.settings.toolbar[sorted[i]].enabled) button.addClass("disabled");
			if (sorted[i] === "codeblock") {
				let contextMenu = this.getContextMenu(textarea);
				button.on("contextmenu", (e) => {
					contextMenu.show(e.clientX, e.clientY);
				});
			}
			button.attr("data-name", sorted[i]);
			if (this.settings.plugin.icons) button.html(this.toolbarData[sorted[i]].icon);
			else button.html(this.toolbarData[sorted[i]].displayName);
			toolbar.append(button);
		}
		window.Sortable.create(toolbar[0], {
			draggable: ".format", // css-selector of elements, which can be sorted
			ghostClass: "ghost",
			onUpdate: () => {
				var buttons = toolbar.children(".format");
				for (var i = 0; i < buttons.length; i++) {
					this.settings.toolbar[$(buttons[i]).data("name")].order = i;
				}
				this.saveSettings();
			}
		});
		if (!this.settings.plugin.icons) {
			toolbar.on("mousemove." + this.getShortName(), (e) => {
				var $this = $(e.currentTarget);
				var pos = e.pageX - $this.parent().offset().left;
				var diff = -$this.width();
				$this.children().each((index, elem) => {
					diff += $(elem).outerWidth();
				});
				$this.scrollLeft(pos / $this.width() * diff);
			});
		}

		return toolbar;
	}
	
	setupToolbar() {
		$(".bf-toolbar").remove();
		$(".channelTextArea-1HTP3C textarea").each((index, elem) => {
			this.addToolbar($(elem));
		});
	}
	
	addToolbar(textarea) {
		var toolbarElement = this.buildToolbar(textarea);
		if (this.settings.plugin.hoverOpen == true) toolbarElement.addClass("bf-hover");
		if (this.isOpen) toolbarElement.addClass("bf-visible");
		
		textarea.on("keypress." + this.getShortName(), (e) => {this.format(e);})
			.parent().after(toolbarElement)
			.siblings(".bf-toolbar")
			.on("click." + this.getShortName(), "div", e => {
				var button = $(e.currentTarget);
				if (button.hasClass("bf-arrow")) {
					if (!this.settings.plugin.hoverOpen) this.openClose();
				}
				else {
					var wrapper = "";
					if (button.hasClass("native-format")) wrapper = this.discordWrappers[button.data("name")];
					else wrapper = this.settings.wrappers[button.data("name")];
					this.wrapSelection(textarea[0], wrapper);	
				}
			});
		this.updateStyle();
	}
	
	generateSettings(panel) {
		
		new PluginSettings.ControlGroup("Toolbar Buttons", () => {this.saveSettings(); this.setupToolbar();}).appendTo(panel).append(
			new PluginSettings.Checkbox("Bold", "", this.settings.toolbar.bold.enabled, (checked) => {this.settings.toolbar.bold.enabled = checked;}),
			new PluginSettings.Checkbox("Italic", "", this.settings.toolbar.italic.enabled, (checked) => {this.settings.toolbar.italic.enabled = checked;}),
			new PluginSettings.Checkbox("Underline", "", this.settings.toolbar.underline.enabled, (checked) => {this.settings.toolbar.underline.enabled = checked;}),
			new PluginSettings.Checkbox("Strikethrough", "", this.settings.toolbar.strikethrough.enabled, (checked) => {this.settings.toolbar.strikethrough.enabled = checked;}),
			new PluginSettings.Checkbox("Code", "", this.settings.toolbar.code.enabled, (checked) => {this.settings.toolbar.code.enabled = checked;}),
			new PluginSettings.Checkbox("CodeBlock", "", this.settings.toolbar.codeblock.enabled, (checked) => {this.settings.toolbar.codeblock.enabled = checked;}),
			new PluginSettings.Checkbox("Smallcaps", "", this.settings.toolbar.smallcaps.enabled, (checked) => {this.settings.toolbar.smallcaps.enabled = checked;}),
			new PluginSettings.Checkbox("Full Width", "", this.settings.toolbar.fullwidth.enabled, (checked) => {this.settings.toolbar.fullwidth.enabled = checked;}),
			new PluginSettings.Checkbox("Upsidedown", "", this.settings.toolbar.upsidedown.enabled, (checked) => {this.settings.toolbar.upsidedown.enabled = checked;}),
			new PluginSettings.Checkbox("Varied Caps", "", this.settings.toolbar.varied.enabled, (checked) => {this.settings.toolbar.varied.enabled = checked;}),
			new PluginSettings.Checkbox("Leet (1337)", "", this.settings.toolbar.leet.enabled, (checked) => {this.settings.toolbar.leet.enabled = checked;})
		);
		
		new PluginSettings.ControlGroup("Active Formats", () => {this.saveSettings();}).appendTo(panel).append(
			new PluginSettings.Checkbox("Superscript", "", this.settings.formats.superscript, (checked) => {this.settings.formats.superscript = checked;}),
			new PluginSettings.Checkbox("Smallcaps", "", this.settings.formats.smallcaps, (checked) => {this.settings.formats.smallcaps = checked;}),
			new PluginSettings.Checkbox("Full Width", "", this.settings.formats.fullwidth, (checked) => {this.settings.formats.fullwidth = checked;}),
			new PluginSettings.Checkbox("Upsidedown", "", this.settings.formats.upsidedown, (checked) => {this.settings.formats.upsidedown = checked;}),
			new PluginSettings.Checkbox("Varied Caps", "", this.settings.formats.varied, (checked) => {this.settings.formats.varied = checked;}),
			new PluginSettings.Checkbox("Leet (1337)", "", this.settings.formats.leet, (checked) => {this.settings.formats.leet = checked;})
		);
		
		new PluginSettings.ControlGroup("Wrapper Options", () => {this.saveSettings();}).appendTo(panel).append(
			new PluginSettings.Textbox("Superscript", "The wrapper for superscripted text.", this.settings.wrappers.superscript, this.defaultSettings.wrappers.superscript,
							(text) => {this.settings.wrappers.superscript = text != "" ? text : this.defaultSettings.wrappers.superscript;}),
			new PluginSettings.Textbox("Smallcaps", "The wrapper to make Smallcaps.", this.settings.wrappers.smallcaps, this.defaultSettings.wrappers.smallcaps,
							(text) => {this.settings.wrappers.smallcaps = text != "" ? text : this.defaultSettings.wrappers.smallcaps;}),
			new PluginSettings.Textbox("Full Width", "The wrapper for E X P A N D E D  T E X T.", this.settings.wrappers.fullwidth, this.defaultSettings.wrappers.fullwidth,
							(text) => {this.settings.wrappers.fullwidth = text != "" ? text : this.defaultSettings.wrappers.fullwidth;}),
			new PluginSettings.Textbox("Upsidedown", "The wrapper to flip the text upsidedown.", this.settings.wrappers.upsidedown, this.defaultSettings.wrappers.upsidedown,
							(text) => {this.settings.wrappers.upsidedown = text != "" ? text : this.defaultSettings.wrappers.upsidedown;}),
			new PluginSettings.Textbox("Varied Caps", "The wrapper to VaRy the capitalization.", this.settings.wrappers.varied, this.defaultSettings.wrappers.varied,
							(text) => {this.settings.wrappers.varied = text != "" ? text : this.defaultSettings.wrappers.varied;}),
			new PluginSettings.Textbox("LeetSpeak", "The wrapper to talk in 13375p34k.", this.settings.wrappers.leet, this.defaultSettings.wrappers.leet,
							(text) => {this.settings.wrappers.leet = text != "" ? text : this.defaultSettings.wrappers.leet;})
		);
		
		new PluginSettings.ControlGroup("Formatting Options", () => {this.saveSettings();}).appendTo(panel).append(
			new PluginSettings.PillButton("Fullwidth Style", "Which style of fullwidth formatting should be used.", "T H I S", "ｔｈｉｓ",
								this.settings.formatting.fullWidthMap, (checked) => {this.settings.formatting.fullWidthMap = checked;}), 
			new PluginSettings.Checkbox("Reorder Upsidedown Text", "Having this enabled reorders the upside down text to make it in-order.",
								this.settings.formatting.reorderUpsidedown, (checked) => {this.settings.formatting.reorderUpsidedown = checked;}),
			new PluginSettings.Checkbox("Start VaRiEd Caps With Capital", "Enabling this starts a varied text string with a capital.",
								this.settings.formatting.startCaps, (checked) => {this.settings.formatting.startCaps = checked;})
		);
		
		new PluginSettings.ControlGroup("Plugin Options", () => {this.saveSettings();}).appendTo(panel).append(
			new PluginSettings.PillButton("Toolbar Style", "Switches between icons and text as the toolbar buttons.", "Text", "Icons",
										this.settings.plugin.icons, (checked) => {this.settings.plugin.icons = checked; this.setupToolbar();}),
			new PluginSettings.Checkbox("Open On Hover", "Enabling this makes you able to open the menu just by hovering the arrow instead of clicking it.", this.settings.plugin.hoverOpen,
				(checked) => {
					this.settings.plugin.hoverOpen = checked;
					if (checked) {
						$(".bf-toolbar").removeClass('bf-visible');
						$(".bf-toolbar").addClass('bf-hover');
					}
					else {
						$(".bf-toolbar").removeClass('bf-hover');
					}
				}
			),
			new PluginSettings.Checkbox("Close On Send", "This option will close the toolbar when the message is sent when \"Open On Hover\" is disabled.",
								this.settings.plugin.closeOnSend, (checked) => {this.settings.plugin.closeOnSend = checked;}),
			new PluginSettings.PillButton("Format Chaining", "Swaps priority of wrappers between inner first and outer first. Check the GitHub for more info.", "Inner", "Outer",
								this.settings.plugin.chainFormats, (checked) => {this.settings.plugin.chainFormats = checked;})
		);
		
		new PluginSettings.ControlGroup("Style Options", () => {this.saveSettings();}).appendTo(panel).append(
			new PluginSettings.PillButton("Toolbar Location", "This option enables swapping toolbar from right side to left side.", "Left", "Right",
							this.settings.style.rightSide, (checked) => {this.settings.style.rightSide = checked; this.updateSide();}),
			new PluginSettings.Slider("Opacity", "This allows the toolbar to be partially seethrough.", 0, 1, 0.01, this.settings.style.opacity, (val) => {this.settings.style.opacity = val; this.updateOpacity();}),
			new PluginSettings.Slider("Font Size", "Adjust the font size between 0 and 100%.", 0, 100, 1, this.settings.style.fontSize, (val) => {this.settings.style.fontSize = val + "%"; this.updateFontSize();}).setLabelUnit("%")
		);
			
		var resetButton = $("<button>");
		resetButton.on("click", () => {
			this.settings = this.defaultSettings;
			this.saveSettings();
			this.setupToolbar();
			panel.empty();
			this.generateSettings(panel);
		});
		resetButton.text("Reset To Defaults");
		resetButton.css("float", "right");
		resetButton.attr("type","button");

		panel.append(resetButton);
	}
}