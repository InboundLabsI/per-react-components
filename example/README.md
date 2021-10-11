# Permobil Navigator 1.2.10 - React Components for HS and WP sites

## How to use

### 1. Create containers for components

Add empty `div` elements with `permobil-navigator-component` class and pass configuration options via `data` attributes.

```
<div class="permobil-navigator-component" data-component="contact"></div>
```

### 2. Add script and styles

Upload js and css files from `dist` folder, and add it to the page:

```
<link href="permobil-navigator-components.umd.css" rel="stylesheet" />
<script src="permobil-navigator-components.umd.js"></script>
```

### 3. Configure

Options must be passed via `data-` attributes, with each component.

| Option                       | Components       | Required | Description                                                    |
| ---------------------------- | ---------------- | :------: | -------------------------------------------------------------- |
| data-component               | \*               |   Yes    | Component name. One of: "Contact", "Products", "User".         |
| data-support-url             | Contact          |    No    | URL for support menu item.                                     |
| data-ticket-submission-url   | Contact          |    No    | URL for ticket submission link.                                |
| data-sales-contact-form-id   | Contact          |    No    | Sales rep contact HS form id.                                  |
| data-sales-contact-portal-id | Contact          |    No    | Sales rep contact HS portal id.                                |
| data-algolia-search-key      | Products, Search |   Yes    | Algolia search-only API key                                    |
| data-algolia-app-id          | Products, Search |   Yes    | Algolia Application ID                                         |
| data-algolia-index-name      | Products         |   Yes    | Algolia index name                                             |
| data-algolia-indices         | Search           |   Yes    | Comma-separated list of Algolia indices                        |
| data-header-height           | Search           |    No    | Height of the Navigator container (header), in px. Default: 60 |
| data-hs-portal-id            | Search           |    No    | Hubspot Portal ID, where to search pages and blog              |
| data-preferences-url         | User             |    No    | URL for Preferencies link                                      |

## Development

### Components library development

To develop library localy link library dependencies to example project first.

To install project run following commands in the library root directory:

```bash
link
yarn
cd node_modules/react
link
cd ../react-dom
link
cd ../../example
link il-per-react-components
link react
link react-dom
yarn
```

To watch locally run following commands in the library root directory

```bash
yarn start
```

And in a separate terminal window run:

```bash
cd example
yarn start
```

### Build widgets for browser

To build browser widgets run following commands in the library root directory

```bash
yarn build
cd example
yarn build:widget
```

### Deploy to HubSpot

1. Build widgets for browser (see previous section)
2. Upload files from `/example/dist/` folder to Hubspot file system.
3. Update path to uploaded files in the ["Main_Navigation_React_Componenets" HS module](https://app.hubspot.com/design-manager/1624307/modules/40729744253), at the end of module.html file.

## Author

Egor Milyukov at InboundLabs  
egor@inboundlabs.co  
2020
