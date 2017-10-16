# BetterFormattingRedux (BFRedux) - [Download](https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterFormattingRedux/BetterFormattingRedux.plugin.js)

Lets you format your messages with buttons and adds more formatting options. For support and update announcements you can visit [Zere's server](https://bit.ly/ZeresServer).

![New Demo](https://i.zackrauen.com/OY2qYj.gif)

![BFRedux Demo](https://zippy.gfycat.com/HugeDeadDuckling.gif)


## Features

### Codeblocks & Programming Languages

![Codeblocks](https://i.zackrauen.com/rTdu3g.gif)

### Sortable Buttons & Tooltips

![Sortable](https://i.zackrauen.com/teYxPk.gif)

### Formatting Toolbar
BFRedux adds a handy toolbar to make formatting easier.

Click the buttons to insert tags or surround the selected text with tags.

![BFRedux Demo](http://discord.zackrauen.com/BFRedux/bfredux.png)

### New Formatting Options

#### Superscript (^^)
`^Sample Text^` will show up as ˢᵃᵐᵖˡᵉ ᵀᵉˣᵗ

#### Small Caps (%%)
`%Sample Text%` will show up as Sᴀᴍᴘʟᴇ Tᴇxᴛ

#### Fullwidth (##)
`##Sample Text##` will show up as Ｓａｍｐｌｅ　Ｔｅｘｔ or S A M P L E  T E X T

#### Upsidedown (&&)
`&&Sample Text&&` will show up as ʇxǝ┴ ǝldɯɐS or Sɐɯdlǝ ┴ǝxʇ

#### Varied Caps (||)
`||Sample Text||` will show up as SaMpLe TeXt or sAmPlE tExT

#### Leet (++)
`++Sample Text++` will show up as 54mp13 73x7

#### Escaping Unwanted Tags (\\)
Put a backslash before the tags if you want them to be rendered normally.

`\##Sample Text\##` will show up as \##Sample Text\##

## Plugin Settings

The settings can be found in Settings > BetterDiscord > Plugins

Note: There is no save button to click, settings update automatically.

### Toolbar Buttons

 - Allows you to choose which buttons to have on the toolbar

### Active Formats

 - Adds a checkbox for every custom format allowing you to enable/disable them

### Wrappers
The default wrappers (`^`, `%`, `##`, `&&`, `||`, `++`) can all be customized in the settings panel. They can be any symbol or letters of any length.

![BFRedux Wrappers](http://discord.zackrauen.com/BFRedux/wrappers.png)

### Formatting
 - The fullwidth format can switch between Ｓａｍｐｌｅ　Ｔｅｘｔ and S A M P L E  T E X T.
 - The upsidedown text can switch between ʇxǝ┴ ǝldɯɐS and Sɐɯdlǝ ┴ǝxʇ.
 - The varied caps can switch between SaMpLe TeXt and sAmPlE tExT. (Change whether to start with a capital)
 
![BFRedux Formatting](http://discord.zackrauen.com/BFRedux/formatting_new.png)
 
### Functional Plugin Settings

 - You can switch between the text buttons or icons for buttons

![BFRedux Chaining](http://discord.zackrauen.com/BFRedux/functional.png)

 - You can change between the default hover mode (from above), or click to see toolbar.
 
![BFRedux Click Mode](https://zippy.gfycat.com/RectangularGargantuanIndianjackal.gif)
 - Optionally, you can make it disappear when the message is sent
 
![BFRedux Send Clear](https://zippy.gfycat.com/IllfatedDimpledGalapagossealion.gif)

 - You can also switch format chaining order from outside first to inside first which means:
 
`&&##Sample Text##&&` will give you ｔｘｅＴ　ｅｌｐｍａＳ instead of ʇｘǝ┴　ǝｌｄɯɐＳ (May not appear right in browser)

`##&&Sample Text&&##` will give you ʇｘǝ┴　ǝｌｄɯɐＳ instead of ＆＆Ｓａｍｐｌｅ　Ｔｅｘｔ＆＆ (May not appear right in browser)

 ![BFRedux Chaining](http://discord.zackrauen.com/BFRedux/chaining_order.png)
 
### Style Settings
![BFRedux Style](http://discord.zackrauen.com/BFRedux/style.png)

 - Change the opacity of the toolbar
 - Change the size of the text
 - Swap the toolbar (and arrow) from the right side (above) to the left side
 
 ![BFRedux Sideswap](https://zippy.gfycat.com/FlusteredViciousEnglishpointer.gif)

## Special Thanks
 - Anxeal#4160 for the original Better Formatting - This is based on the original BetterFormatting by Anxeal#4160 although it has been nearly entirely rewritten. You can find that [here](https://github.com/Anxeal/BDEnhancements/tree/master/plugins/BetterFormatting). 
 - BeardDesign#6223 - The CSS for the toolbar is a modified version of the CSS written by BeardDesign creator of Beard's Material Design Theme, a theme for BetterDiscord. His theme is compatible with several plugins so be sure to check it out [here](http://www.beard-design.com/discord-material-theme).