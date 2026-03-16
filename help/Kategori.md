# 📦 REST API – App Quisioner

Dokumentasi ini menjelaskan penggunaan **endpoint CRUD Kategori**.

- [Back](Home.md)

---

## 🌐 Base URL
BASE_URL/api/kategori

---

## 📌 Endpoint CRUD

- [GET – Ambil Semua Kategori](#get-kategori)
- [Get - Kategori by ID](#get-kategori-by-id)
- [POST – Tambah Kategori](#post-kategori)
- [PUT - Update Kategori](#update-kategori)
- [Delete - Hapus Kategori](#delete-kategori)

<br>

<a id="get-kategori"></a>

### 1️⃣ GET – Ambil Semua Kategori
```
GET /api/kategori
```
**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Materi Pelatihan (kurikulum silabus dan modul)",
      "tipe": "0"
    },
    {
      "id": 2,
      "name": "Tenaga Pelatih",
      "tipe": "1"
    }
  ]
}
```

<a id="get-kategori-by-id"></a>

### 2️⃣ GET – Ambil Kategori Berdasarkan ID

```
GET /api/kategori/:id
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Materi Pelatihan (kurikulum silabus dan modul)",
    "tipe": "0"
  }
}
```

**Jika data tidak ditemukan**

```
{
  "success": false,
  "message": "Data tidak ditemukan"
}
```


<a id="post-kategori"></a>

### 3️⃣ POST – Tambah Kategori
```
POST /api/kategori
```
**Body (JSON)**
```
{
  "name": "Tenaga Pelatih",
  "tipe": "1"
}
```

<a id="update-kategori"></a>

### 4️⃣ PUT – Update Kategori
```
PUT /api/kategori/:id
```

**Contoh**
```
PUT /api/kategori/2
```

**Body (JSON)**
```
{
  "name": "Tenaga Instruktur",
  "tipe": "1"
}
```

**Response**
```
{
  "success": true,
  "message": "Kategori berhasil diperbarui"
}
```

<a id="delete-kategori"></a>

### 5️⃣ DELETE – Hapus Kategori

```
DELETE /api/kategori/:id
```

**Contoh**
```
DELETE /api/kategori/3
```

**Response**
```
{
  "success": true,
  "message": "Kategori berhasil dihapus"
}
```