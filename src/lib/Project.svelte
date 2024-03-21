<script>
    export let info = {};
    export let hLevel = 2;
    // let p = info;
</script>
<style>
    article {
        display: grid;
        grid-template-rows: subgrid;
        grid-row: span 4;
        h2 {
            margin: 0;
        }
	}
    #year {
        font-family: "Baskerville";
        font-variant-numeric: oldstyle-nums;
    }
</style>

<article>
    <svelte:element this={"h" + hLevel}>{ info.title }</svelte:element>
    <img src={info.image} alt="">
    <p>{info.description}</p>
    <p id="year">c. {info.year}</p>
</article>