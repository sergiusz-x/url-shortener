import './Faq.css';
import React from 'react';
import { Link } from 'react-router-dom';

function Faq() {
    return (
        <div>
            <h1>
                <Link to="/">URL Shortener</Link>
            </h1>

            <main>
                <div className="question-box-all">
                    <div className="question-box">
                        <span class="material-symbols-outlined">arrow_right</span>
                        <h3>How it's working?</h3>
                    </div>
                    <p>The API takes care of creating the shortened links, it also takes care of redirecting from the shortened link to the full one. All this is done without tracking the user's data (IP, location, etc.), only the redirect counter is saved.</p>
                </div>

                <div className="question-box-all">
                    <div className="question-box">
                        <span class="material-symbols-outlined">arrow_right</span>
                        <h3>How long are shortened links active?</h3>
                    </div>
                    <p>By default, links are active for 1 year, unlimited use. However, the user can shorten this time as well as the use limit.</p>
                </div>

                <div className="question-box-all">
                    <div className="question-box">
                        <span class="material-symbols-outlined">arrow_right</span>
                        <h3>Can I access via API?</h3>
                    </div>
                    <p>Yes, the documentation is available here: <a target="_blank" rel="noopener noreferrer" href="https://github.com/sergiusz-x/url-shortener">[click]</a></p>
                </div>
                
                <div className="question-box-all">
                    <div className="question-box">
                        <span class="material-symbols-outlined">arrow_right</span>
                        <h3>Can you track shortened link stats?</h3>
                    </div>
                    <p>Yes, after creating a shortened link, a page with statistics will be displayed, then refresh the page to update the data.</p>
                </div>
                
                <div className="question-box-all">
                    <div className="question-box">
                        <span class="material-symbols-outlined">arrow_right</span>
                        <h3>How to set the maximum number of uses?</h3>
                    </div>
                    <p>Click on the "Advanced" button and enter the number of uses in the first field.</p>
                </div>
                
                <div className="question-box-all">
                    <div className="question-box">
                        <span class="material-symbols-outlined">arrow_right</span>
                        <h3>How do I set an expiration date?</h3>
                    </div>
                    <p>Click on the "Advanced" button and in the second field enter the expiry date (no more than one year)</p>
                </div>
            </main>

            <footer style={{ position: "relative" }}>
                <div>
                    <Link to="/stats">Statistics</Link>
                </div>
                <div>
                    <Link to="/faq">FAQ</Link>
                </div>
            </footer>
            
        </div>
    )
}
//
export default Faq