<svelte:head>
    <title>Meta</title>
</svelte:head>

<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import Pie from "$lib/Pie.svelte";

    let data = [];
    let commits = [];
    let files = [];
    let longest_file = "";
    let longest_file_lines = 0;
    let fileLengths = [];
    let averageFileLength = 0;
    let workByPeriod = [];
    let longestWorkPeriod = 0;

    onMount(async () => {
            data = await d3.csv("loc.csv", row => ({
                ...row,
                line: Number(row.line), // or just +row.line
                depth: Number(row.depth),
                length: Number(row.length),
                date: new Date(row.date + "T00:00" + row.timezone),
                datetime: new Date(row.datetime)
            }));
            commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
                let first = lines[0];
                let {author, date, time, timezone, datetime} = first;
                let ret = {
                    id: commit,
                    url: "https://github.com/stephen-wilson/my-portfolio/commit/" + commit,
                    author, date, time, timezone, datetime,
                    hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
                    totalLines: lines.length
                };

                // Like ret.lines = lines
                // but non-enumerable so it doesn’t show up in JSON.stringify
                Object.defineProperty(ret, "lines", {
                    value: lines,
                    configurable: true,
                    writable: true,
                    enumerable: false,
                });
                

                return ret;
            });
            files = d3.groups(data, d => d.file);
            longest_file = d3.max(files.map(([commits, lines]) => {
                return lines;
            }));
            longest_file_lines = longest_file.length;
            longest_file = longest_file[0].file;
            fileLengths = d3.rollups(data, v => d3.max(v, v => v.line), d => d.file);
            averageFileLength = d3.mean(fileLengths, d => d[1]);
            workByPeriod = d3.rollups(data, v => v.length, d => d.datetime.toLocaleString("en", {dayPeriod: "short"}));
            longestWorkPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];
            console.log(data);
            console.log(commits);
    });

    let width = 1000, height = 600;

    $: console.log(commits.map(o => o.datetime));
    $: console.log(d3.max(commits.map(o => o.datetime)));
    $: xScale = d3.scaleTime()
        .domain(d3.extent(commits.map(o => o.datetime)))
        .range([0, width])
        .nice();
    $: console.log(xScale);

    // $: xScale = d3.scaleTime()
	// 	.domain(d3.extent(data))
	// 	.nice();
	
	$: yScale = d3.scaleLinear()
			.domain([0, 24])
			.range([0, height]);

    let margin = {top: 10, right: 10, bottom: 30, left: 20};

    let usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left
    };
    usableArea.width = usableArea.right - usableArea.left;
    usableArea.height = usableArea.bottom - usableArea.top;
    let xAxis, yAxis, yAxisGridlines;
    $: {
        d3.select(xAxis).call(d3.axisBottom(xScale));
        d3.select(yAxis).call(d3.axisLeft(yScale));
        d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00"));
    }
    // $: yAxisGridlines = d3.scaleLinear()
	// 		.domain([0, 24])
	// 		.range([0, height]);
    $: {
        d3.select(yAxisGridlines).call(
            d3.axisLeft(yScale)
            .tickFormat("") 
            .tickSize(-usableArea.width)
        );
    }
    let hoveredIndex = -1;
    $: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};

    let cursor = {x: 0, y: 0};
    let brushSelection;
    let svg;
    $: {
        
        function brushed (evt) {
            brushSelection = evt.selection;
        }
        d3.select(svg).call(d3.brush().on("start brush end", brushed));
        d3.select(svg).selectAll(".dots, .overlay ~ *").raise();
    }

    function isCommitSelected (commit) {
        if (!brushSelection) {
            return false;
        }
        let min = {x: brushSelection[0][0], y: brushSelection[0][1]};
        let max = {x: brushSelection[1][0], y: brushSelection[1][1]};
        let x = xScale(commit.date);
        let y = yScale(commit.hourFrac);
        return x >= min.x && x <= max.x && y >= min.y && y <= max.y;

    }

    $: selectedCommits = brushSelection ? commits.filter(isCommitSelected) : [];
    $: hasSelection = brushSelection && selectedCommits.length > 0;
    $: selectedLines = (hasSelection ? selectedCommits : commits).flatMap(d => d.lines);
    $: console.log("lines", selectedLines);
    $: console.log("commits", selectedCommits);
    $: languageBreakdown = d3.rollups(selectedLines, v => d3.count(v, v => v.line), d => d.type);

</script>

<style>
	svg {
		overflow: visible;
	}
    .gridlines {
        stroke-opacity: .2;
    }
    dl.info {
        background-color: oklch(100% 0% 0 / 80%);
        box-shadow: 5px 5px 10px black;
        border-radius: 10px;
        backdrop-filter: blur(10px);
        padding: 1em;
        display: grid;
        grid-template-columns: max-content auto;
        column-gap: 1rem; /* Adjust the space between the columns */
        align-items: center;
        margin: 0;
        transition-duration: 500ms;
        transition-property: opacity, visibility;

        &[hidden]:not(:hover, :focus-within) {
            opacity: 0;
            visibility: hidden;
        }
        dt {
            font-weight: normal;
            color: #666; /* A lighter color makes labels less prominent */
            margin: 0; /* Remove default margin */
        }
        dd {
            font-weight: bold; /* Makes the values stand out */
            margin: 0; /* Remove default margin */
            /* padding: 0.5rem 0; */
        }
    }
    .tooltip {
        position: fixed;
        top: 1em;
        left: 1em;
    }
    circle {
        transition: 200ms;

        transform-origin: center;
        transform-box: fill-box;

        &:hover {
            transform: scale(1.5);
        }
    }
    @keyframes marching-ants {
        to {
            stroke-dashoffset: -8; /* 5 + 3 */
        }
    }

    svg :global(.selection) {
        fill-opacity: 10%;
        stroke: black;
        stroke-opacity: 70%;
        stroke-dasharray: 5 3;
        animation: marching-ants 2s linear infinite;
    }

    .selected {
        fill: red;
    }
</style>

<h1>Meta</h1>
<dl class="stats">
	<dt>Total <abbr title="Lines of code">LOC</abbr></dt>
	<dd>{data.length}</dd>
    <dt>Total number of commits</dt>
    <dd>{commits.length}</dd>
    <dt>Total number of files</dt>
    <dd>{files.length}</dd>
    <dt>Longest file</dt>
    <dd>{longest_file} ({longest_file_lines} <abbr title="Lines of code">LOC</abbr>)</dd>
    <dt>Average line depth</dt>
    <dd>{d3.mean(data, d => d.depth)}</dd>
    <dt>Average file length</dt>
    <dd>{averageFileLength}</dd>
    <dt>Longest work period</dt>
    <dd>{longestWorkPeriod}</dd>
</dl>

<svg viewBox="0 0 {width} {height}" bind:this={svg}>
    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
    <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />
	<g class="dots">
    {#each commits as commit, index }
        <circle
            cx={ xScale(commit.datetime) }
            cy={ yScale(commit.hourFrac) }
            r="5"
            fill="steelblue"
        	on:mouseenter={evt => {
                hoveredIndex = index;
                cursor = {x: evt.x, y: evt.y};
            }}
	        on:mouseleave={evt => hoveredIndex = -1}
            class:selected={isCommitSelected(commit)}
        />
    {/each}
    </g>
</svg>
<p>{hasSelection ? selectedCommits.length : "No"} commits selected</p>
<Pie data={Array.from(languageBreakdown).map(([language, lines]) => ({label: language, value: lines}))} />
<!-- {#each languageBreakdown as [language, lines] }
	<dl>
        <dt>{language}</dt>
        <dd>{lines} ({d3.format('.1~%')(lines / selectedLines.length)})</dd>
    </dl>
{/each} -->

<dl id="commit-tooltip" class="info tooltip" hidden={hoveredIndex === -1} style="top: {cursor.y}px; left: {cursor.x}px">
	<dt>Commit</dt>
	<dd><a href="{ hoveredCommit.url }" target="_blank">{ hoveredCommit.id }</a></dd>

    <dt>Author</dt>
    <dd>{hoveredCommit.author}</dd>

	<dt>Date</dt>
	<dd>{ hoveredCommit.datetime?.toLocaleString("en", {date: "full"}) }</dd>

    <dt>Lines</dt>
    <dd>{hoveredCommit.lines?.length}</dd>
	<!-- Add: Time, author, lines edited -->
</dl>
This page includes stats about the code of this website.