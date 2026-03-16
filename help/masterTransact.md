# Master Transact Pelatihan Endpoint

Dokumentasi endpoint CRUD untuk **Master Transact Pelatihan**.

- [Back](Home.md)


```
Base URL: /api/master-transact-pelatihan
```

---
## 📌 Endpoint CRUD
- [Create Pelatihan](#create-pelatihan)
- [Get Semua Pelatihan](#get-semua-pelatihan)
- [Search Pelatihan](#search-pelatihan)
- [Get Pelatihan by ID](#get-pelatihan-by-id)
- [Update Pelatihan](#update-pelatihan)
- [Delete Pelatihan](#delete-pelatihan)

---

<a id="create-pelatihan"></a>

## ➕ Create Pelatihan

**POST**
```
/api/master-transact-pelatihan
```

**Body**
```json

{
    "nama_pelatihan": "Pelatihan Web Developer",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "komentar": "Pelatihan dasar web",
  "id_tenaga": 1,
  "id_si": 2
}
```

```json
Response Sukses (201)
{
  "success": true,
  "data": {
    "id": 1,
    "nama_pelatihan": "Pelatihan Web Developer",
    "start_date": "2024-01-01",
    "end_date": "2024-01-31",
    "komentar": "Pelatihan dasar web",
    "id_tenaga": 1,
    "id_si": 2
  }
}
```

```json
Response Error (400)
{
  "success": false,
  "message": "nama_pelatihan wajib diisi"
}
```

---
<a id="get-semua-pelatihan"></a>

## 📄 Get Semua Pelatihan
```
GET /api/master-transact-pelatihan
```

```json
Response Sukses (200)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama_pelatihan": "Pelatihan Web Developer",
      "start_date": "2024-01-01",
      "end_date": "2024-01-31",
      "komentar": "Pelatihan dasar web",
      "id_tenaga": 1,
      "id_si": 2
    }
  ]
}
```
---

<a id="search-pelatihan"></a>

## 🔍 Search Pelatihan

Pencarian berdasarkan nama_pelatihan

```
POST /api/master-transact-pelatihan/search
```


**Body**
```json
{
  "keyword": "Web"
}
```
```json
Response Sukses (200)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama_pelatihan": "Pelatihan Web Developer",
      "start_date": "2024-01-01",
      "end_date": "2024-01-31",
      "komentar": "Pelatihan dasar web",
      "id_tenaga": 1,
      "id_si": 2
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
<a id="get-pelatihan-by-id"></a>

## 📌 Get Pelatihan by ID
```
GET /api/master-transact-pelatihan/{id}
```
```json
Response Sukses (200)
{
  "success": true,
  "data": {
    "id": 1,
    "nama_pelatihan": "Pelatihan Web Developer",
    "start_date": "2024-01-01",
    "end_date": "2024-01-31",
    "komentar": "Pelatihan dasar web",
    "id_tenaga": 1,
    "id_si": 2
  }
}
```
```json
Response Error (404)
{
  "success": false,
  "message": "Data pelatihan tidak ditemukan"
}
```
---
<a id="update-pelatihan"></a>

## ✏️ Update Pelatihan

```
PUT /api/master-transact-pelatihan/{id}
```

**Body**

```json
{
  "nama_pelatihan": "Pelatihan Web Lanjutan",
  "start_date": "2024-02-01",
  "end_date": "2024-02-28",
  "komentar": "Update materi",
  "id_tenaga": 1,
  "id_si": 3
}
```
```json
Response Sukses (200)
{
  "success": true,
  "message": "Data pelatihan berhasil diupdate"
}
```
```json
Response Error (404)
{
  "success": false,
  "message": "Data pelatihan tidak ditemukan"
}
```
---
<a id="delete-pelatihan"></a>

## 🗑️ Delete Pelatihan
```
DELETE /api/master-transact-pelatihan/{id}
```
```json
Response Sukses (200)
{
  "success": true,
  "message": "Data pelatihan berhasil dihapus"
}
```
```json
Response Error (404)
{
  "success": false,
  "message": "Data pelatihan tidak ditemukan"
}
```
---