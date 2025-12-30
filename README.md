# 🫀 Explainable Organ Donation Decision Support System

An end-to-end **Explainable AI--based decision support system** designed
to assist healthcare professionals in organ allocation by predicting
**patient risk scores** and providing **transparent explanations** for
each decision.

> ⚠️ This system is intended to support clinical decision-making and
> does not replace medical professionals.

------------------------------------------------------------------------

## 📌 Problem Statement

Organ allocation is a complex and time-sensitive healthcare process
involving multiple clinical, biological, and ethical factors.\
While machine learning can assist in prioritization, many automated
systems lack **transparency**, making them unsuitable for real-world
clinical use.

Additionally, real-world medical datasets often do not provide explicit
**risk or urgency scores**, limiting predictive modeling.

------------------------------------------------------------------------

## 💡 Solution Overview

The proposed system follows a **modular, microservice-based
architecture** that: - Predicts patient risk scores using Machine
Learning - Supports donor--recipient compatibility analysis - Provides
Explainable AI (XAI) outputs - Maintains auditability of allocation
decisions

------------------------------------------------------------------------

## 🏗️ System Architecture

    Frontend (React.js)
            |
            v
    Backend API (Node.js + Express)
            |
            v
    ML Microservice (FastAPI + Random Forest + SHAP)
            |
            v
    Database (MongoDB)
            |
            v
    Blockchain (Optional – Audit Logs)

------------------------------------------------------------------------

## 🧪 Machine Learning Model

-   **Model**: Random Forest Regressor\
-   **Target Variable**: Risk_Score\
-   **Key Features**:
    -   Age
    -   BMI
    -   Blood Type
    -   Diagnosis Result
    -   Biological Markers
    -   Organ Status

### Why Random Forest?

-   Handles non-linear relationships
-   Robust to noisy medical data
-   Supports feature importance analysis

------------------------------------------------------------------------

## 🔍 Explainable AI (XAI)

This project uses **SHAP (SHapley Additive exPlanations)** to explain
model predictions.\
Each prediction includes: - Feature contribution values -
Positive/negative impact on risk score - Clinically interpretable
explanations

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend

-   React.js

### Backend

-   Node.js
-   Express.js
-   MongoDB

### Machine Learning

-   Python
-   Scikit-learn
-   FastAPI
-   SHAP

### Blockchain (Optional)

-   Ethereum / Polygon
-   Solidity
-   Hardhat

------------------------------------------------------------------------

## 📁 Project Structure

    organ-donation-system/
    │
    ├── frontend/
    ├── backend/
    ├── ml-service/
    │   ├── training/
    │   ├── inference/
    │   └── models/
    ├── blockchain/
    ├── docs/
    └── README.md

------------------------------------------------------------------------

## ⚠️ Disclaimer

This project is developed for **academic and research purposes only**.\
All medical decisions must be made by qualified healthcare
professionals.
