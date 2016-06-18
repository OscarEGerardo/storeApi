#Index
StoreAPI

---
#Modelos [▲](#markdown-header-index)

![BD](https://raw.githubusercontent.com/OscarEGerardo/storeApi/master/docs/BD.PNG)

##Product [▲](#markdown-header-index)
```scala
{
  code: string,
  name: string,
  price: decimal
}
```

##Promotion [▲](#markdown-header-index)
```scala
{
  type: string,
  data: json
}
```

##[GET] Products [▲](#markdown-header-index)
*Obtiene lista de productos*
```scala

Response: {
  Products
}
```

##Ejemplo [GET] Products [▲](#markdown-header-index)
```json

Response: [
  {
    "code": "PANTS",
    "name": "Pants",
    "price": 5,
    "Promotion": {
      "type": "XFORX",
      "data": "{\"buy\":2,\"pay\":1}"
    }
  },
  {
    "code": "TSHIRT",
    "name": "T-Shirt",
    "price": 20,
    "Promotion": {
      "type": "BULK",
      "data": "{\"buy\":3,\"price\":19}"
    }
  },
  {
    "code": "HAT",
    "name": "Hat",
    "price": 7.5,
    "Promotion": null
  }
]
```

##[POST] Products/create [▲](#markdown-header-index)
*Agrega un nuevo producto a la base de datos*

```scala
Request: {
  product: Product,
  promotion: Promotion (Not Required)
}

Response: {
  Product
}
```

##Ejemplo [POST] Products/create [▲](#markdown-header-index)
```json
Request: {
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

Response: {
  "code": "PANTS",
  "name": "OGGI",
  "price": 5.00,
  "updatedAt": "2016-06-17T11:45:00.751Z",
  "createdAt": "2016-06-17T11:45:00.725Z",
  "PromotionId": 2
}
```

##[POST] Products/update [▲](#markdown-header-index)
*Actualiza producto*
```scala
Request: {
  product: Product,
  promotion: Promotion (Not Required)
}

Response: {
  Product
}
```

##Ejemplo [POST] Products/update [▲](#markdown-header-index)
```json
Request: {
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

Response: {
  "code": "PANTS",
  "name": "Pants",
  "price": 5,
  "createdAt": "2016-06-18T05:30:47.558Z",
  "updatedAt": "2016-06-18T14:46:17.343Z",
  "PromotionId": 1,
  "Promotion": {
    "type": "XFORX",
    "data": {
      "buy": 2,
      "pay": 1
    }
  }
}
```

##[POST] Payments [▲](#markdown-header-index)
*Agrega un nuevo producto a la base de datos*

```scala
Request: {
  items[]: string
}

Response: {
  items[]: string,
  total: decimal
}
```

##Ejemplo [POST] Payments [▲](#markdown-header-index)
```json
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