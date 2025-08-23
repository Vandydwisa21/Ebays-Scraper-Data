# eBay Scraper API 🛒

Sebuah REST API yang dapat melakukan scraping produk dari eBay dengan dukungan AI untuk membersihkan deskripsi produk menggunakan Hugging Face.

## ✨ Fitur

- 🔍 **Pencarian Produk**: Scraping produk eBay berdasarkan keyword
- 🤖 **AI Integration**: Pembersihan deskripsi produk menggunakan Hugging Face AI (opsional)
- 🍪 **Cookie Management**: Sistem cookie otomatis untuk menghindari blocking
- 🎭 **User Agent Rotation**: Rotasi user agent untuk stealth scraping
- 📊 **Detail Produk**: Mengambil title, price, link, description, dan item number
- ⚡ **RESTful API**: Endpoint yang mudah digunakan

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Puppeteer** - Web scraping dan browser automation
- **Axios** - HTTP client untuk API calls
- **Hugging Face** - AI model untuk text summarization
- **dotenv** - Environment variable management

## 📋 Prerequisites

Pastikan Anda sudah menginstall:
- Node.js (versi 16 atau lebih baru)
- npm atau yarn
- Git

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd ebays-scraper-data
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` dari template yang tersedia:

```bash
cp .env.example .env
```

Edit file `.env` dan isi dengan konfigurasi Anda:

```env
PORT=3000
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

#### Mendapatkan Hugging Face API Key:

1. Kunjungi [Hugging Face](https://huggingface.co/)
2. Daftar/login ke akun Anda
3. Pergi ke [Settings > Access Tokens](https://huggingface.co/settings/tokens)
4. Buat token baru dengan permission "Read"
5. Copy token dan paste ke file `.env`

### 4. Jalankan Aplikasi

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📖 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Health Check
```http
GET /
```

**Response:**
```json
"✅ eBay Scraper API is running. Use /search?keyword=YOUR_KEYWORD"
```

#### 2. Search Products
```http
GET /search?keyword={keyword}&aiProvider={provider}&model={model}&limit={limit}
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `keyword` | string | ✅ Yes | - | Kata kunci pencarian produk |
| `aiProvider` | string | ❌ No | `null` | Provider AI untuk cleaning deskripsi (`huggingface`) |
| `model` | string | ❌ No | `facebook/bart-large-cnn` | Model AI yang digunakan |
| `limit` | integer | ❌ No | `5` | Jumlah maksimal produk yang diambil |

**Example Request:**
```bash
# Tanpa AI
curl "http://localhost:3000/search?keyword=nike+shoes&limit=5"

# Dengan AI
curl "http://localhost:3000/search?keyword=nike+shoes&aiProvider=huggingface&model=facebook/bart-large-cnn&limit=5"
```

**Example Response:**
```json
{
    "keyword": "nike shoes",
    "total": ,
    "products": [
        {
            "title": " ",
            "price": " ",
            "link": " ",
            "description": " ",
            "itemNumber": " "
        },
    ]
}
```

## 🧪 Testing API

### 1. Menggunakan cURL

#### Test Health Check:
```bash
curl http://localhost:3000/
```

#### Test Search (Tanpa AI):
```bash
curl "http://localhost:3000/search?keyword=nike+shoes&limit=5"
```

#### Test Search (Dengan AI):
```bash
curl "http://localhost:3000/search?keyword=nike+shoes&aiProvider=huggingface&model=facebook/bart-large-cnn&limit=5"
```

### 2. Menggunakan Postman

1. **Import Collection**: Buat collection baru di Postman
2. **Add Requests**:
   
   **Health Check:**
   - Method: `GET`
   - URL: `http://localhost:3000/`
   
   **Search Products:**
   - Method: `GET`
   - URL: `http://localhost:3000/search`
   - Params:
     - `keyword`: `nike shoes`
     - `limit`: `5`
     - `aiProvider`: `huggingface` (opsional)

### 3. Menggunakan Browser

Buka browser dan akses:
```
http://localhost:3000/search?keyword=nike+shoes&limit=5
```

## ⚙️ Konfigurasi

### AI Models yang Didukung

Default menggunakan `facebook/bart-large-cnn`, namun Anda bisa menggunakan model lain seperti:
- `facebook/bart-large-cnn` (Recommended)

### Limit Scraping

- **Default**: 5 produk per request
- **Maximum**: Disarankan tidak lebih dari 20 untuk performa optimal
- **Timeout**: 90 detik per request

## 📝 Development

### Project Structure
```
ebays-scraper-data/
├── src/
│   ├── app.js          # Main Express application
│   ├── scraper.js      # Puppeteer scraping logic
│   └── utils.js        # AI utilities
├── .env.example        # Environment template
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies
└── README.md           # Documentation
```

### Running in Development Mode

Untuk development dengan auto-reload, install nodemon:
```bash
npm install -g nodemon
nodemon src/app.js
```

