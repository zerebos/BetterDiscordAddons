# Transient Material - [Download](http://betterdiscord.net/ghdl/?url=https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Themes/TransientMaterial/TransientMaterial.theme.css)

Transparency patch theme for Beard's Material Design Theme. Also works fairly well on it's own.

For support and update announcements you can visit [Zere's server](http://discord.zackrauen.com/).

## Preview

![Demo](http://discord.zackrauen.com/TransientMaterial/demo.png)

## Instructions

Either open this theme and change the background url to your image (https) or put this in CustomCSS:

```css
#app-mount {
    background-image: url("YOUR_IMAGE") !important;
}
```

## Requirements
In order for things to look right, you need to add a css variable in addition to the accent-color for Beard's.

`--tm-accent` - This is the accent color you use for Beard's but in RGB format. You can get that here: http://www.javascripter.net/faq/hextorgb.htm

## Variables

Below are all the variables with their default values:

### Defaults

```css
:root {
    --tm-accent: 67, 181, 129; /* R, G, B of accent-color */
    --tm-titlebar-opacity: 0.8; /* Titlebar Opacity */
    --tm-guilds-opacity: 0.7; /* Guilds  Opacity */
    --tm-messages-opacity: 0.2; /* Message Bubble Opacity */
    --tm-chat-opacity: 0.7; /* Chat BG Opacity */
    --tm-chatbox-opacity: 0.7; /* Chatbox Opacity */
    --tm-memberlist-opacity: 0.7; /* Memberlist Opacity */
    --tm-channels-opacity: 0.7; /* Channel List Opacity */
    --tm-modal-opacity: 0.7; /* Modal Opacity */
    --tm-popout-opacity: 0.95; /* Popout Opacity */
    --tm-selected-item: rgba(30,30,30, 0.7); /* Selected Channel/Server Color */
    --tm-hover: rgba(255,255,255,0.05); /* Hover Channel/Server Color */
    --tm-active: rgba(255,255,255,0.1); /* Clicking Channel/Server Color */
	--tm-solo: 0; /* Theme by itself */
}
```

### Explanations

 - `--tm-accent` - This is the accent color you use for Beard's but in RGB format. You can get that here: http://www.javascripter.net/faq/hextorgb.htm
 - `--tm-titlebar-opacity` - Controls the opacity for the titlebar. Can range from 0.0 to 1.0.
 - `--tm-guilds-opacity` - Controls the opacity for the guilds column. Can range from 0.0 to 1.0.
 - `--tm-messages-opacity` - Controls the opacity for the messages (chat bubbles). Can range from 0.0 to 1.0.
 - `--tm-chat-opacity` - Controls the opacity for the chat background. Can range from 0.0 to 1.0.
 - `--tm-chatbox-opacity` - Controls the opacity for the chatbox where you type. Can range from 0.0 to 1.0.
 - `--tm-memberlist-opacity` - Controls the opacity for the memberlist. Can range from 0.0 to 1.0.
 - `--tm-channels-opacity` - Controls the opacity for the channels and DM lists. Can range from 0.0 to 1.0.
 - `--tm-modal-opacity` - Controls the opacity for the modals. Can range from 0.0 to 1.0.
 - `--tm-popout-opacity` - Controls the opacity for the popouts. Can range from 0.0 to 1.0.
 - `--tm-selected-item` - This is the color for selected items such as selected channel and server. Also acts as hover for friends list.
 - `--tm-hover` - Color for hovering over most items like channels and server.
 - `--tm-active` - Color that shows during clicking on an item like channel or server.
 - `--tm-solo` - Set this to 0 to be used with Beard's theme (default) or 1 to use it on its own.
