/* eslint-disable quotes */
module.exports = (Plugin, Api) => {
    const {WebpackModules, DiscordModules, DiscordAPI, Patcher} = Api;

    const _readOnlyPerms = [];
    const _hiddenChans = [];

    const userId = DiscordAPI.currentUser.id;
    const UnreadStore = WebpackModules.getByProps("hasUnread");
    const Permissions = DiscordModules.Permissions;
    const ChannelStore = DiscordModules.ChannelStore;
    const GuildStore = DiscordModules.GuildStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;

    const hide = function(element) { // these elements need to be hidden, NOT removed. Removing causes React to crash
        if (!element) return;
        //console.log('hiding', element);
        const hiddenClass = 'roleRemoveIcon-2-TeGW';
        if (element.className && element.className.indexOf('roleRemoveIcon-2-TeGW') > -1) return;
        else if (element.className) element.className += ' ' + hiddenClass;
        else element.className = hiddenClass;
        return element;
    };

    const disButt = function() { // disable perm buttons cause u can't use them :P
        //console.log('executing disButt();');
        let r = document.getElementById('app-mount');
        if (!r) return;
        let permButtons = r.getElementsByClassName('item-3T2z1R');
        if (permButtons && permButtons.length > 0) {
            for (let i in permButtons) {
                permButtons[i].disabled = true;
            }
        }
        let redButton = r.querySelector('.content-1rPSz4 .colorRed-1TFJan');
        hide(redButton);

        let syncButton = r.querySelector('.sidebarScrollable-1qPI87 .card-2j1p1_ .button-1dUBJq');
        hide(syncButton);

        let addPermOverw = r.querySelector('.sidebarScrollable-1qPI87 img.sidebarHeader-2uiNOo');
        hide(addPermOverw);

        let switches = r.getElementsByClassName('checkbox-2tyjJg');
        if (switches && switches.length > 0) {
            for (let i in switches) {
                if (!switches[i]) continue;
                switches[i].className = 'checkboxDisabled-1MA81A checkbox-2tyjJg';
                //console.log(switches[i].parentElement);
                if (switches[i].parentElement) switches[i].parentElement.className = (switches[i].parentElement.className || '').replace('switchEnabled-V2WDBB', 'switchDisabled-3HsXAJ');
            }
        }
        let addRoleButtons = r.getElementsByClassName('addButton-pcyyf6');
        if (addRoleButtons && addRoleButtons.length > 0) {
            for (let i in addRoleButtons) {
                hide(addRoleButtons[i]);
            }
        }
    };

    return class ShowHiddenChannels extends Plugin {
        constructor() {
            super();
            this._readOnlyPerms = _readOnlyPerms;
            this._hiddenChans = _hiddenChans;
        }

        onStart() {

            Patcher.after(Permissions, 'computePermissions', function(thisObject, args, returnValue) {
                // console.log("COMPUTE PERMISSIONS");
                let member = args[0]; // member to get perms for, object or ID
                let thing = args[1]; // this can be a channel, guild, category, ... object or ID
                let original = returnValue; // original (correct) perms

                if (member.id !== userId) { // checking for someone else
                    return original;
                }
                let chans = ChannelStore.getChannels();
                let guilds = GuildStore.getGuilds();
                if (chans[thing.id] || guilds[thing.id]) { // checking perms for a channel or guild

                    if (original & 1024) { // can already wiew channel
                        if (_hiddenChans.indexOf(thing.id) >= 0) _hiddenChans.splice(_hiddenChans.indexOf(thing.id), 1);
                    }
                    else { // can't view channel
                        if (_hiddenChans.indexOf(thing.id) == -1) _hiddenChans.push(thing.id);
                    }
                    if (original & 268435456) { // can already edit perms
                        if (_readOnlyPerms.indexOf(thing.id) >= 0) _readOnlyPerms.splice(_readOnlyPerms.indexOf(thing.id), 1);
                    }
                    else { // can't edit perms, but let me view them
                        if (_readOnlyPerms.indexOf(thing.id) == -1)  _readOnlyPerms.push(thing.id);
                    }

                    return (original | 1024 | 1048576 | 268435456); // add READ_MESSAGES, CONNECT, and MANAGE_ROLES to make it visible & allow viewing perms
                }
                return original;
            });

            Patcher.after(Permissions, 'getGuildPermissionProps', function(thisObject, args, returnValue) {
                if (!returnValue) return;
                //console.log(b.methodArguments);
                let guild = args[0];
                let member = args[1];
                if (member.id !== userId) { // checking for someone else
                    return returnValue;
                }
                if (returnValue.canManageRoles) {
                    if (_readOnlyPerms.indexOf(guild.id) > -1) _readOnlyPerms.splice(_readOnlyPerms.indexOf(guild.id), 1);
                    return returnValue;
                }
                if (_readOnlyPerms.indexOf(guild.id) == -1) _readOnlyPerms.push(guild.id);
                disButt();
                returnValue.canManageRoles = true;
                return returnValue;
            });
        //TODO: ^ This method is triggered very often while settings are open. That can cause a lot of lag. Could be partially replaced with the patched version of generateGuildGeneralPermissionSpec if it worked. Perhaps set an interval on disButt instead, but make sure to stop it when settings are closed.

        Patcher.before(Permissions, 'generateChannelGeneralPermissionSpec', function() {
            //console.log('channel permissions pane opened', b);
            let guildID = SelectedGuildStore.getGuildId();
            if (_readOnlyPerms.indexOf(guildID) > -1) {
                disButt();
                setTimeout(disButt, 690);
            }
        });
        //TODO: ^ This method tells when channel permissions are opened, but not what channel. Figure out how to get said channel, and make the check channel-specific instead of only checking guild perms

        /*monkeyPatch(Permissions, 'generateGuildGeneralPermissionSpec', function(b) {
            console.log('guild permissions pane opened', b);
            //if (_readOnlyPerms.indexOf( magical guild ID ) > -1)
                //setTimeout(disButt, 420);
            return b.callOriginalMethod(b.methodArguments);
        });*/
        //TODO: ^ This method tells when guild permissions are opened, but not what guild. Figure out how to get said guild

        Patcher.after(UnreadStore, 'hasUnread', function(thisObject, args, returnValue) {
            if (_hiddenChans.indexOf(args[0]) > -1) return false; // don't show hidden channels as unread.
            return returnValue;
        });
        Patcher.after(UnreadStore, 'hasUnreadPins', function(thisObject, args, returnValue) {
            if (_hiddenChans.indexOf(args[0]) > -1) return false; // don't show icon on hidden channel pins.
            return returnValue;
        });
        }
        
        onStop() {
            Patcher.unpatchAll();
        }

    };
};