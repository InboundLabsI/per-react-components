# Permobil Navigator 1.1 - React Components

## Development

`yarn start`

## Build

`yarn build:widget`

## How to use

### 1. Create containers for components

Add empty `div` elements with `permobil-navigator-component` class and pass configuration options via `data` attributes.

```
<div class="permobil-navigator-component" data-component="contact"></div>
```

### 2. Add script and styles

Upload js and css files from `dist` folder, and add it to the page:

```
<link href="permobil-navigator-components.css" rel="stylesheet" />
<script src="permobil-navigator-components.js"></script>
```

### 3. Configure 

Options must be passed via `data-` attributes, with each component.

| Option                       | Component | Required | Description                                            |
| ---------------------------- |-----------|:--------:| -------------------------------------------------------|
| data-component               | *         | Yes      | Component name. One of: "Contact", "Products", "User". |
| data-support-url             | Contact   | No       | URL for support menu item.                             |
| data-ticket-submission-url   | Contact   | No       | URL for ticket submission link.                        |
| data-sales-contact-form-id   | Contact   | No       | Sales rep contact HS form id.                          |
| data-sales-contact-portal-id | Contact   | No       | Sales rep contact HS portal id.                        |
| data-algolia-app-id          | Products  | Yes      | Algolia Application ID                                 |
| data-algolia-search-key      | Products  | Yes      | Algolia search-only API key                            |
| data-algolia-index-name      | Products  | Yes      | Algolia index name                                     |
| data-preferences-url         | User      | No       | URL for Preferencies link                               |

## Author

Egor Milyukov at InboundLabs  
egor@inboundlabs.co  
2020