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
        label: 'Power Wheelchairs',
        value: 'Power Wheelchairs',
        image: 'https://f.hubspotusercontent00.net/hubfs/1624307/social-suggested-images/power.png',
        url: 'https://permobilus.com/products/power-wheelchairs-by-permobil',
        categoryName: 'Power Wheelchairs',
        order: 1
    },
    {
        subtitle: 'EXPLORE',
        title: 'Manual Wheelchairs',
        label: 'Manual Wheelchairs',
        value: 'Manual Wheelchairs',
        image: 'https://f.hubspotusercontent00.net/hubfs/1624307/social-suggested-images/manual.png',
        url: 'https://permobilus.com/products/tilite-manual-wheelchairs-smartdrive-power-assist/',
        categoryName: 'Manual Wheelchairs',
        order: 2
    },
    {
        subtitle: 'EXPLORE',
        title: 'Seating / Positioning',
        label: 'Seating and Positioning',
        value: 'Seating and Positioning',
        image: 'https://f.hubspotusercontent00.net/hubfs/1624307/social-suggested-images/seat.png',
        url: 'https://permobilus.com/products/seating-and-positioning-by-roho/',
        categoryName: 'Seating and Positioning',
        order: 3
    },
    {
        subtitle: 'EXPLORE',
        title: 'Accessories',
        label: 'Accessories',
        value: 'Accessories',
        image: 'https://f.hubspotusercontent00.net/hubfs/1624307/social-suggested-images/accessories.png',
        url: 'https://permobilus.com/products/power-wheelchairs-by-permobil/accessories/',
        categoryName: 'Accessories',
        order: 4
    },
    {
        subtitle: 'EXPLORE',
        title: 'Power Assist',
        label: 'Power Assist',
        value: 'Power Assist',
        image: 'https://f.hubspotusercontent00.net/hubfs/1624307/PowerAssistImage.png',
        url: 'https://permobilus.com/products/tilite-manual-wheelchairs-smartdrive-power-assist/smart-drive/',
        categoryName: 'SmartDrive',
        order: 5
    }
]

const Products = ({ algoliaAppID, algoliaSearchKey, algoliaIndexName, hsPortalId }) => {
    const [expanded, setExpanded] = useState(false);
    const [dropdownAlignment, setDropdownAlignment] = useState('left');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const componentRef = useRef(null);

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
        closeDropdown();
        if (typeof window !== 'undefined') {
            if (!!hit.url) {
                window.location.href = hit.url;
            }
        }
    }

    const handleMenuItemClick = (e, item) => {
        e.preventDefault();
        closeDropdown();
        setSelectedCategory(item.categoryName);
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

    const renderHit = ({ hit }) => <p tabIndex="0" onKeyPress={e => { onHitKeyUp(e, hit) }} onClick={(e) => { handleHitClick(e, hit) }}>{hit.title}</p>;

    const renderResults = connectStateResults(({ searchState, searchResults }) =>
        searchState && searchState.query ? (

            searchResults && searchResults.nbHits !== 0 ? <Hits hitComponent={renderHit} /> : <p className="products-component__search-no-results">Nothing found in Products</p>
        ) : renderMenu()
    );

    const renderSearchBox = () => (
        <SearchBox translations={{
            submitTitle: 'Submit your search query.',
            resetTitle: 'Clear your search query.',
            placeholder: 'Search a product...',
        }} onReset={() => {
            // console.log('reset');
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
            {renderSearchBox()}
            {renderResults()}
        </div>
    )

    // Listen to window resize
    useEffect(() => {
        if (typeof window !== 'undefined') {
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
        }
    }, []);


    // Handle click outside the component
    useEffect(() => {
        if (typeof window !== 'undefined') {
            function handleClickOutside(event) {
                if (componentRef.current && !componentRef.current.contains(event.target)) {
                    closeDropdown()
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [componentRef]);

    return !!algoliaAppID && !!algoliaSearchKey && !!algoliaIndexName ? (
        <React.Fragment>
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
                    setSelectedCategory={setSelectedCategory}
                    menuItems={menuItems}
                    hsPortalId={hsPortalId}
                />
            </InstantSearch>
        </React.Fragment>

    ) : null;
}

export default Products;
