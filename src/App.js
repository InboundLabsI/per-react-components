import React from 'react';
import './App.scss';
import Contact from './components/Contact'

function App({ domElement }) {
  const component = domElement.getAttribute("data-component")

  if (!component) {
    return null;
  }

  if (!!component && component === 'contact') {
    domElement.classList.add('init');
    return <Contact domElement={domElement} />
  }

  return null;

}

export default App;
