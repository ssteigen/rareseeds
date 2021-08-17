# Rareseeds Scraper

The purpose of this project is to collect product data from rareseeds.com and
output it in the following format:

```
[
    {
        category: 'New Items 2021',
        url: 'store/vegetables/new-items-2021',
        products: [
            {
                name: 'Longue Rouge Sang Carrot CR143'
                price: '$3.50'
                rating: 5,
                reviewCount: 4,
                url: '/carrots/longue-rouge-sang-carrot'
            },
            {
                name: 'Chijimisai'
                price: '$4.00'
                rating: 5,
                reviewCount: 23,
                url: '/bok-choy/chijimisai'
            },
            ...
        ]
    },
    {
        category: 'Agastache - Hyssop',
        url: 'store/vegetables/hyssop-agastache',
        products: [
            {
                name: 'Mosquito Plant or Texas Hummingbird Mint 'Heather Queen' Agastache HB 272'
                price: '$3.00'
                rating: 5,
                reviewCount: 3,
                url: '/hyssop-agastache/agastache-mosquito-plant-or-texas-hummingbird-mint-hea'
            },
            {
                name: 'Mint Rose Agastache'
                price: '$3.50'
                rating: 5,
                reviewCount: 5,
                url: '/pollinator-garden/agastache-mint-rose'
            },
            ...
        ]
    },
    ...
]
```
