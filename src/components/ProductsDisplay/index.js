import React, { useRef, useEffect } from 'react'
import { CurrentRefinements, InfiniteHits, RefinementList } from 'react-instantsearch-dom';
import './style.scss';

const ProductsDisplay = (props) => {
    const { isOpened, onClose, selectedCategory } = props;
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


    const renderResults = () => (
        <div className="products-display-component__results">
            <div className="products-display-component__results-header">
                <CurrentRefinements />
            </div>
            <div className="products-display-component__results-body">
                <InfiniteHits hitComponent={renderHit} />
            </div>
        </div>
    )

    const renderFilters = () => (
        <div className="products-display-component__filters">
            <div className="products-display-component__filters-header">
                <span className="products-display-component__filters-title">FILTERS</span>
                <svg onClick={closeFilters} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0469 8L14.875 3.21875L15.8594 2.23438C16 2.09375 16 1.85938 15.8594 1.67188L14.8281 0.640625C14.6406 0.5 14.4062 0.5 14.2656 0.640625L8.5 6.45312L2.6875 0.640625C2.54688 0.5 2.3125 0.5 2.125 0.640625L1.09375 1.67188C0.953125 1.85938 0.953125 2.09375 1.09375 2.23438L6.90625 8L1.09375 13.8125C0.953125 13.9531 0.953125 14.1875 1.09375 14.375L2.125 15.4062C2.3125 15.5469 2.54688 15.5469 2.6875 15.4062L8.5 9.59375L13.2812 14.4219L14.2656 15.4062C14.4062 15.5469 14.6406 15.5469 14.8281 15.4062L15.8594 14.375C16 14.1875 16 13.9531 15.8594 13.8125L10.0469 8Z" fill="currentColor" />
                </svg>
            </div>
            <div className="products-display-component__filters-body">
                <RefinementList attribute="categories" defaultRefinement={[selectedCategory]} />
                <RefinementList attribute="filters.diagnostic" />
                <RefinementList attribute="filters.movement" />
                <RefinementList attribute="filters.weight" />
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

    return isOpened ? (
        <div className="products-display-component" ref={componentRef}>
            {renderFilters()}
            {renderResults()}
        </div>
    ) : null;
}

export default ProductsDisplay
