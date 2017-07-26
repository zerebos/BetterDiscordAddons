# BetterFormattingRedux (BFRedux) - [Download](https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterFormattingRedux/BetterFormattingRedux.plugin.js)

Lets you format your messages with buttons and adds more formatting options. For support and update announcements you can visit [Zere's server](http://discord.zackrauen.com/).

**Note:** ~~Currently incompatible with Canary~~ Canary/PTB compatibility has been resolved.

![BFRedux Demo](https://zippy.gfycat.com/HugeDeadDuckling.gif)

Feel free to either DM me (Zerebos#7790) with any feature requests or bugs. Or just open an issue here on GitHub.

## Features

### Formatting Toolbar
BFRedux adds a handy toolbar to make formatting easier.

Click the buttons to insert tags or surround the selected text with tags.

![BFRedux Demo](http://discord.zackrauen.com/BFRedux/bfredux.png)

### New Formatting Options

#### Superscript (^)
`^Sample Text^` will show up as ˢᵃᵐᵖˡᵉ ᵀᵉˣᵗ

#### Small Caps (%)
`%Sample Text%` will show up as Sᴀᴍᴘʟᴇ Tᴇxᴛ

#### Fullwidth (##)
`##Sample Text##` will show up as Ｓａｍｐｌｅ　Ｔｅｘｔ or S A M P L E  T E X T

#### Upsidedown (&&)
`&&Sample Text&&` will show up as ʇxǝ┴ ǝldɯɐS or Sɐɯdlǝ ┴ǝxʇ

#### Varied Caps (||)
`||Sample Text||` will show up as SaMpLe TeXt or sAmPlE tExT

#### Escaping Unwanted Tags (\\)
Put a backslash before the tags if you want them to be rendered normally.

`\##Sample Text\##` will show up as \##Sample Text\##

## Plugin Settings

The settings can be found in Settings > BetterDiscord > Plugins

Note: There is no save button to click, settings update automatically.

### Wrappers
The default wrappers (`^`, `%`, `##`, `&&`, `||`) can all be customized in the settings panel. They can be any symbol or letters of any length.

![BFRedux Wrappers](http://discord.zackrauen.com/BFRedux/wrappers.png)

### Formatting
 - The fullwidth format can switch between Ｓａｍｐｌｅ　Ｔｅｘｔ and S A M P L E  T E X T.
 - The upsidedown text can switch between ʇxǝ┴ ǝldɯɐS and Sɐɯdlǝ ┴ǝxʇ.
 - The varied caps can switch between SaMpLe TeXt and sAmPlE tExT. (Change whether to start with a capital)
 
![BFRedux Formatting](http://discord.zackrauen.com/BFRedux/formatting_new.png)
 
### Functional Plugin Settings
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


 

## Coming Soon (Possibly)
 - Code Blocks (```) and the auto-inserting languages
 - 1337 (Leet) formatting

## Known Bugs and Issues
 - ~~Clicking the buttons on the toolbar too rapidly will cause the tags to be inserted on a different place than where the caret is and move the caret.~~ Should be resolved

## Special Thanks
 - Anxeal#4160 for the original Better Formatting - This is based on the original BetterFormatting by Anxeal#4160 although it has been nearly entirely rewritten. You can find that [here](https://github.com/Anxeal/BDEnhancements/tree/master/plugins/BetterFormatting). 
 - BeardDesign#6223 - The CSS for the toolbar is a modified version of the CSS written by BeardDesign creator of Beard's Material Design Theme, a theme for BetterDiscord. His theme is compatible with several plugins so be sure to check it out [here](http://www.beard-design.com/discord-material-theme).
 
## Changelog

#### 2.0.0
 
 - Complete rewrite to ES6 style classes
 - Refactor settings code to be more generic
 - Remake settings panel
 - Add new setting types (Pill, Slider)
 - New setting: opacity
 - New setting: font size
 - Fix issue with toolbar closing
 - Remove need to save default discord wrappers
 - Improved and reduced parsing for formatting
 - Other minor code cleaning

#### 1.1.5

 - Fixes toolbar not showing up in Canary/PTB
 - Fixes not actually changing the text before sending in Canary/PTB

#### 1.1.4

 - Adds update notification in settings panel.
 - Added the ability to swap the toolbar (and the arrow) from the right hand side to the left hand side (by popular demand)
 - Added in the features promised last time, I made a goof and committed the wrong file
 - Fixed a bug where button would reload discord (and also pressing enter)
 - Update description in discord

#### 1.1.3

 - Added settings to close the toolbar on message send (when hover is turned off)
 - Added ability to change format chaining order and the corresponding setting in the panel
 - Fixed a bug where backslash didn't prevent formatting
 - CSS bugfixes

#### 1.1.2

 - New CSS courtesy of Beard Design
 - Settings panel cleanup
 - Backend of settings abstracted for future development
 - New setting to click open versus hover open

#### 1.1.1

 - Squashed more bugs
 - Half-baked code cleaning
 - Initial release for testing

#### 1.1.0

 - Added varied caps formatting
 - Settings panel created
 - Squashed a couple pesky bugs

#### 1.0.0

 - Initial version of this rewrite
 - Abstracted wrapper replacement
 - Improved Regex
 - Added capability for multiple character wrappers

