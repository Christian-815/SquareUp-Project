import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import './Search.css';

const Search = () => {
    const allEvents = useSelector(state => state.events.Events.allEvents.Events);
    const allEventsArr = Object.values(allEvents);
    const allGroups = useSelector(state => state.groups.groups.allGroups.Groups);
    const allGroupsArr = Object.values(allGroups);
    const { search } = useLocation();
    const query = new URLSearchParams(search).get('query');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const inputRef = useRef();
    const ulRef = useRef(null);
    // console.log(allGroupsArr[0])

    useEffect(() => {
        if (query) {
            setSearchTerm(query);
        }
    }, [query]);

    useEffect(() => {
        if (searchTerm.length > 1) {
            const filteredEvents = allEventsArr.filter(
                (event) =>
                    event.Venue.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.Venue.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const filteredGroups = allGroupsArr.filter(
                (group) =>
                    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    group.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    group.state.toLowerCase().includes(searchTerm.toLowerCase())
            )

            const filteredResults = filteredEvents.concat(filteredGroups)
            setSearchResults(filteredResults);
            console.log(searchResults)
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClickOutside = (e) => {
        if (ulRef.current && !ulRef.current.contains(e.target) && !inputRef.current.contains(e.target)) {
            setSearchTerm('');
        }
    };

    const handleNavLinkClick = () => {
        setSearchTerm('');
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="search-bar-container">
            <input
                ref={inputRef}
                className="search-bar"
                type="text"
                placeholder="Search by city, state, or name"
                value={searchTerm}
                onChange={handleSearch}
            />
            {searchResults.length > 0 && searchTerm.length > 1 && (
                <div className="search-results" ref={ulRef}>
                    {searchResults.map((searchResult) => (
                        searchResult.Group ?
                            <div className='search-results-container'>
                                <NavLink to={`/events/${searchResult.id}`} className="search-results-navlink" onClick={handleNavLinkClick}>
                                    <img src={searchResult.previewImage} className="search-bar-spot-image" alt="Spot Preview" />
                                    <div className="search-results-content">
                                        <div className="search-bar-spot-name">{searchResult.name}</div>
                                        {searchResult.price === 0 ?
                                            <div className="search-bar-price">FREE</div>
                                        :
                                            <div className="search-bar-price">${searchResult.price}</div>}
                                        <div className="search-bar-location">{searchResult.Venue.city}, {searchResult.Venue.state}</div>
                                    </div>
                                </NavLink>
                            </div>
                            :
                            <div className='search-results-container'>
                                <NavLink to={`/groups/${searchResult.id}`} className="search-results-navlink" onClick={handleNavLinkClick}>
                                    <img src={searchResult.previewImage} className="search-bar-spot-image" alt="Spot Preview" />
                                    <div className="search-results-content">
                                        <div className="search-bar-spot-name">{searchResult.name}</div>
                                        <div className="search-bar-price">{searchResult.type}</div>
                                        <div className="search-bar-location">{searchResult.city}, {searchResult.state}</div>
                                    </div>
                                </NavLink>
                            </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
