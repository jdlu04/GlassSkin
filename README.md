# CSC 473 - Glass Skin
Welcome to Glass Skin, the all in one makeup recommender tailored to your needs and desires.

## Basic Setup
Before you run our app, here's some basic startup info:

```bash
npm install
```
To install all of the backend dependencies, you'll need to first make a virtual environment like so :
```bash
cd backend
python -m venv .venv
```
Next, you'll want to activate the venv like so:
```bash
.venv/Scripts/activate
```
or on Mac:
```bash
source .venv/bin/activate
```

Then, you'll want to install all backend dependencies:
```bash
pip install -r requirements.txt
```

## Running the App

First, run the frontend inside the app directory:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Then, run the development server inside the backend directory:
```bash
cd backend
```
Then do:
```bash
python app.py
```
