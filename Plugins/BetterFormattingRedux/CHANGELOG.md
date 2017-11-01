# BetterFormattingRedux Changelog

### 2.2.5

 - Add missing setting
 - Fix incompatibility with sendbutton

### 2.2.4

 - Create a tooltip object that emulates discord's
 - Add tooltips to the formatting buttons
 - Change the formatting buttons to icons to look nicer and save space
 - Add setting to switch back to text buttons

### 2.2.3

 - Hotfix for toolbars appearing on popouts and modals

### 2.2.2

 - Adjust the way the libs are loaded.
 - Make the programming languages easier to add for future
 - Start ESLinting

### 2.2.1

 - Move to remotely loading library (allows me to develop faster and easier, and also allow for consistency across my plugins)

### 2.2.0

 - Some further restructuring
 - Develop context menu that emulates discord's native ones
 - Add codeblock and programming languages (languages on right click of codeblock)

### 2.1.1

 - Add leet (1337) formatting options (off by default)

### 2.1.0

 - Restructure code to make future changes easier
 - Add the ability to select which formats appear on toolbar
 - Add ability to sort (by dragging) the options on the toolbar

### 2.0.0
 
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

### 1.1.5

 - Fixes toolbar not showing up in Canary/PTB
 - Fixes not actually changing the text before sending in Canary/PTB

### 1.1.4

 - Adds update notification in settings panel.
 - Added the ability to swap the toolbar (and the arrow) from the right hand side to the left hand side (by popular demand)
 - Added in the features promised last time, I made a goof and committed the wrong file
 - Fixed a bug where button would reload discord (and also pressing enter)
 - Update description in discord

### 1.1.3

 - Added settings to close the toolbar on message send (when hover is turned off)
 - Added ability to change format chaining order and the corresponding setting in the panel
 - Fixed a bug where backslash didn't prevent formatting
 - CSS bugfixes

### 1.1.2

 - New CSS courtesy of Beard Design
 - Settings panel cleanup
 - Backend of settings abstracted for future development
 - New setting to click open versus hover open

### 1.1.1

 - Squashed more bugs
 - Half-baked code cleaning
 - Initial release for testing

### 1.1.0

 - Added varied caps formatting
 - Settings panel created
 - Squashed a couple pesky bugs

### 1.0.0

 - Initial version of this rewrite
 - Abstracted wrapper replacement
 - Improved Regex
 - Added capability for multiple character wrappers