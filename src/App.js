import React from 'react';
import './App.scss';
import Contact from './components/Contact'
import Products from './components/Products'

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

  return null;

}

export default App;
