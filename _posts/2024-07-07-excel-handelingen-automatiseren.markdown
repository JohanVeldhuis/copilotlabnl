---
layout: post
title: "Copilot gebruiken om handelingen te automatiseren"
date: 2024-07-07 08:24:02 +0200
categories: Excel
---

Misschien heb je jezelf ooit verdiept in het automatiseren van handelingen in Excel door gebruik te maken van Macro's en VBScript. Misschien heb je ervaren dat dit redelijk eenvoudig is maar misschien ben je ook weleens ergens vastgelopen.

Copilot kan je in dat geval helpen. Door gebruik te maken van Copilot in Excel kun je deze automatisering namelijk samen met Copilot bouwen. Op dit moment is het nog niet zo dat Copilot de automatisering voor je toevoegd maar het geeft je wel de stappen en de code die je hiervoor nodig hebt.

Wat we willen automatiseren is het verversen van de data in de Excel sheet. We willen dit graag met een knop doen die op de Excel sheet zelf terug te vinden is.

De prompt die we hiervoor kunnen gebruiken ziet er als volgt uit

`Hel me adding automating to this sheet which allows me to press a button to refresh the data. The automation should prompt the user for confirmation before updating the report.`

Wil je liever eerst zien hoe het werkt voordat je het zelf gaat uitproberen kijk dan eens naar onderstaande video

{% include youtube.html id="4EOmraH8ZGE" %}

In deze blog hebben we gekeken hoe je Copilot voor M365 kunt gebruiken om in een Excel bestand automatisering toe te voegen. Op dit moment Copilot in Excel alleen nog beschikbaar in de Engelse taal, je kunt dus alleen prompts opgeven in het Engels en helaas nog niet in het Nederlands.

De data die we gebruikt hebben in dit voorbeeld komt van het open data platform van het CBS [Statline](https://opendata.cbs.nl/statline/#/CBS/nl/).
Als je leuke data wil hebben om mee te spelen dan is dat echt een aanrader om eens rond te kijken.

> Let op dat als je Copilot in Excel wil gebruiken de data in een tabel moet staan. Dit is momenteel nog een beperking maar zoals te zien in dit [M365 Roadmap item](<https://www.microsoft.com/nl-nl/microsoft-365/roadmap?filters=Microsoft%20Copilot%20(Microsoft%20365)&searchterms=396560>) gaan dit wijzigen.
