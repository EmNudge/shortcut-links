const styles = `
body {
    background: #ddd;
    font-family: monospace;
    display: grid;
    justify-items: center;
}
main {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 800px;
}
.card {
    padding: 20px;
    background: white;
    border-radius: 5px;
    width: 300px;
    height: 100px;
}
.card h2 {
    margin: 0;
    margin-bottom: 16px;
}
.card a {
    text-overflow: ellipsis;
    text-decoration: none;
    color: CornflowerBlue;
}
form {
    display: flex;
    flex-direction: column;
    max-width: 250px;

    justify-content: center;
    padding: 20px;
    gap: 10px;
}
hr {
    margin-top: 20px;
    width: 100%;
    height: 1px;
}
`

type Links = { name: string, url: string | null }[]

const getLinksDisplayer = (links: Links) => {
    const linkCards = links.map(({ name, url }) => `
        <div class="card">
            <h2>${name}</h2>
            <a href="${url || '#'}">${url || 'NOT FOUND'}</a>
        </div>
    `).join("\n");

    return `<main>${linkCards}</main>`;
}

export function getHomePage(links: Links, withUpdate = false) {
    const updateText = withUpdate ? `<h1>Update sent! Note it may take some time for changes to propogate</h1><hr>` : '';

    return `
    <html>
    <head>
        <style>${styles}</style>
    </head>
    <body>
        ${updateText}
        <h1>Redirects</h1>
        ${getLinksDisplayer(links)}

        <hr>

        <h1>Add Redirect</form>
        <form method="POST" action="/set" enctype="multipart/form-data">
            <input type="text" placeholder="name" name="name">
            <input type="text" placeholder="https://example.com" name="url">
        <button type="submit">Add</button>
        </form>
    </body>
    </html>
    `
}