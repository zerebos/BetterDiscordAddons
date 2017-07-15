# BetterFormattingRedux (BFRedux) - [Download](https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterFormattingRedux/BetterFormattingRedux.plugin.js)

Lets you format your messages with buttons and adds more formatting options. For support and update announcements you can visit [Zere's server](http://discord.zackrauen.com/).

![BFRedux Demo](https://zippy.gfycat.com/HugeDeadDuckling.gif)

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

### New Settings

The settings can be found in Settings > BetterDiscord > Plugins

Note: There is no save button to click, settings update automatically.

#### Wrappers
The default wrappers (`^`, `%`, `##`, `&&`, `||`) can all be customized in the settings panel. They can be any symbol or letters of any length.

![BFRedux Wrappers](http://discord.zackrauen.com/BFRedux/wrappers.png)

#### Formatting
 - The fullwidth format can switch between Ｓａｍｐｌｅ　Ｔｅｘｔ and S A M P L E  T E X T.
 - The upsidedown text can switch between ʇxǝ┴ ǝldɯɐS and Sɐɯdlǝ ┴ǝxʇ.
 - The varied caps can switch between SaMpLe TeXt and sAmPlE tExT. (Change whether to start with a capital)
 
![BFRedux Formatting](http://discord.zackrauen.com/BFRedux/formatting.png)

## Coming Soon
 - Switch to non-prototype classes.

## Known Bugs and Issues
 - Clicking the buttons on the toolbar too rapidly will cause the tags to be inserted on a different place than where the caret is and move the caret.

## Special Thanks
 - Anxeal#4160 for the original Better Formatting - This is a rewrite of the original BetterFormatting by Anxeal#4160. You can find that [here](https://github.com/Anxeal/BDEnhancements/tree/master/plugins/BetterFormatting). 
 - BeardDesign#6223 - The CSS for the toolbar is a modified version of the CSS written by BeardDesign creator of Beard's Material Design Theme, a theme for BetterDiscord. His theme is compatible with several plugins so be sure to check it out [here](http://www.beard-design.com/discord-material-theme).
 
## Changelog

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

