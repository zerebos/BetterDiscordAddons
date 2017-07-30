# Radial Status - [Download](https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Themes/RadialStatus/RadialStatus.theme.css)

Changes all instances of the status dot to a status circle except for the friends list. This is an update to Zerthox's StatusCircles to fix small issues as well as add the circles everywhere else possible.

This should also be compatible with Beard's Material Design Theme as long as you uncomment the designated section in __this__ theme by deleting lines `4` and `5` **or** adding this line to custom css: `@import url(https://rawgit.com/rauenzi/BetterDiscordAddons/master/Themes/RadialStatus/import/RadialStatus_BeardFixes.css);`

This should also be compatible with ClearVision without modification.

For support and update announcements you can visit [Zere's server](http://discord.zackrauen.com/).

## What's New

The theme has been changed to auto-updating by popular demand. Fixes for beard's theme will also auto-update provided you have deleted lines `4` and `5` **or** added this line to custom css: `@import url(https://rawgit.com/rauenzi/BetterDiscordAddons/master/Themes/RadialStatus/import/RadialStatus_BeardFixes.css);`

## Screenshots

### Member List
![Member List](http://discord.zackrauen.com/RadialStatus/member_list_short.png)

#### Typing Status
![Typing Status](http://discord.zackrauen.com/RadialStatus/typing_status.png)

### Profile Popout and Modal

#### Popout
![Profile Popout](http://discord.zackrauen.com/RadialStatus/profile_popout.png)

#### Modal
![Profile Modal](http://discord.zackrauen.com/RadialStatus/profile_modal.png)

### Direct Messages
![Direct Messages](http://discord.zackrauen.com/RadialStatus/direct_messages_short.png)

### Mentions
![Mentions](http://discord.zackrauen.com/RadialStatus/mentions.png)

### Personal Status
![Personal Status](http://discord.zackrauen.com/RadialStatus/personal_status.png)

### Beard's Material Design Theme Compatibility
![Compatibility](http://discord.zackrauen.com/RadialStatus/beard_design.png)

### ClearVision Theme Compatibility
![Clear Vision](http://discord.zackrauen.com/RadialStatus/clearvision.png)


## Coming Soon


## Known Bugs and Issues


## Special Thanks
 - Zerthox - Zerthox made the original StatusCircle Theme which you can get [here](https://github.com/Zerthox/Mini-Discord-Themes).
 
## Changelog

#### 1.2.1

 - Made the borders dynamic so they will match whatever avatar scheme used (such as rounded corners)
 - Made some of the styling more verbose to override theme styling
 - Also added a couple more styling notes to fix issues with some themes including ClearVision
 - Fixed an issue where a fake status would show on the account page for some people

#### 1.2.0

 - Changed lots of selectors around to make the theme a bit smaller
 - Used attribute selectors to help make it future proof*er*
 - Made some things a bit more specific to help override the themes that mess with it
 - Commented out Beard Design-specific code.

#### 1.1.4

 - Added support for new selectors in the autocomplete for mentions

#### 1.1.3

 - Fixed an issue with active popouts and hovered names overlapping
 - Add compatibility with Beard's auto collapsing member list
 - Fixed circles not working on mutual friends list
 - Added offline circles to servers that show offline users

#### 1.1.2

 - Added circles showing during mentioning
 - Fix typing symbol bug

#### 1.1.1

 - Added circle to own status at the bottom

#### 1.1.0

 - Added circles to profile popout
 - Added circles to profile modal

#### 1.0.0

 - Updated selectors to match Discord's current setup
 - Spaced out circle from profile picture for easier viewing

