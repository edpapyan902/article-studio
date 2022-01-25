/* Functions */

async function getBase64(file) {
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () =>
            res(reader.result);
        reader.onerror = rej;
    })
}

/* Main */
async function main() {
    const iframe = document.querySelector("iframe");
    const textarea = document.querySelector("textarea");
    /* Load content as markdown */

    textarea.value = new showdown.Converter({
        tables: true,
        strikethrough: true,
        simpleLineBreaks: true,
        parseImgDimensions: true,
        ghCompatibleHeaderId: true,
        noHeaderId: true
    }).makeMarkdown(textarea.value);

    /* Clean content*/
    textarea.value = textarea.value
            .replaceAll("<!-- -->", "")
            .replaceAll('<link rel="stylesheet" href="/stylesheets/edit/framestyle.css">', '')
            .replaceAll('<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js"></script>', '')
            .replaceAll('<script>hljs.highlightAll()</script>', '')
    
    textarea.value = textarea.value
            .slice(6, textarea.value.length - 4)

    /* Highlight */
    hljs.highlightAll();

    /* Trigger when "Save" button is clicked */

    document.querySelector('#save').addEventListener('click', () => {
        document.querySelector('#run').click();
        document.querySelector("textarea.save").value = iframe.srcdoc;
        document.querySelector("input.save").value = document.getElementById("img_url").value;
        document.querySelector("#submit").click();
    });

    /* Submit to /article/save using axios */

    document.querySelector("#submit").addEventListener('click', (e) => {
        e.preventDefault();
        axios.post("/article/save", {
            name: document.querySelector("form#result > input[name='name']").value,
            content: document.querySelector("form#result > textarea[name='content']").value,
            display_img: document.querySelector("form#result > input[name='display_img']").value,
        });
    })

    /* Key combining */

    document.addEventListener("keydown", e => {
        if (e.ctrlKey) {
            if (e.key === "s") {
                e.preventDefault();
                document.querySelector('#save').click();
            }
            if (e.key == "r") {
                e.preventDefault();
                document.querySelector('#run').click();
            }
        }
    });

    /* Test markdown listener */
    document.querySelector('#run').addEventListener('click', () => {
        iframe.srcdoc = `
        <link rel="stylesheet" href="/stylesheets/edit/framestyle.css">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js"></script>
        ` + new showdown.Converter({
            tables: true,
            strikethrough: true,
            simpleLineBreaks: true,
            parseImgDimensions: true,
            ghCompatibleHeaderId: true,
            noHeaderId: true
        }).makeHtml(textarea.value) +
            `<script>hljs.highlightAll()</script>`;
    });

    // Back button
    document.querySelector('#back').addEventListener('click', () => {
        const name = document.querySelectorAll("span").item(0).innerHTML;
        location.replace(`/reader/${encodeURIComponent(name)}`);
    });
}

// Run main
main();