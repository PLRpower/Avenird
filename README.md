# AVENIRD - La Nuit de l'Info 2025

Projet développé pour le défi **"Le Village Numérique Résistant"**.

## 👥 Équipe

- **Paul THOMAS**
- **Clément MARQUES**
- **Louison MASSON**
- **Amélie GAME**
- **Tom BURGER**
- **Clément RINN**
- **Timothée VIRIOT**
- **Nell PATOU-PARVEDY**

## 🚀 Installation et Setup

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation rapide

1. **Cloner le repository** :
   ```bash
   git clone https://github.com/PLRpower/Avenird.git
   cd Avenird
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer l'API Gemini** :
   - Créer un fichier `.env` à la racine du projet
   - Ajouter votre clé API Gemini :
     ```
     VITE_GEMINI_API_KEY=votre_clé_api_ici
     ```

4. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

5. **Ouvrir le navigateur** à l'adresse indiquée (généralement http://localhost:5173)

### Build de production

Pour créer une version de production :
```bash
npm run build
```

Les fichiers seront générés dans le dossier `dist/`.

## 🎯 Défis Relevés

### 1. L'ergonomie : simplifier pour mieux vivre
**Organisateur** : Sopra Steria  
**Lien** : https://www.nuitdelinfo.com/inscription/defis/444

**Notre implémentation** : Page de contact avec un formulaire "ergonomique" unique.  
**Champ concerné** : Tous les champs du formulaire (système de switches pour déverrouiller les champs).  

---

### 2. TruthBot
**Lien** : https://www.nuitdelinfo.com/inscription/defis/473

**Notre implémentation** : Chatbot IA intégré permettant de comparer les réponses de différents modèles.  

---

### 3. On veut du gros pixel ! ✨ 🎮 👾 🕹️
**Lien** : https://www.nuitdelinfo.com/inscription/defis/453

**Notre implémentation** : Design rétro pixel art avec polices et éléments graphiques 8-bit.  
**Livrable** : Fichier `readme.8bit` contenant l'URL du site dans le champ d'upload.

---

### 4. Hidden Snake 📦
**Lien** : https://www.nuitdelinfo.com/inscription/defis/483

**Notre implémentation** : Jeu Snake caché accessible via un easter egg.  
**Activation** : Sur la page d'accueil, dans la section "Linux et l'Open Source", cliquer sur le logo Tux (le pingouin Linux) pour lancer le jeu.  

---

### 5. Chat'bruti
**Lien** : https://www.nuitdelinfo.com/inscription/defis/494

**Notre implémentation** : Arena de chatbots avec interface de comparaison.  


## 🛠️ Stack Technique

- **Framework** : React + Vite
- **Langage** : JavaScript / JSX
- **Styles** : SCSS (Sass)
- **Animations** : GSAP (GreenSock Animation Platform)
- **Smooth Scroll** : Lenis
- **IA** : Google Gemini API

## 🎨 Design System

- **Couleurs** :
  - Rouge Principal : #a92215
  - Noir Secondaire : #2d2727
  - Texte : #f5eee4
- **Polices** :
  - Titres : Cy Grotesk Wide
  - Textes : Poppins

## 📁 Structure du Projet

```
src/
├── components/
│   ├── Navigation.jsx
│   ├── ChatbotArena.jsx
│   └── SnakeGame.jsx
├── pages/
│   ├── Home.jsx
│   └── Contact.jsx
├── assets/
│   └── images/
├── App.jsx
├── App.scss
└── main.jsx
```

## 🎮 Fonctionnalités

- **Page d'accueil** : Présentation du projet avec animations GSAP
- **Formulaire de contact** : Interface "ergonomique" unique avec système de déverrouillage
- **Chatbot Arena** : Comparaison de réponses de différents modèles IA
- **Snake Game** : Jeu caché accessible via easter egg
- **Design Pixel Art** : Esthétique rétro 8-bit

## 📝 Licence

Projet développé dans le cadre de la Nuit de l'Info 2025.

