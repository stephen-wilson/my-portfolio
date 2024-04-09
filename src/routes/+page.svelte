<svelte:head>
    <title>Stephen's Portfolio</title>
</svelte:head>
<script>
    import projects from '$lib/projects.json';
    import Project from "$lib/Project.svelte";
</script>

<img id="profile-photo" src="images/professional_headshot.jpg" alt="A professional headshot of Stephen Wilson."/>
<h1>Stephen Wilson</h1>
<p>
    I am a Junior at MIT pursuing a B.S. in Artificial Intelligence and Decision Making. I have a strong interest in AI and a passion for developing AI and machine learning to integrate it into end-to-end production software that will have a positive impact on society. 
</p>
<p>
    Recently, I worked at Google on the Android Performance Testing team using machine learning to optimize tests by predicting if performance regression detection parameters are properly set for a metric.
</p>    
<p>
    I have previous internship experience doing data science work at a startup and research experience at MIT in applied natural language processing for language education.
</p>

{#await fetch("https://api.github.com/users/stephen-wilson") }
    <p>Loading...</p>
{:then response}
    {#await response.json()}
        <p>Decoding...</p>
    {:then data}
        <section>
            <h2>Github Stats</h2>
            <dl>
                <dt>Public Repos:</dt>
                <dd>{ JSON.stringify(data.public_repos) }</dd>

                <dt>Followers:</dt>
                <dd>{ JSON.stringify(data.followers) }</dd>
            </dl>
        </section>
    {:catch error}
        <p class="error">
            Something went wrong: {error.message}
        </p>
    {/await}
{:catch error}
	<p class="error">
		Something went wrong: {error.message}
	</p>
{/await}

<h2>Latest Projects</h2>
<div class="projects highlights">
    {#each projects.slice(0, 3) as p}
    <Project info={p} hLevel = 3/>
    {/each}
</div>