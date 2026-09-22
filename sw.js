const CACHE_NAME = "sri-lanka-job-calendar-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./sw.js"
];

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(cache => {

                    return cache.addAll(
                        APP_FILES
                    );

                })
                .then(() => {

                    return self.skipWaiting();

                })

        );

    }
);


self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()
                .then(keys => {

                    return Promise.all(

                        keys
                            .filter(
                                key =>
                                    key !== CACHE_NAME
                            )
                            .map(
                                key =>
                                    caches.delete(key)
                            )

                    );

                })
                .then(() => {

                    return self.clients.claim();

                })

        );

    }
);


self.addEventListener(
    "fetch",
    event => {

        if(
            event.request.method !== "GET"
        ){

            return;

        }


        event.respondWith(

            caches.match(
                event.request
            )
            .then(cachedResponse => {

                if(cachedResponse){

                    return cachedResponse;

                }


                return fetch(
                    event.request
                )
                .then(networkResponse => {

                    if(
                        networkResponse &&
                        networkResponse.status === 200
                    ){

                        const copy =
                            networkResponse.clone();


                        caches
                            .open(CACHE_NAME)
                            .then(cache => {

                                cache.put(
                                    event.request,
                                    copy
                                );

                            });

                    }


                    return networkResponse;

                })
                .catch(() => {

                    return caches.match(
                        "./index.html"
                    );

                });

            })

        );

    }
);