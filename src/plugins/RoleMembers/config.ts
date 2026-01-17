import type {Manifest} from "@betterdiscord/manifest";

const manifest: Manifest = {
    info: {
        name: "RoleMembers",
        authors: [{
            name: "Zerebos",
            discord_id: "249746236008169473",
            github_username: "zerebos",
            twitter_username: "IAmZerebos",
            link: "https://zerebos.com/links"
        }],
        version: "0.2.0",
        description: "Allows you to see the members of each role on a server.",
        github: "https://github.com/zerebos/BetterDiscordAddons/tree/master/Plugins/RoleMembers",
        github_raw: "https://raw.githubusercontent.com/zerebos/BetterDiscordAddons/master/Plugins/RoleMembers/RoleMembers.plugin.js"
    },
    changelog: [
        {
            title: "New in 0.2.0",
            type: "added",
            items: [
                "Added support for Discord's new color system. RoleMembers will now show usernames in their primary color if available.",
                "Switch to Svelte for the user search popout for better performance and reliability."
            ]
        },
        {
            title: "Totally Fixed",
            type: "fixed",
            items: [
                "Popouts should be working again.",
                "Clicking a user in the role members list now opens their profile popout when available.",
                "Role mention pills should now be properly patched again.",
                "Fixed an issue where member counts wouldn't show even when enabled.",
                "Various other minor fixes and improvements."
            ]
        },
    ],
    config: [
        {
            type: "switch",
            id: "showCounts",
            name: "Show Member Counts",
            note: "Enabling this shows the members counts of each role in the context menu",
            value: false
        }
    ],
    main: "index.ts"
};

export default manifest;