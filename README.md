# SaitynuLaboras

# Formulės 1 Strategijų Dalinimosi Platforma

## 1. Sprendžiamo uždavinio aprašymas

### 1.1 Sistemos paskirtis

Projekto tikslas – suteikti galimybę Formulė 1 fanams kurti savo lenktynių strategijas bei dalintis su kitais.

Veikimo principas – pačią kuriamą platformą sudaro dvi dalys:

- **Internetinė aplikacija** – ja naudosis svečiai, vartotojai ir administratoriai.
- **Aplikacijų programavimo sąsaja (API).**

Norėdamas naudotis šia platforma, F1 entuziastas prisijungs prie internetinės aplikacijos ir galės sudaryti asmeninius lenktynių strategijos planus. Vartotojas galės pasirinkti konkretų „Grand Prix“ (pvz. _Monza 2025_), komandą bei lenktynininką ir sukurti detalią strategiją: suplanuoti sustojimus, padangų pasirinkimus, degalų sąnaudos ar kitus lenktynių parametrus.

Vartotojai galės dalintis strategijomis tarpusavyje, komentuoti ir analizuoti kitų sukurtus planus. Taip pat bus galimybė peržiūrėti kitų strategų profilius ir matyti jų sukurtas strategijas.

Administratorius prižiūrės turinį – patvirtins viešam rodymui pateiktas strategijas, užtikrins kokybės kontrolę ir, esant poreikiui, galės šalinti netinkamą informaciją.

---

### 1.2 Funkciniai reikalavimai

**Neregistruotas sistemos vartotojas galės:**

1. Peržiūrėti platformos pradžios puslapį.
2. Prisijungti prie internetinės aplikacijos (užsiregistruoti).

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
6. Komentuoti ir vertinti (reitinguoti) kitų naudotojų sukurtas strategijas.
7. Peržiūrėti strategijos autoriaus profilį (jo kitas sukurtas strategijas).

**Administratorius galės:**

1. Patvirtinti strategijas prieš jų viešą paskelbimą.
2. Šalinti naudotojus.
3. Šalinti turinį neatitinkantį/pažeidžiantį reikalavimus.

---

## 2. Sistemos architektūra

**Sistemos sudedamosios dalys:**

- Kliento pusė (Front-End) – naudojant **React.js**
- Serverio pusė (Back-End) – naudojant **Python**
- Duomenų bazė – **MySQL**
- Talpinimas – **DigitalOcean**

Internetinė aplikacija yra pasiekiama per HTTP protokolą. Sistemos aplikacijų programavimo sąsaja sukurta naudojant Python, kuri vykdo duomenų mainus su MySQL – naudojama viena iš Python ORM bibliotekų (pvz. **SQLAlchemy**). Kliento pusė naudoja React.js ir bendrauja su API per HTTP užklausas.

---
