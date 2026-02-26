# Document de Cerințe pentru Corectarea Bug-ului

## Introducere

Calendarul din dashboard-ul admin și client afișează în prezent prea multe informații în fiecare celulă de zi (nume complet client, detalii cont, tip plată, sumă), făcând calendarul aglomerat și greu de citit. Această problemă afectează experiența utilizatorului și reduce utilitatea calendarului ca instrument de vizualizare rapidă.

Bug-ul se manifestă în:
- `admin/dashboard.html` - calendarul din dashboard-ul administratorului
- `client/dashboard.html` - calendarul din dashboard-ul clientului
- `js/calendar.js` - logica de randare a calendarului
- `css/calendar.css` - stilizarea calendarului

## Analiza Bug-ului

### Comportament Curent (Defect)

1.1 CÂND calendarul randează o zi cu plăți recurente ATUNCI sistemul afișează în celula zilei: iconița platformei, numele complet al clientului, numele contului, tipul plății și suma

1.2 CÂND există mai multe plăți într-o zi ATUNCI sistemul afișează toate detaliile pentru fiecare plată în celula zilei, creând aglomerare vizuală

1.3 CÂND utilizatorul privește calendarul ATUNCI informațiile excesive din fiecare celulă fac dificilă scanarea rapidă a lunii

### Comportament Așteptat (Corect)

2.1 CÂND calendarul randează o zi cu plăți recurente ATUNCI sistemul TREBUIE SĂ afișeze în celula zilei doar: numele contului și suma totală

2.2 CÂND utilizatorul dă click pe o zi cu plăți ATUNCI sistemul TREBUIE SĂ deschidă un popup cu informațiile complete despre toate plățile din acea zi (iconița platformei, nume client, nume cont, tip plată, sumă pentru fiecare plată)

2.3 CÂND popup-ul este deschis ATUNCI sistemul TREBUIE SĂ afișeze: data formatată, lista completă de plăți cu toate detaliile, și suma totală pentru ziua respectivă

2.4 CÂND utilizatorul dă click în afara popup-ului sau pe butonul de închidere ATUNCI sistemul TREBUIE SĂ închidă popup-ul

### Comportament Neschimbat (Prevenirea Regresiilor)

3.1 CÂND calendarul randează zilele fără plăți ATUNCI sistemul TREBUIE SĂ CONTINUE SĂ afișeze celule goale fără informații

3.2 CÂND utilizatorul navighează între luni folosind butoanele de navigare ATUNCI sistemul TREBUIE SĂ CONTINUE SĂ actualizeze calendarul corect

3.3 CÂND calendarul marchează ziua curentă ATUNCI sistemul TREBUIE SĂ CONTINUE SĂ aplice stilizarea specială pentru ziua de azi

3.4 CÂND calendarul afișează tooltip-ul la hover ATUNCI sistemul TREBUIE SĂ CONTINUE SĂ funcționeze (sau poate fi eliminat în favoarea popup-ului la click)

3.5 CÂND există un popup `paymentDetailsPopup` deja implementat în HTML ATUNCI sistemul TREBUIE SĂ CONTINUE SĂ utilizeze această structură existentă

3.6 CÂND calendarul este randat în `client/dashboard.html` ATUNCI sistemul TREBUIE SĂ CONTINUE SĂ funcționeze identic cu versiunea din admin
