
let db;

function createDB() {

    var request = indexedDB.open("requests");
    request.onupgradeneeded = function (event) {
        let dbUpgrade = event.target.result;
        var objectStore = dbUpgrade.createObjectStore("api", { autoIncrement: true });
    };
    request.onerror = function (event) {
        console.log("Error:  ", event.target.errorCode);
    };
    request.onsuccess = function (event) {
        db = event.target.result;
    };
}

function addData(url) {
    return new Promise((resolve, reject) => {
        let tran = db.transaction('api', "readwrite");
        let objStore = tran.objectStore('api');
        objStore.add({ url: url, date: new Date().getTime() }).onsuccess =
            () => { resolve("ok") }
    });
};

function readDB() {
    let result = [];
    return new Promise((resolve, reject) => {
        let objectStore = db.transaction("api", "readwrite").objectStore("api");
        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                result.push({ key: cursor.key, value: cursor.value });
                cursor.continue();
            }
            else {
                resolve(result);
            }
        };
    });
}

function removeData(key) {
    return new Promise((resolve, reject) => {
        let tran = db.transaction('api', "readwrite");
        let objStore = tran.objectStore('api');
        objStore.delete(key).onsuccess = () => { resolve("ok") };
    });
};

function syncData() {
    readDB()
        .then(async (data) => {
            for (let i = 0; i < data.length; i++) {
                await fetch(data[i].value.url)
                    .then(async (res) => {
                        await removeData(data[i].key);
                    })
                    .catch((err) => { });
            }
        });
}

self.addEventListener('activate', function (event) {
    event.waitUntil(
        createDB()
    );
});


self.addEventListener('fetch', function (event) {
    if (/.gif/.test(event.request.url)) {
        event.respondWith(
            function () {
                let url = new URL(event.request.url);
                let params = url.searchParams;
                let finalUrl = event.request.url.split('?')[0] + `?event=${params.get('interaction')}&customer=${params.get('client')}` +
                    `&operating_system_name=${params.get('os_name')}&utm_source=${params.get('x1')}&utm_medium=${params.get('x2')}` +
                    `&utm_campaign=${params.get('x3')}&campaign_url=${params.get('landing_url')}`;
                if (navigator.onLine) {
                    fetch(finalUrl)
                        .then((response) => { })
                        .catch((err) => {
                            addData(finalUrl);
                        });
                    syncData();
                } else {
                    addData(finalUrl);
                }
                return new Response({})
            }()
        );
    }
});

self.addEventListener('sync', async function (event) {
    if (event.tag === 'onlineSync') {
        syncData();
    }
});

