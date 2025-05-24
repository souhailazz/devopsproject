package com.medical.app.service;

import com.medical.app.dao.DocteurDAO;
import com.medical.app.model.Docteur;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DocteurService {
    
    @Autowired
    private DocteurDAO docteurDAO;
    
    public Docteur saveDocteur(Docteur docteur) {
        return docteurDAO.save(docteur);
    }
    
    public List<Docteur> getAllDocteurs() {
        return docteurDAO.findAll();
    }
    
    public Docteur getDocteurById(Integer id) {
        return docteurDAO.findById(id);
    }
    
    public List<Docteur> findDocteursBySpecialiteAndCity(String specialite, String city) {
        if (city != null && !city.isEmpty()) {
            return docteurDAO.findBySpecialiteAndCity(specialite, city);
        } else {
            return docteurDAO.findBySpecialite(specialite);
        }
    }
    
    public void deleteDocteur(Integer id) {
        docteurDAO.delete(id);
    }
    
    public Docteur updateDocteur(Integer id, Docteur docteur) {
        Docteur existingDocteur = getDocteurById(id);
        if (existingDocteur != null) {
            docteur.setId(id);
            return docteurDAO.save(docteur);
        }
        return null;
    }
public Optional<Docteur> login(String numeroProfessionnel, String motDePasse) {
    Optional<Docteur> optionalDocteur = docteurDAO.findByNumeroProfessionnel(numeroProfessionnel);

    if (optionalDocteur.isPresent()) {
        Docteur docteur = optionalDocteur.get();
        if (docteur.getMotDePasse().equals(motDePasse)) {
            return Optional.of(docteur);
        }
    }

    return Optional.empty(); // login failed
}
}