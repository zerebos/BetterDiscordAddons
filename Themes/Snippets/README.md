# CSS Snippets (Mini-Themes)

This is a small collection of my CSS Snippets that people may enjoy. Adjust any colors or anything to your own liking.

## Hovering RadialStatus

### Preview

![Hovering RadialStatus](http://i.zackrauen.com/M726Vg.gif)

### CSS

```css
/* Hover and popout like RadialStatus */
.channel-members .member .status {
	transition: all 150ms ease;
    will-change: border-color, width, background, height, padding;
}

.channel-members .member:hover .status, .channel-members .member.popout-open .status {
    width:100% !important;
    background: transparent;
    border-radius: inherit;
    height: 100%;
	right: -4px !important;
	bottom: -4px;
	padding: 2px;
	transition: all 150ms ease;
	border-width: 2px;
	margin: 0;
}

.channel-members .member:hover .status.status-online,
.channel-members .member.popout-open .status.status-online {border-color: #43b581 !important}
.channel-members .member:hover .status.status-idle,
.channel-members .member.popout-open .status.status-idle {border-color: #faa61a !important}
.channel-members .member:hover .status.status-dnd,
.channel-members .member.popout-open .status.status-dnd {border-color: #f04747 !important}
.channel-members .member:hover .status.status-offline,
.channel-members .member.popout-open .status.status-offline {border-color: #636b75 !important}
.channel-members .member:hover .status-streaming.status,
.channel-members .member.popout-open .status-streaming.status {border-color: #593695 !important}
.channel-members .member.popout-open .status.status-typing,
.channel-members .member:hover .status.status-typing {background-color: rgba(0, 0, 0, 0.4) !important;}
.channel-members .member.popout-open .status.status-typing .spinner .spinner-inner,
.channel-members .member:hover .status.status-typing .spinner .spinner-inner {left: 1px !important;top: 1px !important;}
```

## Colored Game

Colors the current game in the userlist to match their status. Does not work with streaming unfortunately.

### Preview

![ColoredGame](http://i.zackrauen.com/wA8OgT.png)

### CSS

```css
.channel-members .member.member-status-online .member-inner .member-activity-text strong {color: #43b581}
.channel-members .member.member-status-idle .member-inner .member-activity-text strong {color: #faa61a}
.channel-members .member.member-status-dnd .member-inner .member-activity-text strong {color: #f04747}
.channel-members .member.member-status-offline .member-inner .member-activity-text strong {color: #636b75}
```


## Better Headers

Underlines and centers the headers in userlist, channel list, and DM list.

### Preview

![Channel List](http://i.zackrauen.com/0oKsvn.png)
![User List](http://i.zackrauen.com/0SMAGX.png)

### CSS

```css
/* underline roles in memberlist & DMs */
.channel-members h2, .private-channels header {
	text-align: center;
}

.channel-members h2::after, .private-channels header::after {
	content: "";
	display: block;
	height: 1px;
	width: 100%;
	border-bottom: 2px solid var(--accent-color);
	padding-bottom: 10px;
}

/* underline labels in channellist */
.channels-3g2vYe .wrapperDefault-1Dl4SS, .channels-3g2vYe .wrapperHovered-1KDCyZ {
	padding-top: 28px;
	padding-right: 8px;
	padding-left: 18px;
	padding: 0 0 8px 0;
	height: auto;
	margin: 28px 8px 4px 18px;
	border-bottom: 2px solid white;
}
.channels-3g2vYe .nameDefault-Lnjrwm, .channels-3g2vYe .nameHovered-1YFSWq {text-align: center;}
.channels-3g2vYe .wrapperDefault-1Dl4SS .flex-lFgbSz, .channels-3g2vYe .wrapperHovered-1KDCyZ .flex-lFgbSz {margin-right:0;}
```

## Alternate Speaking Notification

Uses a small bar instead of a circle. Or uses a bar and gradient (like ClearVision)

### Preview

Alt 1:
![Preview](http://i.zackrauen.com/zW6OZ8.png)

Alt 2:
![Preview](http://i.zackrauen.com/8zBFJy.png)

### CSS

Alt 1:
```css
.avatarSpeaking-3teDH6 {
	box-shadow: none;
}
.avatarSpeaking-3teDH6::before {
	content: "";
	display: block;
	height: 20px;
	border-left: 4px solid #43b581;
	position: absolute;
	left: -5px;
}
```

Alt 2:
```css
.avatarSpeaking-3teDH6, .avatarDefault-3jtQoc, .avatarContainer-303pFz {
	border-color: transparent !important;
	box-shadow: none !important;
	z-index: 10;
}

.avatarSpeaking-3teDH6::before {
	content: "";
	position: absolute;
	left: -5px;
	width: 4px;
	height: 20px;
	background: #43b581;
}

.avatarSpeaking-3teDH6::after {
	content: "";
	position: absolute;
	height: 20px;
	left: -5px;
	width: 100%;
	background: linear-gradient(to right, #43b581 0%, transparent 35%);
	opacity: 0.5;
	z-index: -1;
}
```

## Blur Email (Show on Hover)

Blurs the email in account settings for showing off themes. Email will show on hover.

### Preview

![Blurred Email](http://i.zackrauen.com/pESY7C.gif)

### CSS

```css
/* Blur account email */
.user-settings-account .ui-form-item:last-of-type .view-body.selectable-prgIYK:last-of-type {
	filter: blur(5px);
	transition: 200ms cubic-bezier(.2, .11, 0, 1);
}

.user-settings-account .ui-form-item:last-of-type .view-body.selectable-prgIYK:last-of-type:hover {
	filter: none;
	transition: 200ms cubic-bezier(.2, .11, 0, 1);
}
```