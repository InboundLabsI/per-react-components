import React, { useState, useEffect, useRef } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, connectStateResults } from 'react-instantsearch-dom';
import './style.scss';
import ProductsIcon from '../Icons/ProductsIcon'
import ProductsDisplay from '../ProductsDisplay'

const menuItems = [
    {
        subtitle: 'EXPLORE',
        title: 'Power Wheelchairs',
        image: 'https://f.hubspotusercontent00.net/hubfs/1624307/navigator-components/power-wheelchairs.png',
        url: 'https://permobilus.com/products/power-wheelchairs-by-permobil',
        categoryName: 'Power Wheelchairs',
        order: 1
    },
    {
        subtitle: 'EXPLORE',
        title: 'Manual Wheelchairs',
        image: 'https://f.hubspotusercontent00.net/hubfs/1624307/navigator-components/manual-wheelchairs.png',
        url: 'https://permobilus.com/products/tilite-manual-wheelchairs-smartdrive-power-assist/',
        categoryName: 'Manual Wheelchairs',
        order: 2
    },
    {
        subtitle: 'EXPLORE',
        title: 'Seating / Positioning',
        image: 'https://f.hubspotusercontent00.net/hubfs/1624307/navigator-components/seating.png',
        url: 'https://permobilus.com/products/seating-and-positioning-by-roho/',
        categoryName: 'Seating and Positioning',
        order: 3
    }
]

const Products = ({ domElement }) => {
    const [expanded, setExpanded] = useState(false);
    const [dropdownAlignment, setDropdownAlignment] = useState('left');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const componentRef = useRef(null);
    const algoliaAppID = domElement.getAttribute('data-algolia-app-id');
    const algoliaSearchKey = domElement.getAttribute('data-algolia-search-key');
    const algoliaIndexName = domElement.getAttribute('data-algolia-index-name');

    const searchClient = algoliasearch(algoliaAppID, algoliaSearchKey);

    // Handle main button click
    const handleButtonClick = (event) => {
        if (!!expanded) {
            closeDropdown()
        } else {
            openDropdown()
        }
    }

    const handleHitClick = (event, hit) => {
        console.log('hit clicked', hit);
        closeDropdown();
        if (!!hit.url) {
            window.location.href = hit.url;
        }
    }

    const handleMenuItemClick = (e, item) => {
        e.preventDefault();
        closeDropdown();
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const dev = params.get('dev');
        if (!!dev && dev === 'testing') {
            setSelectedCategory(item.categoryName);
        } else {
            window.location.href = item.url
        }
    }

    const onHitKeyUp = (event, hit) => {
        if (event.charCode === 13) {
            handleHitClick('', hit)
        }
    }

    const closeDropdown = () => {
        setExpanded(false);
    }

    const openDropdown = () => {
        setExpanded(true);
    }

    const renderHit = ({ hit }) => <p tabindex="0" onKeyPress={e => { onHitKeyUp(e, hit) }} onClick={(e) => { handleHitClick(e, hit) }}>{hit.title}</p>;

    const renderResults = connectStateResults(({ searchState }) =>
        searchState && searchState.query ? (
            <Hits hitComponent={renderHit} />
        ) : null
    );

    const renderSearchBox = () => (
        <SearchBox translations={{
            submitTitle: 'Submit your search query.',
            resetTitle: 'Clear your search query.',
            placeholder: 'Search a product...',
        }} />
    )

    const renderMenu = () => (
        <ul className="products-component__dropdown-menu" role="menu">
            {!!menuItems && menuItems.length > 0 && menuItems.map((item, i) => (
                <li key={`${item.title}-${i}`}>
                    <a href={item.url} role="menuitem" className="products-component__dropdown-menu-item" onClick={e => { handleMenuItemClick(e, item) }}>
                        <div className="products-component__dropdown-menu-item-image" style={{ backgroundImage: `url(${item.image})` }}></div>
                        <div className="products-component__dropdown-menu-item-text">
                            <p className="products-component__dropdown-menu-item-subtitle">{item.subtitle}</p>
                            <p className="products-component__dropdown-menu-item-title">{item.title}</p>
                        </div>
                    </a>
                </li>
            ))}
        </ul>
    )

    const renderDropdown = () => (
        <div className={`products-component__dropdown products-component__dropdown--${dropdownAlignment}`}>
            {renderMenu()}
            {renderSearchBox()}
            {renderResults()}
        </div>
    )

    // Listen to window resize
    useEffect(() => {
        function updatedropdownAlignment() {
            if (!!componentRef.current) {
                const offsetRight = window.innerWidth - componentRef.current.offsetLeft - componentRef.current.offsetWidth;
                if (offsetRight < 200) {
                    if (componentRef.current.offsetLeft < 150) {
                        setDropdownAlignment('center');
                    } else {
                        setDropdownAlignment('right');
                    }
                } else {
                    setDropdownAlignment('left');
                }
            }

        }
        window.addEventListener('resize', updatedropdownAlignment);
        updatedropdownAlignment();
        return () => window.removeEventListener('resize', updatedropdownAlignment);
    }, []);


    // Handle click outside the component
    useEffect(() => {
        function handleClickOutside(event) {
            if (componentRef.current && !componentRef.current.contains(event.target)) {
                closeDropdown()
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [componentRef]);

    return !!algoliaAppID && !!algoliaSearchKey && !!algoliaIndexName ? (
        <>
            <InstantSearch searchClient={searchClient} indexName={algoliaIndexName}>
                <div className="products-component" id="products-component" ref={componentRef}>
                    <button
                        aria-haspopup="true"
                        aria-expanded={expanded}
                        onClick={handleButtonClick}
                        tabIndex="0"
                        className={`products-component__button ${expanded ? 'dropdown-opened' : 'dropdown-closed'}`}
                    >
                        <ProductsIcon />
                        <span>Products</span>
                    </button>
                    {!!expanded ? renderDropdown() : null}

                </div>
            </InstantSearch>
            <InstantSearch searchClient={searchClient} indexName={algoliaIndexName}>
                <ProductsDisplay
                    isOpened={!!selectedCategory}
                    onClose={() => {
                        setSelectedCategory(null);
                    }}
                    selectedCategory={selectedCategory}
                    menuItems={menuItems}
                />
            </InstantSearch>
        </>

    ) : null;
}

export default Products;