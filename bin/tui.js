// --------------------------------------------------------------------
// This is a client text user interface example to the ecommerce DB API
// Dependencies:
//   blessed
// Install:
//   $npm install
//   Start the ecommerce DB API server: $npm run start
//
// Usage:
//   Set the APIURL to your server's URL
//   $node tui.js
// --------------------------------------------------------------------

let blessed = require('blessed'),
    // contrib = require('blessed-contrib'),
    screen = blessed.screen();

const APIURL = 'http://localhost:3001';

// Example of API calls to server side

// Get all products
async function fetchProducts() {
    const response = await fetch(`${APIURL}/api/products`);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const products = await response.json();
    return products;
};

// Get all categories
async function fetchCategories() {
    const response = await fetch(`${APIURL}/api/categories`);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const products = await response.json();
    return products;
};

// Get all tags
async function fetchTags() {
    const response = await fetch(`${APIURL}/api/tags`);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const products = await response.json();
    return products;
};

// Blessed js implementation example

// Background desktop container
const desktop = blessed.box({
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    content: 'Main box container',
    tags: true,
    style: {
        fg: 'black',
        bg: 'white'
    }
});

// Right side box
const box = blessed.box({
    top: '2',
    right: '0',
    width: '65%',
    height: '100%-2',
    content: '{bold}e-commerce API client side user interface example{/bold}',
    tags: true,
    shadow: true,
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
        style: {
            bg: 'yellow'
        }
    },
    keys: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0'
        },
        focus: {
            border: {
                fg: 'black',
                bg: 'white'
            }
        },
        hover: {
            bg: 'red'
        }
    }
});

// Side Menu
const sideMenu = blessed.list({
    parent: desktop, // Can't capture events if we use screen.append(sideMenu)
    left: '0',
    top: '2',
    height: '100%-2',
    width: '35%',
    keys: true,
    items: ['(p)roducts', '(c)ategories', '(t)ags', '(q)uit'],
    shadow: true,
    border: {
        type: 'line'
    },
    style: {
        shadow: true,
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0'
        },
        hover: {
            fg: 'black',
            bg: 'yellow'
        },
        focus: {
            border: {
                fg: 'black',
                bg: 'white'
            }
        },
        selected: { bg: 'blue' },
        item: { fg: 'yellow' }
    }
});


// Alert box
const alertbox = blessed.question({
    top: 'center',
    left: 'center',
    width: '50%',
    height: 'shrink',
    content: 'Alert',
    tags: true,
    shadow: true,
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
        style: {
            bg: 'red'
        }
    },
    keys: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'red',
        border: {
            fg: 'black'
        },
        focus: {
            border: {
                fg: 'white',
                bg: 'red'
            }
        },
        hover: {
            bg: 'red'
        }
    }
});


// sideMenu.on('selected', () => { console.log('got an enter'); });
// sideMenu.key('d', () => { console.log('got an a'); });

// sideMenu.key(['space', 'o'], function () {
//     box.content = 'got space or "o"';
//     this.enterSelected(); // Emit select and action event
// });

function displayContent(content) {
    let pretty_content = JSON.stringify(content, null, 4);
    box.scrollTo(0);
    box.setContent(pretty_content);
    screen.render();
};

function displayAlert(err) {
    alertbox.focus();
    alertbox.ask(err, () => {
        sideMenu.focus();
        alertbox.hide();
        screen.render();
    });
};

sideMenu.on('select', (async function (item, selected) {
    // box.setContent(`got an enter/select event',\nindex: ${this.selected} / ${selected};\nvalue: ${this.items[this.selected].content} / ${item.content}`);
    switch (this.selected) {
        case 0:
            let products;
            try {
                products = await fetchProducts();
            } catch (err) {
                displayAlert(err);
            };
            displayContent(products);
            break;
        case 1:
            let categories;
            try {
                categories = await fetchCategories();
            } catch (err) {
                displayAlert(err);
            };
            displayContent(categories);
            break;
        case 2:
            let tags;
            try {
                tags = await fetchTags();
            } catch (err) {
                displayAlert(err);
            };
            displayContent(tags);
            break;
        case 3:
            return process.exit(0);
            break;
        default:
    };
    // console.log(
    //     'got an enter/select event',
    //     'index: ', this.selected, '/', selected, ';',
    //     'value:', this.items[this.selected].content, '/', item.content
    // );
}));

sideMenu.key('p', async function () {
    // box.setContent(`got an "p" ${this.selected}, ${this.items[this.selected].content}`);
    // screen.render();
    const products = await fetchProducts();
    displayContent(products);
});

sideMenu.key('c', async function () {
    // box.setContent(`got a "b" ${this.selected}, ${this.items[this.selected].content}`);
    // screen.render();
    const categories = await fetchCategories();
    displayContent(products);
});

sideMenu.key('t', async function () {
    const tags = await fetchTags();
    displayContent(tags);
});

// Navigate between the two windows
sideMenu.key(["tab"], function () {
    box.focus();
    screen.render();
});

box.key(["tab"], function () {
    sideMenu.focus();
    screen.render();
});

box.key(["pagedown"], function () {
    //console.log("pagedown");
    box.scroll(parseInt(this.height/2));
    screen.render();
});

box.key(["pageup"], function () {
    this.scroll(-parseInt(this.height/2));
    screen.render();
});

// Set up screen
screen.append(desktop);
desktop.append(box);
desktop.append(sideMenu);
desktop.append(alertbox);
screen.title = 'ecommerce db test TUI';

// quit
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});

//allow control the table with the keyboard
sideMenu.focus();

screen.render();
