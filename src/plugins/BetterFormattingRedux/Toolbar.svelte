<script lang="ts">
    import {untrack} from "svelte";

    interface ButtonConfig {
        key: string;
        type: string;
        name: string;
        displayName: string;
        icon: string;
    }

    interface Props {
        buttons: ButtonConfig[];
        useIcons: boolean;
        hoverOpen: boolean;
        rightSide: boolean;
        opacity: number;
        fontSize: number;
        initiallyOpen?: boolean;
        onButtonClick: (key: string) => void;
        onCodeblockContext: (event: MouseEvent) => void;
        onToggle?: (isOpen: boolean) => void;
    }

    const {
        buttons,
        useIcons,
        hoverOpen,
        rightSide,
        opacity,
        fontSize,
        initiallyOpen = false,
        onButtonClick,
        onCodeblockContext,
        onToggle,
    }: Props = $props();

    // untrack prevents Svelte from warning about capturing the initial value of a prop;
    // we intentionally only use initiallyOpen as a seed—state is managed independently.
    let isOpen = $state(untrack(() => initiallyOpen));
    let toolbarEl: HTMLDivElement | undefined = $state();

    export function close(): void {
        isOpen = false;
        onToggle?.(false);
    }

    function handleArrowClick() {
        if (!hoverOpen) {
            isOpen = !isOpen;
            onToggle?.(isOpen);
        }
    }

    function handleMouseMove(e: MouseEvent) {
        if (useIcons || !toolbarEl) return;
        const pos = e.pageX - (toolbarEl.parentElement?.getBoundingClientRect()?.left ?? 0);
        const width = parseInt(getComputedStyle(toolbarEl).width);
        let diff = -1 * width;
        for (const elem of Array.from(toolbarEl.children) as HTMLElement[]) {
            if (elem.classList.contains("bf-arrow")) continue;
            diff += elem.offsetWidth;
        }
        toolbarEl.scrollLeft = (pos / width * diff);
    }
</script>

<div
    class="bf-toolbar"
    role="toolbar"
    tabindex="-1"
    aria-label="Text formatting"
    class:bf-visible={isOpen}
    class:bf-hover={hoverOpen}
    class:bf-left={!rightSide}
    style:opacity={opacity}
    style:font-size={fontSize + "%"}
    onmousemove={!useIcons ? handleMouseMove : undefined}
    bind:this={toolbarEl}
>
    <div
        class="bf-arrow"
        role="button"
        tabindex="0"
        aria-label="Toggle formatting toolbar"
        onclick={handleArrowClick}
        onkeydown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleArrowClick(); } }}
    ></div>
    {#each buttons as button (button.key)}
        <div
            class="format {button.type}"
            role="button"
            tabindex="0"
            title={button.name}
            data-name={button.key}
            onclick={() => onButtonClick(button.key)}
            onkeydown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onButtonClick(button.key); } }}
            oncontextmenu={button.key === "codeblock" ? onCodeblockContext : undefined}
        >
            {#if useIcons}
                {@html button.icon}
            {:else}
                {@html button.displayName}
            {/if}
        </div>
    {/each}
</div>

<style>
    .bf-toolbar {
        user-select: none;
        white-space: nowrap;
        display: block;
        position: absolute;
        color: rgba(255, 255, 255, 0.5);
        width: auto !important;
        right: 0;
        bottom: auto;
        border-radius: 3px;
        height: 27px !important;
        top: 0px;
        transform: translate(0, -100%);
        overflow: hidden !important;
        pointer-events: none;
        padding: 10px 30px 15px 5px;
        margin: 0 5px 0 0;
    }

    .bf-toolbar.bf-visible,
    .bf-toolbar.bf-hover:hover {
        pointer-events: initial;
    }

    .bf-toolbar::before {
        content: "";
        display: block;
        width: 100%;
        height: calc(100% - 15px);
        position: absolute;
        z-index: -1;
        background: #424549;
        pointer-events: initial;
        left: 0px;
        top: 5px;
        border-radius: 3px;
        transform: translate(0, 55px);
        transition: all 200ms ease;
    }

    :global(.theme-light) .bf-toolbar::before {
        background: #97A0AA;
    }

    .bf-toolbar.bf-visible::before,
    .bf-toolbar.bf-hover:hover::before {
        transform: translate(0, 0px);
        transition: all 200ms cubic-bezier(0, 0, 0, 1);
    }

    .bf-toolbar .format {
        padding: 7px 5px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        transform: translate(0, 55px);
        transition: all 50ms, transform 200ms ease;
        position: relative;
        pointer-events: initial;
        border-radius: 2px;
        max-height: 27px;
        box-sizing: border-box;
        vertical-align: middle;
    }

    .bf-toolbar .format :global(img),
    .bf-toolbar .format :global(svg) {
        opacity: 0.6;
        vertical-align: middle;
        max-height: inherit;
    }

    .bf-toolbar .format:hover {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.9);
    }

    .bf-toolbar .format:active {
        background: rgba(0, 0, 0, 0.1) !important;
        transition: all 0ms, transform 200ms ease;
    }

    .bf-toolbar.bf-visible .format,
    .bf-toolbar.bf-hover:hover .format {
        transform: translate(0, 0);
        transition: all 50ms, transform 200ms cubic-bezier(0, 0, 0, 1);
    }

    .bf-arrow {
        display: block;
        background: url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
        height: 30px;
        width: 30px;
        right: 5px;
        position: absolute;
        pointer-events: initial;
        bottom: 0;
        background-repeat: no-repeat;
        background-position: 50%;
        transition: all 200ms ease;
        opacity: 0.3;
        cursor: pointer;
    }

    :global(.theme-light) .bf-arrow {
        background: url("data:image/svg+xml;utf8,<svg fill='rgb(127,129,134)' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
    }

    .bf-toolbar.bf-visible .bf-arrow,
    .bf-toolbar.bf-hover:hover .bf-arrow {
        transform: translate(0, -14px) rotate(-90deg);
        transition: all 200ms cubic-bezier(0, 0, 0, 1);
        opacity: 0.9;
    }

    .bf-toolbar.bf-left {
        left: 0 !important;
        right: auto !important;
        margin-right: 0 !important;
        margin-left: 5px !important;
        padding: 10px 10px 15px 30px !important;
    }

    .bf-toolbar.bf-left .bf-arrow {
        left: 5px !important;
        right: auto !important;
    }

    .bf-toolbar.bf-left.bf-hover:hover .bf-arrow,
    .bf-toolbar.bf-left.bf-visible .bf-arrow {
        transform: translate(0, -14px) rotate(90deg) !important;
    }
</style>
