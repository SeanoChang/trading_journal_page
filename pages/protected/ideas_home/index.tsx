
import React, { useState } from 'react';

/*
    Home page for trading ideas.
    List of all trading pairs that I have ideas for.
    Each trading pair will have a link to the page for all 
    the ideas for that trading pair.
*/
const TradingIdeasHome = (): JSX.Element => {
    const [ideas, setIdeas] = useState([]);
    return (
        <div>
            <h1>Trading Ideas</h1>
        </div>
    );
};

export default TradingIdeasHome;
