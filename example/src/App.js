import React from 'react'
import './App.scss';
import { Contact, Products, Search, User } from '@inboundlabs/per-react-components'
import '@inboundlabs/per-react-components/dist/index.css'

function App({ domElement }) {
  const component = domElement.getAttribute("data-component")

  if (!component) {
    return null;
  }

  if (!!component && component === 'contact') {
    domElement.classList.add('init');
    const options = {
      ticketSubmissionURL: domElement.getAttribute('data-ticket-submission-url'),
      salesContactFormId: domElement.getAttribute('data-sales-contact-form-id'),
      salesContactPortalId: domElement.getAttribute('data-sales-contact-portal-id'),
      headerHeight: domElement.getAttribute('data-header-height'),
      showTel: domElement.getAttribute('data-show-tel'),
      supportURL: domElement.getAttribute('data-support-url')
    }
    return <Contact {...options} />
  }

  if (!!component && component === 'products') {
    domElement.classList.add('init');
    const options = {
      algoliaAppID: domElement.getAttribute('data-algolia-app-id'),
      algoliaSearchKey: domElement.getAttribute('data-algolia-search-key'),
      algoliaIndexName: domElement.getAttribute('data-algolia-index-name')
    }
    return <Products {...options} />
  }

  if (!!component && component === 'user') {
    domElement.classList.add('init');
    const options = {
      preferencesURL: domElement.getAttribute('data-preferences-url')
    }
    return <User {...options} />
  }

  if (!!component && component === 'search') {
    domElement.classList.add('init');
    const options = {
      algoliaAppID: domElement.getAttribute('data-algolia-app-id'),
      algoliaSearchKey: domElement.getAttribute('data-algolia-search-key'),
      algoliaIndices: domElement.getAttribute('data-algolia-indices').split(','),
      headerHeight: domElement.getAttribute('data-header-height'),
      hsPortalId: domElement.getAttribute('data-hs-portal-id')
    }
    return <Search {...options} />
  }

  return null;

}

export default App;
