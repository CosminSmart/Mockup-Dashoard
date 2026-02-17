# Simplified Client Finance Interface - Requirements

## 1. Overview
Simplificare radicală a interfeței de finance pentru clienți începători, eliminând complexitatea tehnică și focusându-se pe acțiuni simple și clare.

## 2. User Stories

### 2.1 Client Începător
**Ca** client începător  
**Vreau** să pot adăuga bani și să îi folosesc pentru campanii  
**Fără** să înțeleg concepte tehnice (wallets, vaults, allocations)

### 2.2 Vizualizare Simplă
**Ca** client  
**Vreau** să văd clar câți bani am disponibili  
**Pentru** a ști dacă pot lansa campanii

### 2.3 Acțiuni Simple
**Ca** client  
**Vreau** butoane clare pentru acțiuni frecvente  
**Fără** să navighez prin multiple tab-uri și sub-tab-uri

## 3. Acceptance Criteria

### 3.1 Interfață Simplificată
- [ ] Un singur KPI principal vizibil: "Bani Disponibili"
- [ ] Maximum 2-3 acțiuni principale vizibile
- [ ] Fără termeni tehnici (wallet, vault, allocation)
- [ ] Limbaj natural: "Adaugă bani", "Folosește pentru campanie"

### 3.2 Adăugare Bani (Topup)
- [ ] Un singur buton mare: "Adaugă Bani"
- [ ] Form simplu: Amount + Upload dovadă
- [ ] Preview clar: "Vei avea X lei după aprobare"
- [ ] Status vizibil: "În așteptare" / "Aprobat" / "Respins"

### 3.3 Folosire Bani
- [ ] Buton: "Folosește pentru Campanie"
- [ ] Selectare platformă (Facebook/Google/TikTok) cu iconițe
- [ ] Input amount cu validare live
- [ ] Preview: "Rămân X lei disponibili"

### 3.4 Istoric Simplificat
- [ ] Tabel simplu: Dată | Acțiune | Sumă | Status
- [ ] Filtre minime: Ultimele 30 zile / Toate
- [ ] Culori intuitive: Verde (adăugat), Roșu (folosit), Galben (în așteptare)

### 3.5 Ghidare Vizuală
- [ ] Tooltips explicative pentru fiecare acțiune
- [ ] Empty states cu sugestii: "Începe prin a adăuga bani"
- [ ] Mesaje de eroare clare: "Nu ai suficienți bani. Adaugă X lei."
- [ ] Progress indicators pentru acțiuni multi-step

### 3.6 Mobile-First
- [ ] Design responsive pentru telefon
- [ ] Butoane mari, ușor de apăsat
- [ ] Font size minim 16px pentru inputs
- [ ] Spacing generos între elemente

## 4. Concepte Ascunse (Backend)
Acestea rămân în backend dar NU sunt expuse clientului:
- Main Wallet
- Platform Vault
- General/Individual Balance
- Allocation flows
- Fee calculations (se arată doar suma finală)

## 5. Limbaj Simplificat

### Înainte → După
- "Main Wallet" → "Banii Tăi"
- "Platform Vault" → (ascuns)
- "Allocate to Individual Balance" → "Folosește pentru Campanie"
- "Topup Request" → "Adaugă Bani"
- "Approved/Pending/Declined" → "✓ Aprobat / ⏳ În așteptare / ✗ Respins"
- "Transfer from Main to Vault" → (ascuns - se face automat)

## 6. Fluxuri Simplificate

### 6.1 Flux Adăugare Bani
```
1. Click "Adaugă Bani" (buton mare, verde)
2. Completează:
   - Cât vrei să adaugi? [____] lei
   - Încarcă dovada plății [Upload]
   - (Optional) Notă [____]
3. Preview: "Vei avea X lei după aprobare"
4. Click "Trimite Cerere"
5. Confirmare: "✓ Cererea ta a fost trimisă. Vei fi notificat când e aprobată."
```

### 6.2 Flux Folosire Bani
```
1. Click "Folosește pentru Campanie"
2. Alege platforma:
   [📘 Facebook] [🔍 Google] [🎵 TikTok]
3. Cât vrei să folosești? [____] lei
   Hint: "Ai X lei disponibili"
4. Preview: "După această acțiune vei avea Y lei rămași"
5. Click "Confirmă"
6. Success: "✓ X lei au fost alocați pentru campanii Facebook"
```

## 7. Prioritizare Informații

### Nivel 1 (Mereu vizibil)
- Bani disponibili (număr mare, bold)
- Buton "Adaugă Bani"
- Buton "Folosește pentru Campanie"

### Nivel 2 (Vizibil dar secundar)
- Bani în așteptare de aprobare
- Ultimele 3 tranzacții

### Nivel 3 (Ascuns în "Vezi mai mult")
- Istoric complet
- Statistici detaliate
- Export date

## 8. Protecții și Validări

### 8.1 Validări Friendly
- ❌ "Insufficient funds" → ✓ "Nu ai suficienți bani. Adaugă cel puțin X lei."
- ❌ "Invalid amount" → ✓ "Te rog introdu o sumă între 10 și 10,000 lei"
- ❌ "Transfer failed" → ✓ "Ceva nu a mers bine. Încearcă din nou sau contactează suportul."

### 8.2 Confirmări Clare
- Înainte de orice acțiune: preview cu impact
- Confirmări cu checkbox: "☑ Confirm că vreau să folosesc X lei pentru campanii Facebook"
- Undo pentru acțiuni recente (dacă posibil)

## 9. Success Metrics
- Timp mediu pentru a adăuga bani: < 2 minute
- Rata de eroare utilizator: < 5%
- Satisfacție utilizator (survey): > 4/5
- Reducere întrebări suport: -50%

## 10. Out of Scope (v1)
- Transfer între platforme
- Setări avansate de fees
- Rapoarte complexe
- Automatizări
- Multi-currency

## 11. Technical Notes
- Backend rămâne același (Main → Vault → Balance → Account)
- Frontend abstractizează complexitatea
- Toate transferurile interne se fac automat
- Client vede doar: Adaugă → Folosește
