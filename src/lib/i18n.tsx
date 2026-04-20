"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type Lang = "pl" | "en" | "zh" | "ru";

type TranslationKeys = {
  // Login
  subtitle: string;
  login: string;
  createAccount: string;
  username: string;
  password: string;
  rememberMe: string;
  signIn: string;
  register: string;
  noAccount: string;
  hasAccount: string;
  enterCredentials: string;
  userExists: string;
  invalidCredentials: string;
  loginError: string;

  // Header / Stats
  items: string;
  invested: string;
  profit: string;
  targetProfit: string;

  // Toolbar
  searchPlaceholder: string;
  filters: string;
  add: string;
  close: string;
  allItems: string;

  // Filter labels
  category: string;
  model: string;
  status: string;
  reset: string;

  // Statuses
  kupione: string;
  wolne: string;
  wystawiony: string;
  sprzedane: string;

  // Sort
  priceDesc: string;
  priceAsc: string;

  // Add form
  skinName: string;
  searchSkin: string;
  searching: string;
  clear: string;
  found: string;
  weaponModels: string;
  details: string;
  buyMarket: string;
  buyPrice: string;
  sellMarket: string;
  sellPrice: string;
  patternSeed: string;
  roiPreview: string;
  addItem: string;
  cancel: string;
  fillRequired: string;

  // Empty state
  noItems: string;
  noItemsHint: string;

  // Card
  deleteItem: string;
  deleteConfirm: string;
  delete: string;
  buy: string;
  sell: string;
  sold: string;
  sellFor: string;
  targetSell: string;
  list: string;
  markSold: string;
  readyToRemove: string;

  // Profile
  profile: string;
  localAccount: string;
  statistics: string;
  allTime: string;
  soldCount: string;
  itemStatus: string;
  history: string;
  viewAll: string;
  noHistory: string;
  added: string;
  removed: string;
  logout: string;

  // Market Info
  marketInfo: string;
  back: string;
  prices: string;
  trends: string;
  calculator: string;
  comingSoon: string;
  markets: string;
  sellFee: string;
  buyFee: string;
  depositFee: string;
  withdrawFee: string;

  // Calculator
  calculateProfit: string;
  buyPriceCalc: string;
  sellPriceCalc: string;
  selectMarket: string;
  netProfit: string;
  fees: string;
  compareMarkets: string;

  // Prices
  searchSkins: string;
  noSkinsFound: string;

  // Trends
  priceHistory: string;

  // Countdown
  hours: string;
  minutes: string;

  // Help Modal
  helpTitle: string;
  addingSkins: string;
  dopplerPhasesAndTiers: string;
  tradeBan: string;
  usefulFeatures: string;
  iUnderstand: string;
  fullInstructions: string;
  clickAddItem: string;
  enterSkinName: string;
  fillPrices: string;
  enterSeed: string;
  systemDetects: string;
  seedFromSteam: string;
  phaseInfo: string;
  defaultSevenDays: string;
  counterCountsDown: string;
  whenEndsStatus: string;
  priceCheckButton: string;
  clickToEdit: string;
  useFilters: string;
  switchMode: string;
  skip: string;
  next: string;
  letsGo: string;

  // Import
  importFromSteam: string;
  importPlaceholder: string;
  fetchInventory: string;
  importAll: string;
  loading: string;

  // Skin Detail Page
  lowestPrice: string;
  averagePrice: string;
  availableMarkets: string;
  market: string;
  fee: string;
  afterFee: string;
  difference: string;
  lowest: string;
  loadingPrices: string;
  pricesAutoUpdate: string;
  pricesUpdated: string;

  // Tutorial
  welcomeTitle: string;
  welcomeContent: string;
  addingSkinsTitle: string;
  addingSkinsContent: string;
  searchTitle: string;
  searchContent: string;
  fillPricesTitle: string;
  fillPricesContent: string;
  readyTitle: string;
  readyContent: string;

  // Misc
  or: string;
  steamLogin: string;
  roi: string;
  price: string;
  tb: string;
  pattern: string;
  sortByTBDesc: string;
  sortByTBAsc: string;
  priceCheck: string;
  statTrak: string;
  souvenir: string;
};

const pl: TranslationKeys = {
  subtitle: "śledź swoje inwestycje CS2",
  login: "Zaloguj się",
  createAccount: "Utwórz konto",
  username: "Nazwa użytkownika",
  password: "Hasło",
  rememberMe: "Zapamiętaj mnie",
  signIn: "Zaloguj",
  register: "Zarejestruj",
  noAccount: "Nie masz konta? Zarejestruj się",
  hasAccount: "Masz konto? Zaloguj się",
  enterCredentials: "Wpisz login i hasło.",
  userExists: "Taki użytkownik już istnieje!",
  invalidCredentials: "Nieprawidłowy login lub hasło!",
  loginError: "Błąd logowania: ",

  items: "Przedmioty",
  invested: "Zainwestowane",
  profit: "Zysk",
  targetProfit: "Zysk docelowy",

  searchPlaceholder: "Szukaj po nazwie, kategorii, markecie, cenie...",
  filters: "Filtry",
  add: "Dodaj",
  close: "Zamknij",
  allItems: "All Items",

  category: "Kategoria",
  model: "Model",
  status: "Status",
  reset: "Reset",

  kupione: "Kupione",
  wolne: "Wolne",
  wystawiony: "Wystawione",
  sprzedane: "Sprzedane",

  priceDesc: "Cena ↓",
  priceAsc: "Cena ↑",

  skinName: "Nazwa skina",
  searchSkin: "Wpisz nazwę skina (np. AK-47 | Redline)",
  searching: "szukam\u2026",
  clear: "✕ wyczyść",
  found: "Znaleziono",
  weaponModels: "Modele broni",
  details: "Szczegóły",
  buyMarket: "Market kupna",
  buyPrice: "Cena kupna ($)",
  sellMarket: "Market sprzedaży",
  sellPrice: "Cena sprzedaży ($)",
  patternSeed: "Pattern / Seed",
  roiPreview: "Podgląd ROI",
  addItem: "Dodaj przedmiot",
  cancel: "Anuluj",
  fillRequired: "Wypełnij nazwę skina oraz ceny kupna i sprzedaży.",

  noItems: "Brak przedmiotów",
  noItemsHint: "Dodaj swój pierwszy skin klikając \"Dodaj przedmiot\"",

  deleteItem: "Usuń przedmiot",
  deleteConfirm: "Usunąć przedmiot?",
  delete: "Usuń",
  buy: "Kupno",
  sell: "Sprzedaż",
  sold: "Sprzedano",
  targetSell: "Cel sprzedażowy",
  sellFor: "Sprzedaj za",
  list: "Wystaw",
  markSold: "Oznacz jako sprzedane",
  readyToRemove: "Gotowe do usunięcia",

  profile: "Profil",
  localAccount: "Konto lokalne",
  statistics: "Statystyki",
  itemStatus: "Status przedmiotów",
  allTime: "Od początku",
  soldCount: "Sprzedane",
  history: "Historia",
  noHistory: "Brak historii",
  added: "Dodano",
  removed: "Usunięto",
  viewAll: "Pokaż wszystko",
  logout: "Wyloguj się",

  marketInfo: "Informacje rynkowe",
  back: "Wróć",
  prices: "Ceny",
  trends: "Trendy",
  calculator: "Kalkulator",
  comingSoon: "Wkrótce dostępne...",
  markets: "Markety",
  sellFee: "Sprzedaż",
  buyFee: "Kupno",
  depositFee: "Wpłata",
  withdrawFee: "Wypłata",

  calculateProfit: "Oblicz zysk",
  buyPriceCalc: "Cena zakupu ($)",
  sellPriceCalc: "Cena sprzedaży ($)",
  selectMarket: "Wybierz rynek",
  netProfit: "Zysk netto",
  fees: "Prowizje",
  compareMarkets: "Porównaj rynki",
  searchSkins: "Szukaj skóry...",
  noSkinsFound: "Nie znaleziono skór",
  priceHistory: "Historia cen",

  hours: "g",
  minutes: "m",

  helpTitle: "📖 Pomoc - Instrukcja obsługi",
  addingSkins: "Dodawanie skórek",
  dopplerPhasesAndTiers: "Fazy Doppler i Tier",
  tradeBan: "Ban handlowy (TB)",
  usefulFeatures: "Przydatne funkcje",
  iUnderstand: "Rozumiem",
  fullInstructions: "Pełna instrukcja",
  clickAddItem: "Kliknij + DODAJ PRZEDMIOT",
  enterSkinName: "Wpisz nazwę skórki i wybierz z sugestii",
  fillPrices: "Wypełnij ceny kupna i sprzedaży",
  enterSeed: "Wpisz numer seed aby automatycznie wykryć fazę Dopplera",
  systemDetects: "System automatycznie wykrywa wszystkie fazy Dopplera",
  seedFromSteam: "Numer seed możesz sprawdzić w ekwipunku Steam",
  phaseInfo: "Po wpisaniu seed pojawi się kolorowa informacja o fazie",
  defaultSevenDays: "Każda nowa skórka ma domyślnie 7 dni bana",
  counterCountsDown: "Licznik automatycznie odlicza czas",
  whenEndsStatus: "Kiedy ban się skończy status zmieni się na Wolne",
  priceCheckButton: "Przycisk Price Check otwiera skórkę bezpośrednio na Pricempire",
  clickToEdit: "Kliknij dowolną wartość na karcie aby ją edytować",
  useFilters: "Używaj filtrów aby szybko znaleźć potrzebne przedmioty",
  switchMode: "Przełączaj się między trybem ceny i ROI",
  skip: "Pomiń",
  next: "Dalej →",
  letsGo: "Zaczynamy! ✨",

  importFromSteam: "Importuj ze Steam",
  importPlaceholder: "Trade link, profil URL lub Steam ID...",
  fetchInventory: "Pobierz ekwipunek",
  importAll: "Importuj wszystkie",
  loading: "Ładowanie...",

  lowestPrice: "NAJNIŻSZA CENA",
  averagePrice: "ŚREDNIA CENA",
  availableMarkets: "DOSTĘPNYCH RYNKÓW",
  market: "Rynek",
  fee: "Opłata",
  afterFee: "Po opłacie",
  difference: "Różnica",
  lowest: "NAJNIŻSZA",
  loadingPrices: "Ładowanie aktualnych cen z wszystkich rynków...",
  pricesAutoUpdate: "Ceny aktualizowane automatycznie co 60 sekund",
  pricesUpdated: "Ceny zostały zaktualizowane",

  welcomeTitle: "Witamy w CS2 Arbitrage Helper!",
  welcomeContent: "Narzędzie do monitorowania inwestycji w skórki CS2 z automatycznymi kalkulacjami ROI i banów handlowych.",
  addingSkinsTitle: "Dodawanie skórek",
  addingSkinsContent: "Kliknij przycisk + DODAJ PRZEDMIOT aby dodać nową skórkę do Twojego portfolio.",
  searchTitle: "Wyszukiwanie automatyczne",
  searchContent: "Wpisz tylko początek nazwy - system automatycznie wyszuka pasujące skórki dla Ciebie.",
  fillPricesTitle: "Wypełnij ceny",
  fillPricesContent: "Podaj cenę kupna i planowaną cenę sprzedaży. ROI i zysk obliczają się automatycznie!",
  readyTitle: "Gotowe!",
  readyContent: "Dodane skórki pojawią się na liście. Obserwuj licznik bana handlowego, który automatycznie odlicza czas!",

  or: "or",
  steamLogin: "Steam Login",
  roi: "ROI",
  price: "Cena",
  tb: "TB",
  pattern: "Pattern",
  sortByTBDesc: "TB ↓",
  sortByTBAsc: "TB ↑",
  priceCheck: "Price Check",
  statTrak: "StatTrak™",
  souvenir: "Souvenir",
};

const en: TranslationKeys = {
  subtitle: "track your CS2 investments",
  login: "Log in",
  createAccount: "Create account",
  username: "Username",
  password: "Password",
  rememberMe: "Remember me",
  signIn: "Sign in",
  register: "Register",
  noAccount: "Don't have an account? Register",
  hasAccount: "Have an account? Sign in",
  enterCredentials: "Enter login and password.",
  userExists: "User already exists!",
  invalidCredentials: "Invalid login or password!",
  loginError: "Login error: ",

  items: "Items",
  invested: "Invested",
  profit: "Profit",
  targetProfit: "Target Profit",

  searchPlaceholder: "Search by name, category, market, price...",
  filters: "Filters",
  add: "Add",
  close: "Close",
  allItems: "All Items",

  category: "Category",
  model: "Model",
  status: "Status",
  reset: "Reset",

  kupione: "Purchased",
  wolne: "Free",
  wystawiony: "Listed",
  sprzedane: "Sold",

  priceDesc: "Price ↓",
  priceAsc: "Price ↑",

  skinName: "Skin name",
  searchSkin: "Enter skin name (e.g. AK-47 | Redline)",
  searching: "searching\u2026",
  clear: "✕ clear",
  found: "Found",
  weaponModels: "Weapon models",
  details: "Details",
  buyMarket: "Buy market",
  buyPrice: "Buy price ($)",
  sellMarket: "Sell market",
  sellPrice: "Sell price ($)",
  patternSeed: "Pattern / Seed",
  roiPreview: "ROI Preview",
  addItem: "Add item",
  cancel: "Cancel",
  fillRequired: "Fill in skin name and buy/sell prices.",

  noItems: "No items",
  noItemsHint: "Add your first skin by clicking \"Add item\"",

  deleteItem: "Delete item",
  deleteConfirm: "Delete item?",
  delete: "Delete",
  buy: "Buy",
  sell: "Sell",
  sold: "Sold",
  targetSell: "Target Sell",
  sellFor: "Sell for",
  list: "List",
  markSold: "Mark as sold",
  readyToRemove: "Ready to remove",

  profile: "Profile",
  localAccount: "Local account",
  statistics: "Statistics",
  itemStatus: "Item status",
  allTime: "All time",
  soldCount: "Sold",
  history: "History",
  noHistory: "No history",
  added: "Added",
  removed: "Removed",
  viewAll: "View all",
  logout: "Log out",

  marketInfo: "Market Info",
  back: "Back",
  prices: "Prices",
  trends: "Trends",
  calculator: "Calculator",
  comingSoon: "Coming soon...",
  markets: "Markets",
  sellFee: "Sell",
  buyFee: "Buy",
  depositFee: "Deposit",
  withdrawFee: "Withdraw",

  calculateProfit: "Calculate profit",
  buyPriceCalc: "Buy price ($)",
  sellPriceCalc: "Sell price ($)",
  selectMarket: "Select market",
  netProfit: "Net profit",
  fees: "Fees",
  compareMarkets: "Compare markets",
  searchSkins: "Search skins...",
  noSkinsFound: "No skins found",
  priceHistory: "Price history",

  hours: "h",
  minutes: "m",

  helpTitle: "📖 Help - User Guide",
  addingSkins: "Adding Skins",
  dopplerPhasesAndTiers: "Doppler Phases and Tiers",
  tradeBan: "Trade Ban (TB)",
  usefulFeatures: "Useful Features",
  iUnderstand: "I understand",
  fullInstructions: "Full Instructions",
  clickAddItem: "Click + ADD ITEM",
  enterSkinName: "Enter skin name and select from suggestions",
  fillPrices: "Fill in buy and sell prices",
  enterSeed: "Enter seed number to auto-detect Doppler phase",
  systemDetects: "System automatically detects all Doppler phases",
  seedFromSteam: "You can check seed number in Steam inventory",
  phaseInfo: "After entering seed, colored phase info will appear",
  defaultSevenDays: "Each new skin has 7 days trade ban by default",
  counterCountsDown: "Counter automatically counts down",
  whenEndsStatus: "When ban ends, status changes to Free",
  priceCheckButton: "Price Check button opens skin directly on Pricempire",
  clickToEdit: "Click any value on the card to edit it",
  useFilters: "Use filters to quickly find needed items",
  switchMode: "Switch between price and ROI mode",
  skip: "Skip",
  next: "Next →",
  letsGo: "Let's Go! ✨",

  importFromSteam: "Import from Steam",
  importPlaceholder: "Trade link, profile URL, or Steam ID...",
  fetchInventory: "Fetch Inventory",
  importAll: "Import All",
  loading: "Loading...",

  lowestPrice: "LOWEST PRICE",
  averagePrice: "AVERAGE PRICE",
  availableMarkets: "AVAILABLE MARKETS",
  market: "Market",
  fee: "Fee",
  afterFee: "After Fee",
  difference: "Difference",
  lowest: "LOWEST",
  loadingPrices: "Loading current prices from all markets...",
  pricesAutoUpdate: "Prices automatically update every 60 seconds",
  pricesUpdated: "Prices have been updated",

  welcomeTitle: "Welcome to CS2 Arbitrage Helper!",
  welcomeContent: "Tool for monitoring CS2 skin investments with automatic ROI and trade ban calculations.",
  addingSkinsTitle: "Adding Skins",
  addingSkinsContent: "Click the + ADD ITEM button to add a new skin to your portfolio.",
  searchTitle: "Automatic Search",
  searchContent: "Just type the beginning of the name - the system will automatically find matching skins for you.",
  fillPricesTitle: "Fill Prices",
  fillPricesContent: "Enter buy price and planned sell price. ROI and profit are calculated automatically!",
  readyTitle: "Ready!",
  readyContent: "Added skins will appear on the list. Watch the trade ban counter that automatically counts down!",

  or: "or",
  steamLogin: "Steam Login",
  roi: "ROI",
  price: "Price",
  tb: "TB",
  pattern: "Pattern",
  sortByTBDesc: "TB ↓",
  sortByTBAsc: "TB ↑",
  priceCheck: "Price Check",
  statTrak: "StatTrak™",
  souvenir: "Souvenir",
};

const zh: TranslationKeys = {
  subtitle: "跟踪你的 CS2 投资",
  login: "\u767b\u5f55",
  createAccount: "\u521b\u5efa\u8d26\u53f7",
  username: "\u7528\u6237\u540d",
  password: "\u5bc6\u7801",
  rememberMe: "\u8bb0\u4f4f\u6211",
  signIn: "\u767b\u5f55",
  register: "\u6ce8\u518c",
  noAccount: "\u6ca1\u6709\u8d26\u53f7\uff1f\u6ce8\u518c",
  hasAccount: "\u5df2\u6709\u8d26\u53f7\uff1f\u767b\u5f55",
  enterCredentials: "\u8bf7\u8f93\u5165\u7528\u6237\u540d\u548c\u5bc6\u7801\u3002",
  userExists: "\u8be5\u7528\u6237\u5df2\u5b58\u5728\uff01",
  invalidCredentials: "\u7528\u6237\u540d\u6216\u5bc6\u7801\u9519\u8bef\uff01",
  loginError: "\u767b\u5f55\u9519\u8bef\uff1a",

  items: "\u7269\u54c1",
  invested: "\u5df2\u6295\u5165",
  profit: "\u5229\u6da6",
  targetProfit: "\u76ee\u6807\u5229\u6da6",

  searchPlaceholder: "\u6309\u540d\u79f0\u3001\u5206\u7c7b\u3001\u5e02\u573a\u3001\u4ef7\u683c\u641c\u7d22...",
  filters: "\u7b5b\u9009",
  add: "\u6dfb\u52a0",
  close: "\u5173\u95ed",
  allItems: "\u6240\u6709\u7269\u54c1",

  category: "\u5206\u7c7b",
  model: "\u578b\u53f7",
  status: "\u72b6\u6001",
  reset: "\u91cd\u7f6e",

  kupione: "\u5df2\u8d2d\u4e70",
  wolne: "\u7a7a\u95f2",
  wystawiony: "\u5df2\u4e0a\u67b6",
  sprzedane: "\u5df2\u51fa\u552e",

  priceDesc: "\u4ef7\u683c \u2193",
  priceAsc: "\u4ef7\u683c \u2191",

  skinName: "\u76ae\u80a4\u540d\u79f0",
  searchSkin: "\u8f93\u5165\u76ae\u80a4\u540d\u79f0\uff08\u5982 AK-47 | Redline\uff09",
  searching: "\u641c\u7d22\u4e2d\u2026",
  clear: "✕ \u6e05\u9664",
  found: "\u5df2\u627e\u5230",
  weaponModels: "\u6b66\u5668\u578b\u53f7",
  details: "\u8be6\u60c5",
  buyMarket: "\u4e70\u5165\u5e02\u573a",
  buyPrice: "\u4e70\u5165\u4ef7\u683c ($)",
  sellMarket: "\u5356\u51fa\u5e02\u573a",
  sellPrice: "\u5356\u51fa\u4ef7\u683c ($)",
  patternSeed: "Pattern / Seed",
  roiPreview: "ROI \u9884\u89c8",
  addItem: "\u6dfb\u52a0\u7269\u54c1",
  cancel: "\u53d6\u6d88",
  fillRequired: "\u8bf7\u586b\u5199\u76ae\u80a4\u540d\u79f0\u548c\u4e70/\u5356\u4ef7\u683c\u3002",

  noItems: "\u6ca1\u6709\u7269\u54c1",
  noItemsHint: "\u70b9\u51fb\u201c\u6dfb\u52a0\u7269\u54c1\u201d\u6dfb\u52a0\u4f60\u7684\u7b2c\u4e00\u4e2a\u76ae\u80a4",

  deleteItem: "\u5220\u9664\u7269\u54c1",
  deleteConfirm: "\u786e\u5b9a\u5220\u9664\uff1f",
  delete: "\u5220\u9664",
  buy: "\u4e70\u5165",
  sell: "\u5356\u51fa",
  sold: "\u5df2\u552e",
  targetSell: "\u76ee\u6807\u552e\u4ef7",
  sellFor: "\u552e\u4ef7",
  list: "\u4e0a\u67b6",
  markSold: "\u6807\u8bb0\u4e3a\u5df2\u552e",
  readyToRemove: "\u53ef\u5220\u9664",

  profile: "\u4e2a\u4eba\u8d44\u6599",
  localAccount: "\u672c\u5730\u8d26\u53f7",
  statistics: "\u7edf\u8ba1",
  itemStatus: "\u7269\u54c1\u72b6\u6001",
  allTime: "\u5168\u90e8\u65f6\u95f4",
  soldCount: "\u5df2\u552e",
  history: "\u5386\u53f2",
  noHistory: "\u65e0\u5386\u53f2",
  added: "\u5df2\u6dfb\u52a0",
  removed: "\u5df2\u5220\u9664",
  viewAll: "\u67e5\u770b\u5168\u90e8",
  logout: "\u9000\u51fa",

  hours: "\u5c0f\u65f6",
  minutes: "\u5206",

  marketInfo: "\u5e02\u573a\u4fe1\u606f",
  back: "\u8fd4\u56de",
  prices: "\u4ef7\u683c",
  trends: "\u8d8b\u52bf",
  calculator: "\u8ba1\u7b97\u5668",
  comingSoon: "\u5373\u5c06\u63a8\u51fa...",
  markets: "\u5e02\u573a",
  sellFee: "\u51fa\u552e",
  buyFee: "\u8d2d\u4e70",
  depositFee: "\u5b58\u5165",
  withdrawFee: "\u63d0\u53d6",

  calculateProfit: "\u8ba1\u7b97\u5229\u6da6",
  buyPriceCalc: "\u4e70\u5165\u4ef7\u683c ($)",
  sellPriceCalc: "\u5356\u51fa\u4ef7\u683c ($)",
  selectMarket: "\u9009\u62e9\u5e02\u573a",
  netProfit: "\u51c0\u5229\u6da6",
  fees: "\u624b\u7eed\u8d39",
  compareMarkets: "\u5bf9\u6bd4\u5e02\u573a",
  searchSkins: "\u641c\u7d22\u76ae\u80a4...",
  noSkinsFound: "\u672a\u627e\u5230\u76ae\u80a4",
  priceHistory: "\u4ef7\u683c\u5386\u53f2",

  helpTitle: "📖 师士 - 使用说明",
  addingSkins: "\u6dfb\u52a0\u76ae\u80a4",
  dopplerPhasesAndTiers: "\u591a\u666e\u52d2\u76ae\u9635\u6bb5\u548cTier",
  tradeBan: "\u4ea4\u6613\u7981\u6b62 (TB)",
  usefulFeatures: "\u6709\u7528\u529f\u80fd",
  iUnderstand: "\u6211\u77e5\u9053\u4e86",
  fullInstructions: "\u5b8c\u6574\u8bf4\u660e",
  clickAddItem: "\u70b9\u51fb + \u6dfb\u52a0\u7269\u54c1",
  enterSkinName: "\u8f93\u5165\u76ae\u80a4\u540d\u79f0\u5e76\u4ece\u5efa\u8bae\u4e2d\u9009\u62e9",
  fillPrices: "\u586b\u5199\u4e70\u5356\u4ef7\u683c",
  enterSeed: "\u8f93\u5165seed\u53f7\u81ea\u52a8\u68c0\u6d4b\u591a\u666e\u52d2\u76ae\u9635\u6bb5",
  systemDetects: "\u7cfb\u7edf\u81ea\u52a8\u68c0\u6d4b\u6240\u6709\u591a\u666e\u52d2\u76ae\u9635\u6bb5",
  seedFromSteam: "\u60a8\u53ef\u4ee5\u5728Steam\u7269\u54c1\u4e2d\u67e5\u770bseed\u53f7",
  phaseInfo: "\u8f93\u5165seed\u540e\u5c06\u663e\u793a\u8272\u5f69\u9635\u6bb5\u4fe1\u606f",
  defaultSevenDays: "\u6bcf\u4e2a\u65b0\u76ae\u80a4\u9ed8\u8ba47\u5929\u4ea4\u6613\u7981\u6b62",
  counterCountsDown: "\u8ba1\u6570\u5668\u81ea\u52a8\u5012\u8ba1\u65f6\u95f4",
  whenEndsStatus: "\u7981\u6b62\u7ed3\u675f\u65f6\u72b6\u6001\u53d8\u4e3a\u7a7a\u95f2",
  priceCheckButton: "Price Check\u6309\u94ae\u76f4\u63a5\u5728Pricempire\u6253\u5f00\u76ae\u80a4",
  clickToEdit: "\u70b9\u51fb\u5361\u7247\u4e0a\u7684\u4efb\u610f\u503c\u8fdb\u884c\u7f16\u8f91",
  useFilters: "\u4f7f\u7528\u7b5b\u9009\u5668\u5feb\u901f\u627e\u5230\u9700\u8981\u7684\u7269\u54c1",
  switchMode: "\u5728\u4ef7\u683c\u548cROI\u6a21\u5f0f\u4e4b\u95f4\u5207\u6362",
  skip: "\u8df3\u8fc7",
  next: "\u4e0b\u4e00\u6b65 \u2192",
  letsGo: "\u5f00\u59cb\u5427! ✨",

  importFromSteam: "\u4eceSteam\u5bfc\u5165",
  importPlaceholder: "\u4ea4\u6613\u94fe\u63a5\u3001\u8d44\u6599\u94fe\u63a5\u6216Steam ID...",
  fetchInventory: "\u83b7\u53d6\u7269\u54c1",
  importAll: "\u5bfc\u5165\u5168\u90e8",
  loading: "\u52a0\u8f7d\u4e2d...",

  lowestPrice: "\u6700\u4f4e\u4ef7\u683c",
  averagePrice: "\u5e73\u5747\u4ef7\u683c",
  availableMarkets: "\u53ef\u7528\u5e02\u573a\u6570",
  market: "\u5e02\u573a",
  fee: "\u624b\u7eed\u8d39",
  afterFee: "\u540e\u624b\u7eed\u8d39",
  difference: "\u5dee\u5f02",
  lowest: "\u6700\u4f4e",
  loadingPrices: "\u6b63\u5728\u4ece\u6240\u6709\u5e02\u573a\u52a0\u8f7d\u5f53\u524d\u4ef7\u683c...",
  pricesAutoUpdate: "\u4ef7\u683c\u6bcf60\u79d2\u81ea\u52a8\u66f4\u65b0",
  pricesUpdated: "\u4ef7\u683c\u5df2\u66f4\u65b0",

  welcomeTitle: "\u6b22\u8fce\u4f7f\u7528CS2\u5275\u5e02\u52a9\u624b!",
  welcomeContent: "\u7528\u4e8e\u76d1\u63a7CS2\u76ae\u80a4\u6295\u8D44\u7684\u5de5\u5177\uff0c\u81ea\u52a8\u8ba1\u7b97ROI\u548c\u4ea4\u6613\u7981\u6b62\u3002",
  addingSkinsTitle: "\u6dfb\u52a0\u76ae\u80a4",
  addingSkinsContent: "\u70b9\u51fb + \u6dfb\u52a0\u7269\u54c1\u6309\u94ae\u5411\u60a8\u7684\u4f59\u91cf\u6dfb\u52a0\u65b0\u76ae\u80a4\u3002",
  searchTitle: "\u81ea\u52a8\u641c\u7d22",
  searchContent: "\u53ea\u9700\u8f93\u5165\u540d\u79f0\u5f00\u5934 - \u7cfb\u7edf\u5c06\u81ea\u52a8\u4e3a\u60a8\u627e\u5230\u5339\u914d\u7684\u76ae\u80a4\u3002",
  fillPricesTitle: "\u586b\u5199\u4ef7\u683c",
  fillPricesContent: "\u8f93\u5165\u4e70\u5165\u4ef7\u548c\u8ba1\u5212\u7684\u51fa\u552e\u4ef7\u3002ROI\u548c\u5229\u6da6\u5c06\u81ea\u52a8\u8ba1\u7b97\uff01",
  readyTitle: "\u5b8c\u6210!",
  readyContent: "\u6dfb\u52a0\u7684\u76ae\u80a4\u5c06\u663e\u793a\u5728\u5217\u8868\u4e0a\u3002\u89c2\u770b\u4ea4\u6613\u7981\u6b62\u8ba1\u6570\u5668\uff0c\u5b83\u4f1a\u81ea\u52a8\u5012\u8ba1\u65f6\u95f4!",

  or: "\u6216",
  steamLogin: "\u767b\u5f55 Steam",
  roi: "ROI",
  price: "\u4ef7\u683c",
  tb: "TB",
  pattern: "\u6a21\u5f0f",
  sortByTBDesc: "TB \u2193",
  sortByTBAsc: "TB \u2191",
  priceCheck: "\u4ef7\u683c\u67e5\u770b",
  statTrak: "StatTrak\u2122",
  souvenir: "Souvenir",
};

const ru: TranslationKeys = {
  subtitle: "отслеживай свои инвестиции CS2",
  login: "Войти",
  createAccount: "Создать аккаунт",
  username: "Имя пользователя",
  password: "Пароль",
  rememberMe: "Запомнить меня",
  signIn: "Войти",
  register: "Регистрация",
  noAccount: "Нет аккаунта? Зарегистрируйтесь",
  hasAccount: "Есть аккаунт? Войдите",
  enterCredentials: "Введите логин и пароль.",
  userExists: "Такой пользователь уже существует!",
  invalidCredentials: "Неверный логин или пароль!",
  loginError: "Ошибка входа: ",

  items: "Предметы",
  invested: "Инвестировано",
  profit: "Прибыль",
  targetProfit: "Целевая прибыль",

  searchPlaceholder: "Поиск по названию, категории, маркету, цене...",
  filters: "Фильтры",
  add: "Добавить",
  close: "Закрыть",
  allItems: "Все предметы",

  category: "Категория",
  model: "Модель",
  status: "Статус",
  reset: "Сброс",

  kupione: "Куплено",
  wolne: "Свободно",
  wystawiony: "Выставлено",
  sprzedane: "Продано",

  priceDesc: "Цена ↓",
  priceAsc: "Цена ↑",

  skinName: "Название скина",
  searchSkin: "Введите название скина (напр. AK-47 | Redline)",
  searching: "поиск\u2026",
  clear: "✕ очистить",
  found: "Найдено",
  weaponModels: "Модели оружия",
  details: "Детали",
  buyMarket: "Маркет покупки",
  buyPrice: "Цена покупки ($)",
  sellMarket: "Маркет продажи",
  sellPrice: "Цена продажи ($)",
  patternSeed: "Pattern / Seed",
  roiPreview: "Предпросмотр ROI",
  addItem: "Добавить предмет",
  cancel: "Отмена",
  fillRequired: "Заполните название скина и цены покупки/продажи.",

  noItems: "Нет предметов",
  noItemsHint: "Добавьте первый скин, нажав «Добавить предмет»",

  deleteItem: "Удалить предмет",
  deleteConfirm: "Удалить предмет?",
  delete: "Удалить",
  buy: "Покупка",
  sell: "Продажа",
  sold: "Продано",
  targetSell: "Целевая цена",
  sellFor: "Продать за",
  list: "Выставить",
  markSold: "Отметить как продано",
  readyToRemove: "Готово к удалению",

  profile: "Профиль",
  localAccount: "Локальный аккаунт",
  statistics: "Статистика",
  itemStatus: "Статус предметов",
  allTime: "За всё время",
  soldCount: "Продано",
  history: "История",
  noHistory: "Нет истории",
  added: "Добавлено",
  removed: "Удалено",
  viewAll: "Показать все",
  logout: "Выйти",

  marketInfo: "Информация о рынке",
  back: "Назад",
  prices: "Цены",
  trends: "Тренды",
  calculator: "Калькулятор",
  comingSoon: "Скоро...",
  markets: "Маркеты",
  sellFee: "Продажа",
  buyFee: "Покупка",
  depositFee: "Депозит",
  withdrawFee: "Вывод",

  calculateProfit: "Расчет прибыли",
  buyPriceCalc: "Цена покупки ($)",
  sellPriceCalc: "Цена продажи ($)",
  selectMarket: "Выберите рынок",
  netProfit: "Чистая прибыль",
  fees: "Комиссия",
  compareMarkets: "Сравнить рынки",
  searchSkins: "Поиск скинов...",
  noSkinsFound: "Скины не найдены",
  priceHistory: "История цен",

  hours: "ч",
  minutes: "м",

  helpTitle: "📖 Помощь - Инструкция",
  addingSkins: "Добавление скинов",
  dopplerPhasesAndTiers: "Фазы Doppler и Tier",
  tradeBan: "Торговый бан (TB)",
  usefulFeatures: "Полезные функции",
  iUnderstand: "Понятно",
  fullInstructions: "Полная инструкция",
  clickAddItem: "Нажми + ДОБАВИТЬ ПРЕДМЕТ",
  enterSkinName: "Введи название скина и выбери из предложений",
  fillPrices: "Заполни цены покупки и продажи",
  enterSeed: "Введи номер seed для автоматического определения фазы Doppler",
  systemDetects: "Система автоматически определяет все фазы Doppler",
  seedFromSteam: "Номер seed можно проверить в инвентаре Steam",
  phaseInfo: "После ввода seed появится цветная информация о фазе",
  defaultSevenDays: "Каждый новый скин имеет 7 дней торгового бана по умолчанию",
  counterCountsDown: "Таймер автоматически отсчитывает время",
  whenEndsStatus: "Когда бан закончится, статус изменится на Свободно",
  priceCheckButton: "Кнопка Price Check открывает скин прямо на Pricempire",
  clickToEdit: "Нажми на любое значение на карточке для редактирования",
  useFilters: "Используй фильтры для быстрого поиска нужных предметов",
  switchMode: "Переключайся между режимом цены и ROI",
  skip: "Пропустить",
  next: "Далее →",
  letsGo: "Начинаем! ✨",

  importFromSteam: "Импорт из Steam",
  importPlaceholder: "Трейд ссылка, URL профиля или Steam ID...",
  fetchInventory: "Получить инвентарь",
  importAll: "Импортировать все",
  loading: "Загрузка...",

  lowestPrice: "МИНИМАЛЬНАЯ ЦЕНА",
  averagePrice: "СРЕДНЯЯ ЦЕНА",
  availableMarkets: "ДОСТУПНЫХ РЫНКОВ",
  market: "Рынок",
  fee: "Комиссия",
  afterFee: "После комиссии",
  difference: "Разница",
  lowest: "МИНИМУМ",
  loadingPrices: "Загрузка актуальных цен со всех рынков...",
  pricesAutoUpdate: "Цены автоматически обновляются каждые 60 секунд",
  pricesUpdated: "Цены обновлены",

  welcomeTitle: "Добро пожаловать в CS2 Arbitrage Helper!",
  welcomeContent: "Инструмент для мониторинга инвестиций в скины CS2 с автоматическим расчетом ROI и торговых банов.",
  addingSkinsTitle: "Добавление скинов",
  addingSkinsContent: "Нажми кнопку + ДОБАВИТЬ ПРЕДМЕТ чтобы добавить новый скин в свой портфель.",
  searchTitle: "Автопоиск",
  searchContent: "Введи только начало названия - система автоматически найдет подходящие скины для тебя.",
  fillPricesTitle: "Заполни цены",
  fillPricesContent: "Укажи цену покупки и планируемую цену продажи. ROI и прибыль рассчитываются автоматически!",
  readyTitle: "Готово!",
  readyContent: "Добавленные скины появятся в списке. Следи за таймером торгового бана, который автоматически отсчитывает время!",

  or: "или",
  steamLogin: "Вход через Steam",
  roi: "ROI",
  price: "Цена",
  tb: "TB",
  pattern: "Паттерн",
  sortByTBDesc: "TB ↓",
  sortByTBAsc: "TB ↑",
  priceCheck: "Проверить цену",
  statTrak: "StatTrak™",
  souvenir: "Souvenir",
};

const translations: Record<Lang, TranslationKeys> = { pl, en, zh, ru };

const LANGUAGE_STORAGE_KEY = "app_language";

function getSavedLang(): Lang {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (saved === "pl" || saved === "en" || saved === "zh" || saved === "ru") return saved;
  return "en";
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return getSavedLang();
    } catch {
      return "pl";
    }
  });

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
  }, []);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export const langLabels: Record<Lang, string> = {
  pl: "Polski",
  en: "English",
  zh: "中文",
  ru: "Русский",
};
