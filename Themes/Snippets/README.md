# CSS Snippets (Mini-Themes)

This is a small collection of my CSS Snippets that people may enjoy. Adjust any colors or anything to your own liking.

## Hovering RadialStatus

### Preview

![Hovering RadialStatus](http://i.zackrauen.com/M726Vg.gif)

### CSS

```css
/* Hover and popout like RadialStatus */
.members-1998pB .member-3W1lQa .status-oxiHuE {
	transition: all 150ms ease;
    will-change: border-color, width, background, height, padding;
}

.members-1998pB .member-3W1lQa:hover .status-oxiHuE, .members-1998pB .member-3W1lQa.popout-open .status-oxiHuE {
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

.members-1998pB .member-3W1lQa:hover .status-oxiHuE.online-2S838R,
.members-1998pB .member-3W1lQa.popout-open .status-oxiHuE.online-2S838R {border-color: #43b581 !important}
.members-1998pB .member-3W1lQa:hover .status-oxiHuE.idle-3DEnRT,
.members-1998pB .member-3W1lQa.popout-open .status-oxiHuE.idle-3DEnRT {border-color: #faa61a !important}
.members-1998pB .member-3W1lQa:hover .status-oxiHuE.dnd-1_xrcq,
.members-1998pB .member-3W1lQa.popout-open .status-oxiHuE.dnd-1_xrcq {border-color: #f04747 !important}
.members-1998pB .member-3W1lQa:hover .status-oxiHuE.offline-3qoTek,
.members-1998pB .member-3W1lQa.popout-open .status-oxiHuE.offline-3qoTek {border-color: #636b75 !important}
.members-1998pB .member-3W1lQa:hover .status-oxiHuE.streaming-2_dnHe,
.members-1998pB .member-3W1lQa.popout-open .status-oxiHuE.streaming-2_dnHe {border-color: #593695 !important}
.members-1998pB .member-3W1lQa.popout-open .status-oxiHuE.typing-1KJk_j,
.members-1998pB .member-3W1lQa:hover .status-oxiHuE.typing-1KJk_j {background-color: rgba(0, 0, 0, 0.4) !important;}
.members-1998pB .member-3W1lQa.popout-open .status-oxiHuE.typing-1KJk_j .inner-1gJC7_,
.members-1998pB .member-3W1lQa:hover .status-oxiHuE.typing-1KJk_j .inner-1gJC7_ {left: 1px !important;top: 1px !important;}
```


## Better Headers

Underlines and centers the headers in userlist, channel list, and DM list.

### Preview

![Channel List](http://i.zackrauen.com/0oKsvn.png)
![User List](http://i.zackrauen.com/0SMAGX.png)

### CSS

```css
/* underline roles in memberlist & DMs */
.members-1998pB .membersGroup-v9BXpm, .private-channels header {
	text-align: center;
	overflow: visible;
	margin-bottom: 10px;
}

.members-1998pB .membersGroup-v9BXpm::after, .private-channels header::after {
	content: "";
	display: block;
	height: 1px;
	width: 100%;
	border-bottom: 2px solid white;
}
.private-channels header::after {padding-bottom: 10px;}

/* underline labels in channellist */
.channels-Ie2l6A .wrapperDefault-10Jfvz, .channels-Ie2l6A .wrapperHovered-28fu1D {
	padding-top: 28px;
	padding-right: 8px;
	padding-left: 18px;
	padding: 0 0 8px 0;
	height: auto;
	margin: 28px 8px 4px 18px;
	border-bottom: 2px solid white;
}
.channels-Ie2l6A .nameDefault-2DI02H, .channels-Ie2l6A .nameHovered-1gxhWH {text-align: center;}
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
.avatarSpeaking-1wJCNq {
	box-shadow: none;
}
.avatarSpeaking-1wJCNq::before {
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
.avatarSpeaking-1wJCNq, .avatarDefault-35WC3R, .avatarContainer-72bSfM {
	border-color: transparent !important;
	box-shadow: none !important;
	z-index: 10;
}

.avatarSpeaking-1wJCNq::before {
	content: "";
	position: absolute;
	left: -5px;
	width: 4px;
	height: 20px;
	background: #43b581;
}

.avatarSpeaking-1wJCNq::after {
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
.userInfoViewing-16kqK3 .flexChild-faoVW3 > div:nth-child(2) .viewBody-2Qz-jg.selectable-x8iAUj {
    filter: blur(5px);
    transition: 200ms cubic-bezier(.2, .11, 0, 1);
}

.userInfoViewing-16kqK3 .flexChild-faoVW3 > div:nth-child(2) .viewBody-2Qz-jg.selectable-x8iAUj:hover {
    filter: none;
    transition: 200ms cubic-bezier(.2, .11, 0, 1);
}
```