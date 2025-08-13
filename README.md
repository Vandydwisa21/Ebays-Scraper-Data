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
    "total": 5,
    "products": [
        {
            "title": "Shop on eBay",
            "price": "$20.00",
            "link": "https://ebay.com/itm/123456?itmmeta=012DEW30YG0MEEKND7NH&hash=item123546:g:acwAA9KNiJowH:sc:ShippingMethodStandard!95008!US!-1&itmprp=enc%3AbgepL1tlUHjMGCVfSTGJh%2BzsVKeJ3CQk7NizDI4BZeppuFnmyS6Ijyp8lh%2FnEw%2BWqO7uTV1Q6izE1R0T54aV8j71F4xlWfVcGft4%2FiOQhtqVXA1rW6M1atPARQRmhqUxtEPJKhKtSFgI%2Bvwlzb0GwVCtkp%3ABlBMUObkmabpYw",
            "description": "CNN.com will feature iReporter photos in a weekly Travel Snapshots gallery. Please submit your best shots of the U.S. for next week. Visit CNN.com/Travel next Wednesday for a new gallery of snapshots. For the latest, go to CNN iReport.com.",
            "itemNumber": "-"
        },
        {
            "title": "Shop on eBay",
            "price": "$20.00",
            "link": "https://ebay.com/itm/123456?itmmeta=012DEW30YG0MEEKND7NH&hash=item123546:g:acwAA9KNiJowH:sc:ShippingMethodStandard!95008!US!-1&itmprp=enc%3AbgepL1tlUHjMGCVfSTGJh%2BzsVKeJ3CQk7NizDI4BZeppuFnmyS6Ijyp8lh%2FnEw%2BWqO7uTV1Q6izE1R0T54aV8j71F4xlWfVcGft4%2FiOQhtqVXA1rW6M1atPARQRmhqUxtEPJKhKtSFgI%2Bvwlzb0GwVCtkp%3ABlBMUObkmabpYw",
            "description": "CNN.com will feature iReporter photos in a weekly Travel Snapshots gallery. Please submit your best shots of the U.S. for next week. Visit CNN.com/Travel next Wednesday for a new gallery of snapshots. For the latest, go to CNN iReport.com.",
            "itemNumber": "-"
        },
        {
            "title": "New Nike Travis Scott x Air Max 270 React ENG Cactus Trails Size 10.5 Mens TS",
            "price": "$319.99",
            "link": "https://www.ebay.com/itm/326292226350?_skw=nike+shoes&epid=26039819473&itmmeta=01K2FCZQ4TVDZ1V3JA2J8CXMNZ&hash=item4bf888412e:g:VuEAAOSwkb5m~snB&itmprp=enc%3AAQAKAAAAwFkggFvd1GGDu0w3yXCmi1dCqdg2BcJ8EY81hbm6Yoxv247voVwbZ8ljJOW07%2BnOFy1g23GFldAJu05Ih4SzivDXRW1cHT16MwPor5zqQX5H%2BkES1IF5ssNNbJzg7WDHV%2Fb3Td9IHY7%2BRrWBS%2BZi0DchWaq%2F9KwCffUC2k7taG75Rl8Yt32%2F66nmu0KAgTGV7gv5%2BlfCStTi8z%2BHUW1PpSqXMEMchxJ2SAZusAQF2%2FnFtHnACGruYIcbWXT421lkog%3D%3D%7Ctkp%3ABlBMUM7y_uyTZg",
            "description": "A brand-new, unused, and unworn item (including handmade items) in the original ... Read more about the condition about the Nike Air Max 270 React. The shoe is available in black and white, and comes in at a range of sizes. It is not available in any other colors.",
            "itemNumber": "326292226350"
        },
        {
            "title": "Nike Air Max Command Mens US Size 7-15 Black/White Running Casual Shoes NEW✅",
            "price": "$87.89",
            "link": "https://www.ebay.com/itm/225272243923?_skw=nike+shoes&epid=26058781072&itmmeta=01K2FCZQ4T88MQNFEXCEGE8FMG&hash=item347345a6d3:g:JXwAAOSwVKBjhHtE&itmprp=enc%3AAQAKAAAA8FkggFvd1GGDu0w3yXCmi1eSaG89%2Fh2sh%2FzxbNqvL3mUCnbPm66F9bSDSB9Il3sXMpXULHzq2jTxmHprB9p4JbJSxfBB%2B9uPAVrbFT%2BxH1H9AsZlVMRvJReOkhfQmB4Wfg4HpzEHSvpQB2VmGT06GJxFvd7N78yYX941ikkkrXGlDUSDk7ai0RcjhyEpAXnQMARRTnWORmHU21WxgDYNefD%2FV4nbFIbBKjwVPEQtcBOi%2BNTwYXqbj%2BOwlvUkp5JpSz6gdg%2B%2FSfT0JIUcf5eTu4%2FCyZzocEI34T%2BW20rJ%2BNf%2BBoCmft6JywvgFnnL9bNa8A%3D%3D%7Ctkp%3ABk9SR87y_uyTZg",
            "description": "New with box: A brand-new, unused, and unworn item (including handmade items) in the original ... Read more about the condition. Item specifics: The condition of the item, its dimensions, its release date and more. The product line: Nike Air Max.",
            "itemNumber": "225272243923"
        },
        {
            "title": "Nike Dunk Low Retro SE Armory Navy Gum Men Casual Shoes Sneakers HQ1931-400",
            "price": "$119.99",
            "link": "https://www.ebay.com/itm/316018494491?_skw=nike+shoes&epid=10072263485&itmmeta=01K2FCZQ4TM90JTRKHC1AZR08X&hash=item49942b8c1b:g:gh8AAOSw0FNnTRpL&itmprp=enc%3AAQAKAAAA8FkggFvd1GGDu0w3yXCmi1ckICdWEhuuiANt28ZlAhJpdyTmWpDSzkYVQM5C0Rq3My%2BjXz%2BUsmH7X5deDolBNR27fJ7LjzpfghE%2B5BKdAlxh0Hz55IU7kRzj%2FqjnOhv3Vxee2PHIKLZjzm3ydq5A94ZrjwSwVXtDPBDRuUkCh9t7TQks2mZhtjBbrQljvRjtGDtbYam24MyNKD5fNgb9kde2c1SE5jvhrr96Trpuyr%2Fi%2FMSsdh9y9wZdSXbt4hk0JIS%2FFb5OrB%2FkYDTtXuarlJJy9Z9lAypidRKnlvu3zQX4r8XgHZ4WwtqdjvbIKJ%2FBiA%3D%3D%7Ctkp%3ABk9SR87y_uyTZg",
            "description": "A brand-new, unused, and unworn item (including handmade items) in the original box. US Shoe Size (Baby & Toddler) is 2c ~ 10c. The shoe's size (Youth) is 10c ~ Us 7y.",
            "itemNumber": "316018494491"
        }
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

**⚠️ Disclaimer**: Tool ini dibuat untuk tujuan edukasi. Pastikan untuk mematuhi terms of service eBay dan menggunakan secara bertanggung jawab.
