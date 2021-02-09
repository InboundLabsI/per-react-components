# @inboundlabs/per-react-components

> React components by InboundLabs

## Install

```bash
yarn add https://github.com/InboundLabsI/per-react-components#master
```

## Usage

```jsx
import React from 'react'
import { Contact, Products, Search } from '@inboundlabs/per-react-components'
import '@inboundlabs/per-react-components/dist/index.css'

const searchOptions = {
  algoliaAppID: "", // Algolia Application ID | required
  algoliaSearchKey: "", // Algolia search-only API key | required
  algoliaIndices: "", // Comma-separated list of Algolia indices | required
  headerHeight: "", // Height of the Navigator container (header), in px. | optional
}

const productsOptions = {
  algoliaAppID: "", // Algolia Application ID, required
  algoliaSearchKey: "", // Algolia search-only API key | required
  algoliaIndexName: "" // Algolia index name | required
}

const contactOptions = {
  ticketSubmissionURL: "", // URL for ticket submission link. | optional
  salesContactFormId: "", // Sales rep contact HS form id. | optional
  salesContactPortalId: "", // Sales rep contact HS portal id. | optional
  supportUrl: "", // URL for support menu item. | optional
  headerHeight: "", // Height of the Navigator container (header), in px. | optional
}

const Example = () => {

  return (
    <div className="example-navigator">
      <Search {...searchOptions} />
      <Products {...productsOptions} />
      <Contact {...contactOptions} />
    </div>
  )
} 
```

## License

MIT © [milukove](https://github.com/milukove)
