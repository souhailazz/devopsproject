package com.medical.app.dao;

import com.medical.app.model.Docteur;
import com.medical.app.repository.DocteurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class DocteurDAO implements IDAO<Docteur, Integer> {
    
    @Autowired
    private DocteurRepository docteurRepository;
    
    @Override
    public Docteur save(Docteur docteur) {
        return docteurRepository.save(docteur);
    }
    
    @Override
    public List<Docteur> findAll() {
        return docteurRepository.findAll();
    }
    
    @Override
    public Docteur findById(Integer id) {
        return docteurRepository.findById(id).orElse(null);
    }
    
    @Override
    public void delete(Integer id) {
        docteurRepository.deleteById(id);
    }

public List<Docteur> findBySpecialite(String specialite) {
    return docteurRepository.findBySpecialite(specialite);
}

public List<Docteur> findBySpecialiteAndCity(String specialite, String city) {
    return docteurRepository.findBySpecialiteAndCity(specialite, city);
}

    @Override
    public Optional<Docteur> findByEmail(String email) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    public Optional<Docteur> findByNumeroProfessionnel(String numeroProfessionnel) {
    return docteurRepository.findByNumeroProfessionnel(numeroProfessionnel);
}   
public Docteur findById(Long id) {
    return docteurRepository.findById(id).orElse(null);
}

}
  

