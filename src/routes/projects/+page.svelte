<svelte:head>
	<title>Projects</title>
</svelte:head>
<script>
    import projects from '$lib/projects.json';
    import Project from "$lib/Project.svelte";
    import Pie from "$lib/Pie.svelte";
    import * as d3 from 'd3';
    // let rolledData = d3.rollups(projects, v => v.length, d => d.year);
    // let pieData = rolledData.map(([year, count]) => {
    //     return { value: count, label: year };
    // });
    let selectedYearIndex = -1;
    let query = "";
    let filteredProjects;
    $: filteredProjects = projects.filter(project => {
        let values = Object.values(project).join("\n").toLowerCase();
        return values.includes(query.toLowerCase());
    });

    // Make sure the variable definition is *outside* the block
    let pieData;

    $: {
        // Initialize to an empty object every time this runs
        pieData = {};

        // Calculate rolledData and pieData based on filteredProjects here
        let rolledData = d3.rollups(filteredProjects, v => v.length, d => d.year);
        pieData = rolledData.map(([year, count]) => {
            return { value: count, label: year };
        });
    }
    let selectedYear;
    $: selectedYear = selectedYearIndex > -1 ? pieData[selectedYearIndex].label : null;
    $: filterByYear = filteredProjects.filter(project => {

        if (selectedYear) {
            return project.year === selectedYear;
        }

        return true;
    });
</script>

<h1>{projects.length} Projects</h1>
<Pie data={pieData} bind:selectedIndex={selectedYearIndex} />
<input type="search" bind:value={query}
       aria-label="Search projects" placeholder="🔍 Search projects…" />
<div class="projects">
    {#each filterByYear as p}
    <Project info={p} />
    {/each}
    <!-- <article>
        <h2>Perspiciatis iure ratione voluptatibus.</h2>
        <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
        <p>Iusto quisquam ipsum vitae harum voluptatum aut porro, architecto ratione doloremque dolores dolorem rerum consequuntur, quam, cumque sed provident. Dolor facilis blanditiis laboriosam tempora, ratione distinctio incidunt porro aliquid atque.</p>
    </article>
    <article>
        <h2>Perferendis, sunt expedita? Alias.</h2>
        <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
        <p>Vitae dolor omnis fugit expedita? Nobis expedita amet adipisci! Ipsam eius accusantium ipsum, quidem ipsa sit asperiores ut, aliquid provident sequi vitae ducimus nobis cumque. Doloremque enim culpa molestiae labore.</p>
    </article>
    <article>
        <h2>Nihil optio minus alias.</h2>
        <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
        <p>Eligendi non cum vitae sapiente aspernatur eaque laboriosam temporibus totam nulla a quidem dolorem saepe quas nihil, ad dolor porro eius perferendis. Necessitatibus accusamus quo quibusdam natus accusantium maiores magnam?</p>
    </article>
    <article>
        <h2>Dicta voluptas impedit delectus.</h2>
        <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
        <p>Dolorem nesciunt fugiat possimus magnam hic, repudiandae eveniet sed nihil harum, consequuntur explicabo necessitatibus consectetur magni molestiae sunt? Exercitationem expedita animi atque voluptatem fuga quod, praesentium in amet illum suscipit.</p>
    </article>
    <article>
        <h2>Minus reiciendis at neque?</h2>
        <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
        <p>Ratione deleniti et eum dolores ab officiis, quis natus quasi asperiores repellat ad fuga recusandae rem aliquid perferendis veniam temporibus porro facere magnam tempora quam, nobis amet dolor? Totam, reiciendis.</p>
    </article>
    <article>
        <h2>Nobis neque quam consequatur!</h2>
        <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
        <p>Pariatur perferendis officiis placeat consectetur eum sunt quia veritatis. Placeat, nemo quo asperiores cumque omnis debitis, minus soluta veritatis recusandae vel officia, alias beatae sint voluptas! Omnis placeat quibusdam explicabo.</p>
    </article>
    <article>
        <h2>Quo magni itaque illo.</h2>
        <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
        <p>Delectus omnis, repudiandae inventore optio eius, qui quae aspernatur voluptas tempore possimus nesciunt dignissimos iste a id eos sequi temporibus aperiam? Impedit quod ex, facere natus deserunt magnam expedita saepe.</p>
    </article>
    <article>
        <h2>Maiores facilis unde ratione?</h2>
        <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
        <p>Facere eveniet blanditiis deleniti consequatur quas harum nemo deserunt consectetur possimus est quam commodi fuga inventore culpa, eligendi perferendis fugit porro impedit asperiores? Fugit eligendi fuga earum corporis commodi cupiditate.</p>
    </article>
    <article>
        <h2>Ullam eum maiores odio?</h2>
        <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
        <p>Nulla, dicta eius fugiat cupiditate nemo tempore harum accusamus ratione ipsam molestias soluta id sit in nostrum eum, voluptate consectetur esse doloribus quo quis, sunt ad? Commodi quae ad vitae.</p>
    </article>
    <article>
        <h2>Necessitatibus debitis iusto ducimus.</h2>
        <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
        <p>Obcaecati quae velit dignissimos sunt? Quos maxime optio rem voluptatibus dolorum magni totam similique, eum beatae ex labore possimus quia doloribus nostrum molestias! Fuga inventore id sunt ipsum quidem hic!</p>
    </article>
    <article>
        <h2>Dolorum excepturi perferendis tempora!</h2>
        <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
        <p>Modi quis voluptas et sapiente magni inventore voluptatem quia consequatur? Omnis enim porro nobis cum non excepturi veniam aspernatur impedit consequatur, magni facilis commodi exercitationem nulla explicabo repellat quam ad!</p>
    </article> -->
</div>