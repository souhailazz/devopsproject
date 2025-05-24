package com.medical.app.dao;

import com.medical.app.model.Docteur;
import java.util.List;
import java.util.Optional;

public interface IDAO<T, ID> {
    T save(T t);
    List<T> findAll();
    T findById(ID id);
    void delete(ID id);
    Optional<T> findByEmail(String email);
    
}