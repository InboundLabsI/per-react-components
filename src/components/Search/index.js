import React, { useEffect, useRef, useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { connectCurrentRefinements, Configure, Index, InstantSearch, SearchBox, connectStateResults, Hits } from 'react-instantsearch-dom';
import './style.scss';
import CloseIcon from '../Icons/CloseIcon'
import DocumentIcon from '../Icons/DocumentIcon'
import WebinarIcon from '../Icons/WebinarIcon'
import GuideIcon from '../Icons/GuideIcon'
import VideoIcon from '../Icons/VideoIcon'
import PdfIcon from '../Icons/PdfIcon'
import QuickStartGuideIcon from '../Icons/QuickStartGuideIcon'
import FundingGuideIcon from '../Icons/FundingGuideIcon'
import ProductIcon from '../Icons/ProductIcon'
import ChevronLeftIcon from '../Icons/ChevronLeftIcon'
import BlogIcon from '../Icons/BlogIcon'
import WebsiteIcon from '../Icons/WebsiteIcon'
import LANGUAGE_BY_LOCALE from './languages'

const indexTitles = {
    'products-at': 'Product pages',
    'academy_resources_production': 'Academy Resources'
}

const resourceIcons = {
    Webinar: WebinarIcon,
    Guide: GuideIcon,
    Video: VideoIcon,
    PDF: PdfIcon,
    QuickStartGuide: QuickStartGuideIcon,
    FundingGuide: FundingGuideIcon,
}

const hsDomainsToSearch = `domain=hub.permobil.com&domain=permobil.com&domain=academy.permobil.com`


const excludeLanguages = Object.keys(LANGUAGE_BY_LOCALE).filter(l=>l!=='en_US').map(l=>`pathPrefix=${l.toLowerCase().replace("_", "-")}`).join('&')

const Search = ({ algoliaAppID, algoliaSearchKey, algoliaIndices, headerHeight, hsPortalId }) => {
    const componentRef = useRef(null);
    const [isResultsVisible, setIsResultsVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(false);
    const [blogResults, setBlogResults] = useState([])
    const [blogTotal, setBlogTotal] = useState(0)
    const [sitePages, setSitePages] = useState([])
    const [siteTotal, setSiteTotal] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")
    
    const algoliaClient = algoliasearch(algoliaAppID, algoliaSearchKey);
    const searchClient = {
        ...algoliaClient,
        search(requests) {
            const nRequest = requests.map(request => {
                if (request.indexName == 'academy_resources_production') {
                    request.params.filters = 'published:1 AND market.name:USA';
                }
                return request;
            });

            if (requests.every(({ params }) => !params.query)) {
                return Promise.resolve({
                    results: requests.map(() => ({
                        hits: [],
                        nbHits: 0,
                        nbPages: 0,
                        page: 0,
                        processingTimeMS: 0,
                    })),
                });
            }
            return algoliaClient.search(requests);
        },
    };

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

    const searchBlogPosts = async (term, limit = 4) => {
        const res = await fetch(`https://api.hubapi.com/contentsearch/v2/search?portalId=${hsPortalId}&term=${term}&type=BLOG_POST&length=SHORT&limit=${limit}&${hsDomainsToSearch}&${excludeLanguages}&matchPrefix=false`);
        const data = await res.json();
        if(!!data && !!data.results){
            setBlogResults(data.results);
            setBlogTotal(data.total)
        } else {
            setBlogResults([]);
            setBlogTotal(0)
        }
    }

    const searchSitePages = async (term, limit = 4) => {
        const res = await fetch(`https://api.hubapi.com/contentsearch/v2/search?portalId=${hsPortalId}&term=${term}&type=SITE_PAGE&type=LANDING_PAGE&length=SHORT&limit=${limit}&${hsDomainsToSearch}&${excludeLanguages}&matchPrefix=false`);
        const data = await res.json();

        if(!!data && !!data.results){
            setSitePages(data.results);
            setSiteTotal(data.total)
        } else {
            setSitePages([]);
            setSiteTotal(0)
        }
    }

    const renderProductsHit = ({ hit }) => {
        try {
            return (
                <span className="search-component__results-hit" onClick={() => { handleHitClick(hit.url) }}>
                    <span className="search-component__results-hit-icon"><ProductIcon /></span>
                    <span className="search-component__results-hit-details">
                        <span className="search-component__results-hit-title">{hit.title}</span>
                        <span className="search-component__results-hit-url">{hit.url}</span>
                    </span>
                </span>
            );
        } catch(err) {
            console.log('renderProductsHit error -> ', err);
            return null;
        }
    }

    const renderAcademyHit = ({ hit }) => {
        try {
            const { name: type } = hit.type || {name: null};
            const { name: format } = hit.format || {name: null};
    
            let iconType = 'PDF';
            if (hit.title.toLowerCase().includes('Quick Start Guide'.toLowerCase())) {
                iconType = 'QuickStartGuide';
            } else if (format == 'MP4') {
                iconType = 'Video';
            } else if (type == 'Webinars') {
                iconType = 'Webinar';
            } else if (type == 'Guides') {
                iconType = 'Guide';
            } else if (type == 'Funding References') {
                iconType = 'FundingGuide';
            } else if (format == 'PDF') {
                iconType = 'PDF';
            }
            return (
                <span className="search-component__results-hit" onClick={() => { handleHitClick(hit.cta_url) }}>
                    <span className="search-component__results-hit-icon">
                        { React.createElement(resourceIcons[iconType]) }
                    </span>
                    <span className="search-component__results-hit-details">
                        <span className="search-component__results-hit-title">{hit.title}</span>
                        <span className="search-component__results-hit-tags">
                            {(hit.audience || []).map(tag => (
                                <span>{ tag.name }</span>
                            ))}
                        </span>
                    </span>
                </span>
            )
        } catch(err) {
            console.log('renderAcademyHit error -> ', err);
            return null;
        }
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
        if (idx == 'blog') {
            return (
                renderBlogResults()
            );
        }
        if (idx == 'site') {
            return (
                renderSiteResults()
            );
        }

        return (
            <div className="search-component__results-index" >
                {!!indexTitles[idx] && (
                    <p className="search-component__results-index-title">{indexTitles[idx]}</p>
                )}
                <div className="search-component__results-index-hits">
                    <Index indexName={idx}>
                        <IndexResults idx={idx}>
                            <Configure hitsPerPage={!!selectedIndex ? 1000 : 4} filters={idx === 'academy_resources_production' ? 'published:1' /* 'published:1 AND market.name:USA' */ : undefined} />
                            <Hits hitComponent={renderFuntions[idx]} />
                        </IndexResults>
                    </Index>
                </div>
            </div>
        );
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

    const renderBlogResults = connectStateResults(
        ({ searchState}) => {

        const hits = !!selectedIndex && selectedIndex === 'blog' ? blogResults : blogResults.slice(0,4);

        return !!blogResults && (!selectedIndex || selectedIndex === 'blog') ? (
            <div className="search-component__results-index" >
                
                <p className="search-component__results-index-title">Blog</p>
                
                <div className="search-component__results-index-hits">

                    {blogResults && blogResults.length > 0 ? (
                        <div>
                            <ul>
                                {hits.map(hit=>(
                                    <li key={`${hit.url}${!!hit.rowId ? '-'+hit.rowId : ''}`}>
                                        <span className="search-component__results-hit" onClick={() => { handleHitClick(hit.url) }}>
                                            <span className="search-component__results-hit-icon"><BlogIcon /></span>
                                            <span className="search-component__results-hit-details">
                                                <span className="search-component__results-hit-title">{hit.title.replace(/(<([^>]+)>)/gi, "")}</span>
                                                <span className="search-component__results-hit-url">{hit.url}</span>
                                            </span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div>
                                {blogTotal > 4 && !selectedIndex && (
                                    <div className="search-component__results-see-all">
                                        <button onClick={(e)=>{
                                            handleSeeAllClick(e, 'blog')
                                        }}>See all</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="search-component__results-empty">
                            No results have been found for "{searchState.query}" in Blog
                        </div>
                    )}
                </div>
            </div>
        ) : null
    })

    const renderSiteResults = connectStateResults(
        ({ searchState}) => {

        const hits = !!selectedIndex && selectedIndex === 'site' ? sitePages : sitePages.slice(0,4);

        return !!sitePages && (!selectedIndex || selectedIndex === 'site') ? (
            <div className="search-component__results-index" >
                
                <p className="search-component__results-index-title">Website pages</p>
                
                <div className="search-component__results-index-hits">

                
                    {sitePages && sitePages.length > 0 ? (
                        <div>
                            <ul>
                                {hits.map(hit=>(
                                    <li key={`${hit.url}${!!hit.rowId ? '-'+hit.rowId : ''}`}>
                                    <span className="search-component__results-hit" onClick={() => { handleHitClick(hit.url) }}>
                                        <span className="search-component__results-hit-icon"><WebsiteIcon /></span>
                                        <span className="search-component__results-hit-details">
                                            <span className="search-component__results-hit-title">{hit.title.replace(/(<([^>]+)>)/gi, "")}</span>
                                            <span className="search-component__results-hit-url">{hit.url}</span>
                                        </span>
                                    </span>
                                    </li>
                                ))}
                            </ul>
                            <div>
                                {siteTotal > 4 && !selectedIndex && (
                                    <div className="search-component__results-see-all">
                                        <button onClick={(e)=>{
                                            handleSeeAllClick(e, 'site')
                                        }}>See all</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="search-component__results-empty">
                            No results have been found for "{searchState.query}" in Website Pages
                        </div>
                    )}
                </div>
            </div>
        ) : null
    })


    const renderResults = connectStateResults(({ searchState }) => {
        let hostName = '';
        try {
            hostName = location.hostname;
        } catch(err) {}
        let pathname = '';
        try {
            pathname = location.pathname;
        } catch(err) {}

        let indices = [
            ...algoliaIndices,
            'blog',
            'site',
        ];

        const academyPattern = new RegExp('^academy\.permo.*');
        const websitePattern = new RegExp('^hub\.permo.*');
        const blogPattern = new RegExp('^/blog(/.*){0,1}');

        let currentWebsiteType = '';
        if (academyPattern.test(hostName)) {
            currentWebsiteType = 'academy_resources_production';
        } else if (websitePattern.test(hostName)) {
            currentWebsiteType = blogPattern.test(pathname) ? 'blog' : 'site'
        } else {
            currentWebsiteType = 'products-at';
        }

        indices = indices.reduce((acc, element) => {
            if (element == currentWebsiteType) {
                return [element, ...acc];
            }
            return [...acc, element];
        }, []);

        return (
            searchState && searchState.query ? (
                <div className="search-component__results-wrapper">
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
                            {!!algoliaIndices && indices.filter(index=>{
                                if(!!selectedIndex){
                                    return index === selectedIndex;
                                }
                                return true;
                            }).map(idx => (
                                <React.Fragment key={idx}>{renderIndexResults(idx)}</React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

            ) : null
        );
    });

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
                onChange={(e)=>{
                    setIsResultsVisible(true)
                    if(!!hsPortalId){
                        if(!!e.target.value){
                            searchBlogPosts(e.target.value);
                            searchSitePages(e.target.value);
                        } else {
                            setBlogResults([]);
                            setSitePages([])
                        }
                    }
                    setSearchTerm(e.target.value)
                }}
                onReset={()=>{
                    setSelectedIndex(false);
                    setIsResultsVisible(false)
                    setBlogResults([]);
                    setSitePages([])
                }}
            />
        </div>
    )

    function handleClickOutside(event) {
        if (componentRef.current && !componentRef.current.contains(event.target)) {
            setIsResultsVisible(false);
        }
    }

    useEffect(()=>{
        if(selectedIndex === 'blog'){
            searchBlogPosts(searchTerm, 100)
        }
        if(selectedIndex === 'site'){
            searchSitePages(searchTerm, 100)
        }
    }, [selectedIndex])

    // Handle click outside the component
    useEffect(() => {
        if(typeof window !== 'undefined'){       
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, []);

    return !!algoliaAppID && !!algoliaSearchKey && !!algoliaIndices && algoliaIndices.length > 0 ? (
        <InstantSearch searchClient={searchClient} indexName={algoliaIndices[0]}>
            <div className="search-component" id="search-component" ref={componentRef} style={{'--header-height': !!headerHeight ? headerHeight+'px' : '60px'}}>
                {renderSearchBox()}
                {!!isResultsVisible ? renderResults() : null}
            </div>
        </InstantSearch>
    ) : <React.Fragment></React.Fragment>;
}

export default Search;
