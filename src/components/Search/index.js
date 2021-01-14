import React, { useEffect, useRef, useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { connectCurrentRefinements, Configure, Index, InstantSearch, SearchBox, connectStateResults, Hits } from 'react-instantsearch-dom';
import './style.scss';
import CloseIcon from '../Icons/CloseIcon'
import DocumentIcon from '../Icons/DocumentIcon'
import ProductIcon from '../Icons/ProductIcon'
import ChevronLeftIcon from '../Icons/ChevronLeftIcon'

const indexTitles = {
    'products-at': 'Product pages',
    'academy_resources_production': 'Academy Resources'
}


const Search = ({ domElement }) => {
    const componentRef = useRef(null);
    const algoliaAppID = domElement.getAttribute('data-algolia-app-id');
    const algoliaSearchKey = domElement.getAttribute('data-algolia-search-key');
    const algoliaIndices = domElement.getAttribute('data-algolia-indices').split(',');
    const [isResultsVisible, setIsResultsVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(false);
    const searchClient = algoliasearch(algoliaAppID, algoliaSearchKey);

    const handleHitClick = (url) => {
        if (!!url) {
            window.location.href = url;
        }
    }

    const handleSeeAllClick = (e, idx) => {
        e.preventDefault();
        setSelectedIndex(idx);
    }

    const handleBackToResultsClick = (e) => {
        e.preventDefault();
        setSelectedIndex(false);
    }

    const renderProductsHit = ({ hit }) => {
        return (
            <span className="search-component__results-hit" onClick={() => { handleHitClick(hit.url) }}>
                <span className="search-component__results-hit-icon"><ProductIcon /></span>
                <span className="search-component__results-hit-details">
                    <span className="search-component__results-hit-title">{hit.title}</span>
                    <span className="search-component__results-hit-url">{hit.url}</span>
                </span>
            </span>
        )
    }

    const renderAcademyHit = ({ hit }) => {
        return (
            <span className="search-component__results-hit" onClick={() => { handleHitClick(hit.cta_url) }}>
                <span className="search-component__results-hit-icon"><DocumentIcon /></span>
                <span className="search-component__results-hit-details">
                    <span className="search-component__results-hit-title">{hit.title}</span>
                    <span className="search-component__results-hit-url">{hit.cta_url}</span>
                </span>
            </span>
        )
    }

    const IndexResults = connectStateResults(
        ({ searchState, searchResults, children, idx }) =>
          searchResults && searchResults.nbHits !== 0 ? (
            <div>
                {children}
                {searchResults.nbHits > 4 && !selectedIndex && (
                    <div className="search-component__results-see-all">
                        <button onClick={(e)=>{handleSeeAllClick(e, idx)}}>See all</button>
                    </div>
                )}
            </div>
          ) : (
            <div className="search-component__results-empty">
              No results have been found for "{searchState.query}" in {indexTitles[idx]}
            </div>
          )
      );

    const renderIndexResults = (idx) => {
        const renderFuntions = {
            'products-at': renderProductsHit,
            'academy_resources_production': renderAcademyHit
        }
        return (
            <div className="search-component__results-index" >
                {!!indexTitles[idx] && (
                    <p className="search-component__results-index-title">{indexTitles[idx]}</p>
                )}
                <div className="search-component__results-index-hits">
                    <Index indexName={idx}>
                        <IndexResults idx={idx}>
                            <Configure hitsPerPage={!!selectedIndex ? 1000 : 4} />
                            <Hits hitComponent={renderFuntions[idx]} />
                        </IndexResults>
                    </Index>
                </div>
            </div>
        )
    }

    const CloseSearchButton = connectCurrentRefinements(({ items, refine }) => (
        <button 
            onClick={() => {
                setSelectedIndex(false);
                refine(items);
            }} 
            disabled={!items.length} 
        >
            <CloseIcon />
        </button>
    ));

    const renderResults = connectStateResults(({ searchState }) =>
        searchState && searchState.query ? (
            <div className="search-component__results">
                <div className="search-component__results-header">
                    {!!selectedIndex ? 
                        <button 
                            className="search-component__results-back" 
                            onClick={handleBackToResultsClick}
                        >
                                <ChevronLeftIcon />
                                <span>Back to all results for "{searchState.query}"</span>
                        </button> 
                    : 
                        <p>Searching for "{searchState.query}"</p>
                    }
                    <CloseSearchButton clearsQuery />
                </div>
                <div className="search-component__results-container">
                    {!!algoliaIndices && algoliaIndices.filter(index=>{
                        if(!!selectedIndex){
                            return index === selectedIndex;
                        }
                        return true;
                    }).map(idx => (
                        <>{renderIndexResults(idx)}</>
                    ))}
                </div>
            </div>

        ) : null
    );

    const renderSearchBox = () => (
        <div className="search-component__searchbox">
            <SearchBox
                translations={{
                    submitTitle: 'Submit your search query.',
                    resetTitle: 'Clear your search query.',
                    placeholder: 'Search Permobil...',
                }}
                onFocus={() => {
                    setIsResultsVisible(true);
                }}
                onReset={()=>{
                    setSelectedIndex(false);
                }}
            />
        </div>
    )

    // Handle click outside the component
    useEffect(() => {
        function handleClickOutside(event) {
            if (componentRef.current && !componentRef.current.contains(event.target)) {
                setIsResultsVisible(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return !!algoliaAppID && !!algoliaSearchKey && !!algoliaIndices && algoliaIndices.length > 0 ? (
        <InstantSearch searchClient={searchClient} indexName={algoliaIndices[0]}>
            <div className="search-component" id="search-component" ref={componentRef}>
                {renderSearchBox()}
                {!!isResultsVisible ? renderResults() : null}
            </div>
        </InstantSearch>
    ) : null;
}

export default Search;
