
<style>
    
    svg {
        max-width: 20em;
        margin-block: 2em;

        /* Do not clip shapes outside the viewBox */
        overflow: visible;
    }
    .swatch {
        display: block;
        background-color: var(--color);
        width: 1em;
        height: 1em;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
    }
    .legend {
        border-style: solid;
        border-width: 2px;
        padding: 15px;
        margin: 10px;
        border-color: lightgray;
        flex: 1;
    }
    .container {
        display: flex;
        align-items: center;
        gap: 2px;
    }
    ul {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(8em, 1fr));
    }
    li {
        display: flex;
        align-items: center;
        gap: 2px;
    }
    svg:has(path:hover) {
        path:not(:hover) {
            opacity: 50%;
        }
    }
    path {
        transition: 300ms;
        cursor: pointer;
    }
    .selected {
        --color: oklch(60% 45% 0) !important;

        &:is(path) {
            fill: var(--color);
        }
    }
    /* li span {
        display: inline-flex;
        aspect-ratio: 1 / 1;
        background-color: skyblue;
        max-width: 10em;
        max-height: 10em;
        border-radius: 75%;
    } */
    /* li::marker {
        color: var(--color)
    } */
</style>
<script>
    import * as d3 from 'd3';
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    export let selectedIndex = -1;
    export let data = [];
    
    let sliceGenerator = d3.pie().value(d => d.value);
    let arcData;
    $: arcData = sliceGenerator(data);

    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    let arcs;
    $: arcs = arcData.map(d => arcGenerator(d));
</script>

<div class="container">
    <svg viewBox="-50 -50 100 100">
        {#each arcs as arc, index}
            <path d={ arc } fill={ colors(index) } 
                  class:selected={selectedIndex === index}
                  on:click={e => selectedIndex =  selectedIndex === index ? -1 : index} />
        {/each}
    </svg>
    <ul class="legend">
        {#each data as d, index}
            <li style="--color: { colors(index) }">
                <span class="swatch" class:selected={selectedIndex === index}></span>
                {d.label} <em>({d.value})</em>
            </li>
        {/each}
    </ul>
</div>
