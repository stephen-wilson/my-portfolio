function $$ (selector, context = document) {
	return Array.from(context.querySelectorAll(selector));
}

let pages = [
	{url: ".", title: "Home"},
    {url: "resume", title: "Resume"},
	{url: "projects", title: "Projects"},
    {url: "contact", title: "Contact"},
];


document.body.insertAdjacentHTML("afterbegin",`
    <label class="color-scheme">
        Theme:
        <select>
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>`
);

function setColorScheme(colorScheme) {
    document.documentElement.style.setProperty("color-scheme", colorScheme);
}

let select = document.querySelector("select");
select.addEventListener("input", function (event) {
    console.log("color scheme changed to", event.target.value);
    setColorScheme(event.target.value);
    localStorage.colorScheme = event.target.value;
});

if ("colorScheme" in localStorage) {
    setColorScheme(localStorage.colorScheme);
    select.value = localStorage.colorScheme;
}

