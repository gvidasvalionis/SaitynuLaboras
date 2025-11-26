# SaitynuLaboras

# Formulės 1 Strategijų Dalinimosi Platforma

## 1. Sprendžiamo uždavinio aprašymas

### 1.1 Sistemos paskirtis

Projekto tikslas – suteikti galimybę Formulė 1 fanams kurti savo lenktynių strategijas bei dalintis su kitais.

Veikimo principas – pačią kuriamą platformą sudaro dvi dalys:

- **Internetinė aplikacija** – ja naudosis svečiai, vartotojai ir administratoriai.
- **Aplikacijų programavimo sąsaja (API).**

Norėdamas naudotis šia platforma, F1 entuziastas prisijungs prie internetinės aplikacijos ir galės sudaryti asmeninius lenktynių strategijos planus. Vartotojas galės pasirinkti konkretų „Grand Prix“ (pvz. _Monza 2025_), komandą bei lenktynininką ir sukurti detalią strategiją: suplanuoti sustojimus, padangų pasirinkimus, degalų sąnaudos ar kitus lenktynių parametrus.

Vartotojai galės dalintis strategijomis tarpusavyje, analizuoti kitų sukurtus planus. Taip pat bus galimybė peržiūrėti kitų sukurtas strategijas.

Administratorius prižiūrės turinį – patvirtins viešam rodymui pateiktas strategijas, užtikrins kokybės kontrolę ir, esant poreikiui, galės šalinti netinkamą informaciją.

---

### 1.2 Funkciniai reikalavimai

**Neregistruotas sistemos vartotojas galės:**

1. Peržiūrėti platformos pradžios puslapį.
2. Prisijungti prie internetinės aplikacijos (užsiregistruoti).
3. Matyti paviešintas strategijas.

**Registruotas naudotojas galės:**

1. Atsijungti nuo platformos.
2. Prisijungti prie platformos.
3. Kurti savo F1 lenktynių strategijas:
   - Pasirinkti Grand Prix
   - Pasirinkti komandą
   - Pasirinkti lenktynininką
   - Suplanuoti strategijos detales
4. Pateikti strategiją viešam skelbimui.
5. Peržiūrėti kitų naudotojų paviešintas strategijas.

**Administratorius galės:**

1. Patvirtinti strategijas prieš jų viešą paskelbimą.
2. Šalinti šalinti strategijas.
3. Pridėti naujų komandų, lenktyninikų, Grand Prix.

---

## 2. Sistemos architektūra

**Sistemos sudedamosios dalys:**

- Kliento pusė (Front-End) – naudojant **React.js**
- Serverio pusė (Back-End) – naudojant **Python**
- Duomenų bazė – **MySQL**
- Talpinimas – **Azure VM**

Internetinė aplikacija yra pasiekiama per HTTP protokolą. Sistemos aplikacijų programavimo sąsaja sukurta naudojant Python, kuri vykdo duomenų mainus su MySQL – naudojama viena iš Python ORM bibliotekų (pvz. **SQLAlchemy**). Kliento pusė naudoja React.js ir bendrauja su API per HTTP užklausas.


### 2.1 UML Deployment Diagrama

```
┌─────────────────────────────────────────┐
│         Kliento naršyklė                │
│         (Web Browser)                   │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │    React.js + TypeScript          │  │
│  │    (Frontend Application)         │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                  │
                  │ HTTPS
                  ↓
┌─────────────────────────────────────────┐
│      Azure VM                           │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │    FastAPI Application            │  │
│  │    (Python Backend)               │  │
│  │                                   │  │
│  │  - Authentication                 │  │
│  │  - Business Logic                 │  │
│  │  - API Endpoints                  │  │
│  └───────────────────────────────────┘  │
│                  │                      │
│                  │ SQLAlchemy ORM       │
│                  ↓                      │
│  ┌───────────────────────────────────┐  │
│  │    MySQL Database                 │  │
│  │                                   │  │
│  │  - Users                          │  │
│  │  - Teams                          │  │
│  │  - Drivers                        │  │
│  │  - Grand Prix                     │  │
│  │  - Strategies                     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 2.2 Duomenų bazės schema

Pagrindinės lentelės:
- **users** - vartotojų informacija (id, username, email, password_hash, role, created_at)
- **teams** - F1 komandų informacija (id, name, country)
- **drivers** - lenktynininkų informacija (id, name, number, team_id)
- **grand_prix** - Grand Prix renginių informacija (id, name, location, date, year)
- **strategies** - strategijų informacija (id, name, description, parameters, approved, grand_prix_id, team_id, driver_id, user_id, created_at, updated_at)

## 4. API Specifikacija

### 4.1 Autentifikacija

Visos užklausos, kurioms reikalinga autentifikacija, turi naudoti JWT Bearer token:

```http
Authorization: Bearer <token>
```

### 4.2 Strategijų valdymas

#### 4.2.1 Gauti visas patvirtintas strategijas (Public)

**GET** `/api/strategies/public`

**Autentifikacija:** Nereikalinga

**Response Codes:**
- `200 OK` - Sėkmingai grąžintos strategijos

**Pavyzdys:**

```http
GET /api/strategies/public
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Monaco Conservative Strategy",
    "description": "Conservative approach for Monaco GP",
    "parameters": {...},
    "approved": true,
    "grand_prix_id": 7,
    "team_id": 1,
    "driver_id": 1,
    "user_id": 2
  }
]
```

#### 4.2.2 Gauti vartotojo visas strategijas

**GET** `/api/strategies/by-user-all`

**Autentifikacija:** Bearer token (User role)

**Response Codes:**
- `200 OK` - Sėkmingai grąžintos strategijos
- `401 Unauthorized` - Neautorizuotas

**Pavyzdys:**

```http
GET /api/strategies/by-user-all
Authorization: Bearer <user_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "My Strategy",
    "description": "Strategy description",
    "parameters": {...},
    "approved": false,
    "grand_prix_id": 1,
    "team_id": 1,
    "driver_id": 1,
    "user_id": 5
  }
]
```

#### 4.2.3 Gauti vartotojo strategijas pagal Grand Prix, lenktynininką

**GET** `/api/strategies/by-user`

**Query Parameters:**
- `grand_prix_id` (integer, required) - Grand Prix ID
- `driver_id` (integer, required) - Lenktynininko ID
- `user_id` (integer, required) - Vartotojo ID

**Autentifikacija:** Bearer token (User role)

**Response Codes:**
- `200 OK` - Sėkmingai grąžintos strategijos
- `401 Unauthorized` - Neautorizuotas
- `403 Forbidden` - Nepakanka teisių

**Pavyzdys:**

```http
GET /api/strategies/by-user?grand_prix_id=1&driver_id=2&user_id=5
Authorization: Bearer <user_token>
```

**Response:**
```json
[
  {
    "id": 15,
    "name": "Silverstone Aggressive",
    "description": "Two-stop strategy",
    "parameters": {...},
    "approved": true,
    "grand_prix_id": 1,
    "team_id": 2,
    "driver_id": 2,
    "user_id": 5
  }
]
```

#### 4.2.4 Sukurti naują strategiją

**POST** `/api/strategies/me`

**Autentifikacija:** Bearer token (User role)

**Request Body:**
```json
{
  "name": "Aggressive Two-Stop Strategy",
  "description": "Fast-paced strategy for Silverstone",
  "parameters": {
    "fuel_load": 105,
    "total_pit_stops": 2,
    "pit_stops": [
      {"lap": 18, "tire": "Medium", "fuel_added": 25.5},
      {"lap": 42, "tire": "Hard", "fuel_added": 20.0}
    ]
  },
  "grand_prix_id": 3,
  "team_id": 2,
  "driver_id": 3
}
```

**Response Codes:**
- `201 Created` - Strategija sėkmingai sukurta
- `400 Bad Request` - Neteisingi duomenys
- `401 Unauthorized` - Neautorizuotas

**Pavyzdys:**

```http
POST /api/strategies/me
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "name": "Monaco One-Stop",
  "description": "Conservative strategy",
  "parameters": {...},
  "grand_prix_id": 1,
  "team_id": 1,
  "driver_id": 1
}
```

**Response:**
```json
{
  "id": 20,
  "name": "Monaco One-Stop",
  "description": "Conservative strategy",
  "parameters": {...},
  "approved": false,
  "grand_prix_id": 1,
  "team_id": 1,
  "driver_id": 1,
  "user_id": 5
}
```

#### 4.2.5 Gauti konkrečią vartotojo strategiją

**GET** `/api/strategies/me/{strategy_id}`

**Path Parameters:**
- `strategy_id` (integer, required) - Strategijos ID

**Autentifikacija:** Bearer token (User role)

**Response Codes:**
- `200 OK` - Sėkmingai grąžinta strategija
- `401 Unauthorized` - Neautorizuotas
- `404 Not Found` - Strategija nerasta arba nepakanka teisių

**Pavyzdys:**

```http
GET /api/strategies/me/15
Authorization: Bearer <user_token>
```

**Response:**
```json
{
  "id": 15,
  "name": "My Strategy",
  "description": "Detailed description",
  "parameters": {...},
  "approved": true,
  "grand_prix_id": 1,
  "team_id": 1,
  "driver_id": 1,
  "user_id": 5
}
```

#### 4.2.6 Atnaujinti strategiją

**PUT** `/api/strategies/me/{strategy_id}`

**Path Parameters:**
- `strategy_id` (integer, required) - Strategijos ID

**Autentifikacija:** Bearer token (User role)

**Request Body:**
```json
{
  "name": "Updated Strategy Name",
  "description": "Updated description",
  "parameters": {...}
}
```

**Response Codes:**
- `200 OK` - Strategija atnaujinta
- `401 Unauthorized` - Neautorizuotas
- `404 Not Found` - Strategija nerasta

**Pavyzdys:**

```http
PUT /api/strategies/me/15
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "name": "Updated Monaco Strategy",
  "description": "Modified approach"
}
```

**Response:**
```json
{
  "id": 15,
  "name": "Updated Monaco Strategy",
  "description": "Modified approach",
  "parameters": {...},
  "approved": false,
  "grand_prix_id": 1,
  "team_id": 1,
  "driver_id": 1,
  "user_id": 5
}
```

#### 4.2.7 Ištrinti strategiją

**DELETE** `/api/strategies/me/{strategy_id}`

**Path Parameters:**
- `strategy_id` (integer, required) - Strategijos ID

**Autentifikacija:** Bearer token (User role)

**Response Codes:**
- `204 No Content` - Strategija ištrinta
- `401 Unauthorized` - Neautorizuotas
- `404 Not Found` - Strategija nerasta

**Pavyzdys:**

```http
DELETE /api/strategies/me/15
Authorization: Bearer <user_token>
```

**Response:**
```
204 No Content
```

### 4.3 Admin Strategijų Valdymas

#### 4.3.1 Gauti visas strategijas (Admin)

**GET** `/api/strategies/`

**Autentifikacija:** Bearer token (Admin role)

**Response Codes:**
- `200 OK` - Sėkmingai grąžintos strategijos
- `401 Unauthorized` - Neautorizuotas
- `403 Forbidden` - Nepakanka teisių

**Pavyzdys:**

```http
GET /api/strategies/
Authorization: Bearer <admin_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Strategy 1",
    "description": "Description",
    "parameters": {...},
    "approved": false,
    "grand_prix_id": 1,
    "team_id": 1,
    "driver_id": 1,
    "user_id": 5
  }
]
```

#### 4.3.2 Patvirtinti strategiją (Admin)

**PUT** `/api/strategies/{strategy_id}/approve`

**Path Parameters:**
- `strategy_id` (integer, required) - Strategijos ID

**Autentifikacija:** Bearer token (Admin role)

**Response Codes:**
- `200 OK` - Strategija patvirtinta
- `401 Unauthorized` - Neautorizuotas
- `403 Forbidden` - Nepakanka teisių
- `404 Not Found` - Strategija nerasta

**Pavyzdys:**

```http
PUT /api/strategies/15/approve
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "id": 15,
  "name": "Monaco Strategy",
  "description": "Description",
  "parameters": {...},
  "approved": true,
  "grand_prix_id": 1,
  "team_id": 1,
  "driver_id": 1,
  "user_id": 5
}
```

#### 4.3.3 Ištrinti bet kurią strategiją (Admin)

**DELETE** `/api/strategies/{strategy_id}`

**Path Parameters:**
- `strategy_id` (integer, required) - Strategijos ID

**Autentifikacija:** Bearer token (Admin role)

**Response Codes:**
- `204 No Content` - Strategija ištrinta
- `401 Unauthorized` - Neautorizuotas
- `403 Forbidden` - Nepakanka teisių
- `404 Not Found` - Strategija nerasta

**Pavyzdys:**

```http
DELETE /api/strategies/15
Authorization: Bearer <admin_token>
```

**Response:**
```
204 No Content
```

### 4.4 Klaidos atsakymai

Visos klaidos grąžinamos standartiniame formате:

```json
{
  "detail": "Error message describing what went wrong"
}
```

**Pagrindiniai klaidų kodai:**
- `400 Bad Request` - Neteisingi užklausos duomenys
- `401 Unauthorized` - Trūksta autentifikacijos arba neteisingas token
- `403 Forbidden` - Nepakanka teisių vykdyti veiksmą
- `404 Not Found` - Resursas nerastas
- `500 Internal Server Error` - Serverio klaida

## 5. Išvados

1. **Technologijų pasirinkimas**: Backend'ui naudojau Python su FastAPI, o frontend'ui – React.js. Toks derinys leido greitai sukurti tvarkingą ir patogiai plečiamą sistemą. FastAPI ypač patiko dėl aiškios dokumentacijos ir automatiškai generuojamos OpenAPI specifikacijos.

2. **Duomenų bazės schema**: Naudotas SQLAlchemy kartu su MySQL. SQLAlchemy yra vieba iš populiariausių ORM, kuri turi gerą dokumentaciją ir didelę bendruomenę. Nors ir nėra paprasčiausia naudoti, tačiau įgijus žinių tikrai jo funkcionalumas praverčia.

3. **Saugumo sprendimai**: Įdiegta rolėmis pagrįsta prieigos kontrolė (user/admin), užtikrinanti, kad tik autorizuoti vartotojai gali vykdyti tam tikrus veiksmus. JWT token'ų naudojimas užtikrina saugią autentifikaciją ir sesijų valdymą.

4. **API struktūra**: RESTful API principai užtikrina aiškią ir logišką endpoint'ų struktūrą, palengvinančią frontend'o integraciją. Kiekvienas endpoint'as turi aiškiai apibrėžtą paskirtį ir atitinka HTTP metodų semantiką.

5. **Administratoriaus funkcionalumas**: Strategijų patvirtinimo sistema leidžia kontroliuoti turinio kokybę prieš jį paskelbiant viešai. Tai užtikrina, kad platformoje būtų publikuojamos tik kokybiškos ir tinkamos strategijos.

6. **Deployment**: Azure VM buvo paprasčiausas ir pigiausias variantas kartu su Azure MySQL server. Juos taip pat lengvai galima scalinti, nors programų paleidimo etapai nėra paprasčiausi.

7. **Galimi patobulinimai**:
   - Įdiegti komentarų sistemą strategijoms
   - Pridėti strategijų reitingavimo funkciją
   - Pridėti notifikacijų sistemą, kai strategija yra patvirtinta/atmesta
   - Integruoti socialines funkcijas - galimybę sekti kitus vartotojus
   - Implementuoti strategijų eksportavimą PDF formatu

8. **Projekto rezultatai**: Sėkmingai sukurta MVP platforma, kuri leidžia F1 fanams dalintis ir valdyti lenktynių strategijas.

9. **Įgytos žinios**: Projekto metu buvo pagilinti praktiniai įgūdžiai dirbant su:
    - FastAPI framework'u ir Python
    - RESTful API projektavimu ir implementavimu
    - Reliacinių duomenų bazių projektavimu
    - JWT autentifikacija ir autorizacija
    - Cloud deployment'u (Azure VM)
---
