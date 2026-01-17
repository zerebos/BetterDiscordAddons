import type {Manifest} from "../src/types/betterdiscord/manifest";


export default (config: Manifest) => {
    const info = config.info;
    const metaString = ["/**"];
    const line = (label: string, val: unknown) => val && metaString.push(` * @${label} ${val}`);
    line("name", info.name);
    line("description", info.description);
    line("version", info.version);
    line("author", info.author ?? info.authors?.map(a => a.name).join(", "));
    line("authorId", info.authorId ?? info?.authors?.[0].id ?? info?.authors?.[0].discord_id);
    line("authorLink", info.authorLink ?? info?.authors?.[0].link);
    line("website", info.website ?? info.github);
    line("source", info.source ?? info.github_raw ?? info.github);
    line("donate", info.donate);
    line("patreon", info.patreon);
    line("invite", info.invite);
    metaString.push(" */");
    metaString.push("");
    return metaString.join("\n");
};