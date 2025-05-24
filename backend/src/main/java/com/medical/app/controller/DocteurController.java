package com.medical.app.controller;

import com.medical.app.dto.LoginRequestDocteur;
import com.medical.app.model.Docteur;
import com.medical.app.service.DocteurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/docteurs")
public class DocteurController {

    @Autowired
    private DocteurService docteurService;

    @PostMapping
    public ResponseEntity<Docteur> createDocteur(@RequestBody Docteur docteur) {
        Docteur savedDocteur = docteurService.saveDocteur(docteur);
        return new ResponseEntity<>(savedDocteur, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Docteur>> getAllDocteurs() {
        List<Docteur> docteurs = docteurService.getAllDocteurs();
        return new ResponseEntity<>(docteurs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Docteur> getDocteurById(@PathVariable Integer id) {
        Docteur docteur = docteurService.getDocteurById(id);
        if (docteur != null) {
            return new ResponseEntity<>(docteur, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Docteur> updateDocteur(@PathVariable Integer id, @RequestBody Docteur docteur) {
        Docteur updatedDocteur = docteurService.updateDocteur(id, docteur);
        if (updatedDocteur != null) {
            return new ResponseEntity<>(updatedDocteur, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocteur(@PathVariable Integer id) {
        Docteur docteur = docteurService.getDocteurById(id);
        if (docteur != null) {
            docteurService.deleteDocteur(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @GetMapping("/search")
public ResponseEntity<List<Docteur>> searchDocteurs(
        @RequestParam String specialite,
        @RequestParam(required = false) String city) {
    
    List<Docteur> docteurs = docteurService.findDocteursBySpecialiteAndCity(specialite, city);
    
    if (docteurs.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    return new ResponseEntity<>(docteurs, HttpStatus.OK);
}
@PostMapping("/login")
public ResponseEntity<?> loginDocteur(@RequestBody LoginRequestDocteur loginRequest) {
    Optional<Docteur> optionalDocteur = docteurService.login(
        loginRequest.getNumeroProfessionnel(),
        loginRequest.getMotDePasse()
    );

    if (optionalDocteur.isPresent()) {
        return new ResponseEntity<>(optionalDocteur.get(), HttpStatus.OK);
    } else {
        return new ResponseEntity<>("Numéro professionnel ou mot de passe incorrect", HttpStatus.UNAUTHORIZED);
    }
}
}