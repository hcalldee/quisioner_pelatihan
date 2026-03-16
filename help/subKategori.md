# Sub Kategori Endpoint

Dokumentasi endpoint CRUD untuk **Sub Kategori**.

```
Base URL:/api/sub-kategori
```
- [Back](Home.md)
---

## 📌 Endpoint CRUD
- [Create Sub Kategori](#create-sub-kategori)
- [Get Semua Sub Kategori](#get-semua-sub-kategori)
- [Search Sub Kategori](#search-sub-kategori)
- [Get Sub Kategori by ID](#get-sub-kategori-by-id)
- [Update Sub Kategori](#update-sub-kategori)
- [Delete Sub Kategori](#delete-sub-kategori)

---

<a id="create-sub-kategori"></a>
## ➕ Create Sub Kategori

**POST**
```
/api/sub-kategori
```

**Body**
```json
{
  "nama": "Ruang Kelas",
  "master_kategori": 3
}
```
<a id="get-semua-sub-kategori"></a>

## 📄 Get Semua Sub Kategori
```
GET /api/sub-kategori
```

Mengambil seluruh data sub kategori.

<a id="search-sub-kategori"></a>

### 🔍 Search Sub Kategori
```
POST /api/sub-kategori/search
```

**Body**
```json
Copy code
{
  "keyword": "Ruang"
}

```
**Catatan:**
```
Menggunakan query LIKE
Pencarian berdasarkan field nama
Keyword dikirim melalui body
```

<a id="get-sub-kategori-by-id"></a>

## 🔎 Get Sub Kategori by ID
```
GET /api/sub-kategori/:id
```

**Contoh**
```
/api/sub-kategori/5
```

<a id="update-sub-kategori"></a>

## ✏️ Update Sub Kategori
```
PUT /api/sub-kategori/:id
```

**Body**

```json
{
  "nama": "Ruang Kelas Teori",
  "master_kategori": 3
}
```
<a id="delete-sub-kategori"></a>

## 🗑 Delete Sub Kategori
```
DELETE /api/sub-kategori/:id
```

## 📦 Format Response
**Success**
```json
{
  "success": true,
  "data": {}
}
```

**Error**
```json
{
  "success": false,
  "message": "Error message"
}
```