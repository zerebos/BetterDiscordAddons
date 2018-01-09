# SwitchFix - [Download](http://betterdiscord.net/ghdl/?url=https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Themes/SwitchFix/SwitchFix.theme.css)

Makes the checkboxes on the plugins and themes pages look like switches again. For support and update announcements you can visit [Zere's server](http://discord.zackrauen.com/).

## Screenshots
![SwitchFix](http://discord.zackrauen.com/SwitchFix/fix.png)

## ClearVision Theme Compatibility
For ClearVision you will need to add the following to CustomCSS:

```css
.ui-switch-wrapper .ui-switch::before {
    top: 0px !important;
}

#bd-settingspane-container .ui-switch-wrapper .ui-switch-checkbox:checked+.ui-switch::before {
    transform: translate(0,0) !important;
}
```
