# 📖 CS2 Arbitrage Helper - Instrukcja Obsługi

## ✨ O aplikacji
Narzędzie do zarządzania i monitorowania inwestycji w skórki CS2 z automatycznymi kalkulacjami ROI, śledzeniem banów handlowych, wykrywaniem faz Dopplera i wielorynkowymi prowizjami.

---

## 📝 Spis Treści
1. [Dodawanie nowej skórki](#1-dodawanie-nowej-skórki)
2. [Fazy Doppler i Tier Case Hardened](#2-fazy-doppler-i-tier-case-hardened)
3. [Ban handlowy (TB)](#3-ban-handlowy-tb)
4. [Filtry i sortowanie](#4-filtry-i-sortowanie)
5. [Tryby cen i ROI](#5-tryby-cen-i-roi)
6. [Przycisk Price Check (Pricempire)](#6-przycisk-price-check-pricempire)
7. [Edycja i usuwanie przedmiotów](#7-edycja-i-usuwanie-przedmiotów)

---

## 1. Dodawanie nowej skórki

### Krok 1 - Wyszukiwanie skórki
1. Kliknij przycisk **`+ DODAJ PRZEDMIOT`**
2. W polu **Nazwa skórki** zacznij pisać nazwę broń lub skórki
3. System automatycznie wyświetli sugestie pasujących skórek
4. Wybierz pasującą skórkę z listy wyników
5. ✅ Jeśli skórka zostanie znaleziona, pojawi się podgląd obrazu i zielony potwierdzenie

> 💡 Wskazówka: Wpisz tylko **początek nazwy** (np. `bayonet doppler`) - system automatycznie wygeneruje pełną nazwę.

### Krok 2 - Szczegóły transakcji
Wypełnij pola:
| Pole | Opis |
|------|------|
| **Status** | Aktualny stan przedmiotu |
| **Kupno** | Gdzie kupiłeś skórkę |
| **Cena kupna** | Cena za jaką kupiłeś w USD |
| **Sprzedaż** | Gdzie będziesz sprzedawał |
| **Cena sprzedaży** | Cena za jaką sprzedajesz w USD |
| **Seed wzoru** | *(Opcjonalnie)* Numer wzoru do automatycznego wykrywania faz Dopplera i tierów |

> ✅ Dodatkowe pola pojawią się automatycznie:
> - Faza Doppler (dla skórek Doppler)
> - Tier Case Hardened (dla Case Hardened)

### Krok 3 - Dodaj przedmiot
Kliknij **DODAJ PRZEDMIOT** aby zapisać.

---

## 2. Fazy Doppler i Tier Case Hardened

System automatycznie wykrywa fazę Dopplera i Tier dla Case Hardened **bez dodatkowego wybierania**:

### ✅ Jak to działa:
1. Podaj **numer wzoru (seed)** podczas dodawania przedmiotu
2. System automatycznie rozpozna:
   - Faza Doppler (Phase 1/2/3/4, Black Pearl, Ruby, Sapphire, Emerald, Gamma)
   - Tier Case Hardened (Blue Gem, Purple, Gold, Silver, Tier 1-10)
3. Kolor i informacja o fazie zostaną automatycznie dodane

> 💡 Numer seed możesz sprawdzić w ekwipunku Steam na karcie skórki w sekcji "Pattern".

---

## 3. Ban handlowy (TB)

Każda nowa skórka ma domyślnie 7 dniowy ban handlowy. System:

✅ **Automatyczne odliczanie**:
- Liczy czas pozostały do końca bana
- Wyświetla kolorowy licznik na karcie przedmiotu
- Gdy ban się skończy: status zmienia się automatycznie na "Wolne"
- Po 14 dniach od zakończenia bana przedmiot zostanie automatycznie usunięty

| Kolor licznika | Znaczenie |
|----------------|-----------|
| 🟢 Zielony | Więcej niż 3 dni pozostało |
| 🟡 Żółty | 1-3 dni pozostało |
| 🔴 Czerwony | Mniej niż 24 godziny |

---

## 4. Filtry i sortowanie

### 📊 Dostępne filtry:
| Filtr | Działanie |
|-------|-----------|
| **Typ** | Filtruj po typie przedmiotu (Nóż, Rękawice, Karabin itd.) |
| **Status** | Filtruj po statusie: Kupione / Wolne / Wystawione / Sprzedane |
| **StatTrak™** | Pokaż tylko skórki StatTrak |
| **Souvenir** | Pokaż tylko skórki Souvenir |

### 📈 Sortowanie:
| Tryb | Opis |
|------|------|
| **TB ↓** | Od najdłuższego do najkrótszego czasu do końca bana |
| **TB ↑** | Od najkrótszego do najdłuższego czasu do końca bana |
| **Cena ↓** | Od najdroższych do najtańszych |
| **Cena ↑** | Od najtańszych do najdroższych |
| **ROI ↓** | Od największego zysku do największej straty |
| **ROI ↑** | Od największej straty do największego zysku |

---

## 5. Tryby cen i ROI

### 🎯 Przełączanie trybów:
Na karcie każdego przedmiotu możesz przełączać się między trybem **Cena** a trybem **ROI**:

| Tryb | Wartości |
|------|----------|
| 🟦 **Cena** | Wyświetla kwoty w dolarach: cena kupna, cena sprzedaży, zysk |
| 🟪 **ROI** | Wyświetla procentowe wskaźniki: % zysku, wartość inwestycji |

### 🔢 Kalkulacje:
✅ Wszystkie obliczenia uwzględniają:
- Prowizje poszczególnych rynków
- Koszty wypłat
- Opłaty transakcyjne
- Podatek dochodowy *(jeśli ustawiony)*

---

## 6. Przycisk Price Check (Pricempire)

Każdy przedmiot ma niebieski przycisk **`Price Check`** który przekierowuje bezpośrednio na stronę Pricempire z poprawnie sformatowanym adresem URL:

✅ Obsługiwane formaty:
- Broń: `https://pricempire.com/cs2-items/skin/weapon-name-pattern`
- Nóż: `https://pricempire.com/cs2-items/skin/knife-name-pattern`
- Rękawice: `https://pricempire.com/cs2-items/glove/glove-name-pattern`
- Warianty chińskie: `弐`, `灣`, `貳`, `二` automatycznie mapowane na "-2"
- Warianty `壱` bez dodatkowego sufiksu

---

## 7. Edycja i usuwanie przedmiotów

### ✏️ Edycja:
Kliknij dowolną wartość na karcie przedmiotu aby ją edytować:
- Kliknij cenę aby ją zmienić
- Kliknij rynek kupna/sprzedaży aby go zmienić
- Kliknij status aby go zmienić
- Wszystkie zmiany są zapisywane automatycznie

### 🗑️ Usuwanie:
Kliknij czerwony przycisk **X** w prawym górnym rogu karty przedmiotu.

---

## 🛠️ Dodatkowe funkcje

1. **Automatyczne zapisywanie**: Wszystkie dane są zapisywane w Twojej przeglądarce
2. **Tryb ciemny**: Wbudowany nowoczesny motyw ciemny
3. **Responsywny design**: Działa na telefonie, tablecie i komputerze
4. **Statystyki**: Na górze strony wyświetlane są podsumowania całkowitego portfolio

---

## 💡 Wskazówki pro tip:

1. Zawsze podawaj numer wzoru dla skórek Doppler i Case Hardened - system automatycznie wygeneruje poprawną fazę
2. Używaj filtra `ROI ↓` aby zobaczyć które inwestycje przynoszą największy zysk
3. Obserwuj licznik TB czerwony - to oznacza że ban skończy się w ciągu 24 godzin

> Jeśli masz pytania lub propozycje nowych funkcji, daj znać!
