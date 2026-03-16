# 📦 REST API – App Quisioner

Dokumentasi ini menjelaskan penggunaan<br>
**Endpoint CRUD Master Sumber Informasi**.

- [Back](Home.md)

---

## 🌐 Base URL
BASE_URL/api/master-si

---

## 📌 Endpoint CRUD

- [POST /api/master-si](#create-master-si)
- [Get Semua Master SI](#get-semua-master-si)
- [Search Master SI](#search-master-si)
- [Get Master SI by ID](#get-master-si-by-id)
- [Update Master SI](#update-master-si)
- [Delete Master SI](#delete-master-si)

---

<a id="create-master-si"></a>

## ➕ Create Sumber Informasi

**POST**

**Body**
```json
{
  "nama_media": "Modul Cetak"
}
```
<a id="get-semua-master-si"></a>

### 📄 Get List Sumber Informasi (Pagination)

**GET**

```
/api/master-si
```

<a id="search-master-si"></a>

### 🔍 Search Master Sumber Informasi

**POST**

```
/api/master-si/search
```

**Body**
```
{
  "keyword": "Modul"
}
```


<a id="update-master-si"></a>

### 🔎 Get Master Sumber Informasi by ID

**GET**

```
/api/master-si/:id
```

<a id="delete-master-si"></a>

### ✏️ Update Master Sumber Informasi

**PUT**
```
/api/master-si/:id
```

**Body**
```
{
  "nama_media": "Modul Digital"
}
```
### 🗑 Delete Master Sumber Informasi

**DELETE**

```
/api/master-si/:id
```

### 📦 Format Response
**Success**
```
{
  "success": true,
  "data": {}
}
```
**Error**
```
{
  "success": false,
  "message": "Error message"
}
```
