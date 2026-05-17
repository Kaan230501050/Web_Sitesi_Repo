# API Test Komutları

## 1. Kayıt Testi
```bash
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Test User","email":"test@test.com","password":"123456"}'
```
Beklenen: `{"message":"Kayıt başarılı"}`

## 2. Giriş Testi
```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"test@test.com","password":"123456"}'
```
Beklenen: `{"token":"...","name":"Test User"}`

## 3. Ürünleri Listeleme Testi
```bash
curl http://localhost:3000/api/products
```
Beklenen: Ürün listesi JSON olarak gelir

## 4. Yetkisiz Ürün Ekleme Testi
```bash
curl -X POST http://localhost:3000/api/products \
-H "Content-Type: application/json" \
-d '{"name":"Test Ürün","price":100,"stock":5,"category":"Test"}'
```
Beklenen: `{"message":"Token gerekli"}`

## 5. Yetkili Ürün Ekleme Testi
```bash
curl -X POST http://localhost:3000/api/products \
-H "Content-Type: application/json" \
-H "Authorization: Bearer TOKEN_BURAYA" \
-d '{"name":"Test Ürün","price":100,"stock":5,"category":"Test"}'
```
Beklenen: `{"message":"Ürün eklendi"}`

## 6. Sipariş Testi
```bash
curl -X POST http://localhost:3000/api/orders \
-H "Content-Type: application/json" \
-H "Authorization: Bearer TOKEN_BURAYA" \
-d '{"items":[{"productId":"URUN_ID","quantity":1}]}'
```
Beklenen: `{"message":"Sipariş oluşturuldu"}`