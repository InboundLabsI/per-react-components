import React, { useRef, useEffect } from 'react'
import {
    connectCurrentRefinements,
    Stats,
    connectMenu,
    InfiniteHits,
    MenuSelect
} from 'react-instantsearch-dom';
import './style.scss';

const ProductsDisplay = (props) => {
    const { isOpened, onClose, selectedCategory, menuItems } = props;
    const componentRef = useRef(null);

    const closeFilters = () => {
        onClose();
    }

    const renderHit = ({ hit }) => {
        const hitImage = !!hit.media && !!hit.media.thumbnails && !!hit.media.thumbnails.large ? hit.media.thumbnails.large : '';

        return (<a href={hit.url} className="products-display-component__results-hit">
            <div className="products-display-component__results-hit-image" style={{ backgroundImage: `url(${hitImage})` }}></div>
            <div className="products-display-component__results-hit-text">
                <span>{hit.title}</span>
            </div>
        </a>)
    }

    const ProductsTitle = connectCurrentRefinements(({ items }) => {
        const categoryItem = items.find(item => item.attribute === 'categories');
        return !!categoryItem ? (<span>{categoryItem.currentRefinement}</span>) : null;
    })

    const CurrentRefinements = connectCurrentRefinements(({ items, refine }) => items.length > 0 ? <div className="products-display-component__results-refinements">
        {items.map(item => (
            <button key={item.label} onClick={(e) => {
                e.preventDefault();
                refine(item.value)
            }}>
                <span>{item.currentRefinement}</span>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.14648 3.875L7.35938 1.68359L7.81055 1.23242C7.875 1.16797 7.875 1.06055 7.81055 0.974609L7.33789 0.501953C7.25195 0.4375 7.14453 0.4375 7.08008 0.501953L4.4375 3.16602L1.77344 0.501953C1.70898 0.4375 1.60156 0.4375 1.51562 0.501953L1.04297 0.974609C0.978516 1.06055 0.978516 1.16797 1.04297 1.23242L3.70703 3.875L1.04297 6.53906C0.978516 6.60352 0.978516 6.71094 1.04297 6.79688L1.51562 7.26953C1.60156 7.33398 1.70898 7.33398 1.77344 7.26953L4.4375 4.60547L6.62891 6.81836L7.08008 7.26953C7.14453 7.33398 7.25195 7.33398 7.33789 7.26953L7.81055 6.79688C7.875 6.71094 7.875 6.60352 7.81055 6.53906L5.14648 3.875Z" fill="#A7A9AC" />
                </svg>
            </button>
        ))}
    </div> : null)

    const renderResults = () => (
        <div className="products-display-component__results">
            <div className="products-display-component__results-header">
                <CurrentRefinements transformItems={items =>
                    items.filter(item => item.attribute !== 'categories')
                } />
                <div className="products-display-component__results-title">
                    <Stats
                        translations={{
                            stats(nbHits) {
                                return nbHits;
                            },
                        }}
                    />
                    <ProductsTitle transformItems={items =>
                        items.filter(item => item.attribute === 'categories')
                    } />
                </div>
            </div>
            <div className="products-display-component__results-body">
                <InfiniteHits hitComponent={renderHit} />
            </div>
        </div>
    )

    const CategoriesMenu = connectMenu(({ items, currentRefinement, refine }) => {
        return (
            <ul className="products-display-component__filters-categories">
                {items.filter(item => menuItems.map(i => i.categoryName).includes(item.label)).map(item => {
                    const menuItem = menuItems.find(i => i.categoryName === item.label);
                    if (!!menuItem) {
                        item.order = menuItem.order
                    }
                    return item;
                }).sort((a, b) => a.order - b.order).map(item => {
                    const menuItem = menuItems.find(i => i.categoryName === item.label);
                    return (<li key={item.label}>
                        <a
                            href="#"
                            onClick={event => {
                                event.preventDefault();
                                console.log('currentRefinement', currentRefinement);
                                //refine(currentRefinement[0]);
                                if (!item.isRefined) {
                                    refine(item.value);
                                }
                            }}
                            className={item.isRefined ? 'active' : 'not-active'}
                        >
                            {!!menuItem.image && (<div style={{ backgroundImage: `url(${menuItem.image})` }}></div>)}
                            <span>{item.label}</span>
                        </a>
                    </li>)
                })}
            </ul>
        )
    })

    const renderFilters = () => (
        <div className="products-display-component__filters">
            <div className="products-display-component__filters-header">
                <span className="products-display-component__filters-title">FILTERS</span>
                <svg onClick={closeFilters} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0469 8L14.875 3.21875L15.8594 2.23438C16 2.09375 16 1.85938 15.8594 1.67188L14.8281 0.640625C14.6406 0.5 14.4062 0.5 14.2656 0.640625L8.5 6.45312L2.6875 0.640625C2.54688 0.5 2.3125 0.5 2.125 0.640625L1.09375 1.67188C0.953125 1.85938 0.953125 2.09375 1.09375 2.23438L6.90625 8L1.09375 13.8125C0.953125 13.9531 0.953125 14.1875 1.09375 14.375L2.125 15.4062C2.3125 15.5469 2.54688 15.5469 2.6875 15.4062L8.5 9.59375L13.2812 14.4219L14.2656 15.4062C14.4062 15.5469 14.6406 15.5469 14.8281 15.4062L15.8594 14.375C16 14.1875 16 13.9531 15.8594 13.8125L10.0469 8Z" fill="currentColor" />
                </svg>
            </div>
            <div className="products-display-component__filters-body">
                <CategoriesMenu attribute="categories" defaultRefinement={selectedCategory} limit={100} />
                <div className="products-display-component__filters-select">
                    <label><span>Diagnostic</span><br /><MenuSelect attribute="filters.diagnostic" /></label>
                </div>
                <div className="products-display-component__filters-select">
                    <label><span>Movement Style</span><br /><MenuSelect attribute="filters.movement" /></label>
                </div>
                <div className="products-display-component__filters-select">
                    <label><span>Your Weight</span><br /><MenuSelect attribute="filters.weight" /></label>
                </div>
            </div>
        </div>
    )

    // Handle click outside the component
    useEffect(() => {
        function handleClickOutside(event) {
            if (componentRef.current && !componentRef.current.contains(event.target)) {
                closeFilters();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [componentRef]);

    useEffect(() => {
        if (isOpened) {
            document.querySelector('body').classList.add('products-display-opened');
        } else {
            document.querySelector('body').classList.remove('products-display-opened');
        }
    }, [isOpened])

    return isOpened ? (
        <div className="products-display-component" ref={componentRef}>
            {renderFilters()}
            {renderResults()}
        </div>
    ) : null;
}

export default ProductsDisplay
