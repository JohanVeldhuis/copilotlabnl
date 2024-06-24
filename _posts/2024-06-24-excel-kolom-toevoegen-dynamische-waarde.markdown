---
layout: post
title: "Gebruik Copilot om een kolom toe te voegen met een dynamische waarde"
date: 2024-06-24 22:10:02 +0200
categories: Excel
---

In de vorige blog hebben we gekeken hoe je een vlookup toevoegd door gebruikt te maken van Copilot voor Microsoft 365. In deze blog gaan we kijken hoe we Copilot een kolom laten toevoegen en op basis van een waarde in een bestaande kolom de waarde voor de velden in de nieuwe kolom automatisch laten vullen.

Voordat je daadwerkelijk met de data is het verstandig om dit voor zover mogelijk op te schonen. Reden hiervoor is dat Copilot alle data bekijktin het Excel bestand, ook al maak je gebruik van filters.

Het prompt om de nieuwe kolom aan te maken en er vervolgens voor te zorgen dat de waarde dynamisch wordt gevuld op basis van een bestaande kolom ziet er als volgt uit:

`Add a new column called regiotype if the value of column C starts with ES the value of the column regiotype should be regionale energietrategie, if the value of column C starts with GM the value of the column regiotype should be gemeente, if the value of column C starts with PV the value of the column regiotype should be provincie, if the value of column C starts with LD the value of the column regiotype should be landelijk`

Wil je liever eerst zien hoe het werkt voordat je het zelf gaat uitproberen kijk dan eens naar onderstaande video

{% include youtube.html id="_DZhZANV0BY" %}

In deze blog hebben we gekeken hoe je Copilot voor M365 kunt gebruiken om in een Excel bestand een kolom te maken en deze dynamisch te vullen op de waarde in kolom C. Zoals vermeld op dit moment is Copilot in Excel alleen nog beschikbaar in de Engelse taal, je kunt dus alleen prompts opgeven in het Engels en helaas nog niet in het Nederlands.

De data die we gebruikt hebben in dit voorbeeld komt van het open data platform van het CBS [Statline](https://opendata.cbs.nl/statline/#/CBS/nl/).
Als je leuke data wil hebben om mee te spelen dan is dat echt een aanrader om eens rond te kijken.

> Let op dat als je Copilot in Excel wil gebruiken de data in een tabel moet staan. Dit is momenteel nog een beperking maar zoals te zien in dit [M365 Roadmap item](<https://www.microsoft.com/nl-nl/microsoft-365/roadmap?filters=Microsoft%20Copilot%20(Microsoft%20365)&searchterms=396560>) gaan dit wijzigen.
