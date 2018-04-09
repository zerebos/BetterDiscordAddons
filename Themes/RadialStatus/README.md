# Radial Status - [Download](http://betterdiscord.net/ghdl/?url=https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Themes/RadialStatus/RadialStatus.theme.css)

Changes all instances of the status dot to a status circle except for the friends list. This is an update to Zerthox's StatusCircles to fix small issues as well as add the circles everywhere else possible.

~~This should also be compatible with Beard's Material Design Theme as long as you uncomment the designated section in __this__ theme by deleting lines `4` and `6` **or** adding this line to custom css: `@import url(https://rawgit.com/rauenzi/BetterDiscordAddons/master/Themes/RadialStatus/import/RadialStatus_BeardFixes.css);`~~

This is no longer needed.

This should also be compatible with ClearVision without modification.

For support and update announcements you can visit [Zere's server](http://discord.zackrauen.com/).

## What's New

### Variables

```css
:root {
    --rs-spacing: 2px; /* spacing between avatar and status */
    --rs-width: 2px; /* width of the status */
    --rs-popout-spacing: 3px; /* spacing between avatar and status for user popouts */
    --rs-popout-width: 4px; /* width of the status for user popouts */
    --rs-profile-spacing: 3px; /* spacing between avatar and status on modals/profiles */
    --rs-profile-width: 4px; /* width of the status on modals/profiles */
    --rs-online-color: #43b581; /* color for online status */
    --rs-idle-color: #faa61a; /* color for idle status */
    --rs-dnd-color: #f04747; /* color for dnd status */
    --rs-offline-color: #636b75; /* color for offline status */
    --rs-invisible-color: #747f8d; /* color for invisible status - Note this will only show for your own invisibility */
    --rs-streaming-color: #643da7; /* color for streaming status */
}
```

### Changed Zoom

If you plan on changing the zoom level change `--rs-width` to `3px`


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


## Special Thanks
 - Zerthox - Zerthox made the original StatusCircle Theme which you can get [here](https://github.com/Zerthox/Mini-Discord-Themes).