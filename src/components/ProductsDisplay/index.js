import React, { useRef, useEffect, useState } from 'react'
import Select, { components } from 'react-select';
import {
    connectRefinementList,
    connectCurrentRefinements,
    Stats,
    connectMenu,
    InfiniteHits
} from 'react-instantsearch-dom';
import './style.scss';
import { customSelectStyles, customCategorySelectStyles } from './selectStyles'

const subcategoriesList = [
    "Power Wheelchairs",
    "Seating and Positioning",
    "Electronics",
    "Mounts",
    "Drive Controls",
    "Storage",
    "Laterals",
    "Headrests",
    "Handles",
    "Hydrographics"
]

const ProductsDisplay = (props) => {
    const { isOpened, onClose, selectedCategory, menuItems, setSelectedCategory } = props;
    const componentRef = useRef(null);
    //const [productFilters, setProductFilters] = useState(['filters.seatingMinWidth <= 100'])
    //const [isFeaturesOpened, setIsFeaturesOpened] = useState(false)
    const [subcategories, setSubcategories] = useState([]);

    const closeFilters = () => {
        onClose();
        setSubcategories([])
    }

    /*const CustomSelect = connectMenu(({ items, currentRefinement, refine }) => {
        return (
            <Select
                placeholder="Select an option"
                className="products-display-component__custom-select-container"
                classNamePrefix="products-display-component__custom-select"
                value={items.filter(item => item.isRefined).length > 0 ? items.filter(item => item.isRefined) : ""}
                onChange={(value, action) => {
                    refine(value.value)
                }}
                options={!!currentRefinement ? [{ value: null, label: "See all", isRefined: false }, ...items] : items}
                theme={theme => ({
                    ...theme,
                    borderRadius: 4,
                    colors: {
                        ...theme.colors,
                        primary25: '#F5F8FA',
                        primary: '#0067A6',
                    },
                })}
                styles={customSelectStyles}
            />
        )
    })*/

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

    const CurrentRefinements = connectCurrentRefinements(({ items, refine }) => {
        return (items.length > 0 || subcategories.length > 0) ? <div className="products-display-component__results-refinements">
            {items.filter(item => item.attribute !== 'tags.ID').map(item => (
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
            {items.filter(item => item.attribute === 'tags.ID').map(itemGroup => (
                <React.Fragment key={itemGroup.label}>
                    {itemGroup.items.map(item => (
                        <button key={item.label.split('::')[0]} onClick={(e) => {
                            e.preventDefault();
                            refine(item.value)
                        }}>
                            <span>{item.label.split('::')[0]}</span>
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.14648 3.875L7.35938 1.68359L7.81055 1.23242C7.875 1.16797 7.875 1.06055 7.81055 0.974609L7.33789 0.501953C7.25195 0.4375 7.14453 0.4375 7.08008 0.501953L4.4375 3.16602L1.77344 0.501953C1.70898 0.4375 1.60156 0.4375 1.51562 0.501953L1.04297 0.974609C0.978516 1.06055 0.978516 1.16797 1.04297 1.23242L3.70703 3.875L1.04297 6.53906C0.978516 6.60352 0.978516 6.71094 1.04297 6.79688L1.51562 7.26953C1.60156 7.33398 1.70898 7.33398 1.77344 7.26953L4.4375 4.60547L6.62891 6.81836L7.08008 7.26953C7.14453 7.33398 7.25195 7.33398 7.33789 7.26953L7.81055 6.79688C7.875 6.71094 7.875 6.60352 7.81055 6.53906L5.14648 3.875Z" fill="#A7A9AC" />
                            </svg>
                        </button>
                    ))}
                </React.Fragment>
            ))}
            {selectedCategory === 'Accessories' && subcategories.map(item => (
                <button key={item} onClick={(e) => {
                    e.preventDefault();
                    setSubcategories([...subcategories.filter(s => s !== item)])
                }}>
                    <span>{item}</span>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.14648 3.875L7.35938 1.68359L7.81055 1.23242C7.875 1.16797 7.875 1.06055 7.81055 0.974609L7.33789 0.501953C7.25195 0.4375 7.14453 0.4375 7.08008 0.501953L4.4375 3.16602L1.77344 0.501953C1.70898 0.4375 1.60156 0.4375 1.51562 0.501953L1.04297 0.974609C0.978516 1.06055 0.978516 1.16797 1.04297 1.23242L3.70703 3.875L1.04297 6.53906C0.978516 6.60352 0.978516 6.71094 1.04297 6.79688L1.51562 7.26953C1.60156 7.33398 1.70898 7.33398 1.77344 7.26953L4.4375 4.60547L6.62891 6.81836L7.08008 7.26953C7.14453 7.33398 7.25195 7.33398 7.33789 7.26953L7.81055 6.79688C7.875 6.71094 7.875 6.60352 7.81055 6.53906L5.14648 3.875Z" fill="#A7A9AC" />
                    </svg>
                </button>
            ))}
        </div> : null
    })


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
                    {selectedCategory}
                    {/*<ProductsTitle transformItems={items =>
                        items.filter(item => item.attribute === 'categories')
                    } />*/}
                </div>
            </div>
            <div className="products-display-component__results-body">
                <InfiniteHits hitComponent={renderHit} />
            </div>
        </div>
    )

    const FeaturesList = connectRefinementList(({ items, currentRefinement, refine }) => {
        const tags = [];
        items.forEach(item => {
            const tag = item.label.split('::')[1];
            if (!!tags.includes(tag)) {
                return;
            } else {
                tags.push(tag);
            }
        })

        const sortTags = (a, b) => (a.label.split('::')[0] > b.label.split('::')[0]) ? 1 : ((b.label.split('::')[0] > a.label.split('::')[0]) ? -1 : 0)

        return !!tags && tags.length > 0 ? (
            <div className={`products-display-component__filters-features opened`}>
                <div className="products-display-component__filters-features-container">
                    {/*<div className="products-display-component__filters-features-title">
                        <span>Features</span>
                    </div>*/}
                    <div className="products-display-component__filters-features-wrapper">
                        {tags.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0)).map(tag => (
                            <div key={tag}>
                                <span className="products-display-component__filters-checkbox-list-title">{tag}</span>
                                <ul className="products-display-component__filters-checkbox-list">
                                    {items.filter(
                                        item => item.label.split("::")[1] === tag
                                    ).sort(sortTags).map(item => (
                                        <li key={tag + '-' + item.label}>
                                            <label className="ais-RefinementList-label">
                                                <input
                                                    className="ais-RefinementList-checkbox"
                                                    type="checkbox"
                                                    checked={currentRefinement.includes(item.label)}
                                                    value={item.value}
                                                    onChange={event => {
                                                        refine(item.value);
                                                    }}
                                                />
                                                <span className="ais-RefinementList-labelText">{item.label.split('::')[0]} ({item.count})</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ) : null

    })

    const SingleValue = ({ children, ...props }) => {
        const currentCategory = props.getValue()[0];
        return (<components.SingleValue {...props}>
            <div className="products-display-component__category-select-value">
                <div className="products-display-component__category-select-value-image" style={{ backgroundImage: `url(${currentCategory.image})` }}></div>
                <div className="products-display-component__category-select-value-title">
                    {currentCategory.title}
                </div>

            </div>
        </components.SingleValue >)
    }


    const CategoriesMenu = connectRefinementList(({ items, refine }) => (
        <React.Fragment>
            <Select
                placeholder="Select an option"
                className="products-display-component__custom-select-container"
                classNamePrefix="products-display-component__custom-select"
                value={menuItems.find(item => item.categoryName === selectedCategory)}
                onChange={(value, action) => {
                    setSelectedCategory(value.categoryName)
                    setSubcategories([])
                    refine([
                        selectedCategory,
                        ...menuItems.filter(i =>
                            i.categoryName !== selectedCategory
                        ).map(i =>
                            (`${selectedCategory === 'Accessories' && i.categoryName === 'Power Wheelchairs' ? '' : '-'}${i.categoryName}`)
                        )])
                }}
                options={menuItems}
                theme={theme => ({
                    ...theme,
                    borderRadius: 4,
                    colors: {
                        ...theme.colors,
                        primary25: '#F5F8FA',
                        primary: '#0067A6',
                    },
                })}
                styles={customCategorySelectStyles}
                components={{ SingleValue }}
            />
        </React.Fragment>
    ))

    const Subcategories = () => {

        //menuItems
        // subcategories
        return (
            <div className={`products-display-component__filters-features opened`}>
                <div className="products-display-component__filters-features-container">
                    <div className="products-display-component__filters-features-wrapper">

                        <div >
                            <span className="products-display-component__filters-checkbox-list-title">Categories</span>
                            <ul className="products-display-component__filters-checkbox-list">
                                {subcategoriesList.map(item => (
                                    <li key={item}>
                                        <label className="ais-RefinementList-label">
                                            <input
                                                className="ais-RefinementList-checkbox"
                                                type="checkbox"
                                                checked={subcategories.includes(item)}
                                                onChange={event => {
                                                    if (event.target.checked) {
                                                        setSubcategories([...subcategories, item])
                                                    } else {
                                                        setSubcategories([...subcategories.filter(i => i !== item)])
                                                    }
                                                }}
                                            />
                                            <span className="ais-RefinementList-labelText">{item}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    const renderFilters = () => (
        <div className="products-display-component__filters">
            <div className="products-display-component__filters-header">
                <CategoriesMenu
                    attribute="categories"
                    defaultRefinement={["-Connect", ...selectedCategory === "Accessories" && subcategories.length < 1 ? [
                        selectedCategory] : selectedCategory === "Accessories" && subcategories.length > 0 ? [selectedCategory, ...subcategories] : selectedCategory === "SmartDrive" ? [selectedCategory] : [
                            selectedCategory,
                            ...menuItems.filter(i =>
                                i.categoryName !== selectedCategory
                            ).map(i =>
                                (`-${i.categoryName}`)
                            )]]}
                    limit={100}
                    operator="and"
                />
                <svg style={{ marginLeft: 'auto' }} onClick={closeFilters} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0469 8L14.875 3.21875L15.8594 2.23438C16 2.09375 16 1.85938 15.8594 1.67188L14.8281 0.640625C14.6406 0.5 14.4062 0.5 14.2656 0.640625L8.5 6.45312L2.6875 0.640625C2.54688 0.5 2.3125 0.5 2.125 0.640625L1.09375 1.67188C0.953125 1.85938 0.953125 2.09375 1.09375 2.23438L6.90625 8L1.09375 13.8125C0.953125 13.9531 0.953125 14.1875 1.09375 14.375L2.125 15.4062C2.3125 15.5469 2.54688 15.5469 2.6875 15.4062L8.5 9.59375L13.2812 14.4219L14.2656 15.4062C14.4062 15.5469 14.6406 15.5469 14.8281 15.4062L15.8594 14.375C16 14.1875 16 13.9531 15.8594 13.8125L10.0469 8Z" fill="currentColor" />
                </svg>
            </div>
            <div className="products-display-component__filters-body">

                {/*<div className="products-display-component__filters-select">
                    <label><span>Diagnostic</span><br /><CustomSelect attribute="filters.diagnostic" /></label>
                </div>
                <div className="products-display-component__filters-select">
                    <label><span>Movement Style</span><br /><CustomSelect attribute="filters.movement" /></label>
                </div>
                <div className="products-display-component__filters-select">
                    <label><span>Your Weight</span><br /><CustomSelect attribute="filters.weight" /></label>
                </div>*/}
                <FeaturesList
                    limit={100}
                    attribute="tags.ID"
                    operator="and"
                />

            </div>
        </div >
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
