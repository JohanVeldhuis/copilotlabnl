---
layout: post
title: "Wat is een goed prompt?"
date: 2024-06-16 20:21:02 +0200
categories: informatie
---

In het eerste blog hebben we het gehad over wat prompting is en wat AI-modellen nu eigenlijk zijn. In dit blog gaan we kijken uit welke componenten een goed prompt nu bestaat en hoe je een goed prompt kan schrijven.

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

In dit voorbeeld hebben we gekeken hoe je een goede prompt kan maken voor Copilot voor M365. Maar natuurlijk kun je dit ook toepassen op Copilot prompts. Hiermee kun je niet specifiek kijken naar e-mail/chats en meetings maar wel naar informatie die al aanwezig is in het large language model (LLM) of op internet te vinden is.

Aangezien het EK net is begonnen is het misschien wel leuk om hier een artikel over te schrijven met behulp van Copilot.

`Help me bij het schrijven van een artikel over het EK in Duitsland`

demo:

```markdown
[![Final video of fixing issues in your code in VS Code]
(https://img.youtube.com/vi/5mYIAqqv65g/maxresdefault.jpg)]
(https://www.youtube.com/watch?v=5mYIAqqv65g)
```

Wanneer je bovenstaande prompt uitvoerd zal je zien dat Copilot de informatie ophaalt van meerdere websites op het web. Alleen is het artikel heel erg toegespitst op een aantal punten. Stel dat we nu alleen maar geïnteresseerd zijn in het Nederland elftal dan zullen we het prompt specifieker moeten maken. Dit kunnen we doen door de **context** toe te voegen:

`help me bij het schrijven van een artikel over het EK in Duitsland om andere mensen voor te bereiden op wat er de komende week gaat gebeuren`

```markdown
[![demo]
(https://img.youtube.com/vi/NRDkw69zQE8/maxresdefault.jpg)]
(https://www.youtube.com/watch?v=NRDkw69zQE8)
```

Copilot zal nu met een compleet ander antwoord komen omdat we hebben verteld wat de context is. We willen namelijk dat het artikel mensen voorbereid door te vertellen wat er volgende gaat gaat gebeuren op het EK.

Het is nogsteeds een bullet list met waarin beschreven wordt welke punten we op kunnen nemen in ons artikel alleen nu al veel specifieker dan ons eerste prompt.

Laten we nu nog een stap verder gaan door de **verwachting** toe te voegen:

`help me bij het schrijven van een artikel over het EK in Duitsland om andere mensen voor te bereiden op wat er de komende week gaat gebeuren. Zorg ervoor dat er een tabel wordt getoond met de andere landen die in dezelfde poule als Nederland spelen. Deze tabel moet de landnaam bevatten| de naam van de coach | de topspeler. Maak een tweede tabel met hierin het speelschema van het Nederlands elftal de kolommen van deze tabel moeten zijn: datum en tijd | tegenstander | stadion | stad. Zorg er daarnaast voor dat het laatste nieuw van het Nederlands elftal wordt toegevoegd op basis van de laatst gespeelde webstrijd tijdens het EK in Duitsland in 2024`

```markdown
[![demo]
(https://img.youtube.com/vi/LkVeUc81AcE/maxresdefault.jpg)]
(https://www.youtube.com/watch?v=LkVeUc81AcE)
```

Je ziet dat prompt een stuk langer is geworden maar we vertellen wel duidelijk wat we van Copilot verwachten. Probeer het prompt zelf maar eens en laat je verrassen. Overigens moet ik wel opmerken dat ik dit meerdere keren heb geprobeerd met verschillende resultaten omdat er elke keer andere bronnen wordt gebruikt.

En dat is dan ook de laatste stap de **bron** toevoegen. Stel dat we alleen maar informatie willen gebruiken van de officiele EK website, nos.nl en de Nederlandse kranten dan kunnen we het prompt hierop aanpassen:

`help me bij het schrijven van een artikel over het EK in Duitsland om andere mensen voor te bereiden op wat er de komende week gaat gebeuren. Zorg ervoor dat er een tabel wordt getoond met de andere landen die in dezelfde poule als Nederland spelen. Deze tabel moet de landnaam bevatten| de naam van de coach | de topspeler. Maak een tweede tabel met hierin het speelschema van het Nederlands elftal de kolommen van deze tabel moeten zijn: datum en tijd | tegenstander | stadion | stad. Zorg er daarnaast voor dat het laatste nieuw van het Nederlands elftal wordt toegevoegd op basis van de laatst gespeelde webstrijd tijdens het EK in Duitsland in 2024. Zorg ervoor dat je alleen maar de volgende informatiebronnen gebruikt: nos.nl, de officiele EK 2024 website en Nederlandse kranten`

```markdown
[![demo]
(https://img.youtube.com/vi/KqEh5UDWIYs/maxresdefault.jpg)]
(https://www.youtube.com/watch?v=KqEh5UDWIYs)
```

Wanneer je dit prompt gebruikt zal je zien dat Copilot hier wat moeite mee heeft. Het gebruikt nos.nl en diverse andere sites om antwoord te geven op de vraag. Neem je alleen nos.nl op als informatiebron dan zal je zien dat Copilot alleen deze bronnen gebruikt.

In dit artikel hebben we gekeken hoe je een goede prompt kan gebruiken. Natuurlijk hoef je dit niet altijd te gebruiken maar de voorbeelden die we hier hebben gebruikt tonen duidelijk aan dat het investeren van tijd in een goed prompt heeft om een zo goed mogelijk resultaat te behalen.

Van de voorbeelden zal ik nog korte demo filmpjes opnemen zodat je resultaten hier van kan zien.
