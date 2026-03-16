# 📦 REST API – App Quisioner

Dokumentasi ini menjelaskan penggunaan<br>
**Endpoint CRUD Pertanyaan**.

- [Back](Home.md)

```
Base URL: /api/pertanyaan
```

---

## 📌 Endpoint CRUD
- [Create Pertanyaan](#create-pertanyaan)
- [Get Semua Pertanyaan](#get-semua-pertanyaan)
- [Search Pertanyaan](#search-pertanyaan)
- [Get Pertanyaan by ID](#get-pertanyaan-by-id)
- [Update Pertanyaan](#update-pertanyaan)
- [Delete Pertanyaan](#delete-pertanyaan)

---

<a id="create-pertanyaan"></a>

## ➕ Create Pertanyaan

```
POST /api/pertanyaan
```

**Body**
```json
{
    "question": "Apa itu JavaScript?",
  "id_sub_kategori": 3
}
```

```json
Response Sukses (201)
{
  "success": true,
  "data": {
    "id": 1,
    "question": "Apa itu JavaScript?",
    "id_sub_kategori": 3
  }
}
```

```json
Response Error (400)

{
  "success": false,
  "message": "question wajib diisi"
}
```

---
<a id="get-semua-pertanyaan"></a>

## 📄 Get Semua Pertanyaan

```
GET /api/pertanyaan
```

```json
Response Sukses (200)

{
  "success": true,
  "data": [
    {
      "id": 1,
      "question": "Apa itu JavaScript?",
      "id_sub_kategori": 3
    }
  ]
}
```

<a id="search-pertanyaan"></a>

## 🔍 Search Pertanyaan

Pencarian berdasarkan question

```
POST /api/pertanyaan/search
```

**Body**
```
{
  "keyword": "JavaScript"
}
```

```json
Response Sukses (200)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "question": "Apa itu JavaScript?",
      "id_sub_kategori": 3
    }
  ]
}
```

```json
Response Error (400)
{
  "success": false,
  "message": "keyword wajib diisi"
}
```
---

<a id="get-pertanyaan-by-id"></a>

## 📌 Get Pertanyaan by ID

```
GET /api/pertanyaan/{id}
```

```json
Response Sukses (200)
{
  "success": true,
  "data": {
    "id": 1,
    "question": "Apa itu JavaScript?",
    "id_sub_kategori": 3
  }
}
```

```json
Response Error (404)
{
  "success": false,
  "message": "Data pertanyaan tidak ditemukan"
}
```

---
<a id="update-pertanyaan"></a>

## ✏️ Update Pertanyaan

```
PUT /api/pertanyaan/{id}
```

**Body**

```json
{
  "question": "Apa itu JavaScript dan kegunaannya?",
  "id_sub_kategori": 3
}
```

```json
Response Sukses (200)
{
  "success": true,
  "message": "Data pertanyaan berhasil diupdate"
}
```

```json
Response Error (404)
{
  "success": false,
  "message": "Data pertanyaan tidak ditemukan"
}
```

---
<a id="delete-pertanyaan"></a>

## 🗑️ Delete Pertanyaan

```
DELETE /api/pertanyaan/{id}
```

```json
Response Sukses (200)
{
  "success": true,
  "message": "Data pertanyaan berhasil dihapus"
}
```

```json
Response Error (404)
{
  "success": false,
  "message": "Data pertanyaan tidak ditemukan"
}
```