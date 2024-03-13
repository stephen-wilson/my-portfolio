<script>
    import "../style.css";
    import { page } from '$app/stores';
    let pages = [
        {url: "./", title: "Home"},
        {url: "./resume", title: "Resume"},
        {url: "./projects", title: "Projects"},
        {url: "./contact", title: "Contact"},
    ];

    let root = globalThis?.document?.documentElement;
    $: root?.style.setProperty("color-scheme", colorScheme);

    let localStorage = globalThis.localStorage ?? {};
    let colorScheme = localStorage.colorScheme ?? "light dark";
    $: localStorage.colorScheme = colorScheme;
</script>
<style>
    .menu {
        display: flex;
        margin-bottom: 1em;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        /* border-bottom-color: oklch(80% 3% 200); */
        border-bottom-color: var(--border-color);
        a {
            flex: 1;
            text-decoration: none;
            color: inherit;
            text-align: center;
            padding: 0.7em;
        }
    }

    .current {
        border-bottom-width: 0.4em;
        border-bottom-style: solid;
        border-bottom-color: oklch(80% 3% 200);
        padding-bottom: 0.3em;
    }

    a:not(.current) {
        &:hover {
            border-bottom-width: 0.4em;
            border-bottom-style: solid;
            border-bottom-color: var(--color-accent);
            /* background-color: oklch(from var(--color-accent) 95% 5% h); */
            background-color: color-mix(in oklch, var(--color-accent), canvas 85%);
            padding-bottom: 0em;
        }
    }

    .color-scheme {
        position: absolute;
        top: 1rem;
        right: 1rem;
    }
</style>

<label class="color-scheme">
    Theme:
    <select bind:value={ colorScheme }>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
    </select>
</label>

<nav class="menu">
	{#each pages as p }
    <a href={ p.url } class:current={ "." + $page.route.id === p.url } target={ p.url.startsWith("http") ? "_blank" : null }>{ p.title }</a>
	{/each}
</nav>

<slot />