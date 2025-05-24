package com.medical.app.repository;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
import com.medical.app.model.Docteur;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
/**
 *
 * @author souhail
 */
public interface DocteurRepository extends JpaRepository<Docteur, Integer> {
    public List<Docteur> findBySpecialite(String specialite);
    public List<Docteur> findBySpecialiteAndCity(String specialite, String city);
    public Optional<Docteur> findByNumeroProfessionnel(String numeroProfessionnel); 
        Optional<Docteur> findById(Long id);

}
