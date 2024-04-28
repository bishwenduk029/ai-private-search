# -*- coding: utf-8 -*-

from contextlib import asynccontextmanager
from typing import List, Optional
from urllib.parse import urlparse


import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field
from pprint import pprint
import requests
import trafilatura
from concurrent.futures import ThreadPoolExecutor
import concurrent
import concurrent.futures
import requests
from urllib.parse import urlparse
import tldextract
import urllib.parse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_url_content(url):
    downloaded = trafilatura.fetch_url(url)
    content = trafilatura.extract(downloaded)
    return {"url": url, "content": content}

def search_web_ref(query: str, debug=False):
    content_list = []
    try:
        safe_string_general = urllib.parse.quote_plus(":all !general " + query)
        safe_string_images = urllib.parse.quote_plus(":all !images " + query)
        print(safe_string_general)
        print(safe_string_images)
        
        def fetch_results(safe_string):
            return requests.get('http://searxng:8080/?q=' + safe_string + '&format=json')

        with ThreadPoolExecutor(max_workers=2) as executor:
            general_future = executor.submit(fetch_results, safe_string_general)
            images_future = executor.submit(fetch_results, safe_string_images)
            general_response = general_future.result()
            images_response = images_future.result()

        general_response.raise_for_status()
        images_response.raise_for_status()

        search_results = general_response.json()
        images_results = images_response.json()

        pedding_urls = []
        conv_links = []
        images = []

        if search_results.get('results'):
            for item in search_results.get('results')[0:9]:
                name = item.get('title')
                snippet = item.get('content')
                url = item.get('url')
                pedding_urls.append(url)
                if url:
                    url_parsed = urlparse(url)
                    domain = url_parsed.netloc
                    icon_url = url_parsed.scheme + '://' + url_parsed.netloc + '/favicon.ico'
                    site_name = tldextract.extract(url).domain
                    conv_links.append({
                        'site_name': site_name,
                        'icon_url': icon_url,
                        'title': name,
                        'url': url,
                        'snippet': snippet
                    })

        if images_results.get('results'):
            for item in images_results.get('results')[0:7]:
                images.append(item.get("img_src"))

        results = []
        futures = []
        executor = ThreadPoolExecutor(max_workers=10)
        for url in pedding_urls:
            futures.append(executor.submit(extract_url_content, url))
        try:
            for future in futures:
                res = future.result(timeout=5)
                results.append(res)
        except concurrent.futures.TimeoutError:
            executor.shutdown(wait=False, cancel_futures=True)

        for content in results:
            if content and content.get('content'):
                item_dict = {
                    "url": content.get('url'),
                    "content": content.get('content'),
                    "length": len(content.get('content'))
                }
                content_list.append(item_dict)

        if debug:
            print("URL: {}".format(url))
            print("=================")

        return [content_list, images]
    except Exception as ex:
        raise ex


class SearchRequest(BaseModel):
    query: str


class SearchResult(BaseModel):
    url: str
    content: str
    length: int


class SearchResultResponse(BaseModel):
    query: str
    results: List[SearchResult]
    images: List[Optional[str]]


@app.post("/v1/search", response_model=SearchResultResponse)
def search(request: SearchRequest):
    [content_list, images] = search_web_ref(request.query, debug=False)
    print(content_list)
    return SearchResultResponse(query=request.query, results=content_list, images=images)


def main():

    port = 8000

    uvicorn.run(app, host='0.0.0.0', port=port, workers=1)


if __name__ == "__main__":
    main()
