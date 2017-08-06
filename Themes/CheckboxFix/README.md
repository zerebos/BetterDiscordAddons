# Checkbox Fix - [Download](https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Themes/CheckboxFix/CheckboxFix.theme.css)


## Screenshots
![CheckboxFix](http://discord.zackrauen.com/CheckboxFix/fix.png)

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
