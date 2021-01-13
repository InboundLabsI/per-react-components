import React from 'react';
import './App.scss';
import Contact from './components/Contact'
import Products from './components/Products'
import User from './components/User'
import Search from './components/Search'

function App({ domElement }) {
  const component = domElement.getAttribute("data-component")

  if (!component) {
    return null;
  }

  if (!!component && component === 'contact') {
    domElement.classList.add('init');
    return <Contact domElement={domElement} />
  }

  if (!!component && component === 'products') {
    domElement.classList.add('init');
    return <Products domElement={domElement} />
  }

  if (!!component && component === 'user' && !!window && !!window.booya) {
    domElement.classList.add('init');
    return <User domElement={domElement} />
  }

  if (!!component && component === 'search') {
    domElement.classList.add('init');
    return <Search domElement={domElement} />
  }

  return null;

}

export default App;
