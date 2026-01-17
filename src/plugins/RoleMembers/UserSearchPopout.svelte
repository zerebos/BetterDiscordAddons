<script lang="ts">
	import {slide} from "svelte/transition";

    interface User {
        id: string;
        name: string;
        avatar: string;
        color?: string;
    }

    interface UserSearchPopoutProps {
        onItemClick?: (event: MouseEvent, user: User) => void;
        users: Array<User>;
    }

	const {users, onItemClick}: UserSearchPopoutProps = $props();

	let query = $state("");
	const results = $derived.by(() => {
		if (!query.trim()) return users;
		return users.filter(e => e.name.toLowerCase().includes(query.toLowerCase()));
	})
</script>

<div class="popout popout-role-members">

	<div class="header">
		<input type="search" placeholder="Search {users.length} users..." bind:value={query} />
	</div>


<div class="user-list">
	{#each results as user (user.id)}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
            class="user"
            transition:slide={{duration: 150}}
            onclick={(event) => onItemClick?.(event, user)}
        >
			<img src={user.avatar} alt="{user.name} Avatar" />
			<span style:color={user.color}>{user.name}</span>
		</div>
	{/each}
</div>
</div>


<style>
.popout {
	--space-xxs: 4px;
	--space-4: 4px;
	--space-8: 8px;
	--space-12: 12px;
	--radius-xs: 4px;
	--radius-sm: 8px;
	--select-option-height: 40px;
	--opacity-black-16: hsl(0 calc(1*0%) 0% /0.1607843137254902);
	--background-surface-higher: color-mix(in oklab, hsl(240 calc(1*5.882%) 16.667% /1) 100%, #000 0%);
	--background-mod-normal: hsl(240 calc(1*4%) 60.784% /0.1607843137254902);
	--border-subtle: color-mix(in oklab,hsl(240 calc(1*4%) 60.784% /0.12156862745098039) 100%,hsl(0 0% 0% /0.12156862745098039) 0%);
	--custom-input-background-color: color-mix(in oklab,hsl(0 calc(1*0%) 0% /0.12156862745098039) 100%,hsl(0 0% 0% /0.12156862745098039) 0%);
	--custom-input-border-color: color-mix(in oklab,hsl(240 calc(1*4%) 60.784% /0.2) 100%,hsl(0 0% 0% /0.2) 0%);
	--custom-input-hover-border-color: color-mix(in oklab,hsl(240 calc(1*4%) 60.784% /0.2) 100%,hsl(0 0% 0% /0.2) 0%);
	--custom-input-focus-border-color: color-mix(in oklab, hsl(234.935 calc(1*85.556%) 64.706% /1) 100%, #000 0%);
	--custom-input-text-color: color-mix(in oklab, hsl(240 calc(1*6.667%) 94.118% /1) 100%, #000 0%);
	--text-strong: color-mix(in oklab, hsl(0 calc(1*0%) 98.431% /1) 100%, #000 0%);
}

.popout {
	background-color: var(--background-surface-higher);
	border: 1px solid var(--border-subtle);
	border-radius: var(--radius-sm);
	box-shadow: 0 2px 8px 0 var(--opacity-black-16);
	width: 222px;
	display: flex;
	flex-direction: column;
	padding: var(--space-4);
	gap: 4px;
	font-size: 16px;
	font-family: "gg sans","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
}

.header {
	display: flex;
	flex-grow: 1;
	/* padding: calc(var(--space-xxs) - 1px) var(--space-4) calc(var(--space-xxs) - 1px) var(--space-8); */
	padding: 4px;
}

.header input {
	flex-grow: 1;
	background-color: var(--custom-input-background-color);
	border: 1px solid var(--custom-input-border-color);
	border-radius: var(--radius-sm);
	box-sizing: border-box;
	color: var(--custom-input-text-color);
	font-size: inherit;
	max-height: 1lh;
	min-height: calc(var(--select-option-height) - 2px);
	min-width: min(12ch, 80%);
	padding-inline: var(--space-12) var(--space-8);
}

.header input:focus {
	outline: 2px solid var(--custom-input-focus-border-color);
	outline-offset: -2px;
}

.header input::-webkit-search-cancel-button {
    mask-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjEyMy4wNXB4IiBoZWlnaHQ9IjEyMy4wNXB4IiB2aWV3Qm94PSIwIDAgMTIzLjA1IDEyMy4wNSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTIzLjA1IDEyMy4wNTsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTEyMS4zMjUsMTAuOTI1bC04LjUtOC4zOTljLTIuMy0yLjMtNi4xLTIuMy04LjUsMGwtNDIuNCw0Mi4zOTlMMTguNzI2LDEuNzI2Yy0yLjMwMS0yLjMwMS02LjEwMS0yLjMwMS04LjUsMGwtOC41LDguNQ0KCQljLTIuMzAxLDIuMy0yLjMwMSw2LjEsMCw4LjVsNDMuMSw0My4xbC00Mi4zLDQyLjVjLTIuMywyLjMtMi4zLDYuMSwwLDguNWw4LjUsOC41YzIuMywyLjMsNi4xLDIuMyw4LjUsMGw0Mi4zOTktNDIuNGw0Mi40LDQyLjQNCgkJYzIuMywyLjMsNi4xLDIuMyw4LjUsMGw4LjUtOC41YzIuMy0yLjMsMi4zLTYuMSwwLTguNWwtNDIuNS00Mi40bDQyLjQtNDIuMzk5QzEyMy42MjUsMTcuMTI1LDEyMy42MjUsMTMuMzI1LDEyMS4zMjUsMTAuOTI1eiIvPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=);
    mask-size: 10px 10px;
    background-color: var(--text-strong);
    -webkit-appearance: none;
    width: 10px;
    height: 10px;
}

.user-list {
	height: 200px;
	overflow: hidden scroll;
}

.user {
	display: flex;
	gap: 10px;
	flex-grow: 1;
	color: var(--text-strong);
	min-height: var(--select-option-height);
	padding: calc(var(--space-xxs) - 1px) var(--space-4) calc(var(--space-xxs) - 1px) var(--space-8);
    margin: 0 4px;
	align-items: center;
	cursor: pointer;
	transition: background-color .15s ease-out;
	border-radius: var(--radius-xs);
    box-sizing: border-box;
}

.user:hover {
	background-color: var(--background-mod-normal);
}

.user img {
	width: 24px;
	height: 24px;
	border-radius: 50%;
}

.user span {
	text-overflow: ellipsis;
	line-height: 1.25;
	white-space: nowrap;
	overflow: hidden;
}


.user-list::-webkit-scrollbar-thumb,
.user-list::-webkit-scrollbar-track {
    background-clip: padding-box;
    border-radius: 7.5px;
    border-style: solid;
    border-width: 3px;
    visibility: hidden;
}

.user-list:hover::-webkit-scrollbar-thumb,
.user-list:hover::-webkit-scrollbar-track {
    visibility: visible;
}

.user-list::-webkit-scrollbar-track {
    border-width: initial;
    background-color: transparent;
    border: 2px solid transparent;
}

.user-list::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 4px;
    cursor: move;
    background-color: rgba(255, 255, 255, 0.3);
    min-height: 40px;
}

.user-list::-webkit-scrollbar {
    height: 8px;
    width: 8px;
}

/* .user-list::-webkit-scrollbar {
    width: 16px;
    height: 16px;
}

.user-list::-webkit-scrollbar-corner {
    background: transparent;
}

.user-list::-webkit-scrollbar-thumb {
    background: transparent;
    min-height: 40px;
}

.user-list:hover::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
}

.user-list::-webkit-scrollbar-thumb,
.user-list::-webkit-scrollbar-track {
    background-clip: padding-box;
    border: 4px solid transparent;
    border-radius: 8px;
}

.user-list::-webkit-scrollbar-track {
    margin-bottom: 36px;
} */
</style>




