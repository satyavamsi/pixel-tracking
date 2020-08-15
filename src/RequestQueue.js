import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';

import { Divider } from '@material-ui/core';

import './RequestQueue.css';

function RequestQueue() {

    let requestEnd = null;

    let [requests, setRequests] = useState([]);

    let [db, setDB] = useState();

    useEffect(() => {
        let request = indexedDB.open("requests");

        request.onupgradeneeded = function (event) {
            // Save the IDBDatabase interface 
            let dbUpgrade = event.target.result;

            // Create an objectStore for this database
            var objectStore = dbUpgrade.createObjectStore("api", { autoIncrement: true });
        };
        request.onerror = function (event) {
            console.log("DB Error", event.target.errorCode);
        };
        request.onsuccess = function (event) {
            setDB(event.target.result);
        };

        return () => { }
    }, [])

    useEffect(() => {
        let dbInterval = setInterval(() => {
            if (db) {
                getData()
                    .then((data) => {
                        setRequests(data);
                    })
            }
        }, 1000)
        return () => { clearInterval(dbInterval) }
    }, [db]);

    useEffect(() => {
        scrollToBottom();
    }, [requests])

    const scrollToBottom = () => {
        if (requestEnd) {
            requestEnd.scrollIntoView({ behavior: "smooth" });
        }
    }

    const getData = () => {
        let result = [];
        return new Promise((resolve, reject) => {
            let objectStore = db.transaction("api", "readwrite").objectStore("api");

            objectStore.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    let url = new URL(cursor.value.url);
                    let params = url.searchParams;
                    result.push({ type: params.get('utm_source'), time: moment(cursor.value.date).tz('Asia/Kolkata').format('MMMM Do - h:mm:ss A') });
                    cursor.continue();
                }
                else {
                    resolve(result);
                }
            };
        });
    }
    return (
        <div className="requestQueue">
            <h3>Pending Requests ({requests.length})</h3>
            <div className="requestQueue_body">
                {requests.map((request, index) => {
                    return (
                        <React.Fragment>
                            <p>{index + 1}. {request.type} is clicked at {request.time}</p>
                            <Divider />
                        </React.Fragment>
                    )
                })}
                <div style={{ float: "left", clear: "both" }}
                    ref={(el) => {
                        requestEnd = el;
                    }}>
                </div>
            </div>
        </div>
    )
}

export default RequestQueue
