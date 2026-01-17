import {HexString} from "@betterdiscord/api/ui";

export interface User {
    avatar: string;
    avatarDecorationData: null | {
        asset: string;
        skuId: string;
    };
    banner: string | null;
    bot: boolean;
    clan: string | null;
    desktop: boolean;
    discriminator: string;
    displayName: string;
    email: string | null;
    flags: number;
    globalName: string;
    guildMemberAvatars: object;
    hasAnyStaffLevel(): boolean;
    hasBouncedEmail: boolean;
    hasFlag(f: number): boolean;
    id: string;
    isStaff(): boolean;
    isStaffPersonal(): boolean;
    mfaEnabled: boolean;
    mobile: boolean;
    nsfwAllowed: boolean | undefined;
    personalConnectionId: null | string;
    phone: string | null;
    premiumType: number | undefined;
    premiumUsageFlags: number;
    primaryGuild: string | null;
    publicFlags: number;
    purchasedFlags: number;
    system: boolean;
    username: string;
    verified: boolean;

    getAvatarURL(a: unknown, size: number, b: boolean): string;

    readonly avatarDecoration: null | {
        asset: string;
        skuId: string;
    };
    readonly createdAt: Date;
    readonly isProvisional: boolean;
    readonly tag: string;
}

export interface DMUser {
    avatar: string;
    avatar_decoration_data: {
        asset: string;
        expires_at: string | null;
        sku_id: string;
    };
    bot: boolean;
    clan: string | null;
    discriminator: string;
    display_name: string;
    global_name: string;
    id: string;
    primary_guild: string | null;
    public_flags: number;
    username: string;
}

export interface GuildMember {
    avatar: null;
    avatarDecoration: undefined;
    colorRoleId: string;
    colorString: HexString;
    colorStrings: {
        primaryColor: HexString;
        secondaryColor: HexString;
        tertiaryColor: HexString;
    };
    communicationDisabledUntil: null;
    flags: number;
    fullProfileLoadedTimestamp: number;
    guildId: string;
    highestRoleId: string;
    hoistRoleId: string;
    iconRoleId: undefined;
    isPending: false;
    joinedAt: string;
    nick: string;
    premiumSince: null;
    roles: string[];
    unusualDMActivityUntil: null;
    userId: string;
}

export interface GuildRole {
    color: number;
    colors: {
        primaryColor: number;
        secondaryColor: number;
        tertiaryColor: number;
    };
    colorString: null;
    colorStrings: {
        primaryColor: HexString;
        secondaryColor: HexString;
        tertiaryColor: HexString;
    };
    description: string | null;
    flags: number;
    guildId: string;
    hoist: boolean;
    icon: string | null;
    id: string;
    managed: boolean;
    mentionable: boolean;
    name: string;
    // originalPosition: number;
    permissions: bigint;
    position: number;
    tags: Record<string, unknown>;
    unicodeEmoji: null;
    version: null;
}

export interface PermissionOverwrite {
    allow: bigint;
    deny: bigint;
    id: string;
    type: number;
}

export interface Channel {
    application_id: string | undefined;
    flags_: number;
    guild_id: string | null;
    icon: string | undefined;
    id: string;
    isMessageRequest: boolean;
    isMessageRequestTimestamp: boolean | null;
    isSpam: boolean;
    lastMessageId: string;
    lastPinTimestamp: string;
    name: string;
    nicks: {
        [key: string]: string;
    };
    ownerId: string;
    rawRecipients: User[];
    recipientFlags: number;
    recipients: string[];
    safetyWarnings: string[];
    type: number;

    readonly accessPermissions: bigint;
    readonly bitrate: number;
    readonly flags: number;
    readonly isHDStreamSplashed: boolean;
    readonly nsfw: boolean;
    readonly permissionOverwrites: {
        [id: string]: PermissionOverwrite;
    };
    readonly position: number;
    readonly rateLimitPerUser: number;
    readonly topic: string;
    readonly userLimit: number;
}

export interface DMChannel extends Channel {
    type: 1;
}

export interface GuildChannel extends Channel {
    defaultAutoArchiveDuration: number | undefined;
    defaultThreadRateLimitPerUser: number | undefined;
    hdStreamingBuyerId: string | undefined;
    hdStreamingUntil: Date | undefined;
    iconEmoji: undefined;
    linkedLobby: undefined;
    memberListId: undefined;
    parent_id: string;
    permissionOverwrites_: {
        [id: string]: PermissionOverwrite;
    };
    position_: number;
    rateLimitPerUser_: number;
    themeColor: string | undefined;
    topic_: string;
    type: 0;
    version: number;
}


export interface Message {
    activity: null;
    activityInstance: null;
    application: null;
    applicationId: null;
    attachments: [];
    author: User;
    blocked: boolean;
    bot: boolean;
    call: null;
    changelogId: null;
    channel_id: string;
    codedLinks: [];
    colorString: undefined;
    components: [];
    content: string;
    customRenderedContent: undefined;
    editedTimestamp: null;
    embeds: [];
    flags: 0;
    giftCodes: [];
    giftInfo: undefined;
    giftingPrompt: null;
    id: string;
    ignored: boolean;
    interaction: null;
    interactionData: null;
    interactionError: null;
    interactionMetadata: null;
    isSearchHit: boolean;
    isUnsupported: boolean;
    loggingName: null;
    mentionChannels: [];
    mentionEveryone: boolean;
    mentionRoles: [];
    mentioned: boolean;
    mentions: [];
    messageReference: null;
    messageSnapshots: [];
    nick: undefined;
    nonce: string;
    pinned: boolean;
    poll: undefined;
    purchaseNotification: undefined;
    reactions: [];
    referralTrialOfferId: null;
    roleSubscriptionData: undefined;
    soundboardSounds: undefined;
    state: "SENT";
    stickerItems: [];
    stickers: [];
    timestamp: Date;
    tts: boolean;
    type: 0;
    webhookId: null;
}


export interface Guild {
    afkChannelId: null;
    afkTimeout: 300;
    application_id: null;
    banner: "dcf17e3b2f4967f9583f048370457d98";
    clan: null;
    defaultMessageNotifications: 1;
    description: "BetterDiscord, the Discord enhancement project.";
    discoverySplash: null;
    explicitContentFilter: 2;
    features: Set<string>;
    homeHeader: null;
    hubType: null;
    icon: "babd1af3fa6011a50e418a80f4970ceb";
    id: "86004744966914048";
    joinedAt: Date;
    latestOnboardingQuestionId: null;
    maxMembers: 500000;
    maxStageVideoChannelUsers: 150;
    maxVideoChannelUsers: 25;
    mfaLevel: 0;
    name: "BetterDiscord";
    nsfwLevel: 0;
    ownerId: "249746236008169473";
    preferredLocale: "en-US";
    premiumProgressBarEnabled: true;
    premiumSubscriberCount: 11;
    premiumTier: 2;
    publicUpdatesChannelId: "174279718500171776";
    rulesChannelId: "209971084286623744";
    safetyAlertsChannelId: "174279718500171776";
    splash: "0a0a7cc90ca96551e7a81ff789817ade";
    systemChannelFlags: 12;
    systemChannelId: "226943408277553152";
    vanityURLCode: null;
    verificationLevel: 3;
    readonly acronym: string;
}