package com.medical.app.dto;

public class LoginRequestDocteur {
    private String numeroProfessionnel;
    private String motDePasse;

    public String getNumeroProfessionnel() {
        return numeroProfessionnel;
    }

    public void setNumeroProfessionnel(String numeroProfessionnel) {
        this.numeroProfessionnel = numeroProfessionnel;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }
}
