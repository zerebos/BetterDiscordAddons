import type {Channel, Guild, GuildMember, GuildRole, PermissionOverwrite} from "@discord";
import type {DiscordPermissions as IDiscordPermissions} from "@discord/modules";
import type {PermissionableEntity, PermissionCategoryDefinition} from "./types";



interface Description {
    ast: string[];
    locale: string;
}

interface PermissionSpecification {
    title: string;
    flag: bigint;
    description: ((locale: string) => Description) | string[] | string;
}

interface PermissionSpecCategory {
    title: string;
    permissions: PermissionSpecification[];
}

// interface PermissionDefinition {
//     id: string;
//     name: string;
//     description: string;
// }

// interface PermissionCategoryDefinition {
//     name: string;
//     permissions: PermissionDefinition[];
// }

interface SpecManager {
    generateGuildPermissionSpec(guild: Guild): PermissionSpecCategory[];
    generateChannelPermissionSpec(channelId: string, guildId: string): PermissionSpecCategory[];
}

const GuildStore = BdApi.Webpack.Stores.GuildStore;
const UserStore = BdApi.Webpack.Stores.UserStore;
const DiscordPermissions = BdApi.Webpack.getModule<IDiscordPermissions>(m => m.ADD_REACTIONS, {searchExports: true})!;
let specManager = null as SpecManager | null;
BdApi.Webpack.waitForModule<SpecManager>(BdApi.Webpack.Filters.byKeys("generateGuildPermissionSpec")).then(mod => {
    if (!mod) throw new Error("Permission spec manager not found");
    specManager = mod;
});


export function getDefinitions(guildIdOrGuild?: string | Guild): PermissionCategoryDefinition[] {
    if (!specManager) throw new Error("Permission spec manager not found");

    // If no guild is provided, default to the first guild in the sorted guild list
    if (!guildIdOrGuild) guildIdOrGuild = BdApi.Webpack.Stores.SortedGuildStore.getFlattenedGuildIds()[0];

    // Get the guild object from the ID if a string was provided
    const guild = typeof guildIdOrGuild === "string" ? BdApi.Webpack.Stores.GuildStore.getGuild(guildIdOrGuild) : guildIdOrGuild;
    if (!guild) throw new Error("Guild not found");

    const guildSpecs = specManager.generateGuildPermissionSpec(guild);
    return guildSpecs.map(category => ({
        name: category.title,
        permissions: category.permissions.map(perm => ({
            id: Object.keys(DiscordPermissions).find(key => DiscordPermissions[key as keyof IDiscordPermissions] === perm.flag) ?? "",
            name: perm.title,
            description: typeof perm.description === "function" ? perm.description(BdApi.Webpack.Stores.LocaleStore.locale).ast[0] : (Array.isArray(perm.description) ? perm.description[0] : (perm.description || ""))
        }))
    }));
}


export function getAllowedDenied(roleOrOverwrite: EntityTarget): Record<string, "allowed" | "denied" | "neutral"> {
    const allowed = getAllowedPermissions(roleOrOverwrite);
    const denied = getDeniedPermissions(roleOrOverwrite);
    const result: Record<string, "allowed" | "denied" | "neutral"> = {};
    for (const perm in DiscordPermissions) {
        const isAllowed = (allowed & DiscordPermissions[perm as keyof IDiscordPermissions]!) === DiscordPermissions[perm as keyof IDiscordPermissions]!;
        const isDenied = (denied & DiscordPermissions[perm as keyof IDiscordPermissions]!) === DiscordPermissions[perm as keyof IDiscordPermissions]!;
        result[perm] = isAllowed ? "allowed" : isDenied ? "denied" : "neutral";
    }
    return result;
}

export function getRoles(guild: Guild) {
    const roleStore = BdApi.Webpack.Stores.GuildRoleStore;
    const roles = roleStore.getRolesSnapshot(guild.id);
    return roles;
}


export function getAllowedPermissions(roleOrOverwrite: EntityTarget): bigint {
    // Channel
    if (typeof roleOrOverwrite === "object" && "allow" in roleOrOverwrite) {
        return roleOrOverwrite.allow;
    }

    // Guild
    if (typeof roleOrOverwrite === "object" && "hoist" in roleOrOverwrite) {
        return roleOrOverwrite.permissions;
    }

    // Custom
    if (typeof roleOrOverwrite === "object" && "permissions" in roleOrOverwrite && !("guildId" in roleOrOverwrite)) {
        if (typeof roleOrOverwrite.permissions === "bigint") {
            return roleOrOverwrite.permissions;
        }
        return roleOrOverwrite.permissions.allow;
    }

    // Default
    return 0n;
}

export function getDeniedPermissions(roleOrOverwrite: EntityTarget): bigint {
    // Channel
    if (typeof roleOrOverwrite === "object" && "deny" in roleOrOverwrite) {
        return roleOrOverwrite.deny;
    }

    // Custom
    if (typeof roleOrOverwrite === "object" && "permissions" in roleOrOverwrite && !("guildId" in roleOrOverwrite)) {
        if (typeof roleOrOverwrite.permissions === "bigint") {
            return 0n;
        }
        return roleOrOverwrite.permissions.deny;
    }

    // Guild & Default
    return 0n;
}


interface CustomEntity extends Omit<PermissionableEntity, "permissions"> {
    // For custom entities, using just a bigint implies allowed permissions with no denials, since we don't have a way to specify denied permissions
    // However, if you want to specify both allowed and denied permissions for a custom entity, you can use the PermissionOverwrite structure
    permissions: Omit<PermissionOverwrite, "id" | "type"> | bigint;
}

type PermissionTarget = Channel | Guild | GuildMember;
type EntityTarget = CustomEntity | GuildRole | PermissionOverwrite;

export function getEntityTargets(permTarget: PermissionTarget): Record<string, EntityTarget> {
    // Channel
    if ("guild_id" in permTarget && permTarget.guild_id) {
        return permTarget.permissionOverwrites;
    }

    // Guild
    if ("maxMembers" in permTarget) {
        const roles = getRoles(permTarget);
        return roles;
    }

    // User
    if ("userId" in permTarget) {
        const guild = GuildStore.getGuild(permTarget.guildId);
        if (!guild) return {};
        const roles = getRoles(guild);
        const memberRoleList = [...permTarget.roles]; // copy to prevent mutations

        // Start with the user's roles minus @everyone, which is added back later for UI purposes
        const memberTargetMap: Record<string, EntityTarget> = {};
        for (const roleId of memberRoleList) {
            if (roles[roleId]) memberTargetMap[roleId] = roles[roleId];
        }

        // @everyone role always applies to users
        // apply after loop to allow custom placement of role in ui
        // TODO: rework the entity structure to avoid this hack
        memberRoleList.push(guild.id);

        // Setup some special variables for later
        const isOwner = permTarget.userId === guild.ownerId;
        const ALL_PERMISSIONS = Object.values(DiscordPermissions!).reduce((all, p) => all | p);

        // Calculate the user's effective permissions by OR'ing together all their role permissions, starting with 0 and applying each role's allowed permissions and then denied permissions
        let userPerms = 0n;
        for (const roleId of memberRoleList) {
            const role = roles[roleId];
            if (role) userPerms |= role.permissions;
        }

        // Add a pseudo-role for "effective" permissions
        memberTargetMap["@effective"] = {
            id: "@effective",
            name: "Effective Permissions",
            permissions: {
                allow: isOwner ? ALL_PERMISSIONS : userPerms,
                deny: isOwner ? 0n : ~userPerms
            },
        } satisfies CustomEntity;

        // If the user is the owner, add an entry for the @owner pseudo-role with all permissions
        if (isOwner) {
            memberTargetMap["@owner"] = {
                id: "@owner",
                name: "Server Owner",
                permissions: ALL_PERMISSIONS,
                iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjb2xvci1taXgoaW4gb2tsYWIsIGhzbCgzOC40NTUgY2FsYygxKjEwMCUpIDQzLjEzNyUgLzEpIDEwMCUsICMwMDAgMCUpIiBkPSJNNSAxOGExIDEgMCAwIDAtMSAxIDMgMyAwIDAgMCAzIDNoMTBhMyAzIDAgMCAwIDMtMyAxIDEgMCAwIDAtMS0xSDVaTTMuMDQgNy43NmExIDEgMCAwIDAtMS41MiAxLjE1bDIuMjUgNi40MmExIDEgMCAwIDAgLjk0LjY3aDE0LjU1YTEgMSAwIDAgMCAuOTUtLjcxbDEuOTQtNi40NWExIDEgMCAwIDAtMS41NS0xLjFsLTQuMTEgMy0zLjU1LTUuMzMuODItLjgyYS44My44MyAwIDAgMCAwLTEuMThsLTEuMTctMS4xN2EuODMuODMgMCAwIDAtMS4xOCAwbC0xLjE3IDEuMTdhLjgzLjgzIDAgMCAwIDAgMS4xOGwuODIuODItMy42MSA1LjQyLTQuNDEtMy4wN1oiPjwvcGF0aD48L3N2Zz4=",
                position: undefined
            } satisfies CustomEntity;
        }

        // Add the @everyone role to the ui
        memberTargetMap[guild.id] = roles[guild.id];

        return memberTargetMap;
    }

    return {};
}


export function getPermissionableEntities(guildContext: Guild, permTarget: PermissionTarget): PermissionableEntity[] {
    const roles = getRoles(guildContext);
    const permEntries: PermissionableEntity[] = [];
    const permTargets = getEntityTargets(permTarget);

    for (const key in permTargets) {
        // console.log(key);
        const entityPermissions = permTargets[key];
        const perms = getAllowedDenied(entityPermissions);

        // Real guild role
        const role = roles?.[key];
        if (role) {
            permEntries.push({
                id: key,
                name: role.name,
                permissions: perms,
                color: role.colorStrings?.primaryColor,
                iconUrl: role.icon ? `https://cdn.discordapp.com/role-icons/${role.id}/${role.icon}.webp` : undefined,
                position: role.position || undefined
            });
            continue;
        }

        // Real user
        const user = UserStore.getUser(key);
        if (user) {
            permEntries.push({
                id: key,
                name: user.username,
                permissions: perms,
                avatarUrl: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`
            });
        }

        // Custom entries @everyone or @owner
        if ("permissions" in entityPermissions && !("guildId" in entityPermissions)) {
            permEntries.push({
                id: key,
                name: entityPermissions.name,
                permissions: perms,
                color: entityPermissions.color,
                iconUrl: entityPermissions.iconUrl,
                position: entityPermissions.position || undefined
            });
        }
    }
    return permEntries;
}