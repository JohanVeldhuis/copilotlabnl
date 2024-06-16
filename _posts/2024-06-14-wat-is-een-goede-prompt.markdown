---
layout: post
title: "Wat is een goede prompt?"
date: 2024-06-16 20:21:02 +0200
categories: Copilot CopilotM365
---

In het eerste blog hebben we het gehad over wat prompting is en wat AI-modellen nu eigenlijk zijn. In dit blog gaan we kijken uit welke componenten een goede prompt nu bestaat en hoe je een goed prompt kan schrijven.

## De componenten

Zoals je misschien al hebt kunnen lezen op andere site bestaan prompts uit onderdelen. De onderdelen die je in een prompt gebruikt zijn:

- **doel:** wat wil je dat Copilot voor je doet
- **context:** waarom wil je het en wie is er bij betrokken
- **verwachtingen:** hoe moet Copilot reageren om je vraag/actie zo goed mogelijk uit te voeren
- **bron:** welke informatie of welke voorbeelden wil je dat Copilot gebruikt

Eigenlijk bevat elk prompt altijd een **doel**. De andere componenten hoef je niet te gebruiken maar je zal zien dat als je ze wel gebruikt je een beter antwoord terug zal krijgen.

## Voorbeeld

Zoals al gezegd hoef je niet alle componenten te gebruiken in een prompt. Laten we eens kijken naar een aantal voorbeelden van "basis" prompts en "goede prompts".

`Maak een overzicht met 10 punten om me voor te bereiden`

Bovenstaande prompt werkt alleen in Copilot voor Microsoft 365. Als we daar de **context** aan toe zouden voegen ziet de prompt er als volgt uit:

`Maak een overzicht met 10 punten om me voor te bereiden op mijn werkweek volgende week`

Als je dit probeert zul je zien dat het antwoord al veel specifieker is. Door daar de **verwachting** aan toe te voegen kunnen we het antwoord nog verder verbeteren:

`Maak een overzicht met 10 punten om me voor te bereiden op mijn werkweek volgende week Zorg ervoor dat de resultaten worden weergeven in een tabel met de volgende kolommen: actie|omschrijving|deadline|prioriteit`

Wanneer je deze prompt gebruikt zul je zien dat de resultaten nu netjes in een tabel worden weergeven met de kolommen: actie, omschrijving, deadline en prioriteit. Natuurlijk kun je dit naar eigen maak verder aanpasen zodat het resultaat voor jouw situatie geschikt is.

Als laatste stap voegen we de **bron** toe. Hiermee geven we aan in welke bronnen Copilot moet kijken maar welke items Copilot moet selecteren:

`Maak een overzicht met 10 punten om me voor te bereiden op mijn werkweek volgende week Zorg ervoor dat de resultaten worden weergeven in een tabel met de volgende kolommen: actie|omschrijving|deadline|prioriteit. Gebruik hiervoor alle e-mails/chats en meetings waarin actiepunten aan mij zijn toegewezen of waar een actie van mij is vereist`
