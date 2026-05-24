---
layout: page
title: Earthquake Shelter Map — Public API Safety Service
description: A safety-map web service combining Kakao Maps and the public-data earthquake/tsunami shelter API, with GPS-based location, routing, and search.
img:
importance: 5
category: personal
project_type: personal
display_year: "2023"
funding: "HTML · CSS · JavaScript · Kakao Maps API"
logo_icon: fa-solid fa-house-crack
---

**Repo.** [github.com/TaeWan21/CreateProject](https://github.com/TaeWan21/CreateProject)

A web service that visualizes earthquake/tsunami shelters and temporary residences on a Kakao Map, helping users find the nearest safe location and navigate there in real time.

The project combines the **Kakao Maps API** with the **public-data portal** (공공데이터포털) APIs for earthquake/tsunami shelters, temporary residences, and recent earthquake events. GPS, route-finding, search, and satellite/standard map toggling round out the feature set.

---

### 🗺️ Kakao Map Rendering
The base map that everything else is built on top of.
<p align="center">
  <img src="https://github.com/user-attachments/assets/0f23a32e-8965-4ba7-b83b-c2dda749fddd" alt="Kakao map rendering" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

---

### 📍 Shelter & Temporary-Residence Markers
Earthquake/tsunami shelter and temporary-residence locations pulled from the public data API and pinned to the map as markers.
<p align="center">
  <img src="https://github.com/user-attachments/assets/1bb8b561-3223-4b91-836f-626233e63e83" alt="Shelter markers" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

---

### 🌋 Recent Earthquake Markers
Recent earthquake events plotted on the map so users can visually identify high-risk regions.
<p align="center">
  <img src="https://github.com/user-attachments/assets/5513cf1d-a7c7-440f-8fcd-014776598d9b" alt="Earthquake event markers" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

---

### 🛰️ GPS-based Current Location
Uses the browser Geolocation API to detect the user's current location and center the map there.
<p align="center">
  <img src="https://github.com/user-attachments/assets/8069aea7-43ce-44bc-9816-6f56440fb974" alt="GPS current location" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

---

### 📋 Nearest Shelters List
Shows a list of shelters near the user's current location, sorted by distance.
<p align="center">
  <img src="https://github.com/user-attachments/assets/0ab33eeb-3bae-432a-9441-1b036cf566c2" alt="Nearest shelters list" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
  <br><br>
  <img src="https://github.com/user-attachments/assets/cf1f7884-933e-4669-b624-f54116afd4bd" alt="Nearest shelters list (detail)" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

---

### 🚗 Route-Finding to a Shelter
Clicking a shelter draws a route from the user's current location to that shelter.
<p align="center">
  <img src="https://github.com/user-attachments/assets/56adc97f-3ecc-4050-831f-fb5b14bb1983" alt="Routing to shelter" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

---

### 🔍 Keyword Search
Search any location or shelter by keyword.
<p align="center">
  <img src="https://github.com/user-attachments/assets/8e7ab457-5ad5-4a0f-8629-a8b293a85419" alt="Keyword search" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

---

### 🌐 Satellite / Standard Map Toggle
Switch freely between satellite and standard map views.
<p align="center">
  <img src="https://github.com/user-attachments/assets/b207788d-3fea-481f-944c-d0605a7ef1fc" alt="Satellite/standard toggle" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

---

### ℹ️ Icon Legend
On-screen legend explaining each marker icon so users can quickly understand the map.
<p align="center">
  <img src="https://github.com/user-attachments/assets/73c96ba7-148a-41e3-adaa-caa6acd93580" alt="Icon legend" width="100%" style="border: 1px solid var(--global-divider-color); border-radius: 8px;"/>
</p>

---

### 🛠️ Stack
- **Frontend.** HTML · CSS · JavaScript
- **APIs.** Kakao Maps API · Public Data Portal (공공데이터포털) — earthquake/tsunami shelter, temporary residence, recent earthquake events
- **Deployment.** GitHub Pages
