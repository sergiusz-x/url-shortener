import './Stats.css';
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import config from "../config"
//
const Stats = () => {
    const navigate = useNavigate();
    //
    const [queryParameters] = useSearchParams()
    const shorturl_param = queryParameters.get("shorturl")
    //
    const [shortURL, setShortURL] = useState(``)
    const [detailsVisibility, setDetailsVisibility] = useState(false)
    const [details, setDetails] = useState(["-", "-", "-", "-"])
    const [warningShadow, setWarningShadow] = useState(false)
    const [alertBox, setAlertBox] = useState({ display: false, value: "", color: "" })
    //
    function fetch_stats() {
        if(!shorturl_param) return
        //
        fetch(`${config.api_address}/stats/${shorturl_param || "-"}`, {
            method: 'POST',
        }).then(response => response.json())
        .then(data => {
            if(!data.success) {
                setWarningShadow(true)
                setDetails(["-", "-", "-", "-"])
                setDetailsVisibility(false)
                setShortURL("This short URL was not found!")
                //
                return
            }
            setShortURL(`${config.domain}/${data.short_url}`)
            //
            let longurl = data.long_url
            if(longurl.length > 35) {
                longurl = longurl.slice(0, 35) + " ..."
            }
            //
            let uses = data.uses
            if(data.max_uses > 0) uses = `${uses}/${data.max_uses}`
            //
            let expiration_date = "-"
            const date = new Date(data.expiration_timestamp)
            let date_numbers = [[date.getDate(), date.getMonth()+1, date.getFullYear()], [date.getHours(), date.getMinutes(), date.getSeconds()]]
            //
            if(date_numbers[0][0] < 10) date_numbers[0][0] = `0${date_numbers[0][0]}`
            if(date_numbers[0][1] < 10) date_numbers[0][1] = `0${date_numbers[0][1]}`
            if(date_numbers[1][0] < 10) date_numbers[1][0] = `0${date_numbers[1][0]}`
            if(date_numbers[1][1] < 10) date_numbers[1][1] = `0${date_numbers[1][1]}`
            if(date_numbers[1][2] < 10) date_numbers[1][2] = `0${date_numbers[1][2]}`
            //
            expiration_date = date_numbers[0].join(".") + ", " + date_numbers[1].join(":")
            //
            setDetails([data.long_url, longurl, uses, expiration_date])
            setWarningShadow(false)
            setDetailsVisibility(true)
        })
        .catch(error => {
            console.error(error)
        })
    }
    //
    function handleSumbit(event) {
        event.preventDefault()
        //
        navigate(`/stats?shorturl=${shortURL.split(`${config.domain}/`)[1]}`)
    }
    //
    useEffect(() => {
        setWarningShadow(false)
        setDetails(["-", "-", "-", "-"])
        setDetailsVisibility(false)
        setShortURL("")
        //
        fetch_stats()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shorturl_param]) 
    //
    function handleShortURLChange(event) {
        if(shortURL.startsWith(config.domain) || event.target.value.startsWith(config.domain)) {
            setShortURL(`${event.target.value}`)
        } else {
            setShortURL(`${config.domain}/${event.target.value}`)
        }
    }
    //
    function handleCopy() {
        if(!shorturl_param || shorturl_param.length === 0) return
        navigator.clipboard.writeText(`${config.real_domain}/${shorturl_param}`)
            .then(() => {
                setAlertBox({ display: true, value: "Copied to clipboard", color: "green" })
                clearAlertBox()
            })
            .catch((error) => {
                setAlertBox({ display: true, value: "Error adding to clipboard", color: "red" })
                clearAlertBox()
            })
    }
    //
    function clearAlertBox() {
        setTimeout(() => {
            setAlertBox({ display: false, value: "", color: "" })
        }, 2000);
    }
    //
    return (
        <div>
            <h1>
                <Link to="/">URL Shortener</Link>
            </h1>

            <form onSubmit={handleSumbit}>
                <input type="text" disabled={!!shorturl_param} id="short-url-text-input" className={`on-top-shadow ${warningShadow ? "warning-shadow-red" : ""}`} autoComplete="off" placeholder="Enter the short URL link" value={shortURL} onChange={handleShortURLChange}></input>
                <button id="copy-button" className="on-top-shadow" onClick={handleCopy}><span class="material-symbols-outlined">content_copy</span></button>
            </form>

            <div id="details-box-all" style={{ visibility: detailsVisibility ? "unset" : "hidden" }}>
                <div className="details-box-one details-box-left">
                    <p>Long URL:</p>
                    <p>Uses:</p>
                    <p>Expiration:</p>
                </div>
                <div className="details-box-one">
                    <a target="_blank" rel="noopener noreferrer" href={details[0]}><p>{details[1]}</p></a>
                    <p>{details[2]}</p>
                    <p>{details[3]}</p>
                </div>
            </div>

            <div id="alert-box" className={`on-top-shadow, alert-box-${alertBox.color}`} style={{ visibility: alertBox.display ? "unset" : "hidden" }}>
                {alertBox.value}
            </div>

            <footer>
                <div>
                    <Link to="/stats">Statistics</Link>
                </div>
                <div>
                    <Link to="/faq">FAQ</Link>
                </div>
            </footer>
        </div>
    );
};
 
export default Stats;