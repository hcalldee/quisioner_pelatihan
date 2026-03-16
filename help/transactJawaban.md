# Dokumentasi <br> 📦 REST API – App Quisioner

## 📘 Dokumentasi – Transact Jawaban

```
base url : /api/transact-jawaban
```
- [Back](Home.md)

---
## 📌 Endpoint CRUD
- [Create jawaban](#create-jawaban)
- [Bulk jawaban](#bulk-jawaban)
- [Get Semua jawaban](#get-semua-jawaban)
- [Get jawaban by ID](#get-jawaban-by-id)
- [Update jawaban](#update-jawaban)
- [Delete jawaban](#delete-jawaban)
- [Delete jawaban](#delete-jawaban-idtransact)

---

### 🔹 Struktur Data (Payload Jawaban)

Contoh struktur data jawaban:

```json
{
  "id_transact": 1,
  "id_pertanyaan": 10,
  "jawaban": "Ya"
}

```
<a id="create-jawaban"></a>
## 1️⃣ Create Jawaban

Endpoint
```
POST /
```

**Deskripsi**
Menyimpan satu jawaban transaksi.

**Body**
```json
{
  "id_transact": 1,
  "id_pertanyaan": 10,
  "jawaban": "Jawaban user"
}
```

```json
Response Sukses (201)
{
  "success": true,
  "data": {
    "id": 12,
    "id_transact": 1,
    "id_pertanyaan": 10,
    "jawaban": "Jawaban user"
  }
}
```

```json
Response Gagal (500)
{
  "success": false,
  "message": "Gagal menyimpan jawaban",
  "error": "Error message"
}
```

---

<a id="bulk-jawaban"></a>
## 2️⃣ Bulk Create Jawaban

**Endpoint**

```
POST /bulk
```

**Deskripsi**
Menyimpan banyak jawaban sekaligus untuk satu transaksi.

Request Body
```json
{
  "id_transact": 1,
  "jawaban": [
    {
      "id_pertanyaan": 1,
      "jawaban": "Ya"
    },
    {
      "id_pertanyaan": 2,
      "jawaban": "Tidak"
    }
  ]
}
```

```json
Response Sukses (201)
{
  "success": true,
  "message": "Semua jawaban berhasil disimpan"
}
```

```json
Response Gagal (400 – Payload Tidak Valid)
{
  "success": false,
  "message": "Payload tidak valid"
}
```
---


<a id="get-semua-jawaban"></a>

## 3️⃣ Get Semua Jawaban Berdasarkan ID Transaksi

Endpoint
```
GET /transact/:id_transact
```

**Deskripsi**
Mengambil semua jawaban berdasarkan id_transact.

Parameter URL

<table>
    <tbody>
        <th>Parameter</th>
        <th>Tipe</th>
        <th>Deskripsi</th>
        <tr>
            <td>id_transact</td>
            <td>number</td>
            <td>ID transaksi</td>
        </tr>
    </tbody>				
</table>

```json
Response Sukses (200)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "id_transact": 1,
      "id_pertanyaan": 1,
      "jawaban": "Ya"
    },
    {
      "id": 2,
      "id_transact": 1,
      "id_pertanyaan": 2,
      "jawaban": "Tidak"
    }
  ]
}
```

<a id="get-jawaban-by-id"></a>

## 4️⃣ Get Jawaban Berdasarkan ID

Endpoint

```
GET /:id
```
**Deskripsi**
Mengambil satu jawaban berdasarkan ID jawaban.

Parameter URL
<table>
    <tbody>
        <th>Parameter</th>
        <th>Tipe</th>
        <th>Deskripsi</th>
        <tr>
            <td>id_transact</td>
            <td>number</td>
            <td>ID transaksi</td>
        </tr>
    </tbody>				
</table>

```json
Response Sukses (200)
{
  "success": true,
  "data": {
    "id": 1,
    "id_transact": 1,
    "id_pertanyaan": 1,
    "jawaban": "Ya"
  }
}
```

```json
Response Tidak Ditemukan (404)
{
  "success": false,
  "message": "Data jawaban tidak ditemukan"
}
```

<a id="update-jawaban"></a>
## 5️⃣ Update Jawaban

Endpoint

```
PUT /:id
```

**Deskripsi**
Mengupdate jawaban berdasarkan ID.

```json
Request Body
{
  "jawaban": "Jawaban diperbarui"
}
```

```json
Response Sukses (200)
{
  "success": true,
  "message": "Jawaban berhasil diupdate"
}
```

```json
Response Tidak Ditemukan (404)
{
  "success": false,
  "message": "Data jawaban tidak ditemukan"
}
```

<a id="delete-jawaban"></a>

## 6️⃣ Delete Jawaban Berdasarkan ID

Endpoint
```
DELETE /:id
```

**Deskripsi**
Menghapus satu jawaban berdasarkan ID.

```json
Response Sukses (200)
{
  "success": true,
  "message": "Jawaban berhasil dihapus"
}
```
```json
Response Tidak Ditemukan (404)

{
  "success": false,
  "message": "Data jawaban tidak ditemukan"
}
```

<a id="delete-jawaban-idtransact"></a>

## 7️⃣ Delete Semua Jawaban Berdasarkan ID Transaksi

Endpoint
```
DELETE /transact/:id_transact
```

**Deskripsi**
Menghapus seluruh jawaban yang terkait dengan satu transaksi.

Parameter URL

<table>
    <tbody>
        <th>Parameter</th>
        <th>Tipe</th>
        <th>Deskripsi</th>
        <tr>
            <td>id_transact</td>
            <td>number</td>
            <td>ID transaksi</td>
        </tr>
    </tbody>				
</table>

```json
Response Sukses (200)

{
  "success": true,
  "message": "Semua jawaban transaksi berhasil dihapus"
}
```