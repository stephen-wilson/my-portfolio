
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
        /* transition-property: transform, opacity, fill; */
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
    export let transitionDuration = 3000;
    
    let sliceGenerator = d3.pie().value(d => d.value).sort(null);
    export let colors = d3.scaleOrdinal(d3.schemeTableau10);
    let wedges = {};
    let oldData = [];
    let pieData;
    $: {
        // pieData = data.map(d => ({...d}));
        pieData = d3.sort(data, d => d.label);
        let arcData = sliceGenerator(data);
        let arcs = arcData.map(d => arcGenerator(d));
        oldData = pieData;
        pieData = pieData.map((d, i) => ({...d, ...arcData[i], arc: arcs[i]}));
        transitionArcs();
    };
    function transitionArcs() {
        let wedgeElements = Object.values(wedges);

        d3.selectAll(wedgeElements).transition("arc")
            .duration(transitionDuration)
            .styleTween("d", function (_, index) {
                let wedge = this;
                let label = Object.keys(wedges)[index];
                let transition = transitionArc(wedge, label);
                return transition?.interpolator;
            });
    }
    function getEmptyArc (label, data = pieData) {
        // Union of old and new labels in the order they appear
        let labels = d3.sort(new Set([...oldData, ...pieData].map(d => d.label)));
        let labelIndex = labels.indexOf(label);
        let sibling;
        for (let i = labelIndex - 1; i >= 0; i--) {
            sibling = data.find(d => d.label === labels[i]);
            if (sibling) {
                break;
            }
        }

        let angle = sibling?.endAngle ?? 0;
        return {startAngle: angle, endAngle: angle};
    }
    function arc (wedge) {
        // Calculations that will only be done once per element go here
        // TODO use transitionArc() to get the data you need
        transition = transitionArc();
        return {
            duration: transitionDuration,
            easing: d3.easeCubic,
            css: (t, u) => {
                // t is a number between 0 and 1 that represents the transition progress; u is 1 - t
                // TODO return CSS to be applied for the current t as a string, e.g. `fill: red`
                return "d: " + transition.interpolator(transition.type === "out" ? u : t);
            }
        }
    }
    function sameArc(arc1, arc2) {
        if (!arc1 && !arc2) {
            return true;
        }
        if (arc1.startAngle === arc2.startAngle && arc1.endAngle === arc2.endAngle) {
            return true;
        }
        return false;
    }
    function transitionArc (wedge, label) {
        label ??= Object.entries(wedges).find(([label, w]) => w === wedge)[0];
        
        let d = pieData.find(d => d.label === label);
        let d_old = oldData.find(d => d.label === label);
        if (sameArc(d_old, d)) {
            return null;
        }
        let type = d ? d_old ? "update" : "in" : "out";
        // Always clone objects first, see note in https://d3js.org/d3-interpolate/value#interpolateObject
        // let from = {...d_old};
        let from = d_old ? {...d_old} : getEmptyArc(label, oldData);
        // let to = {...d};
        let to = d ? {...d} : getEmptyArc(label, pieData);
        let angleInterpolator = d3.interpolate(from, to);
        let interpolator = t => `path("${ arcGenerator(angleInterpolator(t)) }")`;
        return {d, d_old, from, to, interpolator, type};
    }


</script>

<div class="container">
    <svg viewBox="-50 -50 100 100">
        {#each pieData as d, index (d.label)}
            <path d={ d.arc } fill={ colors(d.id ?? d.label) } 
                  class:selected={selectedIndex === index}
                  on:click={e => selectedIndex =  selectedIndex === index ? -1 : index} />
        {/each}
    </svg>
    <ul class="legend">
        <!-- {#each pieData as d, index} -->
        {#each pieData as d, index (d.label)}
            <li style="--color: { colors(d.label) }">
                <span class="swatch" class:selected={selectedIndex === index}></span>
                {d.label} <em>({d.value})</em>
            </li>
        {/each}
    </ul>
</div>
