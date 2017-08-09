# Transient Material - [Download](https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Themes/TransientMaterial/TransientMaterial.theme.css)

Transparency patch theme for Beard's Material Design Theme. Also works fairly well on it's own.

For support and update announcements you can visit [Zere's server](http://discord.zackrauen.com/).

## What's New

- The theme has been changed to auto-updating.
- Fixed message bubble not showing same opacity
- Redone search results

## Preview

![Demo](http://discord.zackrauen.com/TransientMaterial/demo.png)

## Instructions

Either open this theme and change all the background urls to your image (https) or put this in CustomCSS:

```css
.app, #pubslayerroot .layer .ui-standard-sidebar-view {
    background-image: url("YOUR_IMAGE") !important;
    background-size: cover !important;
    background-position: center !important;
}
```

## Variables

Below are all the variables with their default values:

### Defaults

```css
:root {
    --tm-accent: 67, 181, 129;
    --tm-titlebar-opacity: 0.8;
    --tm-guilds-opacity: 0.7;
    --tm-messages-opacity: 0.2;
    --tm-chat-opacity: 0.7;
    --tm-memberlist-opacity:  0.7;
    --tm-channels-opacity: 0.7;
    --tm-modal-opacity: 0.7;
    --tm-popout-opacity: 0.95;
    --tm-selected-item: rgba(30,30,30, 0.7);
    --tm-hover: rgba(255,255,255,0.05);
    --tm-active: rgba(255,255,255,0.1);
}
```

### Explanations

 - `--tm-accent` - This is the accent color you use for Beard's but in RGB format. You can get that here: http://www.javascripter.net/faq/hextorgb.htm
 - `--tm-titlebar-opacity` - Controls the opacity for the titlebar. Can range from 0.0 to 1.0.
 - `--tm-guilds-opacity` - Controls the opacity for the guilds column. Can range from 0.0 to 1.0.
 - `--tm-messages-opacity` - Controls the opacity for the messages (chat bubbles). Can range from 0.0 to 1.0.
 - `--tm-chat-opacity` - Controls the opacity for the chat background. Can range from 0.0 to 1.0.
 - `--tm-memberlist-opacity` - Controls the opacity for the memberlist. Can range from 0.0 to 1.0.
 - `--tm-channels-opacity` - Controls the opacity for the channels and DM lists. Can range from 0.0 to 1.0.
 - `--tm-modal-opacity` - Controls the opacity for the modals. Can range from 0.0 to 1.0.
 - `--tm-popout-opacity` - Controls the opacity for the popouts. Can range from 0.0 to 1.0.
 - `--tm-selected-item` - This is the color for selected items such as selected channel and server. Also acts as hover for friends list.
 - `--tm-hover` - Color for hovering over most items like channels and server.
 - `--tm-active` - Color that shows during clicking on an item like channel or server.
