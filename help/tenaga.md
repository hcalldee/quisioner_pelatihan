# Tenaga Endpoint

Dokumentasi endpoint CRUD untuk **Tenaga**.

- [Back](Home.md)

```
Base URL: /api/tenaga
```
---

## 📌 Endpoint CRUD
- [Create Tenaga](#create-tenaga)
- [Get Semua Tenaga](#get-semua-tenaga)
- [Search Tenaga](#search-tenaga)
- [Get Tenaga by NI](#get-tenaga-by-ni)
- [Update Tenaga](#update-tenaga)
- [Delete Tenaga](#delete-tenaga)

---

<a id="create-tenaga"></a>
## ➕ Create Tenaga

**POST**
```
/api/tenaga
```

**Body**
```json
{
  "NI": "NI-001",
  "Nama": "Ahmad Fauzi",
  "Kelas": "XII",
  "Kejuruan": "Teknik Informatika",
  "Status": "1"
}

Keterangan Status
0 : teori + praktek
1 : teori
2 : praktek
```

---

<a id="get-semua-tenaga"></a>

## 📄 Get Semua Tenaga
```
GET /api/tenaga
```

Mengambil seluruh data tenaga.

<a id="search-tenaga"></a>

## 🔍 Search Tenaga
**POST**

/api/tenaga/search

**Body**

```json
{
  "keyword": "Informatika"
}

Catatan
Menggunakan query LIKE
Pencarian dilakukan pada field:
NI
Nama
Kelas
Kejuruan
```

<a id="get-tenaga-by-ni"></a>

## 🔎 Get Tenaga by NI
```
GET /api/tenaga/:ni
```

**Contoh**
```
/api/tenaga/NI-001
```

<a id="update-tenaga"></a>

## ✏️ Update Tenaga
```
PUT /api/tenaga/:ni
```

**Body**

```json
{
  "Nama": "Ahmad Fauzi Updated",
  "Kelas": "XI",
  "Kejuruan": "Multimedia",
  "Status": "2"
}
```

<a id="delete-tenaga"></a>

## 🗑 Delete Tenaga
```
DELETE /api/tenaga/:ni
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