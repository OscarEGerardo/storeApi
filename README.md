#Index
StoreAPI

---
#Modelos [▲](#markdown-header-index)

##Product [▲](#markdown-header-index)
```
:::scala
{
  code: string,
  name: string,
  price: decimal
}
```

##Promotion [▲](#markdown-header-index)
```
:::scala
{
  type: string,
  data: json
}
```

##[POST] Products [▲](#markdown-header-index)
*Agrega un nuevo producto a la base de datos*

```
:::scala
Request: {
  product: Product,
  promotion: Promotion (Not Required)
}

Response: {
  Product
}
```

##Ejemplo [POST] Products [▲](#markdown-header-index)
```
:::json
Request: {
  {
    "product": {
        "code": "PANTS",
        "name": "OGGI",
        "price": 5.00
    },
    "promotion": {
        "type": "XFORX",
        "data": {
            "buy": 2,
            "pay": 1
        }
    }
 }
}

Response: {
  "code": "PANTS",
  "name": "OGGI",
  "price": 5.00,
  "updatedAt": "2016-06-17T11:45:00.751Z",
  "createdAt": "2016-06-17T11:45:00.725Z",
  "PromotionId": 2
}
```

##[POST] Payments [▲](#markdown-header-index)
*Agrega un nuevo producto a la base de datos*

```
:::scala
Request: {
  items[]: string
}

Response: {
  items[]: string,
  total: decimal
}
```

##Ejemplo [POST] Payments [▲](#markdown-header-index)
```
:::json
Request: {
    "items": ["PANTS","PANTS","PANTS","PANTS"]
}

Response: {
  "items": [
    "PANTS",
    "PANTS",
    "PANTS",
    "PANTS"
  ],
  "total": 10
}
```